import { Wrench } from 'lucide-react'

import NavLink from '@/components/NavLink'
import { TROUBLESHOOTING_GUIDES } from '@/constants'
import { useLanguage } from '@/i18n/context'

export default function TroubleshootingPage() {
	const { isZh } = useLanguage()

	const pathMap: Record<string, string> = {
		tv: '/service/troubleshooting/tv',
		ac: '/service/troubleshooting/ac',
		fridge: '/service/troubleshooting/fridge',
		washer: '/service/troubleshooting/washer',
		lock: '/service/troubleshooting/lock',
	}

	return (
		<main>
			<section className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/30 dark:to-gray-900 border-b border-[#EEEEEE] dark:border-[#333333]">
				<div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 md:py-20">
					<div className="max-w-3xl">
						<h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
							{isZh ? '故障自助排查中心' : 'Self-service Troubleshooting'}
						</h1>
						<p className="mt-4 text-[#666666] dark:text-gray-300 leading-relaxed">
							{isZh
								? '按产品类型选择下方指南，按步骤完成常见问题的自助排查。如无法解决，请提交报修。'
								: 'Pick a guide below by product type and follow the step-by-step troubleshooting. Submit a repair request if the issue persists.'}
						</p>
					</div>
				</div>
			</section>

			<section className="py-14 md:py-16">
				<div className="max-w-7xl mx-auto px-5 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
						{TROUBLESHOOTING_GUIDES.map((guide) => {
							const content = isZh ? guide.zh : guide.en
							const path = pathMap[guide.key] ?? '/service'
							return (
								<NavLink
									key={guide.key}
									href={path}
									className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition block"
								>
									<div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
										<Wrench className="w-5 h-5" />
									</div>
									<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
										{content.name}
									</h3>
									<p className="text-sm text-[#666666] dark:text-gray-300 leading-relaxed mb-4">
										{content.desc}
									</p>
									<ul className="space-y-1 mb-4">
										{guide.issues.slice(0, 3).map((issue, idx) => {
											const issueContent = isZh ? issue.zh : issue.en
											return (
												<li
													key={idx}
													className="text-sm text-[#666666] dark:text-gray-400"
												>
													• {issueContent.title}
												</li>
											)
										})}
									</ul>
									<span className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
										{isZh ? '开始排查 →' : 'Start troubleshooting →'}
									</span>
								</NavLink>
							)
						})}
					</div>
				</div>
			</section>

			<section className="py-14 md:py-16 bg-gray-50 dark:bg-gray-800/40">
				<div className="max-w-4xl mx-auto px-5 lg:px-8">
					<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-7">
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
							{isZh ? '排查后问题仍未解决？' : 'Issue persists after troubleshooting?'}
						</h2>
						<p className="text-[#666666] dark:text-gray-300 leading-relaxed mb-4">
							{isZh
								? '提交报修信息，我们将安排工程师上门检修。请提前准备好产品型号、购机发票或订单凭证。'
								: 'Submit a repair request and a technician will be dispatched. Keep your product model, invoice or order proof handy.'}
						</p>
						<NavLink
							href="/service/repair"
							className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#E60012] hover:bg-blue-700 text-white text-sm font-medium transition"
						>
							<Wrench className="w-4 h-4" />
							{isZh ? '立即报修' : 'Request repair'}
						</NavLink>
					</div>
				</div>
			</section>
		</main>
	)
}
