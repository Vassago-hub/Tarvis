import { LifeBuoy, Menu, Search, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'wouter'

import { NAV_ITEMS, TCL_BRAND_NAME_EN, TCL_BRAND_NAME_ZH } from '@/constants'
import { useLanguage } from '@/i18n/context'

function BrandLogo({ isZh }: { isZh: boolean }) {
	return (
		<Link href="/" className="flex items-center gap-2 shrink-0 group" aria-label="home">
			<div
				className="w-9 h-9 rounded flex items-center justify-center bg-[#E60012]"
				aria-hidden="true"
			>
				<span className="text-white font-bold text-lg leading-none">T</span>
			</div>
			<div className="flex flex-col">
				<span className="text-base font-semibold text-[#1A1A1A] dark:text-white leading-tight">
					{isZh ? TCL_BRAND_NAME_ZH : TCL_BRAND_NAME_EN}
				</span>
				<span className="text-xs text-[#666666] dark:text-gray-400 hidden sm:inline">
					{isZh ? '创意科技，乐享生活' : 'Inspiring Greatness'}
				</span>
			</div>
		</Link>
	)
}

function NavLinks({
	isZh,
	currentPath,
	onNavigate,
}: {
	isZh: boolean
	currentPath: string
	onNavigate: () => void
}) {
	const isActive = (href: string) => {
		if (href === '/') return currentPath === '/'
		return currentPath === href || currentPath.startsWith(href + '/')
	}

	return (
		<>
			{NAV_ITEMS.map((item) => (
				<Link
					key={item.key}
					href={item.href}
					onClick={onNavigate}
					className={`inline-flex items-center text-sm font-medium transition-colors ${
						isActive(item.href)
							? 'text-[#E60012] dark:text-[#E60012]'
							: 'text-[#333333] dark:text-gray-200 hover:text-[#E60012] dark:hover:text-[#E60012]'
					}`}
				>
					{isZh ? item.zh : item.en}
				</Link>
			))}
		</>
	)
}

export default function Header() {
	const { isZh, language, setLanguage } = useLanguage()
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [currentPath] = useLocation()

	const handleNavigate = () => setMobileMenuOpen(false)

	return (
		<header className="sticky top-0 z-50 bg-white dark:bg-[#1A1A1A] border-b border-[#EEEEEE] dark:border-[#333333]">
			<div className="max-w-7xl mx-auto px-5 lg:px-8 py-3.5">
				<div className="flex items-center justify-between gap-4">
					{/* Logo + name */}
					<BrandLogo isZh={isZh} />

					{/* Desktop nav */}
					<nav
						className="hidden lg:flex items-center gap-7"
						aria-label="Primary"
					>
						<NavLinks isZh={isZh} currentPath={currentPath} onNavigate={handleNavigate} />
					</nav>

					{/* Right side: language + CTA */}
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => setLanguage(language === 'zh-CN' ? 'en-US' : 'zh-CN')}
							className="text-sm text-[#666666] dark:text-gray-300 hover:text-[#E60012] dark:hover:text-[#E60012] px-2.5 py-1.5 rounded transition-colors"
							aria-label="Switch language"
						>
							{isZh ? 'EN' : '中文'}
						</button>

						<Link
							href="/service"
							className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-[#E60012] text-white text-sm font-medium rounded hover:bg-[#C5000F] transition-colors"
						>
							<LifeBuoy className="w-4 h-4" />
							{isZh ? '联系客服' : 'Contact Support'}
						</Link>

						<button
							type="button"
							className="lg:hidden p-2 rounded text-[#333333] dark:text-gray-200 hover:bg-[#F5F5F5] dark:hover:bg-[#333333] transition-colors"
							aria-label="Open navigation"
							aria-expanded={mobileMenuOpen}
							aria-controls="mobile-menu"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						>
							{mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
						</button>
					</div>
				</div>

				{/* Mobile nav */}
				{mobileMenuOpen && (
					<nav
						id="mobile-menu"
						aria-label="Mobile"
						className="lg:hidden pt-3 pb-1 mt-2 border-t border-[#EEEEEE] dark:border-[#333333]"
					>
						<div className="flex flex-col gap-1">
							{NAV_ITEMS.map((item) => (
								<Link
									key={item.key}
									href={item.href}
									onClick={handleNavigate}
									className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
										currentPath === item.href || currentPath.startsWith(item.href + '/')
											? 'bg-[#FEE5E5] dark:bg-[#3D1A1A] text-[#E60012] dark:text-[#E60012]'
											: 'text-[#333333] dark:text-gray-200 hover:bg-[#F5F5F5] dark:hover:bg-[#333333]'
									}`}
								>
									{isZh ? item.zh : item.en}
								</Link>
							))}
						</div>
					</nav>
				)}
			</div>
		</header>
	)
}
