/**
 * Copyright (C) 2025 Alibaba Group Holding Limited
 * Copyright (C) 2026 SimonLuvRamen
 * All rights reserved.
 */
import { InvokeError, LLM, type Tool } from '@page-agent/llms'
import type { BrowserState, PageController } from '@page-agent/page-controller'
import chalk from 'chalk'
import * as z from 'zod/v4'

import SYSTEM_PROMPT from './prompts/system_prompt.md?raw'
import { tools } from './tools'
import type {
	AgentActivity,
	AgentConfig,
	AgentReflection,
	AgentStatus,
	AgentStepEvent,
	ConfirmQuestion,
	ExecutionResult,
	HistoricalEvent,
	MacroToolInput,
	MacroToolResult,
	SafetyDecision,
	TelemetryEvent,
	ToolExecutionContext,
} from './types'
import { assert, fetchLlmsTxt, normalizeResponse, suppress, uid, waitFor } from './utils'

export { tool, type PageAgentTool } from './tools'
export type * from './types'

export type PageAgentCoreConfig = AgentConfig & { pageController: PageController }

/**
 * Built-in default safety policy. Runs *before* any user-provided
 * `onBeforeToolExecute` and can be overridden by returning an explicit
 * `allow`/`confirm`/`block` from the user hook. It enforces the minimal
 * guarantees:
 * - `click_element_by_index` → `confirm` when the target is an external link
 *   or `target=_blank`, `block` when javascript: href.
 * - `input_text` → `confirm` when filling a field marked as sensitive.
 * - `execute_javascript` → `block` (the tool is removed at construction if
 *   `experimentalScriptExecutionTool` is false; this acts as a last-resort
 *   guard).
 */
function defaultSafetyPolicy(ctx: ToolExecutionContext): SafetyDecision | undefined {
	const toolName = ctx.toolName
	const element = ctx.element
	if (toolName === 'click_element_by_index') {
		const href = (element?.href || '') as string | undefined
		const isJavascriptProtocol = typeof href === 'string' && /^\s*javascript:/i.test(href)
		if (isJavascriptProtocol) {
			return {
				type: 'block',
				riskLevel: 'blocked',
				reason: 'Blocked navigation to a javascript: link.',
				userMessage: 'Refusing to click element with javascript: URL.',
			}
		}
		if (element?.opensInNewTab || element?.isExternalLink) {
			return {
				type: 'confirm',
				riskLevel: 'high',
				reason: element?.isExternalLink
					? 'This click navigates to an external origin.'
					: 'This click opens a new tab/window.',
				userMessage: '即将离开当前页面，请确认继续。',
			}
		}
		if (element?.isAuthLike || element?.isPaymentLike) {
			return {
				type: 'confirm',
				riskLevel: 'high',
				reason: element.isPaymentLike
					? 'This click triggers a payment-like action.'
					: 'This click triggers a login/signup action.',
				userMessage: '检测到高风险操作，请确认继续。',
			}
		}
		if (element?.isSubmitLike) {
			return {
				type: 'confirm',
				riskLevel: 'medium',
				reason: 'This click submits a form-like action.',
				userMessage: '即将提交表单内容，请确认继续。',
			}
		}
		return undefined
	}

	if (toolName === 'input_text') {
		if (element?.isSensitiveField) {
			return {
				type: 'confirm',
				riskLevel: 'high',
				reason: 'Attempting to fill a sensitive field (phone/password/personal info).',
				userMessage: '检测到向敏感字段写入内容，请确认继续。',
			}
		}
		return undefined
	}

	if (toolName === 'execute_javascript') {
		return {
			type: 'confirm',
			riskLevel: 'high',
			reason: 'execute_javascript bypasses DOM isolation. Require confirmation.',
			userMessage: 'Agent 要求执行自定义 JavaScript，请确认继续。',
		}
	}

	return undefined
}

