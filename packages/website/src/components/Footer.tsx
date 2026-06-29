import { useMemo } from 'react'
import { Link } from 'wouter'

import { NAV_ITEMS, TCL_SERVICE_HOTLINE } from '@/constants'
import { useLanguage } from '@/i18n/context'

export default function Footer() {
	const { isZh } = useLanguage()
	const year = useMemo(() => new Date().getFullYear(), [])

	const primaryLinks = NAV_ITEMS.filter((i) =>
		['home', 'products_personal', 'products_commercial', 'service', 'partner', 'ai_capabilities', 'docs'].includes(
			i.key
		)
	)

	return (
		<footer className="bg-[#1A1A1A] dark:bg-[#0D0D0D]">
			<div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-10">
					{/* Brand + hotline */}
					<div className="md:col-span-1">
						<div className="flex items-center gap-2 mb-4">
							<div
								className="w-8 h-8 rounded flex items-center justify-center bg-[#E60012]"
								aria-hidden="true"
							>
								<span className="text-white font-bold">T</span>
							</div>
							<span className="text-base font-semibold text-white">
								{isZh ? 'TCL' : 'TCL'}
							</span>
						</div>
						<p className="text-sm text-gray-400 leading-relaxed mb-4">
							{isZh
								? 'TCL 创立于 1981 年，是全球领先的智能科技公司，致力于为用户带来更具创新性的产品和服务。'
								: 'Founded in 1981, TCL is a global leading smart technology company committed to delivering innovative products and services.'}
						</p>
						<div className="space-y-1 text-sm text-gray-300">
							<div>
								<span className="text-gray-500">
									{isZh ? '全国服务热线：' : 'National Hotline: '}
								</span>
								<a
									href={`tel:${TCL_SERVICE_HOTLINE}`}
									className="text-[#E60012] font-medium hover:underline"
								>
									{TCL_SERVICE_HOTLINE}
								</a>
							</div>
							<div className="text-gray-500">
								{isZh ? '服务时间：7×24 小时' : 'Hours: 24 / 7'}
							</div>
						</div>
					</div>

					{/* Quick links */}
					<div>
						<h3 className="text-sm font-semibold text-white mb-4">
							{isZh ? '快速链接' : 'Quick Links'}
						</h3>
						<ul className="space-y-2.5">
							{primaryLinks.map((item) => (
								<li key={item.key}>
									<Link
										href={item.href}
										className="text-sm text-gray-400 hover:text-[#E60012] transition-colors"
									>
										{isZh ? item.zh : item.en}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Service entries */}
					<div>
						<h3 className="text-sm font-semibold text-white mb-4">
							{isZh ? '服务支持' : 'Support'}
						</h3>
						<ul className="space-y-2.5 text-sm">
							<li>
								<Link
									href="/service"
									className="text-gray-400 hover:text-[#E60012] transition-colors"
								>
									{isZh ? '在线客服' : 'Live Support'}
								</Link>
							</li>
							<li>
								<Link
									href="/service/repair"
									className="text-gray-400 hover:text-[#E60012] transition-colors"
								>
									{isZh ? '产品报修' : 'Repair Request'}
								</Link>
							</li>
							<li>
								<Link
									href="/service/faq"
									className="text-gray-400 hover:text-[#E60012] transition-colors"
								>
									{isZh ? '常见问题 FAQ' : 'FAQ'}
								</Link>
							</li>
							<li>
								<Link
									href="/service/warranty"
									className="text-gray-400 hover:text-[#E60012] transition-colors"
								>
									{isZh ? '保修政策' : 'Warranty Policy'}
								</Link>
							</li>
							<li>
								<Link
									href="/service/troubleshooting"
									className="text-gray-400 hover:text-[#E60012] transition-colors"
								>
									{isZh ? '故障排查' : 'Troubleshooting'}
								</Link>
							</li>
						</ul>
					</div>

					{/* Commercial */}
					<div>
						<h3 className="text-sm font-semibold text-white mb-4">
							{isZh ? '商务合作' : 'Business'}
						</h3>
						<ul className="space-y-2.5 text-sm">
							<li>
								<Link
									href="/partner"
									className="text-gray-400 hover:text-[#E60012] transition-colors"
								>
									{isZh ? '加盟合作' : 'Partnership'}
								</Link>
							</li>
							<li>
								<Link
									href="/products/commercial"
									className="text-gray-400 hover:text-[#E60012] transition-colors"
								>
									{isZh ? '商用产品' : 'Commercial Products'}
								</Link>
							</li>
							<li>
								<Link
									href="/partner/solar"
									className="text-gray-400 hover:text-[#E60012] transition-colors"
								>
									{isZh ? '光伏与能源' : 'Solar & Energy'}
								</Link>
							</li>
							<li>
								<Link
									href="/service/contact"
									className="text-gray-400 hover:text-[#E60012] transition-colors"
								>
									{isZh ? '联系我们' : 'Contact Us'}
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-10 pt-6 border-t border-gray-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-gray-500">
					<div>
						© {year} TCL Corporation {isZh ? '版权所有' : 'All Rights Reserved'}
					</div>
					<div className="flex items-center gap-5">
						<Link
							href="/service/warranty"
							className="hover:text-[#E60012] transition-colors"
						>
							{isZh ? '服务政策' : 'Service Policy'}
						</Link>
						<Link
							href="/service/contact"
							className="hover:text-[#E60012] transition-colors"
						>
							{isZh ? '隐私政策' : 'Privacy Policy'}
						</Link>
						<Link
							href="/service/contact"
							className="hover:text-[#E60012] transition-colors"
						>
							{isZh ? '使用条款' : 'Terms of Use'}
						</Link>
					</div>
				</div>
			</div>
		</footer>
	)
}
