import { CheckCircle2, Phone } from 'lucide-react'
import { useState } from 'react'

import { TCL_SERVICE_HOTLINE, TCL_SERVICE_HOURS_ZH } from '@/constants'
import { useLanguage } from '@/i18n/context'

export default function RepairPage() {
	const { isZh } = useLanguage()
	const [submitted, setSubmitted] = useState(false)
	const [form, setForm] = useState({
		name: '',
		phone: '',
		city: '',
		address: '',
		product: '',
		issue: '',
	})

	const productOptions = isZh
		? ['电视 / 显示', '空调', '冰箱', '洗衣机', '智能门锁', '商用显示 / 空调', '光伏 / 储能系统', '其他']
		: ['TV / Display', 'Air conditioner', 'Refrigerator', 'Washer', 'Smart lock', 'Commercial display / HVAC', 'Solar / Energy storage', 'Other']

	return (
		<main>
			<section className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/30 dark:to-gray-900 border-b border-[#EEEEEE] dark:border-[#333333]">
				<div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 md:py-20">
					<div className="max-w-3xl">
						<h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
							{isZh ? '在线报修' : 'Repair Request'}
						</h1>
						<p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
							{isZh
								? '填写下方表单提交报修信息，服务团队将在工作时间内与您联系并安排工程师上门。'
								: 'Fill out the form below to submit a repair request. Our service team will contact you during business hours and dispatch a technician.'}
						</p>
						<div className="mt-6 inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
							<Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
							<span className="text-sm text-gray-700 dark:text-gray-200">
								{isZh ? TCL_SERVICE_HOURS_ZH : 'Business hours · 24/7'}
							</span>
							<a
								href={`tel:${TCL_SERVICE_HOTLINE}`}
								className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
							>
								{TCL_SERVICE_HOTLINE}
							</a>
						</div>
					</div>
				</div>
			</section>

			<section className="py-14 md:py-16">
				<div className="max-w-3xl mx-auto px-5 lg:px-8">
					{submitted ? (
						<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
							<CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
							<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
								{isZh ? '报修已提交' : 'Request submitted'}
							</h2>
							<p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
								{isZh
									? '我们将在工作时间内通过电话与您联系，确认信息并安排工程师上门。请保持电话畅通。'
									: 'Our team will contact you by phone during business hours to confirm details and arrange a technician. Please keep your line available.'}
							</p>
							<button
								type="button"
								onClick={() => {
									setSubmitted(false)
									setForm({ name: '', phone: '', city: '', address: '', product: '', issue: '' })
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
										className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition"
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
										className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										{isZh ? '所在城市' : 'City'}
									</label>
									<input
										type="text"
										value={form.city}
										onChange={(e) => setForm({ ...form, city: e.target.value })}
										required
										className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										{isZh ? '产品类型' : 'Product type'}
									</label>
									<select
										value={form.product}
										onChange={(e) => setForm({ ...form, product: e.target.value })}
										required
										className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition"
									>
										<option value="">
											{isZh ? '请选择' : 'Please select'}
										</option>
										{productOptions.map((opt) => (
											<option key={opt} value={opt}>
												{opt}
											</option>
										))}
									</select>
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									{isZh ? '详细地址' : 'Address'}
								</label>
								<input
									type="text"
									value={form.address}
									onChange={(e) => setForm({ ...form, address: e.target.value })}
									required
									className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									{isZh ? '故障描述' : 'Issue description'}
								</label>
								<textarea
									rows={5}
									value={form.issue}
									onChange={(e) => setForm({ ...form, issue: e.target.value })}
									required
									placeholder={
										isZh
											? '请简要描述产品故障现象、发生时间、是否仍在保修期内等。'
											: 'Briefly describe symptoms, when the issue started, warranty status, etc.'
									}
									className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition resize-y"
								/>
							</div>
							<button
								type="submit"
								className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-lg bg-blue-600 hover:bg-[#C5000F] text-white text-sm font-medium transition"
							>
								{isZh ? '提交报修' : 'Submit request'}
							</button>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								{isZh
									? '提示：提交后，客服将与您联系以确认详细信息。请保留购机发票或订单凭证。'
									: 'Note: After submission, customer service will contact you to confirm details. Please keep your invoice or order proof handy.'}
							</p>
						</form>
					)}
				</div>
			</section>
		</main>
	)
}
