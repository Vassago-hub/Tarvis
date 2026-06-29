/**
 * Copyright (C) 2025 Alibaba Group Holding Limited
 * All rights reserved.
 *
 * PageController - Manages DOM operations and element interactions.
 * Designed to be independent of LLM and can be tested in unit tests.
 * All public methods are async for potential remote calling support.
 */
import {
	clickElement,
	getElementByIndex,
	inputTextElement,
	openMenuElement,
	scrollHorizontally,
	scrollVertically,
	selectOptionElement,
} from './actions'
import * as dom from './dom'
import type { FlatDomTree, InteractiveElementDomNode } from './dom/dom_tree/type'
import { getPageInfo } from './dom/getPageInfo'
import { patchReact } from './patches/react'
import { isAnchorElement } from './utils'

/**
 * Configuration for PageController
 */
export interface PageControllerConfig extends dom.DomConfig {
	/** Enable visual mask overlay during operations (default: false) */
	enableMask?: boolean
	/**
	 * Whether arbitrary JavaScript execution is allowed via executeJavascript().
	 * Defaults to false. PageAgentCore honours a matching config to remove the
	 * corresponding tool from the LLM tool list when disabled.
	 */
	enableScriptExecution?: boolean
}

/**
 * Structured browser state for LLM consumption
 */
export interface BrowserState {
	url: string
	title: string
	/** Page info + scroll position hint (e.g. "Page info: 1920x1080px...\n[Start of page]") */
	header: string
	/** Simplified HTML of interactive elements */
	content: string
	/** Page footer hint (e.g. "... 300 pixels below ..." or "[End of page]") */
	footer: string
}

interface ActionResult {
	success: boolean
	message: string
}

/**
 * PageController manages DOM state and element interactions.
 * It provides async methods for all DOM operations, keeping state isolated.
 *
 * @lifecycle
 * - beforeUpdate: Emitted before the DOM tree is updated.
 * - afterUpdate: Emitted after the DOM tree is updated.
 */
export interface ElementMetadata {
	index: number
	tagName: string
	text: string
	ariaLabel?: string
	role?: string
	href?: string
	target?: string
	inputType?: string
	name?: string
	placeholder?: string
	isExternalLink: boolean
	/** Triggers a form-like submit / save action */
	isSubmitLike: boolean
	/** Login / sign-in / register / sign-up style action, requires high-care */
	isAuthLike: boolean
	/** Payment / checkout / purchase style action, requires the highest care */
	isPaymentLike: boolean
	isSensitiveField: boolean
	opensInNewTab: boolean
}
export function getElementMetadataFromElement(
	index: number,
	element: HTMLElement,
	text = element.textContent?.trim() ?? '',
	currentUrl = window.location.href
): ElementMetadata {
	const attr = (name: string) => element.getAttribute(name) || undefined
	const tagName = element.tagName.toLowerCase()
	const inputType = attr('type')?.toLowerCase()
	const href = isAnchorElement(element) ? element.href : attr('href')
	const target = attr('target')
	const name = attr('name')
	const placeholder = attr('placeholder')
	const ariaLabel = attr('aria-label')
	const role = attr('role')
	const label = [text, ariaLabel, name, placeholder, attr('id')]
		.filter(Boolean)
		.join(' ')
		.toLowerCase()
	const sensitivePattern =
		/(phone|mobile|tel|address|addr|order|password|passwd|pwd|captcha|verify|verification|code|otp|身份证|证件|手机号|电话|联系方式|地址|订单|单号|验证码|密码)/
	// Risk-level stratified submit/payment/auth patterns.
	// - payment: highest-care interactions (pay, buy, checkout, 支付)
	// - auth: login/register/sign-in (需要很高的注意)
	// - submit: everything else that looks like a confirmation/submit action
	const paymentPattern =
		/(pay|payment|buy|purchase|checkout|order now|place order|支付|付款|购买|下单)/
	const authPattern =
		/(login|log in|signin|sign in|signup|sign up|register|logout|log out|登录|注册|登出|登入)/
	const submitPattern = /(submit|confirm|commit|send|预约|提交|确认|保存)/
	const isSubmitInput = tagName === 'input' && inputType === 'submit'
	const isSubmitButton =
		tagName === 'button' &&
		(inputType === 'submit' || (!inputType && Boolean(element.closest('form'))))
	// Only http(s) URLs are checked against the current origin; mailto/tel/javascript/file
	// are deliberately excluded because they don't represent navigable external domains,
	// and running `new URL` on them can throw or produce misleading origins.
	const isHttpHref = Boolean(
		href && /^https?:/i.test(typeof href === 'string' ? href : ((href as any)?.toString() ?? ''))
	)
	let isExternalLink = false
	if (isHttpHref) {
		try {
			isExternalLink = new URL(href!, currentUrl).origin !== new URL(currentUrl).origin
		} catch {
			isExternalLink = false
		}
	}
	const isPaymentLike = paymentPattern.test(label) || (isSubmitInput && paymentPattern.test(label))
	const isAuthLike = !isPaymentLike && authPattern.test(label)
	const isSubmitLike =
		!isPaymentLike && !isAuthLike && (isSubmitInput || isSubmitButton || submitPattern.test(label))

	return {
		index,
		tagName,
		text,
		ariaLabel,
		role,
		href,
		target,
		inputType,
		name,
		placeholder,
		isExternalLink,
		isSubmitLike,
		isAuthLike,
		isPaymentLike,
		isSensitiveField:
			tagName === 'input' &&
			(inputType === 'password' || inputType === 'tel' || sensitivePattern.test(label)),
		opensInNewTab: target === '_blank' || target === '_new',
	}
}
export class PageController extends EventTarget {
	private config: PageControllerConfig

