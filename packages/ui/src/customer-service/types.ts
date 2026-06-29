/**
 * Copyright (C) 2025 Alibaba Group Holding Limited
 * Copyright (C) 2026 SimonLuvRamen
 * All rights reserved.
 */
import type { ConfirmQuestion } from '../panel/types'

export type CsMessageType =
	| 'user'
	| 'assistant'
	| 'status'
	| 'confirm'
	| 'handoff'
	| 'fallback'

export interface CsMessage {
	id: string
	type: CsMessageType
	content: string
	question?: ConfirmQuestion
	handoff?: {
		phone?: string
		onlineServiceUrl?: string
		servicePageUrl?: string
		summary?: string
	}
	timestamp: number
}

export interface CustomerServicePanelConfig {
	title?: string
	quickActions?: { label: string; prompt: string }[]
	language?: 'zh-CN' | 'en-US'
	hotline?: string
	servicePageUrl?: string
	onlineServiceUrl?: string
}

/** Minimal agent interface expected by CustomerServicePanel. */
export interface CsAgentAdapter extends EventTarget {
	readonly status: 'idle' | 'running' | 'completed' | 'error' | 'stopped'
	readonly task: string
	readonly history: readonly {
		type: string
		action?: { name: string; input: unknown; output?: string }
		content?: string
	}[]
	onAskUser?: (question: string, options?: { signal: AbortSignal }) => Promise<string>
	onConfirm?: (question: ConfirmQuestion) => Promise<boolean>
	execute(task: string): Promise<unknown>
	stop(): Promise<void>
}