/**
 * AI agent for browser automation.
 *
 * @remarks
 * ## Re-act Agent Loop
 * - step
 *    - observe (gather information about current environment and context)
 *    - think (LLM calling)
 *      - reflection (evaluate history, generate memory, short-term planning)
 *      - action (give the action to approach the next goal)
 *    - act (execute the action)
 * - loop
 *
 * ## Event System
 * - `statuschange` - Agent status transitions (idle → running → completed/error/stopped)
 * - `historychange` - History events updated (persistent, part of agent memory)
 * - `activity` - Real-time activity feedback (transient, for UI only)
 * - `dispose` - Agent cleanup triggered
 *
 * ## Information Streams
 * 1. **History Events** (`history` array)
 *    - Persistent event stream that forms agent's memory
 *    - Included in LLM context across steps
 *    - Types: steps, observations, user takeovers, llm errors
 *
 * 2. **Activity Events** (via `activity` event)
 *    - Transient UI feedback during task execution
 *    - NOT included in LLM context
 *    - Types: thinking, executing, executed, retrying, error
 */
export class PageAgentCore extends EventTarget {
	readonly id = uid()
	readonly config: PageAgentCoreConfig & { maxSteps: number }
	readonly tools: typeof tools
	/** PageController for DOM operations */
	readonly pageController: PageController

	task = ''
	taskId = ''
	/** History events */
	history: HistoricalEvent[] = []
	/** Whether this agent has been disposed */
	disposed = false

	/**
	 * Called when the agent needs to ask the user questions.
	 * If unset, the `ask_user` tool will be disabled.
	 * Implementations should reject the promise when `signal` aborts.
	 * @example onAskUser: (q) => window.prompt(q) || ''
	 */
	onAskUser?: (question: string, options?: { signal: AbortSignal }) => Promise<string>

	/**
	 * Called when a safety policy requires explicit confirmation before a tool executes.
	 * UI layers can set this to render a confirmation card instead of using free-text input.
	 */
	onConfirm?: (question: ConfirmQuestion, options?: { signal: AbortSignal }) => Promise<boolean>

	#status: AgentStatus = 'idle'
	#llm: LLM
	/**
	 * Task cancellation primitive: its signal reaches the LLM fetch, tools
	 * (via `ctx.signal`) and async callbacks. Aborted only by `stop`/`dispose`
	 * (during a task) or task setup, always WITHOUT a reason so `signal.reason`
	 * stays a standard `AbortError`.
	 */
	#abortController = new AbortController()
	#observations: string[] = []

	/** Resolves when the current run has fully settled. Awaited by `stop()`. */
	#running: Promise<void> = Promise.resolve()
	#lastResult: ExecutionResult | null = null

