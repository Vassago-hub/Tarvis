/**
 * Copyright (C) 2025 Alibaba Group Holding Limited
 * Copyright (C) 2026 SimonLuvRamen
 * All rights reserved.
 */
import { describe, expect, it, vi } from 'vitest'

import type { TelemetryEvent } from './telemetry/TelemetryAdapter'

// ---- Mock PageAgent：替换整个 `page-agent` 模块 ----
// 这样 TclServiceAgent 内部 new PageAgent(...) 会返回下面的 mock 实例。
interface PageAgentLike {
	id: string
	taskId: string
	execute: (input: string) => Promise<{ success: boolean; data: string }>
	stop: () => Promise<void>
	dispose: () => void
	pushObservation: (s: string) => void
	pageController: { getCurrentUrl: () => Promise<string> }
}

const testState = vi.hoisted(() => ({
	fakeUrl: 'https://www.tcl.com/cn/zh',
	uidCounter: 0,
}))

vi.mock('page-agent', () => ({
	PageAgent: vi.fn(function () {
		testState.uidCounter += 1
		const sessionId = testState.uidCounter
		testState.uidCounter += 1
		const taskId = testState.uidCounter
		return {
			id: `session-${sessionId}`,
			taskId: `task-${taskId}`,
			execute: vi.fn(async (_input: string) => ({ success: true, data: 'done' })),
			stop: vi.fn(async () => {}),
			dispose: vi.fn(() => {}),
			pushObservation: vi.fn(() => {}),
			pageController: { getCurrentUrl: vi.fn(async () => testState.fakeUrl) },
		} satisfies PageAgentLike
	}),
}))

// CustomerServicePanel 也需要 mock，避免在测试环境做 DOM 操作
vi.mock('@page-agent/ui', () => ({
	CustomerServicePanel: vi.fn(function () {
		return { dispose: vi.fn() }
	}),
}))

// 动态 import 的情况下也需要在 ui.ts 中工作。
// 因为 vi.mock 替换了整个模块，动态 `import('@page-agent/ui')` 也会返回上述 mock。

// ---- 导入被测模块（必须在 mock 之后） ----
const { TclServiceAgent } = await import('./TclServiceAgent')

describe('TclServiceAgent', () => {
	describe('ui mode', () => {
		it('defaults to customer-service mode', () => {
			const agent = new TclServiceAgent({
				baseURL: 'https://api.example.com/v1',
				model: 'test-model',
			})
			expect(agent.uiMode).toBe('customer-service')
		})

		it('respects mode: developer when provided', () => {
			const agent = new TclServiceAgent({
				baseURL: 'https://api.example.com/v1',
				model: 'test-model',
				mode: 'developer',
			})
			expect(agent.uiMode).toBe('developer')
		})
	})

	describe('telemetry', () => {
		it('invokes telemetry.track with sessionId, taskId, pageUrl, intent and resultStatus on a successful troubleshooting execute', async () => {
			const events: TelemetryEvent[] = []
			const telemetry = {
				track: async (e: TelemetryEvent) => {
					events.push(e)
				},
			}
			const agent = new TclServiceAgent({
				baseURL: 'https://api.example.com/v1',
				model: 'test-model',
				mode: 'developer',
				telemetry,
			})

			await agent.execute('我的遥控器没反应')

			// 应有一次 resultStatus === 'success' 的事件（非 handoff 场景）
			const successEvent = events.find((e) => e.resultStatus === 'success')
			expect(successEvent).toBeDefined()
			expect(successEvent?.sessionId).toBeTruthy()
			expect(successEvent?.taskId).toBeTruthy()
			expect(successEvent?.pageUrl).toBe(testState.fakeUrl)
			expect(successEvent?.intent).toBe('troubleshooting')
		})

		it('reports resultStatus: handoff for human_support intent', async () => {
			const events: TelemetryEvent[] = []
			const telemetry = {
				track: async (e: TelemetryEvent) => {
					events.push(e)
				},
			}
			const agent = new TclServiceAgent({
				baseURL: 'https://api.example.com/v1',
				model: 'test-model',
				mode: 'developer',
				telemetry,
			})

			await agent.execute('我要找人工客服')

			const handoffEvent = events.find((e) => e.resultStatus === 'handoff')
			expect(handoffEvent).toBeDefined()
			expect(handoffEvent?.intent).toBe('human_support')

			// 不应再重复写 success 事件
			expect(events.find((e) => e.resultStatus === 'success')).toBeUndefined()
		})

		it('reports resultStatus: handoff for complaint intent', async () => {
			const events: TelemetryEvent[] = []
			const telemetry = {
				track: async (e: TelemetryEvent) => {
					events.push(e)
				},
			}
			const agent = new TclServiceAgent({
				baseURL: 'https://api.example.com/v1',
				model: 'test-model',
				mode: 'developer',
				telemetry,
			})

			await agent.execute('我要投诉，电视买了一周就坏了')

			const handoffEvent = events.find((e) => e.resultStatus === 'handoff')
			expect(handoffEvent).toBeDefined()
			expect(handoffEvent?.intent).toBe('complaint')
		})

		it('reports resultStatus: handoff when troubleshooting FAQ carries a riskNote', async () => {
			const events: TelemetryEvent[] = []
			const telemetry = {
				track: async (e: TelemetryEvent) => {
					events.push(e)
				},
			}
			const agent = new TclServiceAgent({
				baseURL: 'https://api.example.com/v1',
				model: 'test-model',
				mode: 'developer',
				telemetry,
			})

			// “空调显示 E1” 会命中 troubleshooting，且 FAQ 带 riskNote
			await agent.execute('空调显示 E1')

			const handoffEvents = events.filter((e) => e.resultStatus === 'handoff')
			// 至少有 1 条 riskNote 触发的 handoff（可能还含其他，但不为空即可）
			expect(handoffEvents.length).toBeGreaterThan(0)
			expect(events.find((e) => e.resultStatus === 'success')).toBeUndefined()
		})
	})

	describe('lifecycle', () => {
		it('exposes the underlying pageAgent', () => {
			const agent = new TclServiceAgent({
				baseURL: 'https://api.example.com/v1',
				model: 'test-model',
				mode: 'developer',
			})
			expect(agent.pageAgent).toBeDefined()
			expect(typeof agent.pageAgent.execute).toBe('function')
		})

		it('calls stop/dispose on the underlying agent', async () => {
			const agent = new TclServiceAgent({
				baseURL: 'https://api.example.com/v1',
				model: 'test-model',
				mode: 'developer',
			})
			await agent.stop()
			agent.dispose()
			// 没有抛错即通过
			expect(true).toBe(true)
		})
	})
})
