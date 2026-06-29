import { Tv, Wind, Refrigerator, Shirt, Lock, Zap, ArrowRight } from 'lucide-react'
import { Link } from 'wouter'

import { PERSONAL_PRODUCTS, TCL_SERVICE_HOTLINE } from '@/constants'
import { useLanguage } from '@/i18n/context'

// Product icons
const ICONS: Record<string, React.ElementType> = {
	tv: Tv,
	ac: Wind,
	fridge: Refrigerator,
	washer: Shirt,
	lock: Lock,
	small: Zap,
}

export default function ProductsPersonalPage() {
	const { isZh } = useLanguage()

	return (
		<main>
			{/* Header */}
			<section className="bg-gradient-to-b from-[#FFF5F5] to-white dark:from-[#1A0A0A] dark:to-gray-900 border-b border-[#EEEEEE] dark:border-[#333333]">
				<div className="max-w-7xl mx-auto px-5 lg:px-8 py-14 md:py-16">
					<div className="max-w-3xl">
						<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#E60012]/10 text-[#E60012] text-xs font-medium mb-4">
							<Tv className="w-3.5 h-3.5" />
							{isZh ? '个人与家庭产品' : 'Personal & Home'}
						</div>
						<h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] dark:text-white tracking-tight leading-tight">
							{isZh ? '个人及家庭产品' : 'Personal & Home Products'}
						</h1>
						<p className="mt-4 text-[#666666] dark:text-gray-300 leading-relaxed">
							{isZh
								? '从智能电视到白电产品，TCL 为你的家庭带来创新科技与优质体验。浏览产品分类，查看详细规格与服务入口。'
								: 'From smart TVs to home appliances, TCL brings innovative technology and quality experiences to your home. Browse product categories for specs and service entry points.'}
						</p>
					</div>
				</div>
			</section>

			{/* Product grid */}
			<section className="py-14 md:py-16">
				<div className="max-w-7xl mx-auto px-5 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
						{PERSONAL_PRODUCTS.map((cat) => {
							const content = isZh ? cat.zh : cat.en
							const Icon = ICONS[cat.key] || Tv
							const detailHref = `/products/detail/${cat.key}`
							return (
								<Link
									key={cat.key}
									href={detailHref}
									className="group bg-white dark:bg-[#1E1E1E] border border-[#EEEEEE] dark:border-[#333333] rounded-xl p-6 hover:shadow-md hover:border-[#E60012] dark:hover:border-[#E60012] transition-all block"
								>
									<div className="flex items-start justify-between mb-4">
										<div className="w-12 h-12 rounded-lg bg-[#F5F5F5] dark:bg-[#2A2A2A] flex items-center justify-center group-hover:bg-[#E60012]/10 transition-colors">
											<Icon className="w-6 h-6 text-[#666666] dark:text-gray-400 group-hover:text-[#E60012] transition-colors" />
										</div>
									</div>
									<h3 className="text-lg font-semibold text-[#1A1A1A] dark:text-white mb-2">
										{content.name}
									</h3>
									<p className="text-sm text-[#666666] dark:text-gray-400 leading-relaxed mb-4">
										{content.desc}
									</p>
									<div className="pt-4 border-t border-[#F5F5F5] dark:border-[#333333] flex items-center justify-between">
										<span className="text-xs text-[#999999]">
											{isZh ? '系列与规格' : 'Series & specs'}
										</span>
										<span className="text-sm font-medium text-[#E60012] flex items-center gap-1">
											{isZh ? '查看详情' : 'View details'}
											<ArrowRight className="w-4 h-4" />
										</span>
									</div>
								</Link>
							)
						})}
					</div>
				</div>
			</section>

			{/* Contact CTA */}
			<section className="py-14 md:py-16 bg-[#F5F5F5] dark:bg-[#141414]">
				<div className="max-w-5xl mx-auto px-5 lg:px-8 text-center">
					<h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] dark:text-white tracking-tight mb-3">
						{isZh ? '产品有问题？直接联系我们' : 'Product issue? Contact us directly'}
					</h2>
					<p className="text-[#666666] dark:text-gray-400 mb-6">
						{isZh ? '7×24 小时服务热线，随时为你解决问题' : '24/7 hotline to help with any issue'}
					</p>
					<a
						href={`tel:${TCL_SERVICE_HOTLINE}`}
						className="inline-flex items-center gap-2 px-6 py-3 bg-[#E60012] text-white font-medium rounded hover:bg-[#C5000F] transition-colors"
					>
						{isZh ? `拨打 ${TCL_SERVICE_HOTLINE}` : `Call ${TCL_SERVICE_HOTLINE}`}
					</a>
				</div>
			</section>
		</main>
	)
}
