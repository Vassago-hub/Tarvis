/**
 * Copyright (C) 2025 Alibaba Group Holding Limited
 * Copyright (C) 2026 SimonLuvRamen
 * All rights reserved.
 *
 * CustomerServicePanel —— 客服式浮窗 UI，面向普通用户而非开发者。
 * 与 Panel 不同，此处完全不渲染工具名、索引、step 等技术细节。
 */
import { I18n } from '../i18n'
import type { ConfirmQuestion } from '../panel/types'
import { escapeHtml } from '../utils'
import type { CsAgentAdapter, CsMessage, CsMessageType, CustomerServicePanelConfig } from './types'

import styles from './CustomerServicePanel.module.css'

/** 技术文本关键词黑名单 —— 命中的 history 内容不会显示给用户 */
const TECHNICAL_BLACKLIST = [
	'Step',
	'step',
	'click_element',
	'input_text',
	'scroll',
	'execute',
	'select_option',
	'wait_for',
	'ask_user',
	'click_element_by_index',
	'input_text_element',
	'select_dropdown_option',
	'scrollVertically',
	'scrollHorizontally',
	'done',
]

/** 索引类正则 —— 如 [0]、[12]、element #3 等 */
const INDEX_PATTERN = /\[\d+\]|element\s*#\d+/i

/** 兜底/转人工 关键词（出现在 history.message 或 content 中时提示转人工） */
const HANDOFF_KEYWORDS = [
	'handoff',
	'transfer',
	'complaint',
	'safety',
	'captcha',
	'login',
	'需要登录',
	'验证码',
	'人工',
	'客服',
	'投诉',
	'敏感',
]

export class CustomerServicePanel {
	#wrapper: HTMLElement
	#messagesEl: HTMLElement
	#inputEl: HTMLInputElement
	#sendBtn: HTMLElement
	#quickActionsEl: HTMLElement
	#toggleBtn: HTMLElement
	#closeBtn: HTMLElement

	#agent: CsAgentAdapter
	#config: Required<Pick<CustomerServicePanelConfig, 'language'>> & CustomerServicePanelConfig
	#i18n: I18n

	#messages: CsMessage[] = []
	#minimized = false
	#lastHistoryLength = 0
	#pendingConfirmId: string | null = null

	// Event handlers (bound for removal)
	#onStatusChange = () => this.#handleStatusChange()
	#onHistoryChange = () => this.#handleHistoryChange()
	#onActivity = () => this.#handleActivity()
	#onAgentDispose = () => this.dispose()

	get wrapper(): HTMLElement {
		return this.#wrapper
	}