	/** Corresponds to eval_page in browser-use */
	private flatTree: FlatDomTree | null = null

	/**
	 * All highlighted index-mapped interactive elements
	 * Corresponds to DOMState.selector_map in browser-use
	 */
	private selectorMap = new Map<number, InteractiveElementDomNode>()

	/** Index -> element text description mapping */
	private elementTextMap = new Map<number, string>()

	/**
	 * Simplified HTML for LLM consumption.
	 * Corresponds to clickable_elements_to_string in browser-use
	 */
	private simplifiedHTML = '<EMPTY>'

	/** last time the tree was updated */
	private lastTimeUpdate = 0

	/** Whether the tree has been indexed at least once */
	private isIndexed = false

	/** Visual mask overlay for blocking user interaction during automation */
	private mask: InstanceType<typeof import('./mask/SimulatorMask').SimulatorMask> | null = null
	private maskReady: Promise<void> | null = null

	constructor(config: PageControllerConfig = {}) {
		super()

		this.config = config

		patchReact(this)

		if (config.enableMask) this.initMask()
	}

	/**
	 * Initialize mask asynchronously (dynamic import to avoid CSS loading in Node)
	 */
	initMask() {
		if (this.maskReady !== null) return
		this.maskReady = (async () => {
			const { SimulatorMask } = await import('./mask/SimulatorMask')
			this.mask = new SimulatorMask()
		})()
	}
	// ======= State Queries =======

	/**
	 * Get current page URL
	 */
	async getCurrentUrl(): Promise<string> {
		return window.location.href
	}

	/**
	 * Get last tree update timestamp
	 */
	async getLastUpdateTime(): Promise<number> {
		return this.lastTimeUpdate
	}

	/**
	 * Get structured browser state for LLM consumption.
	 * Automatically calls updateTree() to refresh the DOM state.
	 */
	async getBrowserState(): Promise<BrowserState> {
		const url = window.location.href
		const title = document.title
		const pi = getPageInfo()
		const viewportExpansion = dom.resolveViewportExpansion(this.config.viewportExpansion)

		await this.updateTree()

		const content = this.simplifiedHTML

		// Build header: page info + scroll position hint
		const titleLine = `Current Page: [${title}](${url})`

		const pageInfoLine = `Page info: ${pi.viewport_width}x${pi.viewport_height}px viewport, ${pi.page_width}x${pi.page_height}px total page size, ${pi.pages_above.toFixed(1)} pages above, ${pi.pages_below.toFixed(1)} pages below, ${pi.total_pages.toFixed(1)} total pages, at ${(pi.current_page_position * 100).toFixed(0)}% of page`

		const elementsLabel =
			viewportExpansion === -1
				? 'Interactive elements from top layer of the current page (full page):'
				: 'Interactive elements from top layer of the current page inside the viewport:'

		const hasContentAbove = pi.pixels_above > 4
		const scrollHintAbove =
			hasContentAbove && viewportExpansion !== -1
				? `... ${pi.pixels_above} pixels above (${pi.pages_above.toFixed(1)} pages) - scroll to see more ...`
				: '[Start of page]'

		const header = `${titleLine}\n${pageInfoLine}\n\n${elementsLabel}\n\n${scrollHintAbove}`

		// Build footer: scroll position hint
		const hasContentBelow = pi.pixels_below > 4
		const footer =
			hasContentBelow && viewportExpansion !== -1
				? `... ${pi.pixels_below} pixels below (${pi.pages_below.toFixed(1)} pages) - scroll to see more ...`
				: '[End of page]'

		return { url, title, header, content, footer }
	}

	// ======= DOM Tree Operations =======

