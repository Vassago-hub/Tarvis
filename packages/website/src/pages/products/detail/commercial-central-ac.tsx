import { Check, ShieldCheck, Wrench } from 'lucide-react'

import NavLink from '@/components/NavLink'
import { PRODUCT_MODELS, TCL_SERVICE_HOTLINE } from '@/constants'
import { useLanguage } from '@/i18n/context'

export default function CommercialCentralAcDetailPage() {
	const { isZh } = useLanguage()
	const models = PRODUCT_MODELS.filter((m) => m.category === 'central_ac' || m.category === 'commercial_hvac')

	return (
		<main>
			<section className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/30 dark:to-gray-900 border-b border-gray-200 dark:border-gray-800">
				<div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 md:py-20">
					<div className="max-w-3xl">
						<p className="text-xs text-[#E60012] font-medium mb-3">
							{isZh ? '商用中央空调' : 'Commercial Central AC'}
						</p>
						<h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] dark:text-white tracking-tight leading-tight">
							{isZh ? '商用多联机 / 风冷模块 / 集中控制方案' : 'Commercial VRV / Air-cooled Modular / Central Control'}
						</h1>
						<p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
							{isZh
								? '面向办公楼、酒店、学校、工厂的空调系统方案，支持多联机、风冷模块、精密空调与计量计费系统。'
								: 'HVAC solutions for offices, hotels, schools and factories — VRV multi-split, air-cooled modular, precision AC and energy metering systems.'}
						</p>
						<div className="mt-7 flex flex-wrap gap-3">
							<NavLink
							href="/service/repair"
							className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-[#C5000F] text-white text-sm font-medium transition"
						>
							<Wrench className="w-4 h-4" />
							{isZh ? '预约项目方案 / 安装' : 'Request project / installation'}
						</NavLink>
							<a
								href={`tel:${TCL_SERVICE_HOTLINE}`}
								className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[#1A1A1A] dark:text-white text-sm font-medium hover:border-blue-300 dark:hover:border-blue-600 transition"
							>
								<ShieldCheck className="w-4 h-4" />
								{isZh ? '拨打服务热线' : 'Call service hotline'}
							</a>
						</div>
					</div>
				</div>
			</section>

			<section className="py-14 md:py-16">
				<div className="max-w-7xl mx-auto px-5 lg:px-8">
					<h2 className="text-2xl font-bold text-[#1A1A1A] dark:text-white mb-8">
						{isZh ? '主要系列 / 型号' : 'Series & Models'}
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						{models.map((model) => {
							const content = isZh ? model.zh : model.en
							return (
								<article
									key={model.key}
									className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition"
								>
									<h3 className="text-lg font-semibold text-[#1A1A1A] dark:text-white mb-2">
										{content.name}
									</h3>
									<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
										{content.desc}
									</p>
									<ul className="space-y-2 mb-4">
										{content.highlights.map((h, idx) => (
											<li
												key={idx}
												className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
											>
												<Check className="w-4 h-4 mt-0.5 text-[#E60012] shrink-0" />
												<span>{h}</span>
											</li>
										))}
									</ul>
									<div className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
										{isZh ? '规格' : 'Spec'}：{content.specs}
									</div>
									<div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
										{isZh ? '整机保修' : 'Warranty'}：{model.warranty_months}
										{isZh ? ' 个月' : ' months'}
									</div>
								</article>
							)
						})}
					</div>
				</div>
			</section>

			<section className="py-14 md:py-16 bg-gray-50 dark:bg-gray-800/40">
				<div className="max-w-7xl mx-auto px-5 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
						<NavLink
							href="/partner/engineering"
							className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition"
						>
							<h3 className="text-lg font-semibold text-[#1A1A1A] dark:text-white mb-2">
								{isZh ? '工程合作' : 'Engineering partnership'}
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
								{isZh ? '面向工程客户与系统集成商的合作支持。' : 'Partnership support for engineering customers and integrators.'}
							</p>
						</NavLink>
						<NavLink
							href="/service/warranty"
							className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition"
						>
							<h3 className="text-lg font-semibold text-[#1A1A1A] dark:text-white mb-2">
								{isZh ? '保修政策' : 'Warranty policy'}
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
								{isZh ? '商用空调系统保修条款与服务范围。' : 'Warranty terms for commercial HVAC systems.'}
							</p>
						</NavLink>
						<NavLink
							href="/service/contact"
							className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition"
						>
							<h3 className="text-lg font-semibold text-[#1A1A1A] dark:text-white mb-2">
								{isZh ? '项目咨询' : 'Project inquiry'}
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
								{isZh ? '联系商务团队获取方案设计与报价。' : 'Contact our business team for design and quotation.'}
							</p>
						</NavLink>
					</div>
				</div>
			</section>
		</main>
	)
}
