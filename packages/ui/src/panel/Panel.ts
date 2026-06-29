import tclRaySpriteUrl from '../assets/tcl-ray-spritesheet.webp'
import { I18n, type SupportedLanguage } from '../i18n'
import { truncate } from '../utils'
import { createCard } from './cards'
import type { AgentActivity, PanelAgentAdapter } from './types'

import styles from './Panel.module.css'

/**
 * Panel configuration
 */
export interface PanelConfig {
	language?: SupportedLanguage
	/**
	 * Whether to prompt for next task after task completion
	 * @default true
	 */
	promptForNextTask?: boolean
	/**
	 * Show an assistant pet avatar next to the panel.
	 * @default true
	 */
	showPet?: boolean
	/**
	 * Sprite sheet URL for the assistant pet. Defaults to Tarvis.
	 */
	petSpriteUrl?: string
	/**
	 * Accessible name for the assistant pet.
	 * @default 'Tarvis'
	 */
	petName?: string
}

/**
 * Agent control panel
 *
 * Architecture:
 * - History list: renders directly from agent.history (historical events)
 * - Header bar: shows activity events (transient state) and agent status
 *
 * This separation ensures data consistency - history is the single source of truth
 * for what has been done, while activity shows what is happening now.
 */
export class Panel {
	#wrapper: HTMLElement
	#petAvatar: HTMLElement | null = null
	#indicator: HTMLElement
	#statusText: HTMLElement
	#historySection: HTMLElement
	#expandButton: HTMLElement
	#actionButton: HTMLElement
	#inputSection: HTMLElement
	#taskInput: HTMLInputElement

	#agent: PanelAgentAdapter
	#config: PanelConfig
	#isExpanded = false
	#i18n: I18n
	#userAnswerResolver: ((input: string) => void) | null = null
	#isWaitingForUserAnswer: boolean = false
	#headerUpdateTimer: ReturnType<typeof setInterval> | null = null
	#idlePetTimer: ReturnType<typeof setTimeout> | null = null
	#idlePetResetTimer: ReturnType<typeof setTimeout> | null = null
	#pendingHeaderText: string | null = null
	#isAnimating = false
	#petState: 'idle' | 'running' | 'review' | 'waiting' | 'failed' | null = null

	// Event handlers (bound for removal)
	#onStatusChange = () => this.#handleStatusChange()
	#onHistoryChange = () => this.#handleHistoryChange()
	#onActivity = (e: Event) => this.#handleActivity((e as CustomEvent<AgentActivity>).detail)
	#onAgentDispose = () => this.dispose()

	get wrapper(): HTMLElement {
		return this.#wrapper
	}

	/**
	 * Create a Panel bound to an agent
	 * @param agent - Agent instance that implements PanelAgentAdapter
	 * @param config - Optional panel configuration
	 */
	constructor(agent: PanelAgentAdapter, config: PanelConfig = {}) {
		this.#agent = agent
		this.#config = config
		this.#i18n = new I18n(config.language ?? 'en-US')

		// Set up askUser callback on agent
		this.#agent.onAskUser = (question, options) => this.#askUser(question, options?.signal)

		// Create UI elements
		this.#wrapper = this.#createWrapper()
		this.#petAvatar = this.#wrapper.querySelector(`.${styles.petAvatar}`)
		this.#indicator = this.#wrapper.querySelector(`.${styles.indicator}`)!
		this.#statusText = this.#wrapper.querySelector(`.${styles.statusText}`)!
		this.#historySection = this.#wrapper.querySelector(`.${styles.historySection}`)!
		this.#expandButton = this.#wrapper.querySelector(`.${styles.expandButton}`)!
		this.#actionButton = this.#wrapper.querySelector(`.${styles.stopButton}`)!
		this.#inputSection = this.#wrapper.querySelector(`.${styles.inputSectionWrapper}`)!
		this.#taskInput = this.#wrapper.querySelector(`.${styles.taskInput}`)!

		// Listen to agent events
		this.#agent.addEventListener('statuschange', this.#onStatusChange)
		this.#agent.addEventListener('historychange', this.#onHistoryChange)
		this.#agent.addEventListener('activity', this.#onActivity)
		this.#agent.addEventListener('dispose', this.#onAgentDispose)

		this.#setupEventListeners()
		this.#startHeaderUpdateLoop()
		this.#startIdlePetMotion()

		this.#showInputArea()

		this.hide() // Start hidden
	}