	/**
	 * Update DOM tree, returns simplified HTML for LLM.
	 * This is the main method to refresh the page state.
	 * Automatically bypasses mask during DOM extraction if enabled.
	 */
	async updateTree(): Promise<string> {
		this.dispatchEvent(new Event('beforeUpdate'))

		this.lastTimeUpdate = Date.now()

		// Temporarily bypass mask to allow DOM extraction
		if (this.mask) {
			this.mask.wrapper.style.pointerEvents = 'none'
		}

		dom.cleanUpHighlights()

		const blacklist = [
			...(this.config.interactiveBlacklist || []),
			...Array.from(document.querySelectorAll('[data-page-agent-not-interactive]')),
		]

		this.flatTree = dom.getFlatTree({
			...this.config,
			interactiveBlacklist: blacklist,
		})

		this.simplifiedHTML = dom.flatTreeToString(
			this.flatTree,
			this.config.includeAttributes,
			this.config.keepSemanticTags
		)

		this.selectorMap.clear()
		this.selectorMap = dom.getSelectorMap(this.flatTree)

		this.elementTextMap.clear()
		this.elementTextMap = dom.getElementTextMap(this.simplifiedHTML)

		// Mark as indexed - now element actions are allowed
		this.isIndexed = true

		// Restore mask blocking
		if (this.mask) {
			this.mask.wrapper.style.pointerEvents = 'auto'
		}

		this.dispatchEvent(new Event('afterUpdate'))

		return this.simplifiedHTML
	}

	/**
	 * Clean up all element highlights
	 */
	async cleanUpHighlights(): Promise<void> {
		console.log('[PageController] cleanUpHighlights')
		dom.cleanUpHighlights()
	}

	// ======= Element Actions =======

	/**
	 * Ensure the tree has been indexed before any index-based operation.
	 * Throws if updateTree() hasn't been called yet.
	 */
	private assertIndexed(): void {
		if (!this.isIndexed) {
			throw new Error('DOM tree not indexed yet. Can not perform actions on elements.')
		}
	}

	/**
	 * Read safety-relevant metadata for an indexed interactive element.
	 */
	async getElementMetadata(index: number): Promise<ElementMetadata> {
		this.assertIndexed()

		const element = getElementByIndex(this.selectorMap, index)
		const text = this.elementTextMap.get(index) ?? element.textContent?.trim() ?? ''
		return getElementMetadataFromElement(index, element, text)
	}
	/**
	 * Click element by index
	 */
	async clickElement(index: number, signal?: AbortSignal): Promise<ActionResult> {
		try {
			this.assertIndexed()
			const element = getElementByIndex(this.selectorMap, index)
			const elemText = this.elementTextMap.get(index)
			signal?.throwIfAborted()
			await clickElement(element, signal)

			// Handle links that open in new tabs
			if (isAnchorElement(element) && element.target === '_blank') {
				return {
					success: true,
					message: `✅ Clicked element (${elemText ?? index}). ⚠️ Link opened in a new tab.`,
				}
			}

			return {
				success: true,
				message: `✅ Clicked element (${elemText ?? index}).`,
			}
		} catch (error) {
			return {
				success: false,
				message: `❌ Failed to click element: ${error}`,
			}
		}
	}

	/**
	 * Open a dropdown/flyout/popover trigger and immediately refresh the DOM tree
	 * so newly visible menu items receive indexes for the next agent step.
	 */
	async openMenu(
		index: number,
		mode: 'auto' | 'hover' | 'click' = 'auto',
		signal?: AbortSignal
	): Promise<ActionResult> {
		try {
			this.assertIndexed()
			const element = getElementByIndex(this.selectorMap, index)
			const elemText = this.elementTextMap.get(index)
			const beforeHTML = this.simplifiedHTML
			const beforeCount = this.selectorMap.size
			const beforeExpanded = element.getAttribute('aria-expanded')
			const attempts: ('hover' | 'click')[] = mode === 'auto' ? ['hover', 'click'] : [mode]

			signal?.throwIfAborted()

			for (const attempt of attempts) {
				await openMenuElement(element, signal, attempt)
				const nextHTML = await this.updateTree()
				const afterExpanded = element.getAttribute('aria-expanded')
				const expanded =
					afterExpanded === 'true' || (Boolean(beforeExpanded) && afterExpanded !== beforeExpanded)
				const hasNewIndexes = this.selectorMap.size > beforeCount
				const contentChanged = nextHTML !== beforeHTML

				if (expanded || hasNewIndexes || contentChanged) {
					return {
						success: true,
						message: `✅ Opened menu/popover from element (${elemText ?? index}) with ${attempt} and refreshed interactive indexes. Use the newly visible indexed items next.`,
					}
				}
			}

			return {
				success: false,
				message: `❌ Menu/popover trigger (${elemText ?? index}) did not expose new interactive items. Try a different trigger, a more specific visible item, or ask the user to hover it manually.`,
			}
		} catch (error) {
			return {
				success: false,
				message: `❌ Failed to open menu/popover: ${error}`,
			}
		}
	}

