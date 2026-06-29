import { FileQuestion, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import NavLink from '@/components/NavLink'
import { FAQ_LIST, FAQ_CATEGORIES } from '@/constants'
import { useLanguage } from '@/i18n/context'

export default function FaqPage() {
	const { isZh } = useLanguage()
	const [query, setQuery] = useState('')
	const [activeCategory, setActiveCategory] = useState<string | null>(null)

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase()
		return FAQ_LIST.filter((item) => {
			if (activeCategory && item.category !== activeCategory) return false
			if (!q) return true
			const content = isZh ? item.zh : item.en
			return (
				content.q.toLowerCase().includes(q) ||
				content.a.toLowerCase().includes(q)
			)
		})
	}, [query, activeCategory, isZh])

	return (
		<main>
			<section className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/30 dark:to-gray-900 border-b border-gray-200 dark:border-gray-800">
				<div className="max-w-5xl mx-auto px-5 lg:px-8 py-14 md:py-16">
					<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium mb-4">
						<FileQuestion className="w-3.5 h-3.5" />
						{isZh ? '常见问题 FAQ' : 'FAQ'}
					</div>
					<h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
						{isZh ? '高频问题，先在这里看看' : 'Quick answers to common questions'}
					</h1>
					<p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
						{isZh
							? '在联系客服之前，或许下面的问题已经有答案。可按关键词搜索，或选择相关分类。'
							: 'Before contacting support, your question may already be answered below. Search by keyword or filter by category.'}
					</p>

					<div className="mt-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
						<div className="relative flex-1">
							<Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
							<input
								type="text"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder={
									isZh ? '搜索关键词，例如：保修、不制冷、投屏...' : 'Search keywords, e.g. warranty, cooling, screen cast...'}
								className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-9 pr-10 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition"
							/>
							{query && (
								<button
									type="button"
									onClick={() => setQuery('')}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
									aria-label="clear"
								>
									<X className="w-4 h-4" />
								</button>
							)}
						</div>
						<span className="text-sm text-gray-500 dark:text-gray-400 sm:ml-1">
							{isZh
								? `共 ${filtered.length} 条匹配结果`
								: `${filtered.length} match${filtered.length === 1 ? '' : 'es'}`}
						</span>
					</div>
				</div>
			</section>

			<section className="py-14 md:py-16">
				<div className="max-w-5xl mx-auto px-5 lg:px-8">
					<div className="flex flex-wrap gap-2 mb-8">
						<button
							type="button"
							onClick={() => setActiveCategory(null)}
							className={`text-sm px-3 py-1.5 rounded-full border transition ${
								activeCategory === null
									? 'bg-blue-600 border-blue-600 text-white'
									: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-blue-300 dark:hover:border-blue-600'
							}`}
						>
							{isZh ? '全部' : 'All'}
						</button>
						{FAQ_CATEGORIES.map((cat) => (
							<button
								type="button"
								key={cat.key}
								onClick={() =>
									setActiveCategory(activeCategory === cat.key ? null : cat.key)
								}
								className={`text-sm px-3 py-1.5 rounded-full border transition ${
									activeCategory === cat.key
										? 'bg-blue-600 border-blue-600 text-white'
										: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-blue-300 dark:hover:border-blue-600'
								}`}
							>
								{isZh ? cat.zh : cat.en}
							</button>
						))}
					</div>

					{filtered.length === 0 ? (
						<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
								{isZh ? '没有匹配的问题' : 'No matching questions'}
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
								{isZh
									? '试试其他关键词或切换到其他分类，或直接联系客服。'
									: 'Try a different keyword or a different category, or reach out to live support.'}
							</p>
							<div className="flex justify-center gap-2">
								<button
									type="button"
									onClick={() => {
										setQuery('')
										setActiveCategory(null)
									}}
									className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-[#C5000F] text-white text-sm font-medium transition"
								>
									{isZh ? '清除筛选' : 'Clear filters'}
								</button>
								<a
									href="/service"
									className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-medium hover:border-blue-300 dark:hover:border-blue-600 transition"
								>
									{isZh ? '联系客服' : 'Contact support'}
								</a>
							</div>
						</div>
					) : (
						<div className="space-y-4">
							{filtered.map((item, idx) => {
								const content = isZh ? item.zh : item.en
								const catLabel = isZh
									? FAQ_CATEGORIES.find((c) => c.key === item.category)?.zh
									: FAQ_CATEGORIES.find((c) => c.key === item.category)?.en
								return (
									<details
										key={item.key}
										className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 md:p-6 open:shadow-sm"
									>
										<summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
											<div className="flex items-start gap-4">
												<span className="shrink-0 w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/40 text-[#E60012] text-xs font-semibold flex items-center justify-center">
													{idx + 1}
												</span>
												<div className="flex-1">
													{catLabel && (
														<span className="inline-block text-xs font-medium text-[#E60012] bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded-full mb-2">
															{catLabel}
														</span>
													)}
													<h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-white">
														{content.q}
													</h3>
												</div>
											</div>
											<span className="shrink-0 text-gray-400 dark:text-gray-500 group-open:rotate-180 transition-transform text-xl leading-none select-none">
												+
											</span>
										</summary>
										<div className="mt-4 ml-10 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
											{content.a.split('\n').map((line, i) => (
												<p key={i} className="mb-2 last:mb-0">
													{line}
												</p>
											))}
										</div>
									</details>
								)
							})}
						</div>
					)}

					<div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
						{isZh ? (
							<>
								没有找到答案？
								<NavLink
									href="/service"
									className="text-[#E60012] hover:underline font-medium"
								>
									联系在线客服
								</NavLink>
							</>
						) : (
							<>
								Still stuck?{' '}
								<NavLink
									href="/service"
									className="text-[#E60012] hover:underline font-medium"
								>
									Contact live support
								</NavLink>
							</>
						)}
					</div>
				</div>
			</section>
		</main>
	)
}
