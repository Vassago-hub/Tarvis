import { ArrowRight, Calendar, Newspaper, Tv } from 'lucide-react'
import { Link } from 'wouter'

import { useLanguage } from '@/i18n/context'

const NEWS_ITEMS = [
	{
		icon: Newspaper,
		zh: {
			title: 'TCL 亮相 2026 年中国酒店业数字化发展论坛',
			date: '2026-06-10',
			tag: '企业新闻',
			desc: '从客房 AI 中枢到全场景闭环，1.29 万次交互数据印证大模型驱动酒店精细化运营',
		},
		en: {
			title: 'TCL Showcases at 2026 China Hotel Digitalization Forum',
			date: '2026-06-10',
			tag: 'Corporate News',
			desc: 'From room AI hub to full-scenario closed loop, 12,900 interactions validate big model-driven hotel operations',
		},
	},
	{
		icon: Tv,
		zh: {
			title: '2026 TCL QD-MiniLED 电视春季新品发布会',
			date: '2026-03-17',
			tag: '营销活动',
			desc: '全新 QD-MiniLED 电视系列发布，画质与智能体验全面升级',
		},
		en: {
			title: '2026 TCL QD-MiniLED TV Spring New Product Launch',
			date: '2026-03-17',
			tag: 'Marketing',
			desc: 'New QD-MiniLED TV series with upgraded picture quality and smart experience',
		},
	},
	{
		icon: Calendar,
		zh: {
			title: 'TCL 之队，出征 2026 年米兰科尔蒂纳冬奥会',
			date: '2026-02-01',
			tag: '品牌活动',
			desc: 'TCL 携全球顶级冰雪运动员，共赴冰雪之约',
		},
		en: {
			title: 'TCL Team Heads to 2026 Milan Cortina Winter Olympics',
			date: '2026-02-01',
			tag: 'Brand Event',
			desc: 'TCL partners with world-class winter sports athletes',
		},
	},
]

export default function HowItWorksSection() {
	const { isZh } = useLanguage()

	return (
		<section className="py-16 md:py-20 bg-white dark:bg-[#141414]">
			<div className="max-w-7xl mx-auto px-5 lg:px-8">
				<div className="max-w-2xl mx-auto text-center mb-12">
					<p className="text-xs font-semibold tracking-wider text-[#E60012] uppercase mb-3">
						{isZh ? '新闻动态' : 'News & Events'}
					</p>
					<h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] dark:text-white tracking-tight">
						{isZh ? '最新资讯' : 'Latest Updates'}
					</h2>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{NEWS_ITEMS.map((item, idx) => {
						const Icon = item.icon
						const content = isZh ? item.zh : item.en
						return (
							<div
								key={idx}
								className="group bg-[#FAFAFA] dark:bg-[#1E1E1E] rounded-xl overflow-hidden hover:shadow-md transition-all"
							>
								{/* Image placeholder */}
								<div className="aspect-video bg-gradient-to-br from-[#E60012]/5 to-[#E60012]/10 flex items-center justify-center">
									<Icon className="w-12 h-12 text-[#E60012]/40" />
								</div>
								<div className="p-5">
									<div className="flex items-center gap-2 mb-2">
										<span className="text-xs text-[#E60012] font-medium">{content.tag}</span>
										<span className="text-xs text-[#999999]">·</span>
										<span className="text-xs text-[#999999]">{content.date}</span>
									</div>
									<h3 className="text-sm font-semibold text-[#1A1A1A] dark:text-white mb-2 line-clamp-2 group-hover:text-[#E60012] transition-colors">
										{content.title}
									</h3>
									<p className="text-xs text-[#666666] dark:text-gray-400 line-clamp-2">
										{content.desc}
									</p>
								</div>
							</div>
						)
					})}
				</div>

				<div className="mt-10 text-center">
					<Link
						href="/service"
						className="inline-flex items-center gap-2 text-[#E60012] font-medium hover:underline"
					>
						{isZh ? '查看更多新闻' : 'View More News'}
						<ArrowRight className="w-4 h-4" />
					</Link>
				</div>
			</div>
		</section>
	)
}
