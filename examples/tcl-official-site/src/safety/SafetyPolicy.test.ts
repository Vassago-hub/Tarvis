/**
 * Copyright (C) 2025 Alibaba Group Holding Limited
 * Copyright (C) 2026 SimonLuvRamen
 * All rights reserved.
 */
import { describe, expect, it } from 'vitest'

import { TclSafetyPolicy } from './SafetyPolicy'

interface ToolExecutionContext {
	toolName: string
	toolInput: unknown
	pageUrl: string
	element?: {
		index?: number
		tagName?: string
		text?: string
		ariaLabel?: string
		name?: string
		placeholder?: string
		isExternalLink?: boolean
		isSubmitLike?: boolean
		isSensitiveField?: boolean
	}
}

describe('TclSafetyPolicy', () => {
	const policy = new TclSafetyPolicy()

	it('T2.3: blocks execute_javascript unconditionally', () => {
		const ctx: ToolExecutionContext = {
			toolName: 'execute_javascript',
			toolInput: { code: 'document.write("hi")' },
			pageUrl: 'https://www.tcl.com/cn/zh/user-service',
		}

		const decision = policy.evaluate(ctx as any)

		expect(decision.type).toBe('block')
		expect(decision.riskLevel).toBe('blocked')
		expect(decision.reason).toContain('JavaScript')
	})

	it('T2.7: blocks input targeting login/password fields (before sensitive-field check)', () => {
		const ctx: ToolExecutionContext = {
			toolName: 'input_text',
			toolInput: { index: 0, text: '123456' },
			pageUrl: 'https://www.tcl.com/cn/zh/user-service',
			element: {
				index: 0,
				tagName: 'input',
				placeholder: '请输入密码',
				isSensitiveField: true,
			},
		}

		const decision = policy.evaluate(ctx as any)

		expect(decision.type).toBe('block')
		expect(decision.riskLevel).toBe('blocked')
	})

	it('T2.6: input_text to sensitive field (phone) → confirm + high', () => {
		const ctx: ToolExecutionContext = {
			toolName: 'input_text',
			toolInput: { index: 1, text: '13800138000' },
			pageUrl: 'https://www.tcl.com/cn/zh/user-service',
			element: {
				index: 1,
				tagName: 'input',
				placeholder: '请输入手机号',
				isSensitiveField: true,
			},
		}

		const decision = policy.evaluate(ctx as any)

		expect(decision.type).toBe('confirm')
		expect(decision.riskLevel).toBe('high')
	})

	it('T2.5: clicking submit-like button → confirm + high', () => {
		const ctx: ToolExecutionContext = {
			toolName: 'click_element_by_index',
			toolInput: { index: 2 },
			pageUrl: 'https://www.tcl.com/cn/zh/user-service',
			element: {
				index: 2,
				tagName: 'button',
				text: '提交预约',
				isSubmitLike: true,
			},
		}

		const decision = policy.evaluate(ctx as any)

		expect(decision.type).toBe('confirm')
		expect(decision.riskLevel).toBe('high')
	})

	it('T2.4: clicking external-link element → confirm + medium', () => {
		const ctx: ToolExecutionContext = {
			toolName: 'click_element_by_index',
			toolInput: { index: 3 },
			pageUrl: 'https://www.tcl.com/cn/zh/user-service',
			element: {
				index: 3,
				tagName: 'a',
				text: '24小时在线客服',
				isExternalLink: true,
			},
		}

		const decision = policy.evaluate(ctx as any)

		expect(decision.type).toBe('confirm')
		expect(decision.riskLevel).toBe('medium')
	})

	it('T2.8: safety-risk keyword in tool input → confirm + high', () => {
		const ctx: ToolExecutionContext = {
			toolName: 'click_element_by_index',
			toolInput: { index: 4, context: '空调冒烟，有烧焦味' },
			pageUrl: 'https://www.tcl.com/cn/zh/user-service',
			element: {
				index: 4,
				tagName: 'a',
				text: '在线客服',
			},
		}

		const decision = policy.evaluate(ctx as any)

		expect(decision.type).toBe('confirm')
		expect(decision.riskLevel).toBe('high')
	})

	it('T2.8b: water ingress keyword → confirm + high', () => {
		const ctx: ToolExecutionContext = {
			toolName: 'click_element_by_index',
			toolInput: { index: 5, context: '洗衣机进水异常' },
			pageUrl: 'https://www.tcl.com/cn/zh/user-service',
			element: {
				index: 5,
				tagName: 'a',
				text: '联系客服',
			},
		}

		const decision = policy.evaluate(ctx as any)

		expect(decision.type).toBe('confirm')
		expect(decision.riskLevel).toBe('high')
	})

	it('T2.9: plain scroll on normal element → allow + low', () => {
		const ctx: ToolExecutionContext = {
			toolName: 'scroll',
			toolInput: { direction: 'down' },
			pageUrl: 'https://www.tcl.com/cn/zh',
			element: undefined,
		}

		const decision = policy.evaluate(ctx as any)

		expect(decision.type).toBe('allow')
		expect(decision.riskLevel).toBe('low')
	})

	it('T2.9b: reading a normal element → allow + low', () => {
		const ctx: ToolExecutionContext = {
			toolName: 'read_page',
			toolInput: {},
			pageUrl: 'https://www.tcl.com/cn/zh/products',
		}

		const decision = policy.evaluate(ctx as any)

		expect(decision.type).toBe('allow')
		expect(decision.riskLevel).toBe('low')
	})
})
