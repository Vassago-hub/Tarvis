import { AlertTriangle, ChevronRight } from 'lucide-react'

import { TROUBLESHOOTING_GUIDES } from '@/constants'
import { useLanguage } from '@/i18n/context'
import NavLink from '@/components/NavLink'

const key = 'washer'

export default function TroubleshootingWasherPage() {
	const { isZh } = useLanguage()
	const guide = TROUBLESHOOTING_GUIDES.find((g) => g.key === key)
	if (!guide) return null
	const content = isZh ? guide.zh : guide.en

	return (
		<main>
			<section className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/30 dark:to-gray-900 border-b border-gray-200 dark:border-gray-800">
				<div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 md:py-20">
					<div className="max-w-3xl">
						<nav className="text-sm text-gray-500 dark:text-gray-400 mb-3">
							<NavLink href="/service" className="hover:underline">
								{isZh ? '服务支持' : 'Service'}
							</NavLink>
							<span className="mx-2">
								<ChevronRight className="w-3 h-3 inline" />
							</span>
							<NavLink href="/service/troubleshooting" className="hover:underline">
								{isZh ? '故障排查' : 'Troubleshooting'}
							</NavLink>
						</nav>
						<h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
							{isZh ? `${content.name} 故障排查指南` : `${content.name} Troubleshooting Guide`}
						</h1>
						<p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">{content.desc}</p>
					</div>
				</div>
			</section>

			<section className="py-14 md:py-16">
				<div className="max-w-4xl mx-auto px-5 lg:px-8 space-y-6">
					{guide.issues.map((issue, idx) => {
						const issueContent = isZh ? issue.zh : issue.en
						return (
							<article
								key={idx}
								className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6"
							>
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
									{issueContent.title}
								</h3>
								<ol className="space-y-3 mb-4">
									{issueContent.steps.map((step, i) => (
										<li
											key={i}
											className="flex gap-3 text-sm text-gray-700 dark:text-gray-200 leading-relaxed"
										>
											<span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center justify-center">
												{i + 1}
											</span>
											<span>{step}</span>
										</li>
									))}
								</ol>
								{issueContent.danger && (
									<div className="mt-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 flex gap-3">
										<AlertTriangle className="w-5 h-5 text-yellow-700 dark:text-yellow-400 shrink-0 mt-0.5" />
										<p className="text-sm text-yellow-800 dark:text-yellow-200 leading-relaxed">
											{issueContent.danger}
										</p>
									</div>
								)}
							</article>
						)
					})}
				</div>
			</section>

			<section className="py-14 md:py-16 bg-gray-50 dark:bg-gray-800/40">
				<div className="max-w-4xl mx-auto px-5 lg:px-8">
					<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-7">
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
							{isZh ? '问题仍未解决？' : 'Issue still not resolved?'}
						</h2>
						<p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
							{isZh
								? '如按上述步骤操作后问题仍存在，请提交报修信息，我们将安排工程师上门检修。'
								: 'If the issue persists after the steps above, please submit a repair request and a technician will be dispatched.'}
						</p>
						<NavLink
							href="/service/repair"
							className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
						>
							{isZh ? '立即报修' : 'Request repair'}
						</NavLink>
					</div>
				</div>
			</section>
		</main>
	)
}
