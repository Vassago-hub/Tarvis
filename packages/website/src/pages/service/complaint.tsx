import { CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

import { useLanguage } from '@/i18n/context'

export default function ComplaintPage() {
	const { isZh } = useLanguage()
	const [submitted, setSubmitted] = useState(false)
	const [form, setForm] = useState({
		type: '',
		name: '',
		phone: '',
		order: '',
		message: '',
	})

	const typeOptions = isZh
		? [
				{ key: 'complaint', label: '服务投诉（上门、电话、门店）' },
				{ key: 'product', label: '产品质量 / 故障反馈' },
				{ key: 'suggestion', label: '改进建议' },
				{ key: 'praise', label: '表扬与肯定' },
				{ key: 'other', label: '其他' },
			]
		: [
				{ key: 'complaint', label: 'Service complaint (on-site, phone, store)' },
				{ key: 'product', label: 'Product quality / issue feedback' },
				{ key: 'suggestion', label: 'Improvement suggestion' },
				{ key: 'praise', label: 'Positive feedback' },
				{ key: 'other', label: 'Other' },
			]

	return (
		<main>
			<section className="bg-gradient-to-b from-[#FFF5F5] to-white dark:from-blue-950/30 dark:to-gray-900 border-b border-gray-200 dark:border-gray-800">
				<div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 md:py-20">
					<div className="max-w-3xl">
						<h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] dark:text-white tracking-tight leading-tight">
							{isZh ? '投诉与建议' : 'Feedback & Complaints'}
						</h1>
						<p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
							{isZh
								? '您的反馈会帮助我们不断改进产品与服务体验。以下表单将直达客户体验管理团队。'
								: 'Your feedback helps us continuously improve products and service. This form goes directly to the customer experience team.'}
						</p>
					</div>
				</div>
			</section>

			<section className="py-14 md:py-16">
				<div className="max-w-3xl mx-auto px-5 lg:px-8">
					{submitted ? (
						<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
							<CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
							<h2 className="text-2xl font-bold text-[#1A1A1A] dark:text-white mb-2">
								{isZh ? '反馈已提交，感谢您！' : 'Feedback submitted — thank you!'}
							</h2>
							<p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
								{isZh
									? '我们将在 1-3 个工作日内与您取得联系，请保持电话畅通。'
									: 'We will respond within 1-3 business days. Please keep your phone available.'}
							</p>
							<button
								type="button"
								onClick={() => {
									setSubmitted(false)
									setForm({ type: '', name: '', phone: '', order: '', message: '' })
								}}
								className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-[#C5000F] text-white text-sm font-medium transition"
							>
								{isZh ? '再提交一个' : 'Submit another'}
							</button>
						</div>
					) : (
						<form
							className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 space-y-6"
							onSubmit={(e) => {
								e.preventDefault()
								setSubmitted(true)
							}}
						>
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									{isZh ? '反馈类型' : 'Feedback type'}
								</label>
								<select
									value={form.type}
									onChange={(e) => setForm({ ...form, type: e.target.value })}
									required
									className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-[#1A1A1A] dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition"
								>
									<option value="">
										{isZh ? '请选择' : 'Please select'}
									</option>
									{typeOptions.map((opt) => (
										<option key={opt.key} value={opt.key}>
											{opt.label}
										</option>
									))}
								</select>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										{isZh ? '姓名' : 'Name'}
									</label>
									<input
										type="text"
										value={form.name}
										onChange={(e) => setForm({ ...form, name: e.target.value })}
										required
										className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-[#1A1A1A] dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										{isZh ? '联系电话' : 'Phone number'}
									</label>
									<input
										type="tel"
										value={form.phone}
										onChange={(e) => setForm({ ...form, phone: e.target.value })}
										required
										className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-[#1A1A1A] dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition"
									/>
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									{isZh ? '订单号 / 产品型号（可选）' : 'Order / Product model (optional)'}
								</label>
								<input
									type="text"
									value={form.order}
									onChange={(e) => setForm({ ...form, order: e.target.value })}
									className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-[#1A1A1A] dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									{isZh ? '具体描述' : 'Details'}
								</label>
								<textarea
									rows={6}
									value={form.message}
									onChange={(e) => setForm({ ...form, message: e.target.value })}
									required
									placeholder={
										isZh
											? '请详细描述发生的场景、时间、期望的解决方式等，帮助我们更快响应。'
											: 'Please describe the scenario, timeline and expected resolution to help us respond faster.'
									}
									className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-[#1A1A1A] dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition resize-y"
								/>
							</div>
							<button
								type="submit"
								className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-lg bg-blue-600 hover:bg-[#C5000F] text-white text-sm font-medium transition"
							>
								{isZh ? '提交反馈' : 'Submit feedback'}
							</button>
						</form>
					)}
				</div>
			</section>
		</main>
	)
}
