/**
 * Copyright (C) 2025 Alibaba Group Holding Limited
 * Copyright (C) 2026 SimonLuvRamen
 * All rights reserved.
 *
 * 延迟加载客服 UI 的轻量模块。避免在 import 阶段直接依赖
 * `@page-agent/ui` 的构建产物，首次使用时才动态 import。
 */
import type { PageAgent } from 'page-agent'
import type { CustomerServicePanelConfig } from '@page-agent/ui'

/**
 * 延迟挂载一个 CustomerServicePanel 到给定的 PageAgent 上。
 * 返回的 { dispose } 可在需要时销毁 UI。
 */
export async function mountCustomerServicePanel(
	agent: PageAgent,
	config?: CustomerServicePanelConfig
): Promise<{ dispose: () => void }> {
	const { CustomerServicePanel } = await import('@page-agent/ui')
	const panel = new CustomerServicePanel(agent, config ?? {})
	return {
		dispose: () => panel.dispose(),
	}
}
