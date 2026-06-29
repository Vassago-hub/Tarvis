import { CheckCircle2, ShieldCheck } from 'lucide-react'

import NavLink from '@/components/NavLink'
import { WARRANTY_POLICY } from '@/constants'
import { useLanguage } from '@/i18n/context'

export default function WarrantyPage() {
	const { isZh } = useLanguage()
	const content = isZh ? WARRANTY_POLICY.zh : WARRANTY_POLICY.en

	return (
		<main>
			<section className="bg-gradient-to-b from-[#FFF5F5] to-white dark:from-blue-950/30 dark:to-gray-900 border-b border-gray-200 dark:border-gray-800">
				<div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 md:py-20">
					<div className="max-w-3xl">
						<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium mb-5">
							<ShieldCheck className="w-3.5 h-3.5" />
							{isZh ? '服务政策' : 'Service policy'}
						</div>
						<h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
							{content.title}
						</h1>
						<p className="mt-4 text-[#666666] dark:text-gray-300 leading-relaxed">{content.intro}</p>
					</div>
				</div>
			</section>

			<section className="py-14 md:py-16">
				<div className="max-w-5xl mx-auto px-5 lg:px-8">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
						{isZh ? '保修范围与期限' : 'Coverage & Duration'}
					</h2>
					<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
						<table className="w-full text-sm">
							<thead className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
								<tr>
									<th className="text-left px-5 py-3 font-semibold text-gray-700 dark:text-gray-200">
										{isZh ? '产品类型' : 'Product'}
									</th>
									<th className="text-left px-5 py-3 font-semibold text-gray-700 dark:text-gray-200">
										{isZh ? '整机保修' : 'Whole unit'}
									</th>
									<th className="text-left px-5 py-3 font-semibold text-gray-700 dark:text-gray-200">
										{isZh ? '主要部件 / 备注' : 'Major parts / Notes'}
									</th>
								</tr>
							</thead>
							<tbody>
								{content.coverage.map((row, idx) => (
									<tr
										key={idx}
										className="border-b border-gray-100 dark:border-gray-700 last:border-b-0"
									>
										<td className="px-5 py-3 font-medium text-gray-900 dark:text-white align-top">
											{row.product}
										</td>
										<td className="px-5 py-3 text-gray-700 dark:text-gray-300 align-top">
											{row.whole}
										</td>
										<td className="px-5 py-3 text-gray-700 dark:text-gray-300 align-top">
											{row.major}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</section>

			<section className="py-14 md:py-16 bg-gray-50 dark:bg-gray-800/40">
				<div className="max-w-5xl mx-auto px-5 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-7">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
								{isZh ? '免责 / 不保范围' : 'Exclusions'}
							</h3>
							<ul className="space-y-3">
								{content.excluded.map((item, idx) => (
									<li
										key={idx}
										className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300"
									>
										<span className="text-gray-400 dark:text-gray-500 mt-1">•</span>
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>

						<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-7">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
								{isZh ? '保修凭证' : 'Required documents'}
							</h3>
							<ul className="space-y-3 mb-6">
								{content.required_docs.map((item, idx) => (
									<li
										key={idx}
										className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300"
									>
										<CheckCircle2 className="w-4 h-4 mt-1 text-green-600 dark:text-green-400 shrink-0" />
										<span>{item}</span>
									</li>
								))}
							</ul>
							<p className="text-sm text-[#666666] dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
								{content.service_flow[0]}
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="py-14 md:py-16">
				<div className="max-w-5xl mx-auto px-5 lg:px-8">
					<div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-7">
						<p className="text-sm text-blue-800 dark:text-blue-100 leading-relaxed">{content.note}</p>
						<div className="mt-5 flex flex-wrap gap-3">
							<NavLink
								href="/service/repair"
								className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-[#C5000F] text-white text-sm font-medium transition"
							>
								{isZh ? '提交报修' : 'Submit repair'}
							</NavLink>
							<NavLink
								href="/service/faq"
								className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-medium hover:border-blue-300 dark:hover:border-blue-600 transition"
							>
								{isZh ? '查看常见问题' : 'Browse FAQ'}
							</NavLink>
						</div>
					</div>
				</div>
			</section>
		</main>
	)
}
