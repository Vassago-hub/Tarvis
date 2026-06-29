import { Check } from 'lucide-react'

import NavLink from '@/components/NavLink'
import { PARTNER_PROGRAMS } from '@/constants'
import { useLanguage } from '@/i18n/context'

const key = 'gov'

export default function PartnerGovPage() {
	const { isZh } = useLanguage()
	const program = PARTNER_PROGRAMS.find((p) => p.key === key)
	if (!program) return null
	const content = isZh ? program.zh : program.en

	return (
		<main>
			<section className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/30 dark:to-gray-900 border-b border-gray-200 dark:border-gray-800">
				<div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 md:py-20">
					<div className="max-w-3xl">
						<p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-3">
							{isZh ? '商务合作' : 'Business partnership'}
						</p>
						<h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
							{content.name}
						</h1>
						<p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">{content.intro}</p>
					</div>
				</div>
			</section>

			<section className="py-14 md:py-16">
				<div className="max-w-5xl mx-auto px-5 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-7">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
								{isZh ? '合作模式' : 'Partnership models'}
							</h3>
							<ul className="space-y-3">
								{content.models.map((m, idx) => (
									<li
										key={idx}
										className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
									>
										<Check className="w-4 h-4 mt-0.5 text-blue-600 dark:text-blue-400 shrink-0" />
										<span>{m}</span>
									</li>
								))}
							</ul>
						</div>

						<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-7">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
								{isZh ? '合作权益' : 'Partner benefits'}
							</h3>
							<ul className="space-y-3">
								{content.benefits.map((b, idx) => (
									<li
										key={idx}
										className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
									>
										<Check className="w-4 h-4 mt-0.5 text-blue-600 dark:text-blue-400 shrink-0" />
										<span>{b}</span>
									</li>
								))}
							</ul>
						</div>
					</div>

					<div className="mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-7">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
							{isZh ? '合作流程' : 'Process'}
						</h3>
						<ol className="space-y-3">
							{content.process.map((p, idx) => (
								<li
									key={idx}
									className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300"
								>
									<span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center justify-center">
										{idx + 1}
									</span>
									<span>{p}</span>
								</li>
							))}
						</ol>
					</div>

					<div className="mt-6 flex flex-wrap gap-3">
						<NavLink
							href="/service/contact"
							className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
						>
							{isZh ? '提交合作意向' : 'Submit partnership interest'}
						</NavLink>
						<NavLink
							href="/partner"
							className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-medium hover:border-blue-300 dark:hover:border-blue-600 transition"
						>
							{isZh ? '查看其他合作' : 'Explore other partnerships'}
						</NavLink>
					</div>
				</div>
			</section>
		</main>
	)
}
