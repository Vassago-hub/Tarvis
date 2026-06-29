/**
 * Copyright (C) 2025 Alibaba Group Holding Limited
 * Copyright (C) 2026 SimonLuvRamen
 * All rights reserved.
 */
import { describe, expect, it } from 'vitest'

import { getTclPageInstructions } from './pages'

describe('getTclPageInstructions', () => {
	it('returns service-related instructions for user-service page', () => {
		const instructions = getTclPageInstructions('https://www.tcl.com/cn/zh/user-service')
		expect(instructions).toBeTypeOf('string')
		expect(instructions).toContain('服务')
	})

	it('returns home/nav instructions for TCL homepage', () => {
		const instructions = getTclPageInstructions('https://www.tcl.com/cn/zh')
		expect(instructions).toBeTypeOf('string')
		expect(instructions).toContain('首页')
	})

	it('returns product instructions for /products URL', () => {
		const instructions = getTclPageInstructions('https://www.tcl.com/cn/zh/products')
		expect(instructions).toBeTypeOf('string')
		expect(instructions).toContain('产品')
	})

	it('returns blog/tutorial instructions for /blog page', () => {
		const instructions = getTclPageInstructions('https://www.tcl.com/blog')
		expect(instructions).toBeTypeOf('string')
		expect(instructions).toContain('教程')
	})

	it('returns a string (default homepage fallback) for an unknown origin', () => {
		const instructions = getTclPageInstructions('https://unknown.example.com/page')
		expect(instructions).toBeTypeOf('string')
	})
})