	/**
	 * Input text into element by index
	 */
	async inputText(index: number, text: string, signal?: AbortSignal): Promise<ActionResult> {
		try {
			this.assertIndexed()
			const element = getElementByIndex(this.selectorMap, index)
			const elemText = this.elementTextMap.get(index)
			signal?.throwIfAborted()
			await inputTextElement(element, text, signal)

			return {
				success: true,
				message: `✅ Input text (${text}) into element (${elemText ?? index}).`,
			}
		} catch (error) {
			return {
				success: false,
				message: `❌ Failed to input text: ${error}`,
			}
		}
	}

	/**
	 * Select dropdown option by index and option text
	 */
	async selectOption(
		index: number,
		optionText: string,
		signal?: AbortSignal
	): Promise<ActionResult> {
		try {
			this.assertIndexed()
			const element = getElementByIndex(this.selectorMap, index)
			const elemText = this.elementTextMap.get(index)
			signal?.throwIfAborted()
			await selectOptionElement(element as HTMLSelectElement, optionText)

			return {
				success: true,
				message: `✅ Selected option (${optionText}) in element (${elemText ?? index}).`,
			}
		} catch (error) {
			return {
				success: false,
				message: `❌ Failed to select option: ${error}`,
			}
		}
	}

	/**
	 * Scroll vertically
	 */
	async scroll(
		options: {
			down: boolean
			numPages: number
			pixels?: number
			index?: number
		},
		signal?: AbortSignal
	): Promise<ActionResult> {
		try {
			const { down, numPages, pixels, index } = options

			this.assertIndexed()

			const scrollAmount = (pixels ?? numPages * window.innerHeight) * (down ? 1 : -1)

			const element = index !== undefined ? getElementByIndex(this.selectorMap, index) : null
			signal?.throwIfAborted()

			const message = await scrollVertically(scrollAmount, element, signal)

			return {
				success: true,
				message,
			}
		} catch (error) {
			return {
				success: false,
				message: `❌ Failed to scroll: ${error}`,
			}
		}
	}

	/**
	 * Scroll horizontally
	 */
	async scrollHorizontally(
		options: {
			right: boolean
			pixels: number
			index?: number
		},
		signal?: AbortSignal
	): Promise<ActionResult> {
		try {
			const { right, pixels, index } = options

			this.assertIndexed()

			const scrollAmount = pixels * (right ? 1 : -1)

			const element = index !== undefined ? getElementByIndex(this.selectorMap, index) : null
			signal?.throwIfAborted()

			const message = await scrollHorizontally(scrollAmount, element, signal)

			return {
				success: true,
				message,
			}
		} catch (error) {
			return {
				success: false,
				message: `❌ Failed to scroll horizontally: ${error}`,
			}
		}
	}

	/**
	 * Execute arbitrary JavaScript on the page. Gate-kept by
	 * `config.enableScriptExecution` (defaults to disabled).
	 *
	 * The script is compiled via `new Function('signal', script)` rather than
	 * `eval` so the evaluated source can only close over the explicit `signal`
	 * argument. The optional `signal` enables cooperative cancellation.
	 */
	async executeJavascript(script: string, signal?: AbortSignal): Promise<ActionResult> {
		try {
			if (!this.config.enableScriptExecution) {
				return {
					success: false,
					message:
						'❌ JavaScript execution is disabled. Enable config.enableScriptExecution to allow it.',
				}
			}
			signal?.throwIfAborted()
			// eslint-disable-next-line @typescript-eslint/no-implied-eval
			const asyncFunction = new Function(
				'signal',
				`return (async (signal) => { ${script} })(signal)`
			)
			const result = await asyncFunction(signal)
			return {
				success: true,
				message: `✅ Executed JavaScript. Result: ${result}`,
			}
		} catch (error) {
			if ((error as Error)?.name === 'AbortError') {
				return {
					success: false,
					message: `❌ JavaScript execution aborted.`,
				}
			}
			return {
				success: false,
				message: `❌ Error executing JavaScript: ${error}`,
			}
		}
	}

	// ======= Mask Operations =======

	/**
	 * Show the visual mask overlay.
	 * Only works after mask is setup.
	 */
	async showMask(): Promise<void> {
		await this.maskReady
		this.mask?.show()
	}

	/**
	 * Hide the visual mask overlay.
	 * Only works after mask is setup.
	 */
	async hideMask(): Promise<void> {
		await this.maskReady
		this.mask?.hide()
	}

	/**
	 * Dispose and clean up resources
	 */
	dispose(): void {
		dom.cleanUpHighlights()
		this.flatTree = null
		this.selectorMap.clear()
		this.elementTextMap.clear()
		this.simplifiedHTML = '<EMPTY>'
		this.isIndexed = false
		this.mask?.dispose()
		this.mask = null
	}
}

export * from './actions'
