import {
	ArrowLeft,
	BarChart3,
	CheckCircle2,
	ChevronRight,
	ClipboardList,
	FileText,
	Menu,
	Package,
	Plus,
	Search,
	ShoppingCart,
	SlidersHorizontal,
	Trash2,
} from 'lucide-react'
import type { PageAgent as PageAgentType } from 'page-agent'
import { useEffect, useMemo, useState } from 'react'
import type { ComponentType, KeyboardEvent, ReactNode } from 'react'
import { Link, Route, Switch, useLocation } from 'wouter'

import { Button } from '@/components/ui/button'
import { DEMO_BASE_URL, DEMO_MODEL } from '@/constants'
import {
	type ActiveTaskRecord,
	createPageAgentTaskPersistence,
} from '@/utils/pageAgentTaskPersistence'

interface TestCard {
	title: string
	description: string
	path: string
	icon: ComponentType<{ className?: string }>
	checks: string[]
}

interface Product {
	id: string
	name: string
	category: string
	price: number
	stock: number
}

interface CartLine {
	productId: string
	name: string
	quantity: number
	price: number
}

declare global {
	interface Window {
		pageAgent?: PageAgentType
	}
}

let pageAgentModule: Promise<typeof import('page-agent')> | null = null
const TEST_PAGES_RESUME_PREFIX = '继续执行跳转前未完成的测试页任务'
const testPagesTaskPersistence = createPageAgentTaskPersistence({
	storageKey: 'page-agent:test-pages-active-task',
	resumePrefix: TEST_PAGES_RESUME_PREFIX,
	buildResumeTask: (record: ActiveTaskRecord) =>
		[
			`${TEST_PAGES_RESUME_PREFIX}：${record.originalTask}`,
			`上一页 URL：${record.lastUrl}`,
			`当前页 URL：${window.location.href}`,
			'页面刚刚跳转或重新加载。请先观察当前测试页面和可见交互元素，再继续推进原始目标。',
			'如果遇到悬停菜单、下拉列表或导航浮层，优先使用 open_menu_by_index 打开触发器，等待新索引出现后再点击列表项。',
		].join('\n'),
	onResumeError: (error) => {
		console.warn('Failed to resume test-pages agent task:', error)
	},
})

