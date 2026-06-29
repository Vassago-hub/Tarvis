import { ArrowRight, Tv, Wind, Refrigerator, Shirt, Lock, Zap, Building, Sun, Monitor } from 'lucide-react'
import { Link } from 'wouter'
import type { LucideIcon } from 'lucide-react'

import { PERSONAL_PRODUCTS, COMMERCIAL_PRODUCTS } from '@/constants'
import { useLanguage } from '@/i18n/context'

interface ProductCard {
	icon: LucideIcon
	key: string
}

const PERSONAL_ICONS: ProductCard[] = [
	{ icon: Tv, key: 'tv' },
	{ icon: Wind, key: 'ac' },
	{ icon: Refrigerator, key: 'fridge' },
	{ icon: Shirt, key: 'washer' },
	{ icon: Lock, key: 'lock' },
	{ icon: Zap, key: 'small' },
]

const COMMERCIAL_ICONS: ProductCard[] = [
	{ icon: Monitor, key: 'display' },
	{ icon: Wind, key: 'hvac' },
	{ icon: Building, key: 'engineering' },
	{ icon: Sun, key: 'solar' },
]

export default function CapabilitiesSection() {
	const { isZh } = useLanguage()

	return (
		<section className="py-16 md:py-20 bg-[#F5F5F5] dark:bg-[#141414]">
			<div className="max-w-7xl mx-auto px-5 lg:px-8">
				<div className="max-w-2xl mx-auto text-center mb-12">
					<p className="text-xs font-semibold tracking-wider text-[#E60012] uppercase mb-3">
						{isZh ? '产品分类' : 'Product Categories'}
					</p>
					<h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] dark:text-white tracking-tight">
						{isZh ? '个人及家庭产品' : 'Personal & Home Products'}
					</h2>
					<p className="mt-4 text-[#666666] dark:text-gray-300 leading-relaxed">
						{isZh
							? '从智能电视到白电产品，TCL 为你的家庭带来创新科技与优质体验。'
							: 'From smart TVs to home appliances, TCL brings innovative technology and quality experiences to your home.'}
					</p>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
					{PERSONAL_PRODUCTS.map((product) => {
						const iconData = PERSONAL_ICONS.find((i) => i.key === product.key)
						const Icon = iconData?.icon || Tv
						return (
							<Link
								key={product.key}
								href="/products/personal"
								className="group bg-white dark:bg-[#1E1E1E] rounded-xl p-5 text-center hover:shadow-md transition-all"
							>
								<div className="w-12 h-12 rounded-full bg-[#F5F5F5] dark:bg-[#2A2A2A] flex items-center justify-center mx-auto mb-3 group-hover:bg-[#E60012]/10 transition-colors">
									<Icon className="w-6 h-6 text-[#666666] dark:text-gray-400 group-hover:text-[#E60012] transition-colors" />
								</div>
								<h3 className="text-sm font-semibold text-[#1A1A1A] dark:text-white mb-1">
									{isZh ? product.zh.name : product.en.name}
								</h3>
								<p className="text-xs text-[#999999] dark:text-gray-500">
									{isZh ? product.zh.desc : product.en.desc}
								</p>
							</Link>
						)
					})}
				</div>

				{/* Commercial products section */}
				<div className="mt-16 max-w-2xl mx-auto text-center mb-8">
					<h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] dark:text-white tracking-tight">
						{isZh ? '商用产品' : 'Commercial Products'}
					</h2>
					<p className="mt-3 text-[#666666] dark:text-gray-300">
						{isZh
							? '面向企业客户的商用显示、中央空调、光伏能源等解决方案。'
							: 'Commercial displays, central HVAC, solar energy and other solutions for enterprise customers.'}
					</p>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{COMMERCIAL_PRODUCTS.map((product) => {
						const iconData = COMMERCIAL_ICONS.find((i) => i.key === product.key)
						const Icon = iconData?.icon || Monitor
						return (
							<Link
								key={product.key}
								href="/products/commercial"
								className="group bg-white dark:bg-[#1E1E1E] rounded-xl p-5 text-center hover:shadow-md transition-all"
							>
								<div className="w-12 h-12 rounded-full bg-[#F5F5F5] dark:bg-[#2A2A2A] flex items-center justify-center mx-auto mb-3 group-hover:bg-[#E60012]/10 transition-colors">
									<Icon className="w-6 h-6 text-[#666666] dark:text-gray-400 group-hover:text-[#E60012] transition-colors" />
								</div>
								<h3 className="text-sm font-semibold text-[#1A1A1A] dark:text-white mb-1">
									{isZh ? product.zh.name : product.en.name}
								</h3>
								<p className="text-xs text-[#999999] dark:text-gray-500">
									{isZh ? product.zh.desc : product.en.desc}
								</p>
							</Link>
						)
					})}
				</div>

				<div className="mt-10 text-center">
					<Link
						href="/products/personal"
						className="inline-flex items-center gap-2 text-[#E60012] font-medium hover:underline"
					>
						{isZh ? '查看全部产品' : 'View All Products'}
						<ArrowRight className="w-4 h-4" />
					</Link>
				</div>
			</div>
		</section>
	)
}

