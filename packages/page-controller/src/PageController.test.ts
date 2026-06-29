import { describe, expect, it } from 'vitest'

import { PageController, getElementMetadataFromElement } from './PageController'
import { openMenuElement } from './actions'

describe('PageController', () => {
	it('constructs and exposes the current url', async () => {
		const controller = new PageController()
		expect(controller).toBeInstanceOf(PageController)
		expect(await controller.getCurrentUrl()).toBe(window.location.href)
	})

	describe('executeJavascript', () => {
		it('runs a script and returns its result', async () => {
			const controller = new PageController({ enableScriptExecution: true })
			const result = await controller.executeJavascript('return 1 + 2')
			expect(result).toMatchObject({ success: true })
			expect(result.message).toContain('3')
		})

		it('exposes the abort signal to the script scope', async () => {
			const controller = new PageController({ enableScriptExecution: true })
			const controllerSignal = new AbortController()
			controllerSignal.abort()

			const result = await controller.executeJavascript(
				'return signal.aborted',
				controllerSignal.signal
			)
			expect(result).toMatchObject({ success: false })
			expect(result.message).toContain('aborted')
		})

		it('reports a syntax error as a failed result', async () => {
			const controller = new PageController({ enableScriptExecution: true })
			const result = await controller.executeJavascript('return (')
			expect(result.success).toBe(false)
			expect(result.message).toContain('❌')
		})
	})

	describe('getElementMetadata', () => {
		it('marks external links, submit-like elements, and sensitive fields', async () => {
			document.body.innerHTML = `
				<a href="https://service.example.test" target="_blank">24小时在线客服</a>
				<input name="phone" placeholder="手机号" />
				<button type="submit">提交预约</button>
			`
			const [link, input, button] = Array.from(document.body.children) as HTMLElement[]

			const supportLink = getElementMetadataFromElement(0, link, link.textContent ?? '')
			const phoneInput = getElementMetadataFromElement(1, input)
			const submitButton = getElementMetadataFromElement(2, button, button.textContent ?? '')

			expect(supportLink.isExternalLink).toBe(true)
			expect(phoneInput.isSensitiveField).toBe(true)
			expect(submitButton.isSubmitLike).toBe(true)
		})

		it('does not treat normal navigation buttons as submit-like', () => {
			document.body.innerHTML = '<button type="button">服务支持</button>'
			const button = document.body.firstElementChild as HTMLElement

			const metadata = getElementMetadataFromElement(0, button, button.textContent ?? '')

			expect(metadata.isSubmitLike).toBe(false)
		})
	})

	describe('openMenuElement', () => {
		it('opens a popover trigger without treating the trigger as the final target', async () => {
			document.body.innerHTML = `
				<button aria-haspopup="menu" aria-expanded="false">产品中心</button>
				<div id="menu" role="menu" style="display: none">
					<button role="menuitem">电视</button>
				</div>
			`
			const trigger = document.querySelector('button')!
			const menu = document.querySelector<HTMLElement>('#menu')!
			trigger.addEventListener('click', () => {
				trigger.setAttribute('aria-expanded', 'true')
				menu.style.display = 'block'
			})

			await openMenuElement(trigger)

			expect(trigger.getAttribute('aria-expanded')).toBe('true')
			expect(menu.style.display).toBe('block')
		})

		it('does not navigate javascript: menu triggers while still dispatching click handlers', async () => {
			document.body.innerHTML = `<a href="javascript:window.__pageAgentCspFailure = true">产品</a>`
			const trigger = document.querySelector('a')!
			let clicked = false
			trigger.addEventListener('click', () => {
				clicked = true
			})

			await openMenuElement(trigger, undefined, 'click')

			expect(clicked).toBe(true)
			expect((window as any).__pageAgentCspFailure).toBeUndefined()
		})
	})
})
