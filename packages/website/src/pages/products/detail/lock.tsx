import { Check, ShieldCheck, Wrench } from 'lucide-react'

import NavLink from '@/components/NavLink'
import { PRODUCT_MODELS, TCL_SERVICE_HOTLINE } from '@/constants'
import { useLanguage } from '@/i18n/context'

export default function LockDetailPage() {
	const { isZh } = useLanguage()
	const models = PRODUCT_MODELS.filter((m) => m.category === 'lock')

	return (
		<main>
			<section className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/30 dark:to-gray-900 border-b border-gray-200 dark:border-gray-800">
				<div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 md:py-20">
					<div className="max-w-3xl">
						<p className="text-xs text-[#E60012] font-medium mb-3">
							{isZh ? '智能门锁' : 'Smart Lock'}
						</p>
						<h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] dark:text-white tracking-tight leading-tight">
							{isZh ? '3D 人脸识别 / 指纹密码智能门锁' : '3D Face Recognition & Fingerprint Smart Lock'}
						</h1>
						<p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
							{isZh
								? '3D 结构光人脸识别、半导体指纹、虚位密码防偷窥与防撬报警，更安全的家庭入口。'
								: '3D structured-light face recognition, semiconductor fingerprint, peep-protected passwords and tamper alarms — a more secure home entrance.'}
						</p>
						<div className="mt-7 flex flex-wrap gap-3">
							<NavLink
								href="/service/repair"
								className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
							>
								<Wrench className="w-4 h-4" />
								{isZh ? '预约安装 / 维修' : 'Request installation / repair'}
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
							href="/service/troubleshooting/lock"
							className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition"
						>
							<h3 className="text-lg font-semibold text-[#1A1A1A] dark:text-white mb-2">
								{isZh ? '智能门锁故障排查' : 'Smart lock troubleshooting'}
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
								{isZh ? '指纹识别失败、电池没电等常见问题。' : 'Common issues like fingerprint recognition and battery.'}
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
								{isZh ? '整机与主要电子部件保修范围。' : 'Coverage for the whole unit and key electronics.'}
							</p>
						</NavLink>
						<NavLink
							href="/service/faq"
							className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition"
						>
							<h3 className="text-lg font-semibold text-[#1A1A1A] dark:text-white mb-2">
								{isZh ? '常见问题 FAQ' : 'FAQ'}
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
								{isZh ? '查看智能门锁相关的常见问题与官方解答。' : 'Answers to frequently asked smart-lock questions.'}
							</p>
						</NavLink>
					</div>
				</div>
			</section>
		</main>
	)
}