function TestPagesAgent() {
	useEffect(() => {
		let cancelled = false

		async function initAgent() {
			pageAgentModule ??= import('page-agent')
			const { PageAgent } = await pageAgentModule
			if (cancelled) return

			if (!window.pageAgent || window.pageAgent.disposed) {
				window.pageAgent = new PageAgent({
					language: 'zh-CN',
					promptForNextTask: true,
					onBeforeTask: (agent) => testPagesTaskPersistence.onBeforeTask(agent),
					onAfterStep: (agent) => testPagesTaskPersistence.onAfterStep(agent),
					onAfterTask: () => testPagesTaskPersistence.onAfterTask(),
					instructions: {
						system: [
							'你是 Page Agent 测试页面中的中文助手。优先用中文回应用户，并通过页面上的真实控件完成任务。',
							'如果任务需要经过多级页面，页面跳转后要继续围绕原始目标推进；先观察当前页面，不要从首页重新开始。',
							'对于悬停后出现的导航浮层、下拉菜单、弹出列表，优先使用 open_menu_by_index 打开触发器，等待新索引出现后再点击列表项。',
						].join('\n'),
						getPageInstructions: (url: string) => {
							if (!url.includes('/test-pages')) return undefined
							return '这是用于测试助手功能的中文示例页面组。请根据页面文字定位元素，完成点击、输入、筛选、滚动、展开详情、打开导航浮层和跨页面连续任务等操作。'
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
			}

			window.pageAgent.panel.hide()
			testPagesTaskPersistence.tryResume(window.pageAgent)
		}

		void initAgent()

		const handleBeforeUnload = () => {
			if (!window.pageAgent) return
			testPagesTaskPersistence.persistBeforeUnload(window.pageAgent)
		}
		window.addEventListener('beforeunload', handleBeforeUnload)

		return () => {
			cancelled = true
			window.removeEventListener('beforeunload', handleBeforeUnload)
		}
	}, [])

	return null
}
interface Issue {
	id: string
	customer: string
	status: '全部' | '未处理' | '复核中' | '已解决'
	priority: '高' | '中' | '低'
	owner: string
	detail: string
}

const testCards: TestCard[] = [
	{
		title: '结账表单',
		description: '结构化输入、校验、单选、多选、下拉选择和提交反馈。',
		path: '/forms',
		icon: ClipboardList,
		checks: ['填写字段', '选择选项', '提交表单'],
	},
	{
		title: '购物流程',
		description: '商品搜索、分类筛选、购物车更新和结账汇总。',
		path: '/shop',
		icon: ShoppingCart,
		checks: ['搜索商品', '加入购物车', '移除商品'],
	},
	{
		title: '运营仪表盘',
		description: '状态筛选、表格行操作、详情弹窗和指标卡片。',
		path: '/dashboard',
		icon: BarChart3,
		checks: ['筛选表格', '查看详情', '解决工单'],
	},
	{
		title: '长文章页面',
		description: '锚点、滚动目标、可展开内容、内联链接和页面底部任务。',
		path: '/article',
		icon: FileText,
		checks: ['滚动章节', '展开详情', '使用锚点'],
	},
	{
		title: '导航浮层',
		description: '悬停菜单、点击菜单、键盘展开和跳转后的连续任务。',
		path: '/menus',
		icon: Menu,
		checks: ['打开浮层', '点击菜单项', '跨页续跑'],
	},
]

const currencyFormatter = new Intl.NumberFormat('zh-CN', {
	style: 'currency',
	currency: 'CNY',
	maximumFractionDigits: 0,
})

function formatCurrency(value: number) {
	return currencyFormatter.format(value)
}

const products: Product[] = [
	{ id: 'pa-basic', name: '基础浏览器助手套件', category: '助手套件', price: 49, stock: 12 },
	{ id: 'pa-pro', name: '专业工作流助手套件', category: '助手套件', price: 129, stock: 6 },
	{ id: 'mask-addon', name: '数据脱敏扩展包', category: '安全能力', price: 39, stock: 18 },
	{ id: 'eval-pack', name: '评测场景包', category: '测试工具', price: 59, stock: 9 },
	{ id: 'debug-console', name: 'DOM 调试控制台', category: '开发工具', price: 79, stock: 4 },
]

const issues: Issue[] = [
	{
		id: '工单-1042',
		customer: '北风实验室',
		status: '未处理',
		priority: '高',
		owner: '林蔓',
		detail: '结账自动化暂停，因为配送国家字段缺失。',
	},
	{
		id: '工单-1043',
		customer: '星图零售',
		status: '复核中',
		priority: '中',
		owner: '陈明',
		detail: '回放过程中优惠券被应用两次，导致购物车总额变化。',
	},
	{
		id: '工单-1044',
		customer: '蓝岭科技',
		status: '已解决',
		priority: '低',
		owner: '周禾',
		detail: '助手已成功选择备用支付方式。',
	},
	{
		id: '工单-1045',
		customer: '明径软件',
		status: '未处理',
		priority: '中',
		owner: '许诺',
		detail: '确认弹窗出现在客服组件后方。',
	},
]

function PageShell({ children }: { children: ReactNode }) {
	return (
		<main className="flex-1 bg-white text-gray-950 dark:bg-gray-950 dark:text-white">
			<div className="mx-auto w-full max-w-7xl px-6 py-10">{children}</div>
		</main>
	)
}

function BackLink() {
	return (
		<Link
			href="/"
			className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-950 dark:text-gray-300 dark:hover:text-white"
		>
			<ArrowLeft className="h-4 w-4" />
			测试页首页
		</Link>
	)
}

function StatusPill({ children }: { children: ReactNode }) {
	return (
		<span className="inline-flex items-center rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300">
			{children}
		</span>
	)
}

function TestPagesHome() {
	return (
		<PageShell>
			<section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
				<div>
					<p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-300">
						助手测试页面组
					</p>
					<h1 className="max-w-3xl text-4xl font-semibold tracking-normal text-gray-950 dark:text-white sm:text-5xl">
						用于测试 Page Agent 交互能力的示例页面
					</h1>
					<p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
						这些页面用于在可控的本地网站中测试导航、DOM
						提取、表单填写、点击、滚动、动态状态变化和多步骤任务。
					</p>
				</div>
				<div className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900">
					<h2 className="text-base font-semibold">建议冒烟任务</h2>
					<ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
						<li>找到结账表单页，并为陈安提交一份企业订单。</li>
						<li>搜索“脱敏”，将两件商品加入购物车，然后移除一个商品。</li>
						<li>筛选未处理工单，并查看高优先级工单详情。</li>
						<li>滚动到文章检查清单，并展开发布说明。</li>
					</ul>
				</div>
			</section>

			<section className="mt-10 grid gap-4 md:grid-cols-2">
				{testCards.map((card) => {
					const Icon = card.icon
					return (
						<Link
							key={card.path}
							href={card.path}
							className="group rounded-lg border border-gray-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-500"
						>
							<div className="flex items-start justify-between gap-4">
								<div className="flex items-center gap-3">
									<span className="rounded-md bg-blue-50 p-2 text-blue-700 dark:bg-blue-950 dark:text-blue-200">
										<Icon className="h-5 w-5" />
									</span>
									<h2 className="text-xl font-semibold">{card.title}</h2>
								</div>
								<ChevronRight className="mt-1 h-5 w-5 text-gray-400 transition group-hover:translate-x-1" />
							</div>
							<p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-300">
								{card.description}
							</p>
							<div className="mt-4 flex flex-wrap gap-2">
								{card.checks.map((check) => (
									<StatusPill key={check}>{check}</StatusPill>
								))}
							</div>
						</Link>
					)
				})}
			</section>
		</PageShell>
	)
}

function FormsPage() {
	const [submittedName, setSubmittedName] = useState('')
	const [rush, setRush] = useState(false)

	function handleSubmit(formElement: HTMLFormElement) {
		const form = new FormData(formElement)
		const contactName = form.get('contactName')
		setSubmittedName(
			typeof contactName === 'string' && contactName.trim() ? contactName : '未知联系人'
		)
	}

	return (
		<PageShell>
			<BackLink />
			<div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
				<section>
					<h1 className="text-3xl font-semibold">结账表单</h1>
					<p className="mt-3 text-gray-600 dark:text-gray-300">
						一个紧凑的商务结账流程，用于测试文本输入、下拉菜单、单选组、复选框和表单提交。
					</p>
					<div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900">
						<h2 className="font-semibold">目标任务</h2>
						<p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
							为明径软件的陈安填写表单，选择企业版，启用加急审核，并提交订单。
						</p>
					</div>
					{submittedName && (
						<div
							role="status"
							className="mt-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200"
						>
							<CheckCircle2 className="h-5 w-5" />
							订单请求已提交给 {submittedName}。
						</div>
					)}
				</section>

				<form
					onSubmit={(event) => {
						event.preventDefault()
						handleSubmit(event.currentTarget)
					}}
					className="rounded-lg border border-gray-200 p-5 dark:border-gray-800"
					aria-label="商务结账表单"
				>
					<div className="grid gap-4 sm:grid-cols-2">
						<label className="grid gap-2 text-sm font-medium">
							联系人姓名
							<input
								name="contactName"
								required
								placeholder="陈安"
								className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
							/>
						</label>
						<label className="grid gap-2 text-sm font-medium">
							公司
							<input
								name="company"
								required
								placeholder="明径软件"
								className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
							/>
						</label>
						<label className="grid gap-2 text-sm font-medium">
							邮箱
							<input
								name="email"
								type="email"
								required
								placeholder="chenan@example.com"
								className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
							/>
						</label>
						<label className="grid gap-2 text-sm font-medium">
							套餐
							<select
								name="plan"
								defaultValue="team"
								className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
							>
								<option value="starter">入门版</option>
								<option value="team">团队版</option>
								<option value="enterprise">企业版</option>
							</select>
						</label>
					</div>

					<fieldset className="mt-5">
						<legend className="text-sm font-semibold">首选部署方式</legend>
						<div className="mt-3 grid gap-3 sm:grid-cols-3">
							{['云端', '自托管', '混合部署'].map((option) => (
								<label
									key={option}
									className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm dark:border-gray-800"
								>
									<input
										name="deployment"
										type="radio"
										value={option}
										defaultChecked={option === '云端'}
									/>
									{option}
								</label>
							))}
						</div>
					</fieldset>

					<label className="mt-5 flex items-center gap-3 text-sm font-medium">
						<input
							name="rushReview"
							type="checkbox"
							checked={rush}
							onChange={(event) => setRush(event.target.checked)}
						/>
						启用加急审核
					</label>

					<label className="mt-5 grid gap-2 text-sm font-medium">
						实施备注
						<textarea
							name="notes"
							rows={5}
							placeholder="描述助手需要支持的工作流。"
							className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
						/>
					</label>

					<div className="mt-6 flex flex-wrap items-center gap-3">
						<Button type="submit">提交订单</Button>
						<Button type="reset" variant="outline" onClick={() => setRush(false)}>
							重置表单
						</Button>
						<span className="text-sm text-gray-500">加急审核：{rush ? '已启用' : '未启用'}</span>
					</div>
				</form>
			</div>
		</PageShell>
	)
}

function ShopPage() {
	const [query, setQuery] = useState('')
	const [category, setCategory] = useState('全部')
	const [cart, setCart] = useState<CartLine[]>([])

	const filteredProducts = useMemo(() => {
		return products.filter((product) => {
			const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase())
			const matchesCategory = category === '全部' || product.category === category
			return matchesQuery && matchesCategory
		})
	}, [category, query])

	const cartTotal = cart.reduce((sum, line) => sum + line.price * line.quantity, 0)

	function addToCart(product: Product) {
		setCart((current) => {
			const existing = current.find((line) => line.productId === product.id)
			if (existing) {
				return current.map((line) =>
					line.productId === product.id ? { ...line, quantity: line.quantity + 1 } : line
				)
			}
			return [
				...current,
				{ productId: product.id, name: product.name, quantity: 1, price: product.price },
			]
		})
	}

	function removeFromCart(productId: string) {
		setCart((current) => current.filter((line) => line.productId !== productId))
	}

	return (
		<PageShell>
			<BackLink />
			<div className="grid gap-8 xl:grid-cols-[1fr_22rem]">
				<section>
					<div className="flex flex-wrap items-end justify-between gap-4">
						<div>
							<h1 className="text-3xl font-semibold">购物流程</h1>
							<p className="mt-3 text-gray-600 dark:text-gray-300">
								搜索商品、筛选分类、添加商品并更新购物车。
							</p>
						</div>
						<div className="flex flex-wrap gap-3">
							<label className="relative block">
								<Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
								<input
									aria-label="搜索商品"
									value={query}
									onChange={(event) => setQuery(event.target.value)}
									placeholder="搜索商品"
									className="h-10 w-60 rounded-md border border-gray-300 bg-white pl-9 pr-3 text-sm dark:border-gray-700 dark:bg-gray-900"
								/>
							</label>
							<label className="relative block">
								<SlidersHorizontal className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
								<select
									aria-label="按分类筛选"
									value={category}
									onChange={(event) => setCategory(event.target.value)}
									className="h-10 w-52 rounded-md border border-gray-300 bg-white pl-9 pr-3 text-sm dark:border-gray-700 dark:bg-gray-900"
								>
									<option>全部</option>
									<option>助手套件</option>
									<option>安全能力</option>
									<option>测试工具</option>
									<option>开发工具</option>
								</select>
							</label>
						</div>
					</div>

					<div className="mt-6 grid gap-4 md:grid-cols-2">
						{filteredProducts.map((product) => (
							<article
								key={product.id}
								className="rounded-lg border border-gray-200 p-5 dark:border-gray-800"
							>
								<div className="flex items-start justify-between gap-4">
									<div>
										<p className="text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-300">
											{product.category}
										</p>
										<h2 className="mt-2 text-lg font-semibold">{product.name}</h2>
									</div>
									<Package className="h-5 w-5 text-gray-400" />
								</div>
								<div className="mt-5 flex items-center justify-between">
									<div>
										<p className="text-2xl font-semibold">{formatCurrency(product.price)}</p>
										<p className="text-sm text-gray-500">{product.stock} 件库存</p>
									</div>
									<Button
										type="button"
										onClick={() => addToCart(product)}
										aria-label={`加入 ${product.name}`}
									>
										<Plus className="h-4 w-4" />
										加入
									</Button>
								</div>
							</article>
						))}
					</div>
				</section>

				<aside
					className="rounded-lg border border-gray-200 p-5 dark:border-gray-800"
					aria-label="购物车汇总"
				>
					<h2 className="flex items-center gap-2 text-xl font-semibold">
						<ShoppingCart className="h-5 w-5" />
						购物车
					</h2>
					{cart.length === 0 ? (
						<p className="mt-5 text-sm text-gray-500">暂无商品。</p>
					) : (
						<ul className="mt-5 space-y-4">
							{cart.map((line) => (
								<li key={line.productId} className="flex items-start justify-between gap-3">
									<div>
										<p className="font-medium">{line.name}</p>
										<p className="text-sm text-gray-500">
											数量 {line.quantity} - {formatCurrency(line.price * line.quantity)}
										</p>
									</div>
									<Button
										type="button"
										variant="outline"
										size="icon-sm"
										aria-label={`移除 ${line.name}`}
										onClick={() => removeFromCart(line.productId)}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</li>
							))}
						</ul>
					)}
					<div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-800">
						<div className="flex justify-between text-sm">
							<span>合计</span>
							<strong>{formatCurrency(cartTotal)}</strong>
						</div>
						<Button type="button" className="mt-4 w-full" disabled={cart.length === 0}>
							去结账
						</Button>
					</div>
				</aside>
			</div>
		</PageShell>
	)
}

function DashboardPage() {
	const [status, setStatus] = useState('全部')
	const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
	const [resolvedIds, setResolvedIds] = useState<string[]>([])

	const visibleIssues = issues.filter((issue) => status === '全部' || issue.status === status)

	return (
		<PageShell>
			<BackLink />
			<section>
				<div className="flex flex-wrap items-end justify-between gap-4">
					<div>
						<h1 className="text-3xl font-semibold">运营仪表盘</h1>
						<p className="mt-3 text-gray-600 dark:text-gray-300">
							查看工单状态、检查表格行，并将工单标记为已解决。
						</p>
					</div>
					<label className="grid gap-2 text-sm font-medium">
						状态筛选
						<select
							value={status}
							onChange={(event) => setStatus(event.target.value)}
							className="h-10 w-48 rounded-md border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
						>
							<option>全部</option>
							<option>未处理</option>
							<option>复核中</option>
							<option>已解决</option>
						</select>
					</label>
				</div>

				<div className="mt-6 grid gap-4 sm:grid-cols-3">
					{[
						['未处理工单', issues.filter((issue) => issue.status === '未处理').length],
						['复核中', issues.filter((issue) => issue.status === '复核中').length],
						['今日已解决', resolvedIds.length],
					].map(([label, value]) => (
						<div key={label} className="rounded-lg border border-gray-200 p-5 dark:border-gray-800">
							<p className="text-sm text-gray-500">{label}</p>
							<p className="mt-2 text-3xl font-semibold">{value}</p>
						</div>
					))}
				</div>

				<div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
					<table className="w-full min-w-200 text-left text-sm">
						<thead className="bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-300">
							<tr>
								<th className="px-4 py-3 font-semibold">工单</th>
								<th className="px-4 py-3 font-semibold">客户</th>
								<th className="px-4 py-3 font-semibold">状态</th>
								<th className="px-4 py-3 font-semibold">优先级</th>
								<th className="px-4 py-3 font-semibold">负责人</th>
								<th className="px-4 py-3 font-semibold">操作</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 dark:divide-gray-800">
							{visibleIssues.map((issue) => {
								const statusLabel = resolvedIds.includes(issue.id) ? '已解决' : issue.status
								return (
									<tr key={issue.id}>
										<td className="px-4 py-3 font-medium">{issue.id}</td>
										<td className="px-4 py-3">{issue.customer}</td>
										<td className="px-4 py-3">{statusLabel}</td>
										<td className="px-4 py-3">{issue.priority}</td>
										<td className="px-4 py-3">{issue.owner}</td>
										<td className="px-4 py-3">
											<div className="flex gap-2">
												<Button
													type="button"
													variant="outline"
													onClick={() => setSelectedIssue(issue)}
												>
													查看
												</Button>
												<Button
													type="button"
													variant="secondary"
													onClick={() =>
														setResolvedIds((current) =>
															current.includes(issue.id) ? current : [...current, issue.id]
														)
													}
												>
													解决
												</Button>
											</div>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			</section>

			{selectedIssue && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
					role="dialog"
					aria-modal="true"
					aria-labelledby="issue-dialog-title"
				>
					<div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
						<h2 id="issue-dialog-title" className="text-2xl font-semibold">
							{selectedIssue.id} - {selectedIssue.customer}
						</h2>
						<p className="mt-4 text-gray-600 dark:text-gray-300">{selectedIssue.detail}</p>
						<dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
							<div>
								<dt className="text-gray-500">优先级</dt>
								<dd className="font-medium">{selectedIssue.priority}</dd>
							</div>
							<div>
								<dt className="text-gray-500">负责人</dt>
								<dd className="font-medium">{selectedIssue.owner}</dd>
							</div>
						</dl>
						<div className="mt-6 flex justify-end gap-3">
							<Button type="button" variant="outline" onClick={() => setSelectedIssue(null)}>
								关闭
							</Button>
							<Button
								type="button"
								onClick={() => {
									setResolvedIds((current) =>
										current.includes(selectedIssue.id) ? current : [...current, selectedIssue.id]
									)
									setSelectedIssue(null)
								}}
							>
								标记为已解决
							</Button>
						</div>
					</div>
				</div>
			)}
		</PageShell>
	)
}

function ArticlePage() {
	const [, setLocation] = useLocation()

	return (
		<PageShell>
			<BackLink />
			<article className="mx-auto max-w-3xl">
				<p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-300">
					长滚动目标
				</p>
				<h1 className="mt-3 text-4xl font-semibold">在真实内容页面中测试助手</h1>
				<p className="mt-5 text-lg leading-8 text-gray-600 dark:text-gray-300">
					这个页面故意做得足够长，用来测试滚动行为、章节导航，以及首屏之外才会出现的交互。
				</p>
				<div className="mt-6 flex flex-wrap gap-3">
					<Button type="button" variant="outline" onClick={() => setLocation('/article#checklist')}>
						跳到检查清单
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={() => setLocation('/article#release-notes')}
					>
						跳到发布说明
					</Button>
				</div>

				<section className="mt-12 space-y-5">
					<h2 className="text-2xl font-semibold">场景设计</h2>
					<p className="leading-8 text-gray-600 dark:text-gray-300">
						一个好的助手测试页面应该包含清晰的语义标签、重复控件、足够用于消歧的附近文本，以及操作后可验证的状态变化。
					</p>
					<p className="leading-8 text-gray-600 dark:text-gray-300">
						这组示例刻意把简单的原生控件和动态 React 状态结合起来，让 DOM
						查找和动作执行都能被观察到。
					</p>
				</section>

				<section className="mt-28 space-y-5">
					<h2 className="text-2xl font-semibold">导航深度</h2>
					<p className="leading-8 text-gray-600 dark:text-gray-300">
						许多助手问题只会在首屏之后出现。本节提供一个页面中段的滚动目标，包含普通正文、链接和较密集的段落文本。
					</p>
					<a
						className="text-blue-600 underline dark:text-blue-300"
						href="https://github.com/alibaba/page-agent"
					>
						外部仓库链接
					</a>
				</section>

				<section id="checklist" className="mt-32 scroll-mt-24 space-y-5">
					<h2 className="text-2xl font-semibold">检查清单</h2>
					<div className="grid gap-3">
						{['观察当前章节', '点击发布说明展开项', '返回首页'].map((item) => (
							<label
								key={item}
								className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-800"
							>
								<input type="checkbox" />
								{item}
							</label>
						))}
					</div>
				</section>

				<section id="release-notes" className="mt-32 scroll-mt-24 space-y-5">
					<h2 className="text-2xl font-semibold">发布说明</h2>
					<details className="rounded-lg border border-gray-200 p-5 dark:border-gray-800">
						<summary className="cursor-pointer font-semibold">展开六月测试页说明</summary>
						<p className="mt-4 leading-8 text-gray-600 dark:text-gray-300">
							六月测试页面组加入了多页面路由、购物车状态、仪表盘弹窗和长滚动文章，用于支持手动和自动化的
							Page Agent 评测。
						</p>
					</details>
				</section>
			</article>
		</PageShell>
	)
}

function MenusPage() {
	const [, setLocation] = useLocation()
	const [openMenu, setOpenMenu] = useState<'products' | 'support' | null>(null)
	const [selectedItem, setSelectedItem] = useState('')

	function open(menu: 'products' | 'support') {
		setOpenMenu(menu)
	}

	function close() {
		setOpenMenu(null)
	}

	function handleTriggerKeyDown(
		event: KeyboardEvent<HTMLButtonElement>,
		menu: 'products' | 'support'
	) {
		if (event.key !== 'ArrowDown' && event.key !== 'Enter' && event.key !== ' ') return
		event.preventDefault()
		open(menu)
	}

	function choose(label: string, path?: string) {
		setSelectedItem(label)
		close()
		if (path) setLocation(path)
	}

	return (
		<PageShell>
			<BackLink />
			<section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
				<div>
					<p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-300">
						导航浮层测试
					</p>
					<h1 className="mt-3 text-3xl font-semibold">测试悬停菜单与跳转续跑</h1>
					<p className="mt-4 leading-7 text-gray-600 dark:text-gray-300">
						这个页面用于验证助手能否先打开导航浮层，再点击浮层里的目标项。菜单支持悬停、聚焦、点击和键盘展开。
					</p>
					<div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900">
						<h2 className="font-semibold">建议任务</h2>
						<p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
							打开服务支持菜单，进入长文章页面的发布说明；或者打开产品中心菜单，进入购物流程后搜索“脱敏”。
						</p>
					</div>
					{selectedItem && (
						<div
							role="status"
							className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200"
						>
							已选择：{selectedItem}
						</div>
					)}
				</div>

				<div className="rounded-lg border border-gray-200 p-5 dark:border-gray-800">
					<nav aria-label="测试导航菜单" className="relative flex flex-wrap gap-3">
						<div onMouseEnter={() => open('products')} onMouseLeave={close}>
							<Button
								type="button"
								variant="outline"
								aria-haspopup="menu"
								aria-expanded={openMenu === 'products'}
								onFocus={() => open('products')}
								onClick={() => setOpenMenu(openMenu === 'products' ? null : 'products')}
								onKeyDown={(event) => handleTriggerKeyDown(event, 'products')}
							>
								产品中心
							</Button>
							{openMenu === 'products' && (
								<div
									role="menu"
									className="absolute left-0 top-12 z-20 w-72 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-800 dark:bg-gray-900"
								>
									<button
										type="button"
										role="menuitem"
										className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
										onClick={() => choose('购物流程', '/shop')}
									>
										购物流程
										<span className="mt-1 block text-xs text-gray-500">
											搜索商品、筛选分类、加入购物车。
										</span>
									</button>
									<button
										type="button"
										role="menuitem"
										className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
										onClick={() => choose('结账表单', '/forms')}
									>
										结账表单
										<span className="mt-1 block text-xs text-gray-500">
											输入联系人、套餐和实施备注。
										</span>
									</button>
								</div>
							)}
						</div>

						<div onMouseEnter={() => open('support')} onMouseLeave={close}>
							<Button
								type="button"
								variant="outline"
								aria-haspopup="menu"
								aria-expanded={openMenu === 'support'}
								onFocus={() => open('support')}
								onClick={() => setOpenMenu(openMenu === 'support' ? null : 'support')}
								onKeyDown={(event) => handleTriggerKeyDown(event, 'support')}
							>
								服务支持
							</Button>
							{openMenu === 'support' && (
								<div
									role="menu"
									className="absolute left-32 top-12 z-20 w-80 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-800 dark:bg-gray-900"
								>
									<button
										type="button"
										role="menuitem"
										className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
										onClick={() => choose('运营仪表盘', '/dashboard')}
									>
										运营仪表盘
										<span className="mt-1 block text-xs text-gray-500">
											筛选工单、查看详情、标记解决。
										</span>
									</button>
									<button
										type="button"
										role="menuitem"
										className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
										onClick={() => choose('长文章发布说明', '/article#release-notes')}
									>
										长文章发布说明
										<span className="mt-1 block text-xs text-gray-500">
											跳转后继续滚动并展开详情。
										</span>
									</button>
								</div>
							)}
						</div>
					</nav>

					<div className="mt-28 rounded-lg border border-dashed border-gray-300 p-5 text-sm leading-6 text-gray-600 dark:border-gray-700 dark:text-gray-300">
						菜单打开后，浮层中的按钮会被重新索引。助手应该先打开对应菜单，再点击浮层项；如果点击后发生路由跳转，应继续原始任务。
					</div>
				</div>
			</section>
		</PageShell>
	)
}

export default function TestPagesRouter() {
	return (
		<>
			<TestPagesAgent />
			<Switch>
				<Route path="/forms">
					<FormsPage />
				</Route>
				<Route path="/shop">
					<ShopPage />
				</Route>
				<Route path="/dashboard">
					<DashboardPage />
				</Route>
				<Route path="/article">
					<ArticlePage />
				</Route>
				<Route path="/menus">
					<MenusPage />
				</Route>
				<Route>
					<TestPagesHome />
				</Route>
			</Switch>
		</>
	)
}
