import { useEffect, useMemo, useRef, useState } from 'react'

import { DEMO_BASE_URL, DEMO_MODEL } from '@/constants'
import { useLanguage } from '@/i18n/context'
import {
	type ActiveTaskRecord,
	type ResumableAgent,
	createPageAgentTaskPersistence,
} from '@/utils/pageAgentTaskPersistence'

interface AiAssistantButtonProps {
	showOnPages?: string[]
}

interface AgentInstance {
	panel: { show: () => void; hide: () => void }
	task: string
	status: string
	execute: (task: string) => Promise<unknown>
}

export default function AiAssistantButton({ showOnPages = ['/'] }: AiAssistantButtonProps) {
	const { isZh } = useLanguage()
	const [isPanelOpen, setIsPanelOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [hasError, setHasError] = useState(false)
	const agentRef = useRef<AgentInstance | null>(null)
	const [rawPathname] = useState(window.location.pathname)
	const resumePrefix = isZh
		? '继续执行跳转前未完成的本地示例任务'
		: 'Continue the unfinished local demo task from before navigation'
	const taskPersistence = useMemo(
		() =>
			createPageAgentTaskPersistence({
				storageKey: 'page-agent:website-active-task',
				resumePrefix,
				buildResumeTask: (record: ActiveTaskRecord) =>
					isZh
						? [
								`${resumePrefix}：${record.originalTask}`,
								`上一页 URL：${record.lastUrl}`,
								`当前页 URL：${window.location.href}`,
								'页面刚刚跳转或重新加载。请先观察当前页面和可见交互元素，再继续推进原始目标。',
								'如果已经到达目标页，简短告诉用户当前位置和下一步；如果还需要进入下一级页面，继续使用页面导航、搜索或菜单项。',
							].join('\n')
						: [
								`${resumePrefix}: ${record.originalTask}`,
								`Previous URL: ${record.lastUrl}`,
								`Current URL: ${window.location.href}`,
								'The page just navigated or reloaded. Observe the current page first, then continue the original goal.',
								'If the target page has been reached, briefly tell the user where they are and what comes next.',
							].join('\n'),
				onResumeError: (error) => {
					console.warn('Failed to resume local AI assistant task:', error)
				},
			}),
		[isZh, resumePrefix]
	)

	// Strip the /page-agent base from the pathname to match wouter routes
	const strippedPathname = rawPathname.replace(/^\/page-agent(\/|$)/, '/')

	// Check if we should show on current page - match against stripped pathname
	const shouldShow = showOnPages.some(
		(page) => strippedPathname === page || strippedPathname.startsWith(page + '/')
	)

	useEffect(() => {
		if (!shouldShow) return

		let cancelled = false

		async function initAgent() {
			setIsLoading(true)
			try {
				const pageAgentModule = await import('page-agent')
				const { PageAgent } = pageAgentModule
				if (cancelled) return

				const agent = new PageAgent({
					language: isZh ? 'zh-CN' : 'en-US',
					promptForNextTask: true,
					onBeforeTask: (agent) => taskPersistence.onBeforeTask(agent),
					onAfterStep: (agent) => taskPersistence.onAfterStep(agent),
					onAfterTask: () => taskPersistence.onAfterTask(),
					instructions: {
						system: isZh
							? [
									'你是 TCL 智能服务助手。帮助用户找到官方服务入口、解决产品问题、进行故障排查。',
									'如果任务需要经过多级页面，页面跳转后要继续围绕原始目标推进；先观察当前页面，不要从首页重新开始。',
									'对于悬停后出现的导航浮层、下拉菜单、弹出列表，优先使用 open_menu_by_index 打开触发器，等待新索引出现后再点击列表项。',
									'涉及安全与隐私的问题优先转人工客服。',
								].join('\n')
							: [
									'You are the TCL Service Assistant. Help users find official service entries, solve product issues, and troubleshoot.',
									'If a task spans multiple pages, continue the original goal after navigation. Observe the current page first instead of restarting from the home page.',
									'For hover flyouts, dropdown menus, and popover lists, prefer open_menu_by_index on the trigger, then use the newly visible indexed items.',
									'Safety and privacy issues are handed off to human support first.',
								].join('\n'),
						getPageInstructions: (url: string) => {
							if (url.includes('/service')) {
								return isZh
									? '这是服务支持页面。用户可能需要报修、故障排查、查看保修政策或联系客服。'
									: 'This is the service support page. Users may need repair, troubleshooting, warranty policy, or contact support.'
							}
							if (url.includes('/products')) {
								return isZh
									? '这是产品页面。用户可能在查找产品信息、规格或服务入口。'
									: 'This is the products page. Users may be looking for product info, specs, or service entries.'
							}
							if (url.includes('/partner')) {
								return isZh
									? '这是商务合作页面。用户可能在咨询加盟、工程、光伏或政府采购。'
									: 'This is the partnership page. Users may be asking about franchise, engineering, solar, or government procurement.'
							}
							return undefined
						},
					},
					model:
						import.meta.env.DEV && import.meta.env.LLM_MODEL_NAME
							? import.meta.env.LLM_MODEL_NAME
							: DEMO_MODEL,
					baseURL:
						import.meta.env.DEV && import.meta.env.LLM_BASE_URL
							? import.meta.env.LLM_BASE_URL
							: DEMO_BASE_URL,
					apiKey:
						import.meta.env.DEV && import.meta.env.LLM_API_KEY
							? import.meta.env.LLM_API_KEY
							: undefined,
				})

				// Initially hide the panel - user opens it via clicking the sprite
				agent.panel.hide()
				agentRef.current = agent
				taskPersistence.tryResume(agent)
			} catch (error) {
				console.warn('Failed to initialize AI assistant:', error)
				setHasError(true)
			} finally {
				setIsLoading(false)
			}
		}

		void initAgent()

		const handleBeforeUnload = () => {
			if (!agentRef.current) return
			taskPersistence.persistBeforeUnload(agentRef.current as ResumableAgent)
		}
		window.addEventListener('beforeunload', handleBeforeUnload)

		return () => {
			cancelled = true
			window.removeEventListener('beforeunload', handleBeforeUnload)
		}
	}, [shouldShow, isZh, taskPersistence])

	const handleClick = () => {
		if (!agentRef.current) return

		if (isPanelOpen) {
			agentRef.current.panel.hide()
			setIsPanelOpen(false)
		} else {
			agentRef.current.panel.show()
			setIsPanelOpen(true)
		}
	}

	if (!shouldShow) return null

	// Don't show if there's an error or still loading
	if (hasError || isLoading) return null

	// Tarvis sprite sheet: 8 columns, 9 rows
	// Source frame: 192px x 208px. Render at a 1/4 scale to avoid sprite bleed.
	const PET_FRAME_WIDTH = 48
	const PET_FRAME_HEIGHT = 52
	const PET_SHEET_WIDTH = PET_FRAME_WIDTH * 8
	const PET_SHEET_HEIGHT = PET_FRAME_HEIGHT * 9

	return (
		<button
			type="button"
			onClick={handleClick}
			aria-label={isZh ? '打开 Tarvis 智能助手' : 'Open Tarvis Assistant'}
			style={{
				position: 'fixed',
				bottom: '24px',
				right: '24px',
				zIndex: 2147483647,
				width: `${PET_FRAME_WIDTH}px`,
				height: `${PET_FRAME_HEIGHT}px`,
				padding: 0,
				border: 'none',
				background: `url("/tcl-ray-spritesheet.webp")`,
				backgroundSize: `${PET_SHEET_WIDTH}px ${PET_SHEET_HEIGHT}px`,
				backgroundPosition: '0 0',
				backgroundRepeat: 'no-repeat',
				cursor: 'pointer',
				filter: 'drop-shadow(0 8px 18px rgba(230, 0, 18, 0.25))',
				backfaceVisibility: 'hidden',
				contain: 'strict',
				transform: 'translateZ(0)',
				willChange: 'background-position',
				animation: 'pet-idle 1.1s steps(8, end) infinite',
			}}
		/>
	)
}
