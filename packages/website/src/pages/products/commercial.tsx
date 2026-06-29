import { Building2, Monitor, Wind, Lightbulb, Sun, ArrowRight } from 'lucide-react'
import { Link } from 'wouter'

import { COMMERCIAL_PRODUCTS } from '@/constants'
import { useLanguage } from '@/i18n/context'

// Product icons
const ICONS: Record<string, React.ElementType> = {
	display: Monitor,
	hvac: Wind,
	engineering: Lightbulb,
	solar: Sun,
}

export default function ProductsCommercialPage() {
	const { isZh } = useLanguage()

	return (
		<main>
			{/* Header */}
			<section className="bg-gradient-to-b from-[#FFF5F5] to-white dark:from-[#1A0A0A] dark:to-gray-900 border-b border-[#EEEEEE] dark:border-[#333333]">
				<div className="max-w-7xl mx-auto px-5 lg:px-8 py-14 md:py-16">
					<div className="max-w-3xl">
						<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#E60012]/10 text-[#E60012] text-xs font-medium mb-4">
							<Building2 className="w-3.5 h-3.5" />
							{isZh ? '商用产品' : 'Commercial'}
						</div>
						<h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] dark:text-white tracking-tight leading-tight">
							{isZh ? '商用产品与解决方案' : 'Commercial Products & Solutions'}
						</h1>
						<p className="mt-4 text-[#666666] dark:text-gray-300 leading-relaxed">
							{isZh
								? '从商用显示到光伏能源系统，TCL 为企业客户提供全面的产品与解决方案。了解产品线与合作方式。'
								: 'From commercial displays to solar energy systems, TCL provides comprehensive products and solutions for enterprise customers.'}
						</p>
					</div>
				</div>
			</section>

			{/* Product grid */}
			<section className="py-14 md:py-16">
				<div className="max-w-7xl mx-auto px-5 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						{COMMERCIAL_PRODUCTS.map((cat) => {
							const content = isZh ? cat.zh : cat.en
							const Icon = ICONS[cat.key] || Building2
							const detailHref = `/products/detail/${cat.key}`
							return (
								<Link
									key={cat.key}
									href={detailHref}
									className="group bg-white dark:bg-[#1E1E1E] border border-[#EEEEEE] dark:border-[#333333] rounded-xl p-7 hover:shadow-md hover:border-[#E60012] dark:hover:border-[#E60012] transition-all block"
								>
									<div className="flex items-start justify-between mb-4">
										<div className="w-14 h-14 rounded-xl bg-[#F5F5F5] dark:bg-[#2A2A2A] flex items-center justify-center group-hover:bg-[#E60012]/10 transition-colors">
											<Icon className="w-7 h-7 text-[#666666] dark:text-gray-400 group-hover:text-[#E60012] transition-colors" />
										</div>
									</div>
									<h3 className="text-xl font-semibold text-[#1A1A1A] dark:text-white mb-2">
										{content.name}
									</h3>
									<p className="text-sm text-[#666666] dark:text-gray-400 leading-relaxed mb-5">
										{content.desc}
									</p>
									<span className="inline-flex items-center gap-1 text-sm font-medium text-[#E60012]">
										{isZh ? '查看产品详情' : 'View product details'}
										<ArrowRight className="w-4 h-4" />
									</span>
								</Link>
							)
						})}
					</div>
				</div>
			</section>

			{/* Partner CTA */}
			<section className="py-14 md:py-16 bg-[#F5F5F5] dark:bg-[#141414]">
				<div className="max-w-5xl mx-auto px-5 lg:px-8 text-center">
					<h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] dark:text-white tracking-tight mb-3">
						{isZh ? '商务合作咨询' : 'Business Partnership'}
					</h2>
					<p className="text-[#666666] dark:text-gray-400 mb-6">
						{isZh ? '欢迎企业客户、工程集成商、代理商洽谈合作' : 'Welcome enterprises, system integrators and distributors'}
					</p>
					<Link
						href="/partner"
						className="inline-flex items-center gap-2 px-6 py-3 bg-[#E60012] text-white font-medium rounded hover:bg-[#C5000F] transition-colors"
					>
						{isZh ? '商务合作' : 'Partnership'}
					</Link>
				</div>
			</section>
		</main>
	)
}
