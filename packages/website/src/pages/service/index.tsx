import { FileQuestion, HandHeart, Headphones, LifeBuoy, MessageCircle, MessageSquareWarning, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'wouter'

import {
	TCL_ADDRESS,
	TCL_SERVICE_HOTLINE,
	TCL_SERVICE_HOURS_ZH,
} from '@/constants'
import { useLanguage } from '@/i18n/context'

interface Entry {
	icon: LucideIcon
	zh: { title: string; desc: string; cta: string }
	en: { title: string; desc: string; cta: string }
	href: string
}

const ENTRIES: Entry[] = [
	{
		icon: Headphones,
		zh: { title: '在线客服', desc: '直接与人工客服对话，解决产品问题或提交工单。', cta: '联系在线客服' },
		en: { title: 'Live Support', desc: 'Talk directly with human support for product issues and tickets.', cta: 'Open chat' },
		href: '/service/contact',
	},
	{
		icon: Wrench,
		zh: { title: '产品报修', desc: '提交报修信息，就近调度售后工程师上门服务。', cta: '立即报修' },
		en: { title: 'Repair Request', desc: 'Submit a repair ticket, nearest technicians will be dispatched.', cta: 'Submit' },
		href: '/service/repair',
	},
	{
		icon: MessageCircle,
		zh: { title: '故障排查', desc: '选择设备类型，自助完成常见故障排查并拿到下一步建议。', cta: '开始排查' },
		en: { title: 'Troubleshooting', desc: 'Select device type, then step through common faults and resolutions.', cta: 'Start' },
		href: '/service/troubleshooting',
	},
	{
		icon: FileQuestion,
		zh: { title: '常见问题 FAQ', desc: '搜索关键词，快速找到同类问题的官方解答。', cta: '查看 FAQ' },
		en: { title: 'FAQ', desc: 'Search keywords to find official answers to common questions.', cta: 'Browse FAQ' },
		href: '/service/faq',
	},
	{
		icon: MessageSquareWarning,
		zh: { title: '投诉与建议', desc: '对服务或产品的投诉、建议，将由专属团队跟进。', cta: '提交反馈' },
		en: { title: 'Feedback', desc: 'Share complaints or suggestions — our team follows up on every submission.', cta: 'Send feedback' },
		href: '/service/complaint',
	},
	{
		icon: HandHeart,
		zh: { title: '保修政策', desc: '整机与主要部件保修范围、流程与注意事项的详细说明。', cta: '查看政策' },
		en: { title: 'Warranty Policy', desc: 'Detailed coverage for the whole unit, major parts and the service process.', cta: 'Read policy' },
		href: '/service/warranty',
	},
]

export default function ServicePage() {
	const { isZh } = useLanguage()

	return (
		<main>
			{/* Header */}
			<section className="bg-gradient-to-b from-[#FFF5F5] to-white dark:from-[#1A0A0A] dark:to-gray-900 border-b border-[#EEEEEE] dark:border-[#333333]">
				<div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 md:py-20">
					<div className="max-w-3xl">
						<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#E60012]/10 text-[#E60012] text-xs font-medium mb-5">
							<LifeBuoy className="w-3.5 h-3.5" />
							{isZh ? '服务支持中心' : 'Support Center'}
						</div>
						<h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] dark:text-white tracking-tight leading-tight">
							{isZh ? '服务支持' : 'Service Support'}
						</h1>
						<p className="mt-4 text-[#666666] dark:text-gray-300 leading-relaxed">
							{isZh
								? '在线客服、产品报修、投诉建议与自助排查，统一汇聚在这里。AI 服务助手会识别你的意图，帮你更快抵达对应服务。'
								: 'Live support, repair requests, feedback and troubleshooting — all in one place. The AI Service Assistant recognizes your intent and routes you to the right team.'}
						</p>

						{/* Hotline banner */}
						<div className="mt-8 inline-flex flex-wrap items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-[#EEEEEE] dark:border-[#333333] shadow-sm">
							<span className="text-sm text-[#666666] dark:text-gray-300">
								{isZh ? '全国服务热线' : 'National Hotline'}
							</span>
							<a
								href={`tel:${TCL_SERVICE_HOTLINE}`}
								className="text-xl font-bold text-[#E60012] hover:underline"
							>
								{TCL_SERVICE_HOTLINE}
							</a>
							<span className="text-xs text-[#999999] pl-3 border-l border-[#EEEEEE] dark:border-[#333333]">
								{isZh ? TCL_SERVICE_HOURS_ZH : '24 / 7'}
							</span>
						</div>
					</div>
				</div>
			</section>

			{/* Entry cards */}
			<section className="py-14 md:py-16">
				<div className="max-w-7xl mx-auto px-5 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
						{ENTRIES.map((entry, idx) => {
							const Icon = entry.icon
							const content = isZh ? entry.zh : entry.en
							return (
								<div
									key={idx}
									className="bg-white dark:bg-[#1E1E1E] border border-[#EEEEEE] dark:border-[#333333] rounded-xl p-6 hover:shadow-md hover:border-[#E60012] dark:hover:border-[#E60012] transition-all"
								>
									<div className="w-10 h-10 rounded-lg bg-[#F5F5F5] dark:bg-[#2A2A2A] flex items-center justify-center mb-4">
										<Icon className="w-5 h-5 text-[#666666] dark:text-gray-400" />
									</div>
									<h3 className="text-lg font-semibold text-[#1A1A1A] dark:text-white mb-2">
										{content.title}
									</h3>
									<p className="text-sm text-[#666666] dark:text-gray-400 leading-relaxed mb-5 min-h-[3rem]">
										{content.desc}
									</p>
									<Link
										href={entry.href}
										className="text-sm font-medium text-[#E60012] hover:underline"
									>
										{content.cta} →
									</Link>
								</div>
							)
						})}
					</div>
				</div>
			</section>

			{/* Contact block */}
			<section className="py-14 md:py-16 bg-[#F5F5F5] dark:bg-[#141414]">
				<div className="max-w-7xl mx-auto px-5 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#EEEEEE] dark:border-[#333333] p-7">
							<h3 className="text-lg font-semibold text-[#1A1A1A] dark:text-white mb-4">
								{isZh ? '电话与服务时间' : 'Phone & Hours'}
							</h3>
							<dl className="space-y-3 text-sm">
								<div className="flex items-center justify-between border-b border-[#F5F5F5] dark:border-[#333333] pb-3">
									<dt className="text-[#999999]">
										{isZh ? '全国服务热线' : 'National Hotline'}
									</dt>
									<dd>
										<a
											href={`tel:${TCL_SERVICE_HOTLINE}`}
											className="text-[#E60012] font-medium hover:underline"
										>
											{TCL_SERVICE_HOTLINE}
										</a>
									</dd>
								</div>
								<div className="flex items-center justify-between border-b border-[#F5F5F5] dark:border-[#333333] pb-3">
									<dt className="text-[#999999]">
										{isZh ? '服务时间' : 'Hours'}
									</dt>
									<dd className="text-[#666666] dark:text-gray-300">
										{isZh ? TCL_SERVICE_HOURS_ZH : '24 hours / 7 days'}
									</dd>
								</div>
								<div className="flex items-center justify-between">
									<dt className="text-[#999999]">
										{isZh ? '优先响应' : 'Priority response'}
									</dt>
									<dd className="text-[#666666] dark:text-gray-300">
										{isZh ? '安全 / 紧急 / 投诉' : 'Safety / Emergency / Feedback'}
									</dd>
								</div>
							</dl>
						</div>

						<div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#EEEEEE] dark:border-[#333333] p-7">
							<h3 className="text-lg font-semibold text-[#1A1A1A] dark:text-white mb-4">
								{isZh ? '公司与邮寄地址' : 'Address & Mailing'}
							</h3>
							<dl className="space-y-3 text-sm">
								<div className="flex items-start justify-between border-b border-[#F5F5F5] dark:border-[#333333] pb-3 gap-4">
									<dt className="text-[#999999] shrink-0">
										{isZh ? '公司地址' : 'Office'}
									</dt>
									<dd className="text-[#666666] dark:text-gray-300 text-right">
										{isZh ? TCL_ADDRESS.office : TCL_ADDRESS.officeEn}
									</dd>
								</div>
								<div className="flex items-start justify-between gap-4">
									<dt className="text-[#999999] shrink-0">
										{isZh ? '邮寄地址' : 'Mailing'}
									</dt>
									<dd className="text-[#666666] dark:text-gray-300 text-right">
										{isZh ? TCL_ADDRESS.mail : TCL_ADDRESS.mailEn}
									</dd>
								</div>
							</dl>
						</div>
					</div>
				</div>
			</section>
		</main>
	)
}
