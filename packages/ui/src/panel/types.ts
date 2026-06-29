/**
 * Agent activity - transient state for immediate UI feedback.
 *
 * Unlike historical events (which are persisted), activities are ephemeral
 * and represent "what the agent is doing right now". UI components should
 * listen to 'activity' events to show real-time feedback.
 *
 * Note: There is no 'idle' activity - absence of activity events means idle.
 *
 * Events dispatched: CustomEvent<AgentActivity>
 */
export type AgentActivity =
	| { type: 'thinking' }
	| { type: 'executing'; tool: string; input: unknown }
	| { type: 'executed'; tool: string; input: unknown; output: string; duration: number }
	| { type: 'retrying'; attempt: number; maxAttempts: number }
	| { type: 'error'; message: string }

/**
 * Minimal interface that Panel expects from an agent.
 * Panel does not depend on PageAgent directly - it only requires this interface.
 * This enables decoupling and allows any agent implementation to work with Panel.
 *
 * Events:
 * - 'statuschange': Agent status changed
 * - 'historychange': Historical events updated (persisted)
 * - 'activity': Transient activity for immediate UI feedback (thinking/executing/etc)
 * - 'dispose': Agent is being disposed
 */
export interface ConfirmQuestion {
	id: string
	title: string
	description: string
	confirmText?: string
	cancelText?: string
	riskLevel?: 'low' | 'medium' | 'high' | 'blocked'
}

export interface QuickAction {
	label: string
	prompt?: string
	handler?: () => void
}

export interface PanelAgentAdapter extends EventTarget {
	/** Current agent status */
	readonly status: 'idle' | 'running' | 'completed' | 'error' | 'stopped'

	/** Result of the most recent run, or `null` before the first run completes */
	readonly lastResult: { success: boolean } | null

	/** History of agent events */
	readonly history: readonly {
		type: 'step' | 'observation' | 'user_takeover' | 'retry' | 'error'
		stepIndex?: number
		/** For 'step' type */
		reflection?: {
			evaluation_previous_goal?: string
			memory?: string
			next_goal?: string
		}
		/** For 'step' type */
		action?: {
			name: string
			input: unknown
			output: string
		}
		/** For 'observation' type */
		content?: string
		/** For 'retry' type */
		attempt?: number
		maxAttempts?: number
		/** For 'retry' and 'error' types */
		message?: string
	}[]

	/** Current task being executed */
	readonly task: string

	/**
	 * Called when the agent needs to ask the user questions.
	 * If unset, the `ask_user` tool will be disabled.
	 * Panel will set this to handle user questions via its UI.
	 * The optional `signal` aborts when the task is stopped or disposed.
	 */
	onAskUser?: (question: string, options?: { signal: AbortSignal }) => Promise<string>

	/**
	 * Called when the agent needs to confirm an action with the user.
	 * Use this for sensitive operations (payment, login, external links, etc.).
	 * If unset, confirm-style operations will be skipped or auto-approved.
	 */
	onConfirm?: (question: ConfirmQuestion) => Promise<boolean>

	/** Execute a task */
	execute(task: string): Promise<unknown>

	/** Stop the current task (agent remains reusable) */
	stop(): Promise<void>

	/** Dispose the agent (terminal, cannot be reused) */
	dispose(): void
}
