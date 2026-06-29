import { Bot, ShieldCheck, Sparkles } from 'lucide-react'

import { AI_CAPABILITIES, INTENT_CLASSIFICATION } from '@/constants'
import { useLanguage } from '@/i18n/context'

export default function AiCapabilitiesPage() {
	const { isZh } = useLanguage()

	return (
		<main>
			<section className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/30 dark:to-gray-900 border-b border-gray-200 dark:border-gray-800">
				<div className="max-w-7xl mx-auto px-5 lg:px-8 py-14 md:py-16">
					<div className="max-w-3xl">
						<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium mb-4">
							<Sparkles className="w-3.5 h-3.5" />
							{isZh ? 'AI 能力' : 'AI Capabilities'}
						</div>
						<h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
							{isZh
								? '理解每一位用户的真实意图'
								: 'Understanding what users really need'}
						</h1>
						<p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
							{isZh
								? '基于大语言模型与规则安全层，AI 服务助手将用户需求分类到产品、服务、合作、投诉等明确方向，并在涉及隐私、金钱与投诉时主动转人工客服。'
								: 'Powered by LLMs with a safety rules layer, the AI Service Assistant classifies user needs into product, support, partnership and feedback categories. It hands off to humans automatically when privacy, payments or complaints are detected.'}
						</p>
					</div>
				</div>
			</section>

			<section className="py-14 md:py-16">
				<div className="max-w-7xl mx-auto px-5 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
						{AI_CAPABILITIES.map((cap, idx) => {
							const content = isZh ? cap.zh : cap.en
							return (
								<div
									key={cap.key}
									className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-sm transition-all"
								>
									<div className="flex items-start justify-between mb-3">
										<div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
											<Bot className="w-5 h-5" />
										</div>
										<span className="text-xs font-mono text-gray-400 dark:text-gray-500">
											0{idx + 1}
										</span>
									</div>
									<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
										{content.name}
									</h3>
									<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
										{content.desc}
									</p>
									<div className="space-y-1.5">
										{content.example.map((ex, i) => (
											<p
												key={i}
												className="text-xs text-gray-500 dark:text-gray-400 pl-2 border-l-2 border-gray-200 dark:border-gray-600"
											>
												"{ex}"
											</p>
										))}
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</section>

			{/* Intent classification */}
			<section className="py-14 md:py-16 bg-gray-50 dark:bg-gray-800/40">
				<div className="max-w-7xl mx-auto px-5 lg:px-8">
					<div className="max-w-2xl mb-10">
						<h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
							{isZh ? '意图分类体系' : 'Intent classification'}
						</h2>
						<p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">
							{isZh
								? '系统在用户输入后先进行分类，不同类别走不同的处理路径与安全策略。'
								: 'After the user types a message, the system first classifies it. Different categories follow different processing paths and safety policies.'}
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{INTENT_CLASSIFICATION.map((item) => {
							const content = isZh ? item.zh : item.en
							return (
								<div
									key={item.key}
									className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5"
								>
									<div className="flex items-center justify-between mb-2">
										<h3 className="text-base font-semibold text-gray-900 dark:text-white">
											{content.name}
										</h3>
										<span
											className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
												item.action === 'HANDOFF'
													? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
													: item.action === 'PROHIBIT'
														? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
														: 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300'
											}`}
										>
											{item.action}
										</span>
									</div>
									<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
										{content.desc}
									</p>
								</div>
							)
						})}
					</div>
				</div>
			</section>

			{/* Safety */}
			<section className="py-14 md:py-16">
				<div className="max-w-7xl mx-auto px-5 lg:px-8">
					<div className="flex items-start gap-4 mb-8">
						<div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
							<ShieldCheck className="w-6 h-6" />
						</div>
						<div>
							<h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
								{isZh ? '安全与隐私保护' : 'Safety & privacy'}
							</h2>
							<p className="mt-2 text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
								{isZh
									? '以下动作不会在没有人工确认前被执行。这是产品对用户最重要的承诺。'
									: 'The following actions are never taken without human review. This is the product\'s most important commitment to its users.'}
							</p>
						</div>
					</div>
					<ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300">
						{[
							isZh ? '不收集手机号、地址、银行卡等敏感信息。' : 'Never collects phone numbers, addresses or payment info.',
							isZh ? '不在用户未确认前提交任何表单。' : 'Never submits a form on the user\'s behalf without confirmation.',
							isZh ? '检测到投诉、投诉升级或退换货时，立即转人工。' : 'Immediate human hand-off when complaints, refunds or escalations are detected.',
							isZh ? '检测到危险操作（拆卸、短路、改装）时，拒绝生成指令并转人工。' : 'Refuses guidance for dangerous operations (disassembly, short-circuit) and routes to human support.',
							isZh ? '不访问也不修改用户设备上的本地文件与隐私内容。' : 'Never accesses or modifies local files and privacy content on the user\'s device.',
							isZh ? '所有对话日志按政策定期清理，不以营销为目的使用。' : 'Conversation logs are cleaned periodically according to policy — never used for marketing.',
						].map((line, i) => (
							<li
								key={i}
								className="flex items-start gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
							>
								<span className="shrink-0 text-blue-600 dark:text-blue-400 font-bold">✓</span>
								<span>{line}</span>
							</li>
						))}
					</ul>
				</div>
			</section>
		</main>
	)
}
