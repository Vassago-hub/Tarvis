/**
 * Copyright (C) 2025 Alibaba Group Holding Limited
 * Copyright (C) 2026 SimonLuvRamen
 * All rights reserved.
 *
 * TclServiceAgent —— 面向 TCL 官方网站的客服 Agent。
 * - 默认 customer-service 模式下：在首次 execute 调用时延迟挂载客服 UI
 * - developer 模式下：不自动挂载 UI，由使用方自行接管
 */
import { PageAgent } from 'page-agent'

import type { TclServiceAgentConfig } from './config'
import {
	FALLBACK_CAPTCHA,
	FALLBACK_LOGIN,
	FALLBACK_NO_ENTRY,
	FALLBACK_PAYMENT,
} from './instructions/fallback'
import { getTclPageInstructions } from './instructions/pages'
import { TCL_SYSTEM_INSTRUCTIONS } from './instructions/system'
import { IntentRouter } from './intent/IntentRouter'
import { findFaqByKeywords } from './knowledge/faq'
import { TCL_SERVICE_MAP } from './knowledge/serviceMap'
import type { TclSafetyPolicy } from './safety/SafetyPolicy'
import { TclSafetyPolicy as DefaultTclSafetyPolicy } from './safety/SafetyPolicy'
import { mountCustomerServicePanel } from './ui'

export class TclServiceAgent {
	private readonly agent: PageAgent
	private readonly config: TclServiceAgentConfig
	private readonly intentRouter = new IntentRouter()
	private readonly safetyPolicy: TclSafetyPolicy

	/** 只读：当前运行模式 */
	readonly uiMode: 'customer-service' | 'developer'

	private readonly _uiConfig: {
		title?: string
		hotline?: string
		servicePageUrl?: string
		onlineServiceUrl?: string
	}
	private _panel: { dispose: () => void } | null = null

	constructor(config: TclServiceAgentConfig, safetyPolicy = new DefaultTclSafetyPolicy()) {
		this.config = config
		this.safetyPolicy = safetyPolicy
		this.uiMode = config.mode ?? 'customer-service'
		this._uiConfig = {
			hotline: TCL_SERVICE_MAP.hotline,
			servicePageUrl: TCL_SERVICE_MAP.servicePage,
			...(config.ui ?? {}),
		}

		this.agent = new PageAgent({
			baseURL: config.baseURL,
			model: config.model,
			apiKey: config.apiKey,
			language: 'zh-CN',
			experimentalScriptExecutionTool: config.environment === 'development',
			instructions: {
				system: `${TCL_SYSTEM_INSTRUCTIONS}\n\nTCL 服务路径：${JSON.stringify(
					TCL_SERVICE_MAP
				)}\n\n兜底话术（无法继续时请向用户转达对应话术）：\n- 找不到入口：${FALLBACK_NO_ENTRY}\n- 遇到验证码：${FALLBACK_CAPTCHA}\n- 遇到登录页面：${FALLBACK_LOGIN}\n- 遇到支付/订单操作：${FALLBACK_PAYMENT}`,
				getPageInstructions: getTclPageInstructions,
			},
			onBeforeToolExecute: async (ctx, agent) => {
				const decision = this.safetyPolicy.evaluate(ctx)
				await config.telemetry?.track({
					sessionId: agent.id,
					taskId: agent.taskId,
					pageUrl: ctx.pageUrl,
					actionType: ctx.toolName,
					riskLevel: decision.riskLevel,
					confirmationShown: decision.type === 'confirm',
					resultStatus: decision.type === 'block' ? 'blocked' : undefined,
					failureReason: decision.type === 'block' ? decision.reason : undefined,
				})
				return decision
			},
		})
	}

	set onAskUser(callback: PageAgent['onAskUser']) {
		this.agent.onAskUser = callback
	}

	get pageAgent(): PageAgent {
		return this.agent
	}

	/** 显式初始化客服 UI（customer-service 模式下有效，重复调用为 no-op） */
	async initUI(): Promise<void> {
		if (this.uiMode !== 'customer-service') return
		if (this._panel) return
		this._panel = await mountCustomerServicePanel(this.agent, this._uiConfig)
	}

	/** 销毁 UI（若存在） */
	destroyUI(): void {
		if (this._panel) {
			this._panel.dispose()
			this._panel = null
		}
	}

	async execute(input: string) {
		const startedAt = Date.now()
		const routed = this.intentRouter.route(input)
		this.agent.pushObservation(
			`TCL intent routing: ${routed.intent}, confidence=${routed.confidence}, reason=${routed.reason}`
		)

		const matchedFaqs = findFaqByKeywords(input)
		if (matchedFaqs.length > 0) {
			const faqContext = matchedFaqs
				.map(
					(faq, idx) =>
						`[FAQ#${idx + 1}] ${faq.title}\n步骤:\n${faq.steps
							.map((s, i) => `  ${i + 1}. ${s}`)
							.join('\n')}${faq.riskNote ? `\n安全提示: ${faq.riskNote}` : ''}${
							faq.recommendation ? `\n建议: ${faq.recommendation}` : ''
						}`
				)
				.join('\n\n')
			this.agent.pushObservation(
				`TCL 知识库命中 ${matchedFaqs.length} 条 FAQ（关键词匹配），以下排查知识可优先参考：\n${faqContext}`
			)
		}

		// customer-service 模式下：首次 execute 延迟挂载客服 UI
		if (this.uiMode === 'customer-service' && !this._panel) {
			this._panel = await mountCustomerServicePanel(this.agent, this._uiConfig)
		}

		const result = await this.agent.execute(input)
		const pageUrl = await this.agent.pageController.getCurrentUrl()

		const shouldReportHandoff =
			routed.intent === 'complaint' ||
			routed.intent === 'human_support' ||
			(routed.intent === 'troubleshooting' && matchedFaqs.some((faq) => !!faq.riskNote))

		if (shouldReportHandoff) {
			await this.config.telemetry?.track({
				sessionId: this.agent.id,
				taskId: this.agent.taskId,
				pageUrl,
				intent: routed.intent,
				resultStatus: 'handoff',
				latencyMs: Date.now() - startedAt,
			})
		} else {
			await this.config.telemetry?.track({
				sessionId: this.agent.id,
				taskId: this.agent.taskId,
				pageUrl,
				intent: routed.intent,
				resultStatus: result.success ? 'success' : 'failed',
				latencyMs: Date.now() - startedAt,
			})
		}

		return result
	}

	stop() {
		return this.agent.stop()
	}

	dispose() {
		this.destroyUI()
		return this.agent.dispose()
	}
}
