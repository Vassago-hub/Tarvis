import { Suspense, lazy, useEffect, useLayoutEffect } from 'react'
import { Route, Switch, useLocation } from 'wouter'

import Footer from './components/Footer'
import Header from './components/Header'
import HomePage from './pages/home'

const docsImport = () => import('./pages/docs')
const testPagesImport = () => import('./pages/test-pages')
const servicePageImport = () => import('./pages/service')
const productsPersonalImport = () => import('./pages/products/personal')
const productsCommercialImport = () => import('./pages/products/commercial')
const partnerImport = () => import('./pages/partner')
const aiCapabilitiesImport = () => import('./pages/ai-capabilities')
const faqImport = () => import('./pages/service/faq')
// Service sub-pages
const repairImport = () => import('./pages/service/repair')
const troubleshootingHubImport = () => import('./pages/service/troubleshooting')
const warrantyImport = () => import('./pages/service/warranty')
const complaintImport = () => import('./pages/service/complaint')
const contactImport = () => import('./pages/service/contact')
// Troubleshooting per-category
const troubleshootTvImport = () => import('./pages/service/troubleshooting/tv')
const troubleshootAcImport = () => import('./pages/service/troubleshooting/ac')
const troubleshootFridgeImport = () => import('./pages/service/troubleshooting/fridge')
const troubleshootWasherImport = () => import('./pages/service/troubleshooting/washer')
const troubleshootLockImport = () => import('./pages/service/troubleshooting/lock')
// Product detail pages
const productDetailTvImport = () => import('./pages/products/detail/tv')
const productDetailAcImport = () => import('./pages/products/detail/ac')
const productDetailFridgeImport = () => import('./pages/products/detail/fridge')
const productDetailWasherImport = () => import('./pages/products/detail/washer')
const productDetailLockImport = () => import('./pages/products/detail/lock')
const productDetailCommercialDisplayImport = () =>
	import('./pages/products/detail/commercial-display')
const productDetailCommercialHvacImport = () =>
	import('./pages/products/detail/commercial-hvac')
const productDetailCommercialEngineeringImport = () =>
	import('./pages/products/detail/commercial-engineering')
const productDetailCommercialSolarImport = () =>
	import('./pages/products/detail/commercial-solar')
const productDetailCommercialCentralAcImport = () =>
	import('./pages/products/detail/commercial-central-ac')
// Partner sub-pages
const partnerRetailImport = () => import('./pages/partner/retail')
const partnerEngineeringImport = () => import('./pages/partner/engineering')
const partnerSolarImport = () => import('./pages/partner/solar')
const partnerGovImport = () => import('./pages/partner/government')

const DocsPages = lazy(docsImport)
const TestPages = lazy(testPagesImport)
const ServicePage = lazy(servicePageImport)
const ProductsPersonalPage = lazy(productsPersonalImport)
const ProductsCommercialPage = lazy(productsCommercialImport)
const PartnerPage = lazy(partnerImport)
const AiCapabilitiesPage = lazy(aiCapabilitiesImport)
const FaqPage = lazy(faqImport)
const RepairPage = lazy(repairImport)
const TroubleshootingHubPage = lazy(troubleshootingHubImport)
const WarrantyPage = lazy(warrantyImport)
const ComplaintPage = lazy(complaintImport)
const ContactPage = lazy(contactImport)
const TroubleshootTvPage = lazy(troubleshootTvImport)
const TroubleshootAcPage = lazy(troubleshootAcImport)
const TroubleshootFridgePage = lazy(troubleshootFridgeImport)
const TroubleshootWasherPage = lazy(troubleshootWasherImport)
const TroubleshootLockPage = lazy(troubleshootLockImport)
const ProductDetailTvPage = lazy(productDetailTvImport)
const ProductDetailAcPage = lazy(productDetailAcImport)
const ProductDetailFridgePage = lazy(productDetailFridgeImport)
const ProductDetailWasherPage = lazy(productDetailWasherImport)
const ProductDetailLockPage = lazy(productDetailLockImport)
const ProductDetailCommercialDisplayPage = lazy(productDetailCommercialDisplayImport)
const ProductDetailCommercialHvacPage = lazy(productDetailCommercialHvacImport)
const ProductDetailCommercialEngineeringPage = lazy(productDetailCommercialEngineeringImport)
const ProductDetailCommercialSolarPage = lazy(productDetailCommercialSolarImport)
const ProductDetailCommercialCentralAcPage = lazy(productDetailCommercialCentralAcImport)
const PartnerRetailPage = lazy(partnerRetailImport)
const PartnerEngineeringPage = lazy(partnerEngineeringImport)
const PartnerSolarPage = lazy(partnerSolarImport)
const PartnerGovPage = lazy(partnerGovImport)

function ScrollToTop() {
	const [pathname] = useLocation()
	useLayoutEffect(() => {
		window.scrollTo(0, 0)
	}, [pathname])
	return null
}

function PageShell({ children }: { children: React.ReactNode }) {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center py-24">
					<div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
				</div>
			}
		>
			<ScrollToTop />
			{children}
		</Suspense>
	)
}