	/** internal states during a single task execution */
	#states = {
		/** Accumulated wait time in seconds */
		totalWaitTime: 0,
		/** For detecting navigation */
		lastURL: '',
		/** Browser state */
		browserState: null as BrowserState | null,
	}

	constructor(config: PageAgentCoreConfig) {
		super()

		this.config = { ...config, maxSteps: config.maxSteps ?? 40 }

		this.#llm = new LLM(this.config)
		this.tools = new Map(tools)
		this.pageController = config.pageController

		this.#llm.addEventListener('retry', (e) => {
			const { attempt, maxAttempts, lastError } = (e as CustomEvent).detail
			this.#emitActivity({ type: 'retrying', attempt, maxAttempts })
			this.#emitTelemetry({
				type: 'llm.retry',
				attempt,
				maxAttempts,
				errorMessage: String(lastError),
			})
			this.history.push({
				type: 'error',
				message: String(lastError),
				rawResponse: (lastError as InvokeError).rawResponse,
			})
			this.history.push({
				type: 'retry',
				message: `LLM retry attempt ${attempt} of ${maxAttempts}`,
				attempt,
				maxAttempts,
			})
			this.#emitHistoryChange()
		})

		if (this.config.customTools) {
			for (const [name, tool] of Object.entries(this.config.customTools)) {
				if (tool === null) {
					this.tools.delete(name)
					continue
				}
				this.tools.set(name, tool)
			}
		}

		if (!this.config.experimentalScriptExecutionTool) {
			this.tools.delete('execute_javascript')
		}
	}

	/** Get current agent status */
	get status(): AgentStatus {
		return this.#status
	}

	/** Result of the most recent run, or `null` before the first run completes. */
	get lastResult(): ExecutionResult | null {
		return this.#lastResult
	}

	/** Emit statuschange event */
	#emitStatusChange(): void {
		this.dispatchEvent(new Event('statuschange'))
	}

	/** Emit historychange event */
	#emitHistoryChange(pushHistoricalEvent?: HistoricalEvent): void {
		if (pushHistoricalEvent) this.history.push(pushHistoricalEvent)
		this.dispatchEvent(new Event('historychange'))
	}

	/**
	 * Emit activity event - for transient UI feedback
	 * @param activity - Current agent activity
	 */
	#emitActivity(activity: AgentActivity): void {
		this.dispatchEvent(new CustomEvent('activity', { detail: activity }))
	}

	/** Update status and emit event */
	#setStatus(status: AgentStatus): void {
		if (this.#status !== status) {
			this.#status = status
			this.#emitStatusChange()
		}
	}

	/**
	 * Push an observation message to the history event stream.
	 * This will be visible in <agent_history> and remain persistent in memory across steps.
	 * @experimental @internal
	 * @note history change will be emitted before next step starts
	 */
	pushObservation(content: string): void {
		this.#observations.push(content)
	}

	/**
	 * Stop the current task and wait until the run has fully settled (including lifecycle hooks).
	 * @note never await .stop() in a lifecycle hook.
	 */
	async stop(): Promise<void> {
		if (this.#status !== 'running') return
		this.#abortController.abort()
		await this.#running
	}

	/**
	 * external errors (pre-checks/config/hooks) will threw;
	 * agent errors will be caught and added to history, and return a failed result
	 */
	async execute(task: string): Promise<ExecutionResult> {
		// pre-checks
		if (this.disposed) throw new Error('PageAgent has been disposed. Create a new instance.')
		if (this.#status === 'running') throw new Error('A task is already running.')
		if (!task) throw new Error('Task is required')

		this.task = task
		this.taskId = uid()

		this.history = []
		this.#observations = []
		this.#states = { totalWaitTime: 0, lastURL: '', browserState: null }
		this.#abortController = new AbortController()
		const signal = this.#abortController.signal

		let resolveRunning!: () => void
		this.#running = new Promise<void>((r) => (resolveRunning = r))

		this.#setStatus('running')
		this.#emitHistoryChange()
		const safeUrl =
			typeof window !== 'undefined' && window.location ? window.location.href : ''
		this.#emitTelemetry({
			type: 'task.started',
			taskId: this.taskId,
			language: this.config.language || 'en-US',
			pageUrl: safeUrl,
		})

		const taskStartedAt = Date.now()

		const onBeforeStep = this.config.onBeforeStep
		const onAfterStep = this.config.onAfterStep
		const onBeforeTask = this.config.onBeforeTask
		const onAfterTask = this.config.onAfterTask
		const stepDelay = this.config.stepDelay ?? 0.4
		const maxSteps = this.config.maxSteps

		let step = 0
		let taskResult: ExecutionResult
		let finalStatus: AgentStatus = 'error'

		await suppress(() => this.pageController.showMask())

		// graceful exit
		try {
			await onBeforeTask?.(this)

			while (true) {
				await onBeforeStep?.(this, step)

				// handle internal agent errors
				try {
					console.group(`step: ${step}`)

					// @note It's convenient to treat stepDelay as part of the next step.
					// Maybe move it to a dedicated try block for better semantics?
					if (step > 0) await waitFor(stepDelay, signal)

					signal.throwIfAborted()

					// observe

					console.log(chalk.blue.bold('👀 Observing...'))

					this.#states.browserState = await this.pageController.getBrowserState()
					await this.#handleObservations(step)

					// assemble prompts

					const messages = [
						{ role: 'system' as const, content: this.#getSystemPrompt() },
						{ role: 'user' as const, content: await this.#assembleUserPrompt() },
					]

					const macroTool = { AgentOutput: this.#packMacroTool() }

					// invoke LLM

					console.log(chalk.blue.bold('🧠 Thinking...'))
					this.#emitActivity({ type: 'thinking' })

					const llmStart = Date.now()
					const result = await this.#llm.invoke(messages, macroTool, signal, {
						toolChoiceName: 'AgentOutput',
						normalizeResponse: (res) => normalizeResponse(res, this.tools),
					})
					this.#emitTelemetry({
						type: 'llm.invoked',
						attempt: 1,
						durationMs: Date.now() - llmStart,
						toolCalled: result.toolCall.name,
						success: true,
					})

					// assemble history

					const macroResult = result.toolResult as MacroToolResult
					const input = macroResult.input
					const output = macroResult.output
					const reflection: Partial<AgentReflection> = {
						evaluation_previous_goal: input.evaluation_previous_goal,
						memory: input.memory,
						next_goal: input.next_goal,
					}
					const actionName = Object.keys(input.action)[0]
					const action: AgentStepEvent['action'] = {
						name: actionName,
						input: input.action[actionName],
						output: output,
					}

					this.#emitHistoryChange({
						type: 'step',
						stepIndex: step,
						reflection,
						action,
						usage: result.usage,
						rawResponse: result.rawResponse,
						rawRequest: result.rawRequest,
					})

					if (actionName === 'done') {
						const success = action.input?.success ?? false
						const data = action.input?.text || 'no text provided'
						console.log(chalk.green.bold('Task completed'), success, data)
						taskResult = { success, data, history: this.history }
						this.#lastResult = taskResult
						finalStatus = 'completed'
						break
					}
				} catch (error: unknown) {
					// catch block must not throw error. otherwise the error may be overridden if finally block also throws error.

					const isAbortError = (error as any)?.name === 'AbortError'
					if (!isAbortError) console.error('Task failed', error)
					const message = isAbortError ? 'Task aborted' : String(error)
					this.#emitActivity({ type: 'error', message: message })
					this.#emitHistoryChange({ type: 'error', message: message, rawResponse: error })
					this.#emitTelemetry({ type: 'agent.error', message })
					taskResult = { success: false, data: message, history: this.history }
					this.#lastResult = taskResult
					finalStatus = isAbortError ? 'stopped' : 'error'
					break
				} finally {
					// finally block runs before the break above.

					console.groupEnd()
					// @note hook may throw error.
					// which will override the `break` above and be handled as an external error.
					// as expected.
					await onAfterStep?.(this, this.history)
				}

				step++
				if (step > maxSteps) {
					const message = 'Step count exceeded maximum limit'
					console.error(message)
					this.#emitActivity({ type: 'error', message: message })
					this.#emitHistoryChange({ type: 'error', message: message })
					this.#emitTelemetry({ type: 'agent.error', message })
					taskResult = { success: false, data: message, history: this.history }
					this.#lastResult = taskResult
					finalStatus = 'error'
					break
				}
			} // while

			await onAfterTask?.(this, taskResult)

			return taskResult
		} catch (error) {
			this.#emitActivity({ type: 'error', message: String(error) })
			this.#emitTelemetry({ type: 'agent.error', message: String(error) })
			finalStatus = 'error'
			throw error
		} finally {
			await suppress(() => this.pageController.cleanUpHighlights())
			await suppress(() => this.pageController.hideMask())
			const safeUrl2 =
				typeof window !== 'undefined' && window.location ? window.location.href : ''
			this.#emitTelemetry({
				type: 'task.completed',
				taskId: this.taskId,
				success: finalStatus === 'completed',
				durationMs: Date.now() - taskStartedAt,
				pageUrl: safeUrl2,
			})
			this.#abortController.abort()
			resolveRunning()
			this.#setStatus(finalStatus)
		}
	}

	async #applyBeforeToolExecute(toolName: string, toolInput: unknown): Promise<string | undefined> {
		// Build context only once; always include the abort signal.
		const ctx = await this.#buildToolExecutionContext(toolName, toolInput)

		// 1) Built-in default safety policy (always runs).
		let decision: SafetyDecision | undefined = defaultSafetyPolicy(ctx)

		// 2) User-provided hook may override or layer on top.
		const customDecision = await this.config.onBeforeToolExecute?.(ctx, this)
		if (customDecision && customDecision.type !== 'allow') {
			decision = customDecision
		}

		// Nothing to guard: allow execution
		if (!decision || decision.type === 'allow') return undefined

		if (decision.type === 'block') {
			this.#emitTelemetry({
				type: 'tool.blocked',
				tool: toolName,
				reason: decision.reason,
				elementIndex: ctx.element?.index,
			})
			return this.#formatSafetyDecision('blocked', decision)
		}

		// Runtime check: confirmation only happens when a callback is set.
		// If neither onConfirm nor onAskUser is present → refuse rather than silently pass.
		if (this.onConfirm) {
			const confirmed = await this.onConfirm(this.#buildConfirmQuestion(decision), {
				signal: this.#abortController.signal,
			})
			this.#emitTelemetry({
				type: 'tool.confirmed',
				tool: toolName,
				elementIndex: ctx.element?.index,
				confirmed: confirmed,
			})
			if (!confirmed) {
				return this.#formatSafetyDecision('blocked', decision, 'User did not confirm the action.')
			}
			return undefined
		}

		if (this.onAskUser) {
			const question = this.#buildConfirmQuestion(decision).description
			const answer = await this.onAskUser(question, { signal: this.#abortController.signal })
			const confirmed =
				/^(y|yes|ok|okay|confirm|confirmed|go ahead|继续|确认|同意|可以|好的|好|是)/i.test(
					answer.trim()
				)
			this.#emitTelemetry({
				type: 'tool.confirmed',
				tool: toolName,
				elementIndex: ctx.element?.index,
				confirmed,
			})
			if (!confirmed) {
				return this.#formatSafetyDecision('blocked', decision, 'User did not confirm the action.')
			}
			return undefined
		}

		// No confirmation mechanism available → fail closed.
		this.#emitTelemetry({
			type: 'tool.blocked',
			tool: toolName,
			reason: 'Confirmation callback missing; blocked by default.',
			elementIndex: ctx.element?.index,
		})
		return this.#formatSafetyDecision(
			'blocked',
			decision,
			'Confirmation is required, but no confirmation callback is available.'
		)
	}

	#emitTelemetry(event: TelemetryEvent): void {
		this.dispatchEvent(new CustomEvent('telemetry', { detail: event }))
	}

	#buildConfirmQuestion(decision: SafetyDecision): ConfirmQuestion {
		return {
			id: uid(),
			title: '请确认操作',
			description:
				decision.userMessage ??
				`请确认是否继续执行这个 ${decision.riskLevel} 风险操作：${decision.reason}`,
			confirmText: '继续',
			cancelText: '取消',
			riskLevel: decision.riskLevel,
		}
	}

	async #buildToolExecutionContext(
		toolName: string,
		toolInput: unknown
	): Promise<ToolExecutionContext> {
		const pageUrl = this.#states.browserState?.url ?? ''
		const signal = this.#abortController.signal
		const elementIndex =
			typeof toolInput === 'object' &&
			toolInput !== null &&
			'index' in toolInput &&
			typeof toolInput.index === 'number'
				? toolInput.index
				: undefined
		const element =
			elementIndex === undefined
				? undefined
				: await suppress(() => this.pageController.getElementMetadata(elementIndex))

		return {
			toolName,
			toolInput,
			pageUrl,
			element,
			signal,
		}
	}

	#formatSafetyDecision(status: 'blocked', decision: SafetyDecision, extra?: string): string {
		return [
			`⚠️ Tool execution ${status}.`,
			`Risk: ${decision.riskLevel}.`,
			`Reason: ${decision.reason}.`,
			extra,
		]
			.filter(Boolean)
			.join(' ')
	}
	/**
	 * Merge all tools into a single MacroTool with the following input:
	 * - thinking: string
	 * - evaluation_previous_goal: string
	 * - memory: string
	 * - next_goal: string
	 * - action: { toolName: toolInput }
	 * where action must be selected from tools defined in this.tools
	 */
	#packMacroTool(): Tool<MacroToolInput, MacroToolResult> {
		const tools = this.tools

		const actionSchemas = Array.from(tools.entries()).map(([toolName, tool]) => {
			return z.object({ [toolName]: tool.inputSchema }).describe(tool.description)
		})

		const actionSchema = z.union(actionSchemas as unknown as [z.ZodType, z.ZodType, ...z.ZodType[]])

		const macroToolSchema = z.object({
			// thinking: z.string().optional(),
			evaluation_previous_goal: z.string().optional(),
			memory: z.string().optional(),
			next_goal: z.string().optional(),
			action: actionSchema,
		})

		return {
			description: 'You MUST call this tool every step!',
			inputSchema: macroToolSchema as z.ZodType<MacroToolInput>,
			execute: async (input: MacroToolInput): Promise<MacroToolResult> => {
				const signal = this.#abortController.signal
				signal.throwIfAborted()

				console.log(chalk.blue.bold('MacroTool input'), input)
				const action = input.action

				const toolName = Object.keys(action)[0]
				const toolInput = action[toolName]

				// Build reflection text, only include non-empty fields
				const reflectionLines: string[] = []
				if (input.evaluation_previous_goal)
					reflectionLines.push(`✅: ${input.evaluation_previous_goal}`)
				if (input.memory) reflectionLines.push(`💾: ${input.memory}`)
				if (input.next_goal) reflectionLines.push(`🎯: ${input.next_goal}`)

				const reflectionText = reflectionLines.length > 0 ? reflectionLines.join('\n') : ''

				if (reflectionText) {
					console.log(reflectionText)
				}

				// Find the corresponding tool
				const tool = tools.get(toolName)
				assert(tool, `Tool ${toolName} not found`)

				const safetyResult = await this.#applyBeforeToolExecute(toolName, toolInput)
				if (safetyResult) {
					return {
						input,
						output: safetyResult,
					}
				}

				console.log(chalk.blue.bold(`Executing tool: ${toolName}`), toolInput)

				// Emit executing activity
				this.#emitActivity({ type: 'executing', tool: toolName, input: toolInput })

				const startTime = Date.now()

				const result = await tool.execute.bind(this)(toolInput, { signal })
				// Enforce abort even if the tool ignored the signal and resolved normally.
				signal.throwIfAborted()

				const duration = Date.now() - startTime
				console.log(chalk.green.bold(`Tool (${toolName}) executed for ${duration}ms`), result)

				const elementIndex =
					typeof toolInput === 'object' &&
					toolInput !== null &&
					'index' in toolInput &&
					typeof toolInput.index === 'number'
						? toolInput.index
						: undefined
				this.#emitTelemetry({
					type: 'tool.executed',
					tool: toolName,
					durationMs: duration,
					success: true,
					elementIndex,
				})

				// Emit executed activity
				this.#emitActivity({
					type: 'executed',
					tool: toolName,
					input: toolInput,
					output: result,
					duration,
				})

				// counting wait time
				if (toolName === 'wait') {
					this.#states.totalWaitTime += toolInput?.seconds || 0
				} else {
					this.#states.totalWaitTime = 0
				}

				// Return structured result
				return {
					input,
					output: result,
				}
			},
		}
	}

	/**
	 * Get system prompt, dynamically replace language settings based on configured language
	 */
	#getSystemPrompt(): string {
		if (this.config.customSystemPrompt) {
			return this.config.customSystemPrompt
		}

		const targetLanguage = this.config.language === 'zh-CN' ? '中文' : 'English'
		const systemPrompt = SYSTEM_PROMPT.replace(
			/Default working language: \*\*.*?\*\*/,
			`Default working language: **${targetLanguage}**`
		)

		return systemPrompt
	}

	/**
	 * Get instructions from config
	 */
	async #getInstructions(): Promise<string> {
		const { instructions, experimentalLlmsTxt } = this.config

		const systemInstructions = instructions?.system?.trim()
		let pageInstructions: string | undefined

		const url = this.#states.browserState?.url || ''
		if (instructions?.getPageInstructions && url) {
			try {
				pageInstructions = instructions.getPageInstructions(url)?.trim()
			} catch (error) {
				console.error(
					chalk.red('[PageAgent] Failed to execute getPageInstructions callback:'),
					error
				)
			}
		}

		const llmsTxt = experimentalLlmsTxt && url ? await fetchLlmsTxt(url) : undefined

		if (!systemInstructions && !pageInstructions && !llmsTxt) return ''

		let result = '<instructions>\n'

		if (systemInstructions) {
			result += `<system_instructions>\n${systemInstructions}\n</system_instructions>\n`
		}

		if (pageInstructions) {
			result += `<page_instructions>\n${pageInstructions}\n</page_instructions>\n`
		}

		if (llmsTxt) {
			result += `<llms_txt>\n${llmsTxt}\n</llms_txt>\n`
		}

		result += '</instructions>\n\n'

		return result
	}

	/**
	 * Generate system observations before each step
	 * @todo loop detection
	 * @todo console error
	 */
	async #handleObservations(step: number): Promise<void> {
		// Accumulated wait time warning
		if (this.#states.totalWaitTime >= 3) {
			this.pushObservation(
				`You have waited ${this.#states.totalWaitTime} seconds accumulatively. ` +
					`DO NOT wait any longer unless you have a good reason.`
			)
		}

		// Detect URL change
		const currentURL = this.#states.browserState?.url || ''
		if (currentURL !== this.#states.lastURL) {
			this.pushObservation(`Page navigated to → ${currentURL}`)
			this.#states.lastURL = currentURL
			await waitFor(0.5) // wait for page to stabilize
		}

		// Remaining steps warning
		const remaining = this.config.maxSteps - step
		if (remaining === 5) {
			this.pushObservation(
				`⚠️ Only ${remaining} steps remaining. ` +
					`Consider wrapping up or calling done with partial results.`
			)
		} else if (remaining === 2) {
			this.pushObservation(
				`⚠️ Critical: Only ${remaining} steps left! You must finish the task or call done immediately.`
			)
		}

		// Push observations to history and emit
		if (this.#observations.length > 0) {
			for (const content of this.#observations) {
				this.history.push({ type: 'observation', content })
				console.log(chalk.cyan('Observation:'), content)
			}
			this.#observations = []
			this.#emitHistoryChange()
		}
	}

	async #assembleUserPrompt(): Promise<string> {
		const browserState = this.#states.browserState!

		let prompt = ''

		// <instructions> (optional)

		prompt += await this.#getInstructions()

		// <agent_state>
		//  - <user_request>
		//  - <step_info>
		// <agent_state>

		const stepCount = this.history.filter((e) => e.type === 'step').length

		prompt += '<agent_state>\n'
		prompt += '<user_request>\n'
		prompt += `${this.task}\n`
		prompt += '</user_request>\n'
		prompt += '<step_info>\n'
		prompt += `Step ${stepCount + 1} of ${this.config.maxSteps} max possible steps\n`
		prompt += `Current time: ${new Date().toLocaleString()}\n`
		prompt += '</step_info>\n'
		prompt += '</agent_state>\n\n'

		// <agent_history>
		//  - <step_N> for steps
		//  - <sys> for observations and system messages

		prompt += '<agent_history>\n'

		let stepIndex = 0
		for (const event of this.history) {
			if (event.type === 'step') {
				stepIndex++
				prompt += `<step_${stepIndex}>\n`
				prompt += `Evaluation of Previous Step: ${event.reflection.evaluation_previous_goal}\n`
				prompt += `Memory: ${event.reflection.memory}\n`
				prompt += `Next Goal: ${event.reflection.next_goal}\n`
				prompt += `Action Results: ${event.action.output}\n`
				prompt += `</step_${stepIndex}>\n`
			} else if (event.type === 'observation') {
				prompt += `<sys>${event.content}</sys>\n`
			} else if (event.type === 'user_takeover') {
				prompt += `<sys>User took over control and made changes to the page</sys>\n`
			} else if (event.type === 'error') {
				// Error events are mainly for panel rendering, not included in LLM context
				// to avoid polluting the agent's reasoning with transient errors
			}
		}

		prompt += '</agent_history>\n\n'

		// <browser_state>

		let pageContent = browserState.content
		if (this.config.transformPageContent) {
			pageContent = await this.config.transformPageContent(pageContent)
		}

		prompt += '<browser_state>\n'
		prompt += browserState.header + '\n'
		prompt += pageContent + '\n'
		prompt += browserState.footer + '\n\n'
		prompt += '</browser_state>\n\n'

		return prompt
	}

	dispose() {
		console.log('Disposing PageAgent...')
		this.disposed = true
		this.pageController.dispose()
		// this.history = []
		this.#abortController.abort()

		// Emit dispose event for UI cleanup
		this.dispatchEvent(new Event('dispose'))

		this.config.onDispose?.(this)
	}
}
