import type { TclIntent } from '../intent/intents'

export interface TelemetryEvent {
	sessionId: string
	taskId: string
	pageUrl: string
	intent?: TclIntent
	actionType?: string
	riskLevel?: string
	confirmationShown?: boolean
	resultStatus?: 'success' | 'failed' | 'handoff' | 'blocked'
	failureReason?: string
	latencyMs?: number
}

export interface TelemetryAdapter {
	track(event: TelemetryEvent): void | Promise<void>
}

export class ConsoleTelemetryAdapter implements TelemetryAdapter {
	track(event: TelemetryEvent): void {
		console.info('[TclServiceAgent]', event)
	}
}