function NotFoundPage() {
	return (
		<div className="flex-1 bg-white dark:bg-gray-900 flex items-center justify-center py-24">
			<div className="text-center">
				<h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">404</h1>
				<p className="text-xl text-gray-600 dark:text-gray-300 mb-6">页面未找到</p>
				<a
					href="/page-agent/"
					className="inline-block px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
				>
					返回首页
				</a>
			</div>
		</div>
	)
}

export default function Router() {
	useEffect(() => {
		if ('requestIdleCallback' in globalThis) {
			const id = requestIdleCallback(() => docsImport())
			return () => cancelIdleCallback(id)
		}
		const id = setTimeout(() => docsImport(), 1)
		return () => clearTimeout(id)
	}, [])

	return (
		<div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
			<Header />
			<main id="main-content" className="flex-1">
				<Switch>
					<Route path="/">
						<PageShell>
							<HomePage />
						</PageShell>
					</Route>

					<Route path="/products/personal">
						<PageShell>
							<ProductsPersonalPage />
						</PageShell>
					</Route>

					<Route path="/products/commercial">
						<PageShell>
							<ProductsCommercialPage />
						</PageShell>
					</Route>

					<Route path="/service">
						<PageShell>
							<ServicePage />
						</PageShell>
					</Route>

					<Route path="/service/faq">
						<PageShell>
							<FaqPage />
						</PageShell>
					</Route>
					<Route path="/service/repair">
						<PageShell>
							<RepairPage />
						</PageShell>
					</Route>
					<Route path="/service/troubleshooting">
						<PageShell>
							<TroubleshootingHubPage />
						</PageShell>
					</Route>
					<Route path="/service/troubleshooting/tv">
						<PageShell>
							<TroubleshootTvPage />
						</PageShell>
					</Route>
					<Route path="/service/troubleshooting/ac">
						<PageShell>
							<TroubleshootAcPage />
						</PageShell>
					</Route>
					<Route path="/service/troubleshooting/fridge">
						<PageShell>
							<TroubleshootFridgePage />
						</PageShell>
					</Route>
					<Route path="/service/troubleshooting/washer">
						<PageShell>
							<TroubleshootWasherPage />
						</PageShell>
					</Route>
					<Route path="/service/troubleshooting/lock">
						<PageShell>
							<TroubleshootLockPage />
						</PageShell>
					</Route>
					<Route path="/service/warranty">
						<PageShell>
							<WarrantyPage />
						</PageShell>
					</Route>
					<Route path="/service/complaint">
						<PageShell>
							<ComplaintPage />
						</PageShell>
					</Route>
					<Route path="/service/contact">
						<PageShell>
							<ContactPage />
						</PageShell>
					</Route>

					<Route path="/products/detail/tv">
						<PageShell>
							<ProductDetailTvPage />
						</PageShell>
					</Route>
					<Route path="/products/detail/ac">
						<PageShell>
							<ProductDetailAcPage />
						</PageShell>
					</Route>
					<Route path="/products/detail/fridge">
						<PageShell>
							<ProductDetailFridgePage />
						</PageShell>
					</Route>
					<Route path="/products/detail/washer">
						<PageShell>
							<ProductDetailWasherPage />
						</PageShell>
					</Route>
					<Route path="/products/detail/lock">
						<PageShell>
							<ProductDetailLockPage />
						</PageShell>
					</Route>
					<Route path="/products/detail/commercial-display">
						<PageShell>
							<ProductDetailCommercialDisplayPage />
						</PageShell>
					</Route>
					<Route path="/products/detail/commercial-hvac">
						<PageShell>
							<ProductDetailCommercialHvacPage />
						</PageShell>
					</Route>
					<Route path="/products/detail/commercial-engineering">
						<PageShell>
							<ProductDetailCommercialEngineeringPage />
						</PageShell>
					</Route>
					<Route path="/products/detail/commercial-solar">
						<PageShell>
							<ProductDetailCommercialSolarPage />
						</PageShell>
					</Route>
					<Route path="/products/detail/commercial-central-ac">
						<PageShell>
							<ProductDetailCommercialCentralAcPage />
						</PageShell>
					</Route>

					<Route path="/partner">
						<PageShell>
							<PartnerPage />
						</PageShell>
					</Route>
					<Route path="/partner/retail">
						<PageShell>
							<PartnerRetailPage />
						</PageShell>
					</Route>
					<Route path="/partner/engineering">
						<PageShell>
							<PartnerEngineeringPage />
						</PageShell>
					</Route>
					<Route path="/partner/solar">
						<PageShell>
							<PartnerSolarPage />
						</PageShell>
					</Route>
					<Route path="/partner/government">
						<PageShell>
							<PartnerGovPage />
						</PageShell>
					</Route>

					<Route path="/ai-capabilities">
						<PageShell>
							<AiCapabilitiesPage />
						</PageShell>
					</Route>

					<Route path="/docs" nest>
						<PageShell>
							<DocsPages />
						</PageShell>
					</Route>

					<Route path="/test-pages" nest>
						<PageShell>
							<TestPages />
						</PageShell>
					</Route>

					<Route>
						<NotFoundPage />
					</Route>
				</Switch>
			</main>
			<Footer />
		</div>
	)
}
