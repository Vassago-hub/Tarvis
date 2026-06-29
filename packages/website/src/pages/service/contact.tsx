import { Building2, Mail, Phone, Clock } from 'lucide-react'

import NavLink from '@/components/NavLink'
import { TCL_ADDRESS, TCL_SERVICE_EMAIL, TCL_SERVICE_HOTLINE, TCL_SERVICE_HOURS_ZH } from '@/constants'
import { useLanguage } from '@/i18n/context'

export default function ContactPage() {
	const { isZh } = useLanguage()

	return (
		<main>
			<section className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/30 dark:to-gray-900 border-b border-gray-200 dark:border-gray-800">
				<div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 md:py-20">
					<div className="max-w-3xl">
						<h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
							{isZh ? '联系我们' : 'Contact Us'}
						</h1>
						<p className="mt-4 text-[#666666] dark:text-gray-300 leading-relaxed">
							{isZh
								? '请通过以下官方渠道与我们取得联系。我们将在工作时间内尽快响应。'
								: 'Please reach out through the official channels below. We respond during business hours.'}
						</p>
					</div>
				</div>
			</section>

			<section className="py-14 md:py-16">
				<div className="max-w-5xl mx-auto px-5 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-5">
					<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-7">
						<div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-[#E60012] flex items-center justify-center mb-4">
							<Phone className="w-5 h-5" />
						</div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
							{isZh ? '全国服务热线' : 'National hotline'}
						</h3>
						<a
							href={`tel:${TCL_SERVICE_HOTLINE}`}
							className="text-2xl font-bold text-[#E60012] hover:underline"
						>
							{TCL_SERVICE_HOTLINE}
						</a>
						<div className="mt-4 flex items-start gap-2 text-sm text-[#666666] dark:text-gray-300">
							<Clock className="w-4 h-4 mt-0.5" />
							<span>{isZh ? TCL_SERVICE_HOURS_ZH : 'Open 24 / 7'}</span>
						</div>
					</div>

					<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-7">
						<div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-[#E60012] flex items-center justify-center mb-4">
							<Mail className="w-5 h-5" />
						</div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
							{isZh ? '电子邮箱' : 'Email'}
						</h3>
						<a
							href={`mailto:${TCL_SERVICE_EMAIL}`}
							className="text-lg font-medium text-[#E60012] hover:underline break-all"
						>
							{TCL_SERVICE_EMAIL}
						</a>
						<p className="mt-4 text-sm text-[#666666] dark:text-gray-300">
							{isZh
								? '建议在邮件中简要描述您的问题，并附上订单号或产品型号。'
								: 'Please include a brief description of your issue, order number or product model in the email.'}
						</p>
					</div>

					<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-7 md:col-span-2">
						<div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-[#E60012] flex items-center justify-center mb-4">
							<Building2 className="w-5 h-5" />
						</div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
							{isZh ? '公司 / 邮寄地址' : 'Office / Mailing address'}
						</h3>
						<dl className="space-y-4 text-sm">
							<div>
								<dt className="text-gray-500 dark:text-gray-400 mb-1">
									{isZh ? '公司地址' : 'Office'}
								</dt>
								<dd className="text-gray-900 dark:text-white leading-relaxed">
									{isZh ? TCL_ADDRESS.office : TCL_ADDRESS.officeEn}
								</dd>
							</div>
							<div>
								<dt className="text-gray-500 dark:text-gray-400 mb-1">
									{isZh ? '邮寄地址' : 'Mailing'}
								</dt>
								<dd className="text-gray-900 dark:text-white leading-relaxed">
									{isZh ? TCL_ADDRESS.mail : TCL_ADDRESS.mailEn}
								</dd>
							</div>
						</dl>
					</div>
				</div>
			</section>

			<section className="py-14 md:py-16 bg-gray-50 dark:bg-gray-800/40">
				<div className="max-w-4xl mx-auto px-5 lg:px-8">
					<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-7">
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
							{isZh ? '更多服务入口' : 'More service entry points'}
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
							<NavLink
								href="/service/repair"
								className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition"
							>
								{isZh ? '在线报修' : 'Repair request'}
							</NavLink>
							<a
								href="/service/troubleshooting"
								className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition"
							>
								{isZh ? '故障排查' : 'Troubleshooting'}
							</a>
							<NavLink
								href="/service/warranty"
								className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition"
							>
								{isZh ? '保修政策' : 'Warranty'}
							</NavLink>
							<NavLink
								href="/service/faq"
								className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition"
							>
								{isZh ? '常见问题' : 'FAQ'}
							</NavLink>
							<NavLink
								href="/service/complaint"
								className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition"
							>
								{isZh ? '投诉与建议' : 'Feedback'}
							</NavLink>
							<NavLink
								href="/partner"
								className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition"
							>
								{isZh ? '商务合作' : 'Business partnership'}
							</NavLink>
						</div>
					</div>
				</div>
			</section>
		</main>
	)
}
