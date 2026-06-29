import { LifeBuoy, Sparkles } from 'lucide-react'
import { Link } from 'wouter'

import { PERSONAL_PRODUCTS, TCL_SERVICE_HOTLINE } from '@/constants'
import { useLanguage } from '@/i18n/context'

// Product icon map
function ProductIcon({ category }: { category: string }) {
	const iconMap: Record<string, string> = {
		tv: '📺',
		ac: '❄️',
		fridge: '🧊',
		washer: '👕',
		lock: '🔐',
		small: '⚡',
	}
	return <span className="text-2xl">{iconMap[category] || '📦'}</span>
}

export default function HeroSection() {
	const { isZh } = useLanguage()

	return (
		<section className="relative overflow-hidden">
			{/* TCL brand gradient background */}
			<div
				className="absolute inset-0 -z-10 bg-gradient-to-b from-[#FFF5F5] via-white to-white dark:from-[#1A0A0A] dark:via-gray-900 dark:to-gray-900"
				aria-hidden="true"
			/>
			<div
				className="absolute -top-20 -right-20 -z-10 w-[40rem] h-[40rem] rounded-full bg-[#E60012]/5 dark:bg-[#E60012]/10 blur-3xl"
				aria-hidden="true"
			/>

			<div className="max-w-7xl mx-auto px-5 lg:px-8 pt-12 pb-16 md:pt-16 md:pb-24">
				<div className="text-center">
					{/* Badge */}
					<div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E60012]/10 border border-[#E60012]/20 text-[#E60012] dark:text-[#E60012] text-xs font-medium mb-6">
						<Sparkles className="w-3.5 h-3.5" />
						{isZh ? 'AI 智能助手 · 7×24 小时在线' : 'AI Assistant · 24 / 7 Online'}
					</div>

					{/* Headline */}
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] dark:text-white tracking-tight leading-tight">
						{isZh ? (
							<>
								创新科技
								<br />
								<span className="text-[#E60012]">智享美好生活</span>
							</>
						) : (
							<>
								Innovation Technology
								<br />
								<span className="text-[#E60012]">for a Better Life</span>
							</>
						)}
					</h1>

					{/* Subtitle */}
					<p className="mt-6 text-base md:text-lg text-[#666666] dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
						{isZh
							? 'TCL 创立于 1981 年，业务遍及 160 多个国家和地区。从电视、空调到智能家居，我们致力于为你带来更具创新性的产品和更优质的服务体验。'
							: 'Founded in 1981, TCL serves customers in 160+ countries. From TVs and ACs to smart home solutions, we are committed to delivering more innovative products and premium service experiences.'}
					</p>

					{/* Primary CTA */}
					<div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
						<Link
							href="/products/personal"
							className="inline-flex items-center gap-2 px-6 py-3 bg-[#E60012] text-white font-medium rounded hover:bg-[#C5000F] transition-colors shadow-sm"
						>
							{isZh ? '探索产品' : 'Explore Products'}
						</Link>
						<Link
							href="/service"
							className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-[#333333] dark:text-gray-100 font-medium rounded border border-[#EEEEEE] dark:border-gray-700 hover:border-[#E60012] dark:hover:border-[#E60012] hover:text-[#E60012] dark:hover:text-[#E60012] transition-colors"
						>
							<LifeBuoy className="w-4 h-4" />
							{isZh ? '服务支持' : 'Service Support'}
						</Link>
					</div>

					{/* Product categories showcase */}
					<div className="mt-12">
						<p className="text-sm text-[#999999] dark:text-gray-400 mb-4">
							{isZh ? '热门产品分类' : 'Popular Categories'}
						</p>
						<div className="flex flex-wrap items-center justify-center gap-3">
							{PERSONAL_PRODUCTS.map((product) => (
								<Link
									key={product.key}
									href="/products/personal"
									className="inline-flex items-center gap-2 px-4 py-2.5 text-sm text-[#333333] dark:text-gray-200 bg-white dark:bg-gray-800 border border-[#EEEEEE] dark:border-gray-700 rounded-lg hover:border-[#E60012] dark:hover:border-[#E60012] hover:text-[#E60012] dark:hover:text-[#E60012] transition-colors"
								>
									<ProductIcon category={product.key} />
									{isZh ? product.zh.name : product.en.name}
								</Link>
							))}
						</div>
					</div>

					{/* Trust line */}
					<div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-2 text-xs text-[#999999] dark:text-gray-400">
						<span>{isZh ? '全国服务热线' : 'National Hotline'}</span>
						<span className="hidden sm:inline text-[#DDDDDD] dark:text-gray-600">·</span>
						<a
							href={`tel:${TCL_SERVICE_HOTLINE}`}
							className="font-mono text-[#E60012] font-medium hover:underline"
						>
							{TCL_SERVICE_HOTLINE}
						</a>
						<span className="hidden sm:inline text-[#DDDDDD] dark:text-gray-600">·</span>
						<span>{isZh ? '7×24 小时服务' : '24 / 7 Service'}</span>
					</div>
				</div>
			</div>
		</section>
	)
}