export function IntentsSection() {
	const { isZh } = useLanguage()

	return (
		<section className="py-16 md:py-20">
			<div className="max-w-7xl mx-auto px-5 lg:px-8">
				<div className="max-w-2xl mx-auto text-center mb-12">
					<p className="text-xs font-semibold tracking-wider text-[#E60012] uppercase mb-3">
						{isZh ? 'AI 智能助手' : 'AI Assistant'}
					</p>
					<h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] dark:text-white tracking-tight">
						{isZh ? '服务支持' : 'Service Support'}
					</h2>
					<p className="mt-4 text-[#666666] dark:text-gray-300 leading-relaxed">
						{isZh
							? '从报修、故障排查到产品导航、商务合作，AI 服务助手帮你快速定位官方入口。'
							: 'From repair requests and troubleshooting to product navigation and business partnerships, our AI assistant helps you find the right entry.'}
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
					<ServiceCard
						icon={Tv}
						title={isZh ? '故障排查' : 'Troubleshooting'}
						desc={isZh ? '电视、空调、冰箱、洗衣机等常见故障自助排查' : 'DIY troubleshooting for TVs, ACs, fridges, washers and more'}
						href="/service"
					/>
					<ServiceCard
						icon={Wind}
						title={isZh ? '产品报修' : 'Repair Request'}
						desc={isZh ? '预约上门维修，提交产品故障信息' : 'Schedule on-site repair for product issues'}
						href="/service"
					/>
					<ServiceCard
						icon={Monitor}
						title={isZh ? '人工客服' : 'Live Support'}
						desc={isZh ? '7×24 小时在线人工客服' : '24/7 human customer support'}
						href="/service"
					/>
				</div>

				<div className="mt-10 text-center">
					<Link
						href="/service"
						className="inline-flex items-center gap-2 px-6 py-3 bg-[#E60012] text-white font-medium rounded hover:bg-[#C5000F] transition-colors"
					>
						{isZh ? '立即使用 AI 助手' : 'Try AI Assistant Now'}
					</Link>
				</div>
			</div>
		</section>
	)
}

function ServiceCard({
	icon: Icon,
	title,
	desc,
	href,
}: {
	icon: LucideIcon
	title: string
	desc: string
	href: string
}) {
	return (
		<Link
			href={href}
			className="group bg-white dark:bg-[#1E1E1E] border border-[#EEEEEE] dark:border-[#333333] rounded-xl p-6 hover:shadow-md hover:border-[#E60012] dark:hover:border-[#E60012] transition-all"
		>
			<div className="w-11 h-11 rounded-lg bg-[#F5F5F5] dark:bg-[#2A2A2A] flex items-center justify-center mb-4 group-hover:bg-[#E60012]/10 transition-colors">
				<Icon className="w-5 h-5 text-[#666666] dark:text-gray-400 group-hover:text-[#E60012] transition-colors" />
			</div>
			<h3 className="text-base font-semibold text-[#1A1A1A] dark:text-white mb-2">{title}</h3>
			<p className="text-sm text-[#666666] dark:text-gray-400">{desc}</p>
		</Link>
	)
}
