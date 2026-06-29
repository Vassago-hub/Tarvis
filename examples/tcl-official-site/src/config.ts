/**
 * Copyright (C) 2025 Alibaba Group Holding Limited
 * Copyright (C) 2026 SimonLuvRamen
 * All rights reserved.
 */
import type { TelemetryAdapter } from './telemetry/TelemetryAdapter'

export interface TclServiceAgentConfig {
	baseURL: string
	model: string
	apiKey?: string
	telemetry?: TelemetryAdapter
	environment?: 'development' | 'production'
	/** UI 模式 —— 默认客服模式。developer 模式下不会自动挂载客服 UI。 */
	mode?: 'customer-service' | 'developer'
	/** 客服 UI 配置（title / hotline / servicePageUrl / onlineServiceUrl） */
	ui?: {
		title?: string
		hotline?: string
		servicePageUrl?: string
		onlineServiceUrl?: string
	}
}
