import { Check, ShieldCheck, Wrench } from 'lucide-react'

import NavLink from '@/components/NavLink'
import { PRODUCT_MODELS, TCL_SERVICE_HOTLINE } from '@/constants'
import { useLanguage } from '@/i18n/context'

export default function CommercialEngineeringDetailPage() {
	const { isZh } = useLanguage()
	const models = PRODUCT_MODELS.filter((m) => m.category === 'commercial_engineering')

	return (
		<main>
			<section className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/30 dark:to-gray-900 border-b border-[#EEEEEE] dark:border-[#333333]">
				<div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 md:py-20">
					<div className="max-w-3xl">
						<p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-3">
							{isZh ? '工程照明 / 安防' : 'Engineering Lighting & Security'}
						</p>
						<h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] dark:text-white tracking-tight leading-tight">
							{isZh ? 'LED 工业照明 / 高清 IP 摄像机 / 智慧园区' : 'LED Industrial Lighting / HD IP Cameras / Smart Campus'}
						</h1>
						<p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
							{isZh
								? '为工厂、仓库、园区提供节能 LED 照明、安防监控与智慧管理平台集成方案。'
								: 'Energy-efficient LED lighting, security cameras and smart-campus platform integration for factories, warehouses and campuses.'}
						</p>
						<div className="mt-7 flex flex-wrap gap-3">
							<NavLink
							href="/service/repair"
							className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#E60012] hover:bg-blue-700 text-white text-sm font-medium transition"
						>
							<Wrench className="w-4 h-4" />
							{isZh ? '预约项目方案' : 'Request project plan'}
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
								{isZh ? '面向工程客户的合作与批量采购支持。' : 'Partnership and bulk purchase for engineering customers.'}
							</p>
						</NavLink>
						<NavLink
							href="/partner/government"
							className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition"
						>
							<h3 className="text-lg font-semibold text-[#1A1A1A] dark:text-white mb-2">
								{isZh ? '政府采购' : 'Government procurement'}
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
								{isZh ? '面向政府、事业单位的采购与项目支持。' : 'Procurement and project support for government and public institutions.'}
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
