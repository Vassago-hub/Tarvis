import { Check, ShieldCheck, Wrench } from 'lucide-react'

import NavLink from '@/components/NavLink'
import { PRODUCT_MODELS, TCL_SERVICE_HOTLINE } from '@/constants'
import { useLanguage } from '@/i18n/context'

export default function TvDetailPage() {
	const { isZh } = useLanguage()
	const models = PRODUCT_MODELS.filter((m) => m.category === 'tv')

	return (
		<main>
			<section className="bg-gradient-to-b from-[#FFF5F5] to-white dark:from-[#1A0A0A] dark:to-gray-900 border-b border-[#EEEEEE] dark:border-[#333333]">
				<div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 md:py-20">
					<div className="max-w-3xl">
						<p className="text-xs text-[#E60012] font-medium mb-3">
							{isZh ? '电视' : 'TV'}
						</p>
						<h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] dark:text-white tracking-tight leading-tight">
							{isZh ? 'QD-Mini LED 智屏 & 4K 智能电视系列' : 'QD-Mini LED & 4K Smart TV Series'}
						</h1>
						<p className="mt-4 text-[#666666] dark:text-gray-300 leading-relaxed">
							{isZh
								? '千级分区背光、量子点广色域与高刷新率面板，为家庭影院与游戏娱乐带来旗舰画质体验。'
								: 'Thousands of local-dimming zones, quantum dot wide color gamut and high-refresh panels — flagship picture quality for home cinema and gaming.'}
						</p>
						<div className="mt-7 flex flex-wrap gap-3">
							<NavLink
								href="/service/repair"
								className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-[#C5000F] text-white text-sm font-medium transition"
							>
								<Wrench className="w-4 h-4" />
								{isZh ? '预约安装 / 维修' : 'Request installation / repair'}
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
									<p className="text-sm text-[#666666] dark:text-gray-300 leading-relaxed mb-4">
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
							href="/service/troubleshooting/tv"
							className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition"
						>
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
								{isZh ? '电视故障排查' : 'TV troubleshooting'}
							</h3>
							<p className="text-sm text-[#666666] dark:text-gray-300 leading-relaxed">
								{isZh
									? '黑屏、无法连接 Wi-Fi、投屏失败等常见问题，按步骤自助解决。'
									: 'Step-through guides for black screen, Wi-Fi, casting and more.'}
							</p>
						</NavLink>
						<NavLink
							href="/service/warranty"
							className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition"
						>
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
								{isZh ? '保修政策' : 'Warranty policy'}
							</h3>
							<p className="text-sm text-[#666666] dark:text-gray-300 leading-relaxed">
								{isZh
									? '电视整机与主要部件保修时长、免保与自费服务的划分。'
									: 'Coverage details for the whole unit and major components.'}
							</p>
						</NavLink>
						<NavLink
							href="/service/faq"
							className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition"
						>
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
								{isZh ? '常见问题 FAQ' : 'FAQ'}
							</h3>
							<p className="text-sm text-[#666666] dark:text-gray-300 leading-relaxed">
								{isZh ? '查看电视相关的常见问题与官方解答。' : 'Find answers to frequently asked TV questions.'}
							</p>
						</NavLink>
					</div>
				</div>
			</section>
		</main>
	)
}