	// ========== Agent event handlers ==========

	/** Handle agent status change */
	#handleStatusChange(): void {
		const status = this.#agent.status

		// Map agent status to UI indicator. A `completed` run whose result reports
		// failure shows as error; other statuses map to their own indicator.
		const failed = status === 'completed' && this.#agent.lastResult?.success === false
		this.#updateStatusIndicator(failed ? 'error' : status)

		// Morph action button: running = stop, idle = hide the dialog and keep the pet alive.
		if (status === 'running') {
			this.#actionButton.textContent = '❌'
			this.#actionButton.title = this.#i18n.t('ui.panel.stop')
		} else {
			this.#actionButton.textContent = '❌'
			this.#actionButton.title = this.#i18n.t('ui.panel.collapse')
		}

		// Show/hide based on status
		if (status === 'running') {
			this.show()
			this.#setPetState('running')
			this.#hideInputArea() // Hide input while running
		}

		// Handle completion
		if (status === 'completed' || status === 'error' || status === 'stopped') {
			this.#setPetState(failed ? 'failed' : 'idle')
			if (!this.#isDocked() && this.#shouldShowInputArea()) {
				this.#showInputArea()
			}
		}
	}

	/** Handle agent history change - re-render history list from agent.history */
	#handleHistoryChange(): void {
		this.#renderHistory()
	}

	/**
	 * Handle agent activity - transient state for immediate UI feedback
	 * Activity events are NOT persisted in history, only used for header bar updates
	 */
	#handleActivity(activity: AgentActivity): void {
		switch (activity.type) {
			case 'thinking':
				this.#pendingHeaderText = this.#i18n.t('ui.panel.thinking')
				this.#updateStatusIndicator('thinking')
				this.#setPetState('review')
				break

			case 'executing':
				this.#pendingHeaderText = this.#getToolExecutingText(activity.tool, activity.input)
				this.#updateStatusIndicator('executing')
				this.#setPetState('running')
				break

			case 'executed':
				this.#pendingHeaderText = truncate(activity.output, 50)
				break

			case 'retrying':
				this.#pendingHeaderText = `Retrying (${activity.attempt}/${activity.maxAttempts})`
				this.#updateStatusIndicator('retrying')
				this.#setPetState('waiting')
				break

			case 'error':
				this.#pendingHeaderText = truncate(activity.message, 50)
				this.#updateStatusIndicator('error')
				this.#setPetState('failed')
				break
		}
	}

	/**
	 * Ask for user input (internal, called by agent via onAskUser).
	 * Rejects when `signal` aborts (task stopped or disposed), cleaning up the
	 * question card and pending state so the agent loop can settle.
	 */
	#askUser(question: string, signal?: AbortSignal): Promise<string> {
		return new Promise((resolve, reject) => {
			// Set `waiting for user answer` state
			this.#isWaitingForUserAnswer = true
			this.#userAnswerResolver = resolve

			// Expand history panel
			if (!this.#isExpanded) {
				this.#expand()
			}

			// Add temporary question card so user can see the full question
			const tempCard = document.createElement('div')
			tempCard.innerHTML = createCard({
				icon: '?',
				content: `Question: ${question}`,
				type: 'question',
			})
			const cardElement = tempCard.firstElementChild as HTMLElement
			cardElement.setAttribute('data-temp-card', 'true')
			this.#historySection.appendChild(cardElement)
			this.#scrollToBottom()

			this.#showInputArea(this.#i18n.t('ui.panel.userAnswerPrompt'))

			signal?.addEventListener(
				'abort',
				() => {
					this.#removeTempCards()
					this.#isWaitingForUserAnswer = false
					this.#userAnswerResolver = null
					// reason is a DOMException AbortError (abort() takes no args).
					reject(signal.reason as DOMException)
				},
				{ once: true }
			)
		})
	}

	/** Remove temporary question cards (only direct children for safety) */
	#removeTempCards(): void {
		Array.from(this.#historySection.children).forEach((child) => {
			if (child.getAttribute('data-temp-card') === 'true') {
				child.remove()
			}
		})
	}

	// ========== Public control methods ==========

	show(): void {
		this.wrapper.classList.remove(styles.docked)
		// Clear inline styles left by previous show/hide transitions.
		this.wrapper.style.opacity = ''
		this.wrapper.style.transform = ''
		// Ensure the input area is visible after the pet opens the panel.
		this.#inputSection.classList.remove(styles.hidden)
		this.#taskInput.value = ''
		this.#taskInput.placeholder = this.#i18n.t('ui.panel.taskInput')
	}

	hide(): void {
		this.#collapse()
		this.wrapper.classList.add(styles.docked)
	}

	reset(): void {
		this.#statusText.textContent = this.#i18n.t('ui.panel.ready')
		this.#updateStatusIndicator('thinking')
		this.#setPetState('idle')
		this.#renderHistory()
		this.#collapse()
		// Reset user input state
		this.#isWaitingForUserAnswer = false
		this.#userAnswerResolver = null
		// Show input area
		this.#showInputArea()
	}

	expand(): void {
		this.#expand()
	}

	collapse(): void {
		this.#collapse()
	}

	/**
	 * Dispose panel and clean up event listeners
	 */
	dispose(): void {
		// Remove agent event listeners
		this.#agent.removeEventListener('statuschange', this.#onStatusChange)
		this.#agent.removeEventListener('historychange', this.#onHistoryChange)
		this.#agent.removeEventListener('activity', this.#onActivity)
		this.#agent.removeEventListener('dispose', this.#onAgentDispose)

		// Clean up UI
		this.#isWaitingForUserAnswer = false
		this.#stopHeaderUpdateLoop()
		this.#stopIdlePetMotion()
		this.wrapper.remove()
	}

	// ========== Private methods ==========

	#getToolExecutingText(toolName: string, args: unknown): string {
		const a = args as Record<string, string | number>
		switch (toolName) {
			case 'click_element_by_index':
				return this.#i18n.t('ui.tools.clicking', { index: a.index })
			case 'input_text':
				return this.#i18n.t('ui.tools.inputting', { index: a.index })
			case 'select_dropdown_option':
				return this.#i18n.t('ui.tools.selecting', { text: a.text })
			case 'scroll':
				return this.#i18n.t('ui.tools.scrolling')
			case 'wait':
				return this.#i18n.t('ui.tools.waiting', { seconds: a.seconds })
			case 'ask_user':
				return this.#i18n.t('ui.tools.askingUser')
			case 'done':
				return this.#i18n.t('ui.tools.done')
			default:
				return this.#i18n.t('ui.tools.executing', { toolName })
		}
	}

	/**
	 * Action button handler: stop when running, hide dialog when idle.
	 */
	#handleActionButton(): void {
		if (this.#agent.status === 'running') {
			this.#agent.stop()
		} else {
			this.hide()
		}
	}

	/**
	 * Submit task
	 */
	#submitTask() {
		const input = this.#taskInput.value.trim()
		if (!input) return

		// Hide input area
		this.#hideInputArea()

		if (this.#isWaitingForUserAnswer) {
			// Handle user input mode
			this.#handleUserAnswer(input)
		} else {
			// Execute task via agent
			this.#agent.execute(input)
		}
	}

	/**
	 * Handle user answer
	 */
	#handleUserAnswer(input: string): void {
		this.#removeTempCards()

		// Reset state
		this.#isWaitingForUserAnswer = false

		// Call resolver to return user input
		if (this.#userAnswerResolver) {
			this.#userAnswerResolver(input)
			this.#userAnswerResolver = null
		}
	}

	/**
	 * Show input area
	 */
	#showInputArea(placeholder?: string): void {
		// Clear input field
		this.#taskInput.value = ''
		this.#taskInput.placeholder = placeholder || this.#i18n.t('ui.panel.taskInput')
		this.#inputSection.classList.remove(styles.hidden)
		// Focus on input field
		setTimeout(() => {
			this.#taskInput.focus()
		}, 100)
	}

	/**
	 * Hide input area
	 */
	#hideInputArea(): void {
		this.#inputSection.classList.add(styles.hidden)
	}

	/**
	 * Check if input area should be shown
	 */
	#shouldShowInputArea(): boolean {
		// Always show input area if waiting for user input
		if (this.#isWaitingForUserAnswer) return true

		const history = this.#agent.history
		if (history.length === 0) {
			return true // Initial state
		}

		const status = this.#agent.status
		const isTaskEnded = status === 'completed' || status === 'error' || status === 'stopped'

		// Only show input area after task completion if configured to do so
		if (isTaskEnded) {
			return this.#config.promptForNextTask ?? true
		}

		return false
	}

	#createWrapper(): HTMLElement {
		const taskInputMaxLength = 1000
		const showPet = this.#config.showPet ?? true
		const petName = this.#config.petName ?? 'Tarvis'
		const petSpriteUrl = this.#config.petSpriteUrl ?? tclRaySpriteUrl
		const wrapper = document.createElement('div')
		wrapper.id = 'page-agent-runtime_agent-panel'
		wrapper.className = styles.wrapper
		wrapper.setAttribute('data-browser-use-ignore', 'true')
		wrapper.setAttribute('data-page-agent-ignore', 'true')

		wrapper.innerHTML = `
			${
				showPet
					? `<div class="${styles.petAvatar} ${styles.petIdle}" role="img" aria-label="${petName}" title="${petName}"></div>`
					: ''
			}
			<div class="${styles.background}"></div>
			<div class="${styles.historySectionWrapper}">
				<div class="${styles.historySection}">
					<div class="${styles.historyItem}">
						<div class="${styles.historyContent}">
							<span class="${styles.statusIcon}">🤖</span>
							<span>${this.#i18n.t('ui.panel.waitingPlaceholder')}</span>
						</div>
					</div>
				</div>
			</div>
			<div class="${styles.header}">
				<div class="${styles.statusSection}">
					<div class="${styles.indicator} ${styles.thinking}"></div>
					<div class="${styles.statusText}">${this.#i18n.t('ui.panel.ready')}</div>
				</div>
				<div class="${styles.controls}">
					<button class="${styles.controlButton} ${styles.expandButton}" title="${this.#i18n.t('ui.panel.expand')}">
						▲
					</button>
					<button class="${styles.controlButton} ${styles.stopButton}" title="${this.#i18n.t('ui.panel.collapse')}">
						❌
					</button>
				</div>
			</div>
			<div class="${styles.inputSectionWrapper} ${styles.hidden}">
				<div class="${styles.inputSection}">
					<input 
						type="text" 
						class="${styles.taskInput}" 
						maxlength="${taskInputMaxLength}"
					/>
				</div>
			</div>
		`

		const petAvatar = wrapper.querySelector<HTMLElement>(`.${styles.petAvatar}`)
		if (petAvatar) {
			this.#loadPetSprite(petAvatar, petSpriteUrl)
		}

		document.body.appendChild(wrapper)
		return wrapper
	}

	#loadPetSprite(petAvatar: HTMLElement, petSpriteUrl: string): void {
		const image = new Image()
		let isApplied = false
		const applySprite = () => {
			if (isApplied) return

			isApplied = true
			petAvatar.style.backgroundImage = `url("${petSpriteUrl}")`
			petAvatar.classList.add(styles.petReady)
		}

		image.onload = applySprite
		image.onerror = applySprite
		image.src = petSpriteUrl

		if (image.complete) {
			applySprite()
		}
	}

	#setPetState(state: 'idle' | 'running' | 'review' | 'waiting' | 'failed'): void {
		if (!this.#petAvatar) return
		if (this.#petState === state) return

		this.#clearIdlePetReset()
		this.#petState = state
		this.#petAvatar.classList.remove(
			styles.petIdle,
			styles.petRunning,
			styles.petReview,
			styles.petWaiting,
			styles.petFailed
		)
		const className =
			state === 'running'
				? styles.petRunning
				: state === 'review'
					? styles.petReview
					: state === 'waiting'
						? styles.petWaiting
						: state === 'failed'
							? styles.petFailed
							: styles.petIdle
		this.#petAvatar.classList.add(className)
	}

	#setupEventListeners(): void {
		this.#petAvatar?.addEventListener('click', (e) => {
			e.stopPropagation()
			this.show()
			this.#taskInput.focus()
		})

		// Click header area to expand/collapse
		const header = this.wrapper.querySelector(`.${styles.header}`)!
		header.addEventListener('click', (e) => {
			// Don't trigger expand/collapse if clicking on buttons
			if ((e.target as HTMLElement).closest(`.${styles.controlButton}`)) {
				return
			}
			this.#toggle()
		})

		// Expand button
		this.#expandButton.addEventListener('click', (e) => {
			e.stopPropagation()
			this.#toggle()
		})

		// Action button (stop / close)
		this.#actionButton.addEventListener('click', (e) => {
			e.stopPropagation()
			this.#handleActionButton()
		})

		// Submit on Enter key in input field
		this.#taskInput.addEventListener('keydown', (e) => {
			if (e.isComposing) return // Ignore IME composition keys
			if (e.key === 'Enter') {
				e.preventDefault()
				this.#submitTask()
			}
		})

		// Prevent input area click event bubbling
		this.#inputSection.addEventListener('click', (e) => {
			e.stopPropagation()
		})
	}

	#isDocked(): boolean {
		return this.wrapper.classList.contains(styles.docked)
	}

	#toggle(): void {
		if (this.#isExpanded) {
			this.#collapse()
		} else {
			this.#expand()
		}
	}

	#expand(): void {
		this.#isExpanded = true
		this.wrapper.classList.add(styles.expanded)
		this.#expandButton.textContent = '▼'
	}

	#collapse(): void {
		this.#isExpanded = false
		this.wrapper.classList.remove(styles.expanded)
		this.#expandButton.textContent = '▲'
	}

	#startIdlePetMotion(): void {
		const schedule = () => {
			this.#idlePetTimer = setTimeout(
				() => {
					this.#idlePetTimer = null
					this.#playIdlePetMotion()
					schedule()
				},
				3600 + Math.random() * 5200
			)
		}

		schedule()
	}

	#playIdlePetMotion(): void {
		if (!this.#canPlayIdlePetMotion()) return

		const states: ('review' | 'waiting')[] = ['review', 'waiting']
		const state = states[Math.floor(Math.random() * states.length)]
		this.#setPetState(state)
		this.#idlePetResetTimer = setTimeout(() => {
			this.#idlePetResetTimer = null
			if (this.#canPlayIdlePetMotion(state)) {
				this.#setPetState('idle')
			}
		}, 1200)
	}

	#canPlayIdlePetMotion(expectedState: 'review' | 'waiting' | null = null): boolean {
		if (!this.#petAvatar || this.#isWaitingForUserAnswer) return false
		if (this.#agent.status === 'running') return false
		return expectedState ? this.#petState === expectedState : this.#petState === 'idle'
	}

	#clearIdlePetReset(): void {
		if (!this.#idlePetResetTimer) return
		clearTimeout(this.#idlePetResetTimer)
		this.#idlePetResetTimer = null
	}

	#stopIdlePetMotion(): void {
		if (this.#idlePetTimer) {
			clearTimeout(this.#idlePetTimer)
			this.#idlePetTimer = null
		}
		this.#clearIdlePetReset()
	}
	/**
	 * Start periodic header update loop
	 */
	#startHeaderUpdateLoop(): void {
		// Check every 450ms (same as total animation duration)
		this.#headerUpdateTimer = setInterval(() => {
			this.#checkAndUpdateHeader()
		}, 450)
	}

	/**
	 * Stop periodic header update loop
	 */
	#stopHeaderUpdateLoop(): void {
		if (this.#headerUpdateTimer) {
			clearInterval(this.#headerUpdateTimer)
			this.#headerUpdateTimer = null
		}
	}

	/**
	 * Check if header needs update and trigger animation if not currently animating
	 */
	#checkAndUpdateHeader(): void {
		// If no pending text or currently animating, skip
		if (!this.#pendingHeaderText || this.#isAnimating) {
			return
		}

		// If text is already displayed, clear pending and skip
		if (this.#statusText.textContent === this.#pendingHeaderText) {
			this.#pendingHeaderText = null
			return
		}

		// Start animation
		const textToShow = this.#pendingHeaderText
		this.#pendingHeaderText = null
		this.#animateTextChange(textToShow)
	}

	/**
	 * Animate text change with fade out/in effect
	 */
	#animateTextChange(newText: string): void {
		this.#isAnimating = true

		// Fade out current text
		this.#statusText.classList.add(styles.fadeOut)

		setTimeout(() => {
			// Update text content
			this.#statusText.textContent = newText

			// Fade in new text
			this.#statusText.classList.remove(styles.fadeOut)
			this.#statusText.classList.add(styles.fadeIn)

			setTimeout(() => {
				this.#statusText.classList.remove(styles.fadeIn)
				this.#isAnimating = false
			}, 300)
		}, 150) // Half the duration of fade out animation
	}

	#updateStatusIndicator(
		type:
			| 'idle'
			| 'running'
			| 'thinking'
			| 'executing'
			| 'executed'
			| 'retrying'
			| 'completed'
			| 'error'
			| 'stopped'
	): void {
		// `running` animates like thinking; `idle`/`stopped` use the neutral base.
		const variant = type === 'running' ? 'thinking' : type
		this.#indicator.className = styles.indicator
		if (variant !== 'idle' && variant !== 'stopped') {
			this.#indicator.classList.add(styles[variant])
		}
	}

	#scrollToBottom(): void {
		// Execute in next event loop to ensure DOM update completion
		setTimeout(() => {
			this.#historySection.scrollTop = this.#historySection.scrollHeight
		}, 0)
	}

	/**
	 * Render history directly from agent.history
	 *
	 * Renders:
	 * 1. Task (first item, from agent.task)
	 * 2. Reflection cards (evaluation, memory, next_goal)
	 * 3. Tool execution with output
	 * 4. Observations
	 */
	#renderHistory(): void {
		const items: string[] = []

		// 1. Task card (always first)
		const task = this.#agent.task
		if (task) {
			items.push(this.#createTaskCard(task))
		}

		// 2. Render each history event
		const history = this.#agent.history
		for (const event of history) {
			items.push(...this.#createHistoryCards(event))
		}

		this.#historySection.innerHTML = items.join('')
		this.#scrollToBottom()
	}

	#createTaskCard(task: string): string {
		return createCard({
			icon: this.#i18n.t('ui.panel.historyCardTask'),
			content: task,
			type: 'input',
		})
	}

	/** Create cards for a history event */
	#createHistoryCards(event: PanelAgentAdapter['history'][number]): string[] {
		const cards: string[] = []

		if (event.type === 'step') {
			// Action card (only final answers shown to user)
			const action = event.action
			if (action) {
				cards.push(...this.#createActionCards(action))
			}
		} else if (event.type === 'error') {
			cards.push(
				createCard({
					icon: this.#i18n.t('ui.panel.historyCardError'),
					content: event.message || 'Error',
					type: 'observation',
				})
			)
		}

		return cards
	}

	/** Create cards for an action - only user-facing actions shown (done/ask_user) */
	#createActionCards(action: { name: string; input: unknown; output: string }): string[] {
		const cards: string[] = []

		if (action.name === 'done') {
			const input = action.input as { text?: string }
			const text = input.text || action.output || ''
			if (text) {
				cards.push(
					createCard({
						icon: this.#i18n.t('ui.panel.historyCardBot'),
						content: text,
						type: 'output',
					})
				)
			}
		} else if (action.name === 'ask_user') {
			const input = action.input as { question?: string }
			const answer = action.output.replace(/^User answered:\s*/i, '')
			cards.push(
				createCard({
					icon: this.#i18n.t('ui.panel.historyCardQuestion'),
					content: input.question || '',
					type: 'question',
				})
			)
			cards.push(
				createCard({
					icon: this.#i18n.t('ui.panel.historyCardAnswer'),
					content: answer,
					type: 'input',
				})
			)
		}

		return cards
	}
}

