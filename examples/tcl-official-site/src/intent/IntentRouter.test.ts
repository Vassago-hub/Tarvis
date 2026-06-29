/**
 * Copyright (C) 2025 Alibaba Group Holding Limited
 * Copyright (C) 2026 SimonLuvRamen
 * All rights reserved.
 */
import { describe, expect, it } from 'vitest'

import { IntentRouter } from './IntentRouter'

describe('IntentRouter', () => {
	const router = new IntentRouter()

	describe('troubleshooting', () => {
		it('classifies TV black-screen issues as troubleshooting', () => {
			const result = router.route('我的电视黑屏了，开不了机')
			expect(result.intent).toBe('troubleshooting')
			expect(result.entities.productType).toBe('电视')
			expect(result.entities.issueType).toBe('黑屏')
		})

		it('classifies air conditioner E1 error as troubleshooting', () => {
			const result = router.route('空调显示 E1')
			expect(result.intent).toBe('troubleshooting')
			expect(result.entities.productType).toBe('空调')
			expect(result.entities.issueType).toBe('E1')
		})
	})

	describe('repair_service', () => {
		it('classifies repair requests as repair_service', () => {
			const result = router.route('我要报修洗衣机')
			expect(result.intent).toBe('repair_service')
			expect(result.entities.productType).toBe('洗衣机')
		})
	})

	describe('human_support', () => {
		it('classifies human-agent requests as human_support', () => {
			const result = router.route('我要找人工客服')
			expect(result.intent).toBe('human_support')
		})

		it('classifies phone-number questions as human_support', () => {
			const result = router.route('你们客服电话是多少')
			expect(result.intent).toBe('human_support')
		})
	})

	describe('complaint', () => {
		it('classifies complaints as complaint', () => {
			const result = router.route('我要投诉，电视买了一周就坏了')
			expect(result.intent).toBe('complaint')
			expect(result.entities.productType).toBe('电视')
		})
	})

	describe('business_or_special_service', () => {
		it('classifies commercial display & central AC as business_or_special_service', () => {
			const result = router.route('商显中央空调，想做工程合作')
			expect(result.intent).toBe('business_or_special_service')
		})

		it('classifies PV product inquiries as business_or_special_service', () => {
			const result = router.route('光伏产品找谁')
			expect(result.intent).toBe('business_or_special_service')
		})
	})

	describe('site_navigation', () => {
		it('classifies service page navigation as site_navigation', () => {
			const result = router.route('服务支持页在哪')
			expect(result.intent).toBe('site_navigation')
		})
	})

	describe('unknown', () => {
		it('classifies generic greetings as unknown', () => {
			const result = router.route('你好')
			expect(result.intent).toBe('unknown')
			expect(result.confidence).toBeLessThan(0.5)
		})

		it('classifies off-topic messages as unknown', () => {
			const result = router.route('今天天气不错')
			expect(result.intent).toBe('unknown')
		})
	})

	describe('entity extraction', () => {
		it('extracts target page for TCL+ APP mentions', () => {
			const result = router.route('TCL+ APP 在哪里下载')
			expect(result.entities.targetPage).toBe('TCL+ APP')
		})

		it('handles whitespace-only input gracefully', () => {
			const result = router.route('   ')
			expect(result.intent).toBe('unknown')
		})
	})
})
