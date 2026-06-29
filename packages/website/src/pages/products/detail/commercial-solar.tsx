import { Check, ShieldCheck, Wrench } from 'lucide-react'

import NavLink from '@/components/NavLink'
import { PRODUCT_MODELS, TCL_SERVICE_HOTLINE } from '@/constants'
import { useLanguage } from '@/i18n/context'

export default function CommercialSolarDetailPage() {
	const { isZh } = useLanguage()
	const models = PRODUCT_MODELS.filter((m) => m.category === 'commercial_solar')

	return (
		<main>
			<section className="bg-gradient-to-b from-[#FFF5F5] to-white dark:from-blue-950/30 dark:to-gray-900 border-b border-gray-200 dark:border-gray-800">
				<div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 md:py-20">
					<div className="max-w-3xl">
						<p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-3">
							{isZh ? '光伏与储能' : 'Solar & Energy Storage'}
						</p>
						<h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
							{isZh ? '户用 / 工商业光伏系统与储能' : 'Residential / Commercial Solar & Energy Storage'}
						</h1>
						<p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
							{isZh
								? '单晶 PERC / TOPCon 组件、并网/离网逆变器、磷酸铁锂储能电池及一站式 EPC 服务。'
								: 'Mono PERC / TOPCon modules, grid-tie / off-grid inverters, LiFePO4 batteries and turn-key EPC service.'}
						</p>
						<div className="mt-7 flex flex-wrap gap-3">
							<NavLink
							href="/service/repair"
							className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-[#C5000F] text-white text-sm font-medium transition"
						>
							<Wrench className="w-4 h-4" />
							{isZh ? '预约项目方案' : 'Request project plan'}
						</NavLink>
							<a
								href={`tel:${TCL_SERVICE_HOTLINE}`}
								className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-medium hover:border-blue-300 dark:hover:border-blue-600 transition"
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
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
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
									<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
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
												<Check className="w-4 h-4 mt-0.5 text-blue-600 dark:text-blue-400 shrink-0" />
												<span>{h}</span>
											</li>
										))}
									</ul>
									<div className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
										{isZh ? '规格' : 'Spec'}：{content.specs}
									</div>
									<div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
										{isZh ? '整机保修' : 'Warranty'}：{model.warranty_months}
										{isZh ? ' 个月（组件产品质保另有长期承诺）' : ' months (modules have additional long-term product warranty)'}
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
							href="/partner/solar"
							className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition"
						>
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
								{isZh ? '光伏合作' : 'Solar partnership'}
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
								{isZh ? '户用与工商业光伏项目合作。' : 'Partnership for residential and commercial solar projects.'}
							</p>
						</NavLink>
						<NavLink
							href="/service/warranty"
							className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition"
						>
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
								{isZh ? '保修政策' : 'Warranty policy'}
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
								{isZh ? '光伏系统保修与组件长期性能保证。' : 'System warranty and module long-term performance guarantee.'}
							</p>
						</NavLink>
						<NavLink
							href="/service/contact"
							className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition"
						>
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
								{isZh ? '项目咨询' : 'Project inquiry'}
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
								{isZh ? '联系光伏团队获取方案设计与报价。' : 'Contact the solar team for design and quotation.'}
							</p>
						</NavLink>
					</div>
				</div>
			</section>
		</main>
	)
}
