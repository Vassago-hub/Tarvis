import { OpenAIClient } from './OpenAIClient'
import {
	DEFAULT_TEMPERATURE,
	LLM_MAX_RETRIES,
	RETRY_BACKOFF_MULTIPLIER,
	RETRY_BASE_BACKOFF_MS,
	RETRY_JITTER_FRACTION,
	RETRY_MAX_BACKOFF_MS,
} from './constants'
import { InvokeError, InvokeErrorTypes } from './errors'
import type { InvokeOptions, InvokeResult, LLMClient, LLMConfig, Message, Tool } from './types'

export { InvokeError, InvokeErrorTypes }
export type { InvokeOptions, InvokeResult, LLMClient, LLMConfig, Message, Tool }

export function parseLLMConfig(config: LLMConfig): Required<LLMConfig> {
	// Runtime validation as defensive programming (types already guarantee these)
	if (!config.baseURL || !config.model) {
		throw new Error(
			'[PageAgent] LLM configuration required. Please provide: baseURL, model. ' +
				'See: https://alibaba.github.io/page-agent/docs/features/models'
		)
	}

	return {
		baseURL: config.baseURL,
		model: config.model,
		apiKey: config.apiKey || '',
		temperature: config.temperature ?? DEFAULT_TEMPERATURE,
		maxRetries: config.maxRetries ?? LLM_MAX_RETRIES,
		transformRequestBody: config.transformRequestBody ?? ((requestBody) => requestBody),
		disableNamedToolChoice: config.disableNamedToolChoice ?? false,
		customFetch: (config.customFetch ?? fetch).bind(globalThis), // fetch will be illegal unless bound
	}
}

export class LLM extends EventTarget {
	config: Required<LLMConfig>
	client: LLMClient

	constructor(config: LLMConfig) {
		super()
		this.config = parseLLMConfig(config)

		// Default to OpenAI client
		this.client = new OpenAIClient(this.config)
	}

	/**
	 * - call llm api *once*
	 * - invoke tool call *once*
	 * - return the result of the tool
	 */
	async invoke(
		messages: Message[],
		tools: Record<string, Tool>,
		abortSignal: AbortSignal,
		options?: InvokeOptions
	): Promise<InvokeResult> {
		return await withRetry(
			async () => this.client.invoke(messages, tools, abortSignal, options),
			{
				maxRetries: this.config.maxRetries,
				onRetry: (attempt, lastError) => {
					this.dispatchEvent(
						new CustomEvent('retry', {
							detail: { attempt, maxAttempts: this.config.maxRetries, lastError },
						})
					)
				},
				abortSignal,
			}
		)
	}
}

/**
 * Retry a function until it succeeds or reaches the maximum number of retries.
 * Uses exponential backoff with randomised jitter to avoid thundering herds.
 */
async function withRetry<T>(
	fn: () => Promise<T>,
	settings: {
		maxRetries: number
		abortSignal: AbortSignal
		onRetry: (attempt: number, lastError: Error) => void
	}
): Promise<T> {
	const { maxRetries, onRetry, abortSignal } = settings
	let attempt = 0
	while (true) {
		try {
			return await fn()
		} catch (error: unknown) {
			if ((error as any)?.name === 'AbortError') throw error
			if (error instanceof InvokeError && !error.retryable) throw error
			attempt++
			if (attempt > maxRetries) throw error

			console.debug('[LLM] retryable failure, will retry:', error)
			onRetry(attempt, error as Error)

			await backoff(attempt, abortSignal)
		}
	}
}

/**
 * Exponential backoff with random jitter, abortable by AbortSignal.
 *
 * waitMs = min(BASE * MULTIPLIER^(attempt-1), MAX)
 *       + uniform(0, JITTER * waitMs)
 */
function backoff(attempt: number, signal: AbortSignal): Promise<void> {
	const base = RETRY_BASE_BACKOFF_MS * Math.pow(RETRY_BACKOFF_MULTIPLIER, Math.max(0, attempt - 1))
	const capped = Math.min(base, RETRY_MAX_BACKOFF_MS)
	const jitter = Math.random() * RETRY_JITTER_FRACTION * capped
	const totalMs = Math.round(capped + jitter)

	if (signal.aborted) {
		return Promise.reject(new DOMException('The operation was aborted.', 'AbortError'))
	}

	return new Promise<void>((resolve, reject) => {
		const timer = setTimeout(() => resolve(), totalMs)
		signal.addEventListener('abort', () => {
			clearTimeout(timer)
			reject(new DOMException('The operation was aborted.', 'AbortError'))
		})
	})
}