	constructor(agent: CsAgentAdapter, config: CustomerServicePanelConfig = {}) {
		this.#agent = agent
		this.#config = { language: 'zh-CN', ...config }
		this.#i18n = new I18n(this.#config.language)

		// 将 agent 的 onConfirm 桥接到 UI（若 agent 侧尚未设置）
		this.#agent.onConfirm = (question) => this.#askConfirm(question)

		this.#wrapper = this.#createWrapper()
		this.#messagesEl = this.#wrapper.querySelector(`.${styles.messages}`)!
		this.#inputEl = this.#wrapper.querySelector('input')! as HTMLInputElement
		this.#sendBtn = this.#wrapper.querySelector(`.${styles.sendButton}`)!
		this.#quickActionsEl = this.#wrapper.querySelector(`.${styles.quickActions}`)!
		this.#toggleBtn = this.#wrapper.querySelector('[data-action="toggle"]')!
		this.#closeBtn = this.#wrapper.querySelector('[data-action="close"]')!

		// Listen to agent events
		this.#agent.addEventListener('statuschange', this.#onStatusChange)
		this.#agent.addEventListener('historychange', this.#onHistoryChange)
		this.#agent.addEventListener('activity', this.#onActivity)
		this.#agent.addEventListener('dispose', this.#onAgentDispose)

		this.#setupEventListeners()

		// 欢迎态
		this.#pushMessage({
			id: `welcome-${Date.now()}`,
			type: 'assistant',
			content: this.#i18n.t('ui.customerService.title') + '，请问有什么可以帮您？',
			timestamp: Date.now(),
		})
	}

	// ======= Public API =======

	show(): void {
		this.#wrapper.style.display = 'flex'
	}

	hide(): void {
		this.#wrapper.style.display = 'none'
	}

	minimize(): void {
		this.#minimized = true
		this.#wrapper.classList.add(styles.minimized)
		this.#wrapper.innerHTML = ''
		const icon = document.createElement('div')
		icon.className = styles.minimizedIcon
		icon.title = this.#i18n.t('ui.customerService.expand')
		icon.addEventListener('click', () => this.expand())
		this.#wrapper.appendChild(icon)
	}

	expand(): void {
		this.#minimized = false
		this.#wrapper.classList.remove(styles.minimized)
		// 重建完整 DOM（简单做法）
		this.#wrapper.innerHTML = ''
		const fresh = this.#createWrapper()
		// 将内容搬回（此处简单做法：直接替换 wrapper 内的结构）
		this.#messagesEl = fresh.querySelector(`.${styles.messages}`)!
		this.#inputEl = fresh.querySelector('input')! as HTMLInputElement
		this.#sendBtn = fresh.querySelector(`.${styles.sendButton}`)!
		this.#quickActionsEl = fresh.querySelector(`.${styles.quickActions}`)!
		this.#toggleBtn = fresh.querySelector('[data-action="toggle"]')!
		this.#closeBtn = fresh.querySelector('[data-action="close"]')!

		// 将已有消息渲染
		this.#renderAllMessages()
		this.#setupEventListeners()
	}

	toggle(): void {
		if (this.#minimized) {
			this.expand()
		} else {
			this.minimize()
		}
	}

	dispose(): void {
		this.#agent.removeEventListener('statuschange', this.#onStatusChange)
		this.#agent.removeEventListener('historychange', this.#onHistoryChange)
		this.#agent.removeEventListener('activity', this.#onActivity)
		this.#agent.removeEventListener('dispose', this.#onAgentDispose)
		this.#wrapper.remove()
	}

	// ======= Agent event handlers =======

	#handleStatusChange(): void {
		const status = this.#agent.status

		if (status === 'running') {
			// 更新输入区
			this.#inputEl.disabled = true
			this.#sendBtn.setAttribute('disabled', 'true')
			this.#inputEl.placeholder = this.#i18n.t('ui.customerService.processing')

			// 移除旧的「正在处理…」状态消息
			this.#removeMessagesOfType('status')
			this.#pushMessage({
				id: `status-${Date.now()}`,
				type: 'status',
				content: this.#i18n.t('ui.customerService.processing'),
				timestamp: Date.now(),
			})
		} else {
			this.#inputEl.disabled = false
			this.#sendBtn.removeAttribute('disabled')
			this.#inputEl.placeholder = this.#i18n.t('ui.customerService.inputPlaceholder')

			// 任务结束，清理状态提示
			this.#removeMessagesOfType('status')

			if (status === 'error') {
				this.#pushMessage({
					id: `fallback-${Date.now()}`,
					type: 'fallback',
					content: this.#i18n.t('ui.customerService.fallback.noEntry'),
					timestamp: Date.now(),
				})
			}
		}
	}

	#handleHistoryChange(): void {
		// 把 task 渲染为用户气泡
		if (this.#agent.task && this.#lastHistoryLength === 0) {
			this.#pushMessage({
				id: `user-${Date.now()}`,
				type: 'user',
				content: this.#agent.task,
				timestamp: Date.now(),
			})
		}

		// 仅渲染新增条目，避免重复
		const history = this.#agent.history
		const startIdx = this.#lastHistoryLength
		this.#lastHistoryLength = history.length

		for (let i = startIdx; i < history.length; i++) {
			const entry = history[i]
			this.#renderHistoryEntry(entry)
		}
	}

	#handleActivity(): void {
		// 活动事件在客服模式下仅作为轻提示（不渲染具体工具名）
		// 若当前已有 status 消息则保持，否则追加「正在为您处理…」
		const hasStatus = this.#messages.some((m) => m.type === 'status')
		if (!hasStatus && this.#agent.status === 'running') {
			this.#pushMessage({
				id: `status-${Date.now()}`,
				type: 'status',
				content: this.#i18n.t('ui.customerService.processing'),
				timestamp: Date.now(),
			})
		}
	}

	// ======= History rendering (核心：过滤技术文本) =======

	#renderHistoryEntry(entry: CsAgentAdapter['history'][number]): void {
		// step -> 提取 action.output 作为助手回复
		// observation -> 提取 content 作为助手回复
		// error / retry -> 过滤后作为助手回复或转人工
		const type = entry.type

		// 检查是否为转人工关键词触发
		const contentString =
			typeof entry.action?.output === 'string'
				? entry.action.output
				: typeof entry.content === 'string'
					? entry.content
					: ''
		if (HANDOFF_KEYWORDS.some((k) => contentString.toLowerCase().includes(k))) {
			this.#renderHandoffCard(contentString)
			return
		}

		let text: string
		if (type === 'step' && entry.action) {
			// 仅在 done / ask_user 时输出用户可见文本，其他工具名一律跳过
			const toolName = (entry.action.name || '').toLowerCase()
			if (toolName === 'done') {
				text = entry.action.output || ''
			} else if (toolName === 'ask_user') {
				// 用提问内容作为助手消息（由 Panel 管理输入态，这里仅做展示）
				const input = entry.action.input as { question?: string } | undefined
				text = input?.question || entry.action.output || ''
			} else {
				// 其他工具调用不展示给用户（保持客服式简洁）
				return
			}
		} else if (type === 'observation') {
			text = entry.content || ''
		} else if (type === 'error') {
			// 错误在客服模式下以「未找到入口」兜底呈现
			this.#pushMessage({
				id: `fallback-${Date.now()}`,
				type: 'fallback',
				content: this.#i18n.t('ui.customerService.fallback.noEntry'),
				timestamp: Date.now(),
			})
			return
		} else {
			// retry / user_takeover 等其他类型不在客服 UI 展示
			return
		}

		// 过滤技术文本
		text = this.#filterTechnicalText(text)
		if (!text) return

		this.#pushMessage({
			id: `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
			type: 'assistant',
			content: text,
			timestamp: Date.now(),
		})
	}

	#filterTechnicalText(text: string): string {
		if (!text) return ''
		let cleaned = text

		// 删除整行包含黑名单关键词的内容
		const lines = cleaned.split(/\r?\n/)
		const filteredLines = lines.filter((line) => {
			if (TECHNICAL_BLACKLIST.some((k) => line.includes(k))) return false
			if (INDEX_PATTERN.test(line)) return false
			return true
		})
		cleaned = filteredLines.join('\n')

		// 移除内嵌的工具名/索引 token（行内替换）
		TECHNICAL_BLACKLIST.forEach((keyword) => {
			const re = new RegExp(keyword.replace(/_/g, '\\_'), 'gi')
			cleaned = cleaned.replace(re, '')
		})
		cleaned = cleaned.replace(INDEX_PATTERN, '')

		// 压缩连续空白
		cleaned = cleaned.replace(/\s{2,}/g, ' ').trim()

		// 如果内容太短或只有标点，视为空
		if (cleaned.length < 2) return ''
		return cleaned
	}

	// ======= Confirm & Handoff cards =======

	#askConfirm(question: ConfirmQuestion): Promise<boolean> {
		return new Promise((resolve) => {
			// 如果已经有一个挂起的确认，直接拒绝（避免堆叠）
			if (this.#pendingConfirmId) {
				resolve(false)
				return
			}
			this.#pendingConfirmId = question.id

			const msg: CsMessage = {
				id: `confirm-${question.id}-${Date.now()}`,
				type: 'confirm',
				content: '',
				question,
				timestamp: Date.now(),
			}
			this.#pushMessage(msg)

			// 在下一个微任务中绑定按钮事件（DOM 已渲染）
			queueMicrotask(() => {
				const card = this.#messagesEl.querySelector(
					`[data-confirm-id="${question.id}"]`
				) as HTMLElement | null
				if (!card) {
					this.#pendingConfirmId = null
					resolve(false)
					return
				}
				const confirmBtn = card.querySelector(
					`[data-confirm-action="confirm"]`
				) as HTMLButtonElement | null
				const cancelBtn = card.querySelector(
					`[data-confirm-action="cancel"]`
				) as HTMLButtonElement | null

				const finish = (value: boolean) => {
					this.#pendingConfirmId = null
					// 将卡片置为只读态
					card
						.querySelectorAll('button')
						.forEach((b) => (b as HTMLButtonElement).setAttribute('disabled', 'true'))
					resolve(value)
				}

				confirmBtn?.addEventListener('click', () => finish(true))
				cancelBtn?.addEventListener('click', () => finish(false))
			})
		})
	}

	#renderHandoffCard(summary: string): void {
		const handoff = {
			phone: this.#config.hotline ?? '4008-123456',
			onlineServiceUrl: this.#config.onlineServiceUrl,
			servicePageUrl: this.#config.servicePageUrl,
			summary: this.#filterTechnicalText(summary) || this.#agent.task,
		}
		this.#pushMessage({
			id: `handoff-${Date.now()}`,
			type: 'handoff',
			content: '',
			handoff,
			timestamp: Date.now(),
		})
	}

	// ======= DOM / rendering =======

	#createWrapper(): HTMLElement {
		const wrapper = document.createElement('div')
		wrapper.className = styles.wrapper
		wrapper.setAttribute('data-browser-use-ignore', 'true')
		wrapper.setAttribute('data-page-agent-ignore', 'true')

		const quickActions =
			this.#config.quickActions && this.#config.quickActions.length > 0
				? this.#config.quickActions
				: [
						{
							label: this.#i18n.t('ui.customerService.quickActions.humanSupport'),
							prompt: this.#i18n.t('ui.customerService.quickActions.humanSupport'),
						},
						{
							label: this.#i18n.t('ui.customerService.quickActions.troubleshooting'),
							prompt: this.#i18n.t('ui.customerService.quickActions.troubleshooting'),
						},
						{
							label: this.#i18n.t('ui.customerService.quickActions.repair'),
							prompt: this.#i18n.t('ui.customerService.quickActions.repair'),
						},
						{
							label: this.#i18n.t('ui.customerService.quickActions.findProduct'),
							prompt: this.#i18n.t('ui.customerService.quickActions.findProduct'),
						},
					]

		wrapper.innerHTML = `
			<div class="${styles.header}">
				<div class="${styles.title}">${escapeHtml(
					this.#config.title || this.#i18n.t('ui.customerService.title')
				)}</div>
				<div class="${styles.controls}">
					<button data-action="toggle" title="${this.#i18n.t('ui.customerService.collapse')}">—</button>
					<button data-action="close" title="×">×</button>
				</div>
			</div>
			<div class="${styles.messages}"></div>
			<div class="${styles.quickActions}">
				${quickActions
					.map(
						(qa) =>
							`<button type="button" data-prompt="${escapeHtml(qa.prompt)}">${escapeHtml(
								qa.label
							)}</button>`
					)
					.join('')}
			</div>
			<div class="${styles.inputSection}">
				<input type="text" placeholder="${this.#i18n.t('ui.customerService.inputPlaceholder')}" />
				<button class="${styles.sendButton}" type="button" title="→">➤</button>
			</div>
		`

		document.body.appendChild(wrapper)
		return wrapper
	}

	#setupEventListeners(): void {
		// 快捷操作按钮
		Array.from(
			this.#quickActionsEl.querySelectorAll<HTMLButtonElement>('button[data-prompt]')
		).forEach((btn) => {
			btn.addEventListener('click', () => {
				const prompt = btn.getAttribute('data-prompt') || ''
				if (!prompt || this.#agent.status === 'running') return
				this.#inputEl.value = prompt
				this.#submitInput()
			})
		})

		// 折叠/展开
		this.#toggleBtn.addEventListener('click', () => this.toggle())
		this.#closeBtn.addEventListener('click', () => this.dispose())

		// 输入提交
		this.#inputEl.addEventListener('keydown', (e) => {
			if (e.isComposing) return
			if (e.key === 'Enter') {
				e.preventDefault()
				this.#submitInput()
			}
		})
		this.#sendBtn.addEventListener('click', () => this.#submitInput())
	}

	#submitInput(): void {
		const text = this.#inputEl.value.trim()
		if (!text || this.#agent.status === 'running') return

		this.#inputEl.value = ''
		this.#pushMessage({
			id: `user-${Date.now()}`,
			type: 'user',
			content: text,
			timestamp: Date.now(),
		})

		this.#lastHistoryLength = 0 // 重置增量起点，新的 history 会被视为「新任务」
		this.#agent.execute(text)
	}

	// ======= Messages list =======

	#pushMessage(msg: CsMessage): void {
		// 去重：相同 id 的消息不再追加
		if (this.#messages.some((m) => m.id === msg.id)) return
		this.#messages.push(msg)
		this.#appendMessageElement(msg)
		this.#scrollToBottom()
	}

	#removeMessagesOfType(type: CsMessageType): void {
		this.#messages = this.#messages.filter((m) => m.type !== type)
		Array.from(this.#messagesEl.querySelectorAll(`[data-message-type="${type}"]`)).forEach((el) =>
			el.remove()
		)
	}

	#renderAllMessages(): void {
		this.#messagesEl.innerHTML = ''
		const snapshot = [...this.#messages]
		this.#messages = []
		snapshot.forEach((m) => this.#pushMessage(m))
	}

	#appendMessageElement(msg: CsMessage): void {
		const container = document.createElement('div')
		container.setAttribute('data-message-id', msg.id)
		container.setAttribute('data-message-type', msg.type)

		switch (msg.type) {
			case 'user':
				container.className = styles.userBubble
				container.textContent = msg.content
				break
			case 'assistant':
				container.className = styles.assistantBubble
				container.innerHTML = escapeHtml(msg.content).replace(/\n/g, '<br/>')
				break
			case 'status':
				container.className = styles.statusText
				container.textContent = msg.content
				break
			case 'confirm': {
				const q = msg.question!
				container.className = styles.confirmCard
				container.setAttribute('data-confirm-id', q.id)
				container.innerHTML = `
					<div class="${styles.title}">${escapeHtml(q.title)}</div>
					<div class="${styles.description}">${escapeHtml(q.description).replace(/\n/g, '<br/>')}</div>
					<div class="${styles.buttons}">
						<button class="${styles.confirm}" data-confirm-action="confirm">${escapeHtml(
							q.confirmText || this.#i18n.t('ui.customerService.confirm.continue')
						)}</button>
						<button class="${styles.cancel}" data-confirm-action="cancel">${escapeHtml(
							q.cancelText || this.#i18n.t('ui.customerService.confirm.cancel')
						)}</button>
					</div>
				`
				break
			}
			case 'handoff': {
				const h = msg.handoff!
				container.className = styles.handoffCard
				const summary = h.summary || this.#agent.task
				const summaryId = `summary-${msg.id}`
				container.innerHTML = `
					<div class="${styles.title}">${this.#i18n.t('ui.customerService.handoff.title')}</div>
					<div class="${styles.summary}" id="${summaryId}">${escapeHtml(summary)}</div>
					<button class="${styles.copySummary}" data-copy="${summaryId}">${this.#i18n.t(
						'ui.customerService.handoff.copySummary'
					)}</button>
					<div class="${styles.buttons}">
						${
							h.phone
								? `<button type="button" data-action="phone">📞 ${this.#i18n.t(
										'ui.customerService.handoff.phone'
									)}：${escapeHtml(h.phone)}</button>`
								: ''
						}
						${
							h.onlineServiceUrl
								? `<button type="button" data-action="online" data-url="${escapeHtml(
										h.onlineServiceUrl
									)}">💬 ${this.#i18n.t('ui.customerService.handoff.online')}</button>`
								: ''
						}
						${
							h.servicePageUrl
								? `<button type="button" data-action="service" data-url="${escapeHtml(
										h.servicePageUrl
									)}">ℹ️ ${this.#i18n.t('ui.customerService.handoff.servicePage')}</button>`
								: ''
						}
					</div>
				`
				// 绑定 handoff 按钮行为
				container.querySelectorAll<HTMLButtonElement>('button[data-action]').forEach((btn) => {
					const action = btn.getAttribute('data-action')
					const url = btn.getAttribute('data-url')
					btn.addEventListener('click', () => {
						if (action === 'phone' && h.phone) {
							window.location.href = `tel:${h.phone.replace(/\D/g, '')}`
						} else if ((action === 'online' || action === 'service') && url) {
							window.open(url, '_blank', 'noopener')
						}
					})
				})
				const copyBtn = container.querySelector<HTMLButtonElement>(
					`button[data-copy="${summaryId}"]`
				)
				if (copyBtn) {
					copyBtn.addEventListener('click', async () => {
						try {
							await navigator.clipboard.writeText(summary)
							copyBtn.textContent = this.#i18n.t('ui.customerService.handoff.copied')
							setTimeout(() => {
								copyBtn.textContent = this.#i18n.t('ui.customerService.handoff.copySummary')
							}, 1500)
						} catch {
							/* ignore clipboard errors */
						}
					})
				}
				break
			}
			case 'fallback':
				container.className = styles.assistantBubble
				container.innerHTML = `<span>⚠️ </span>${escapeHtml(msg.content).replace(/\n/g, '<br/>')}`
				break
		}

		this.#messagesEl.appendChild(container)
	}

	#scrollToBottom(): void {
		requestAnimationFrame(() => {
			this.#messagesEl.scrollTop = this.#messagesEl.scrollHeight
		})
	}
}
