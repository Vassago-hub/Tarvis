import { BriefcaseBusiness, Handshake, Leaf, Landmark, MessageCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import NavLink from '@/components/NavLink'
import { useLanguage } from '@/i18n/context'

interface Entry {
	icon: LucideIcon
	zh: { title: string; desc: string; cta: string }
	en: { title: string; desc: string; cta: string }
	href: string
}

const ENTRIES: Entry[] = [
	{
		icon: BriefcaseBusiness,
		zh: { title: '零售加盟 / 专卖店', desc: '开设 TCL 品牌专卖店，或在现有门店引入 TCL 产品系列。', cta: '了解加盟' },
		en: { title: 'Retail Franchise & Stores', desc: 'Open a TCL branded store, or introduce TCL products to your existing location.', cta: 'Learn more' },
		href: '/partner/retail',
	},
	{
		icon: Handshake,
		zh: { title: '工程 / 渠道批发', desc: '面向工程集成商、地产公司、批发商等企业客户的批量合作。', cta: '查看方案' },
		en: { title: 'Engineering & Channel Wholesale', desc: 'Enterprise partnerships for system integrators, developers and distributors.', cta: 'Explore' },
		href: '/partner/engineering',
	},
	{
		icon: Leaf,
		zh: { title: '光伏与能源合作', desc: '户用分布式、工商业光伏与储能项目的产品与工程合作。', cta: '了解项目' },
		en: { title: 'Solar & Energy', desc: 'Products and engineering cooperation for residential, C&I solar and storage.', cta: 'Explore projects' },
		href: '/partner/solar',
	},
	{
		icon: Landmark,
		zh: { title: '政府采购 / 国企合作', desc: '面向政府、事业单位及国有企业采购项目的资质、方案与服务支持。', cta: '了解合作' },
		en: { title: 'Government Procurement', desc: 'Qualification, solutions and after-sales support for government and SOE projects.', cta: 'Learn more' },
		href: '/partner/government',
	},
]

export default function PartnerPage() {
	const { isZh } = useLanguage()

	return (
		<main>
			<section className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/30 dark:to-gray-900 border-b border-[#EEEEEE] dark:border-[#333333]">
				<div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 md:py-20">
					<div className="max-w-3xl">
						<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium mb-4">
							<MessageCircle className="w-3.5 h-3.5" />
							{isZh ? '商务合作' : 'Business Partnership'}
						</div>
						<h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
							{isZh ? '与 TCL 一起，把产品与服务带到更多地方' : 'Bring TCL products and services to more places'}
						</h1>
						<p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
							{isZh
								? '零售加盟、工程批发、光伏能源与政府采购四大合作方向。提交意向后，专属商务团队将与您对接。'
								: 'Retail franchise, engineering procurement, solar energy and government procurement. Submit your interest and a dedicated team will reach out.'}
						</p>
					</div>
				</div>
			</section>

			<section className="py-14 md:py-16">
				<div className="max-w-7xl mx-auto px-5 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						{ENTRIES.map((entry, idx) => {
							const Icon = entry.icon
							const content = isZh ? entry.zh : entry.en
							return (
								<NavLink
									key={idx}
									href={entry.href}
									className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition-all block"
								>
									<div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
										<Icon className="w-5 h-5" />
									</div>
									<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
										{content.title}
									</h3>
									<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
										{content.desc}
									</p>
									<span className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
										{content.cta} →
									</span>
								</NavLink>
							)
						})}
					</div>
				</div>
			</section>

			<section className="py-14 md:py-16 bg-gray-50 dark:bg-gray-800/40">
				<div className="max-w-4xl mx-auto px-5 lg:px-8 text-center">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
						{isZh ? '希望与我们对话？' : 'Want to talk to our team?'}
					</h2>
					<p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
						{isZh
							? '如果上述分类无法准确匹配您的合作意向，请通过联系我们页面直接与商务团队沟通。'
							: 'If none of the categories above match your scenario, reach out directly through the contact page.'}
					</p>
					<NavLink
						href="/service/contact"
						className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-[#C5000F] text-white text-sm font-medium transition"
					>
						{isZh ? '联系商务' : 'Contact our team'}
					</NavLink>
				</div>
			</section>
		</main>
	)
}
