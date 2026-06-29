import { ArrowLeft, HelpCircle, Search } from 'lucide-react'

import NavLink from '@/components/NavLink'
import { PRODUCT_MODELS, WARRANTY_POLICY } from '@/constants'
import { useLanguage } from '@/i18n/context'

export default function ProductsDetailWasherPage() {
	const { isZh } = useLanguage()

	const models = PRODUCT_MODELS.filter((m) => m.category === 'washer')
	const warrantyZh = WARRANTY_POLICY.zh.coverage.find((p: any) => p.product === '洗衣机 / 干衣机')
	const warrantyEn = WARRANTY_POLICY.en.coverage.find((p: any) => p.product === 'Washer / Dryer')

	return (
		<main>
			<section className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/30 dark:to-gray-900 border-b border-gray-200 dark:border-gray-800">
				<div className="max-w-7xl mx-auto px-5 lg:px-8 py-10 md:py-12">
					<a
						href="/products/personal"
						className="inline-flex items-center gap-1.5 text-sm text-[#666666] dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6"
					>
						<ArrowLeft className="w-4 h-4" />
						{isZh ? '返回个人与家庭产品' : 'Back to Personal & Home'}
					</a>
					<h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] dark:text-white tracking-tight leading-tight mb-3">
						{isZh ? '洗衣机 / 干衣机' : 'Washers & Dryers'}
					</h1>
					<p className="text-[#666666] dark:text-gray-300 leading-relaxed">
						{isZh
							? '查看洗衣机的主流型号、典型配置与保修信息，按型号查询对应服务入口。'
							: 'Browse major washer models, typical configurations and warranty info. Access service channels by model.'}
					</p>
				</div>
			</section>

			<section className="py-12 md:py-14">
				<div className="max-w-7xl mx-auto px-5 lg:px-8">
					<h2 className="text-2xl font-bold text-[#1A1A1A] dark:text-white mb-8">
						{isZh ? '产品型号' : 'Product models'}
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						{models.map((model) => {
							const content = isZh ? model.zh : model.en
							const highlights = (content as any).highlights || []
							return (
								<div
									key={model.key}
									className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-600 transition-all"
								>
									<h3 className="text-lg font-semibold text-[#1A1A1A] dark:text-white mb-3">
										{content.name}
									</h3>
									<p className="text-sm text-[#666666] dark:text-gray-300 leading-relaxed mb-4">
										{content.desc}
									</p>
									<ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1.5 mb-4">
										{highlights.map((hl: string) => (
											<li key={hl}>
												<span className="text-gray-400 dark:text-gray-500">• </span>
												{hl}
											</li>
										))}
									</ul>
									<div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/40 rounded-md px-3 py-2 mb-5">
										{content.specs}
									</div>
									<div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-2">
										<NavLink
											href="/service/repair"
											className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline"
										>
											<HelpCircle className="w-3.5 h-3.5" />
											{isZh ? '报修' : 'Repair request'}
										</NavLink>
										<NavLink
											href="/service/troubleshooting/washer"
											className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline"
										>
											<Search className="w-3.5 h-3.5" />
											{isZh ? '故障排查' : 'Troubleshooting'}
										</NavLink>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</section>

			<section className="py-12 md:py-14 bg-gray-50 dark:bg-gray-800/40">
				<div className="max-w-4xl mx-auto px-5 lg:px-8">
					<h2 className="text-2xl font-bold text-[#1A1A1A] dark:text-white mb-6">
						{isZh ? '保修政策' : 'Warranty policy'}
					</h2>
					<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
						<dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
									{isZh ? '整机保修' : 'Whole unit'}
								</dt>
								<dd className="text-lg font-semibold text-[#1A1A1A] dark:text-white">
									{isZh ? warrantyZh?.whole : warrantyEn?.whole}
								</dd>
							</div>
							<div>
								<dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
									{isZh ? '主要部件' : 'Major parts'}
								</dt>
								<dd className="text-lg font-semibold text-[#1A1A1A] dark:text-white">
									{isZh ? warrantyZh?.major : warrantyEn?.major}
								</dd>
							</div>
						</dl>
						<NavLink
							href="/service/warranty"
							className="mt-6 inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
						>
							{isZh ? '查看完整保修政策 →' : 'View full warranty policy →'}
						</NavLink>
					</div>
				</div>
			</section>
		</main>
	)
}
