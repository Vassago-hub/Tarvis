import CapabilitiesSection, { IntentsSection } from './CapabilitiesSection'
import HeroSection from './HeroSection'
import HowItWorksSection from './HowItWorksSection'

import AiAssistantButton from '@/components/AiAssistantButton'

export default function HomePage() {
	return (
		<main>
			<HeroSection />
			<CapabilitiesSection />
			<HowItWorksSection />
			<IntentsSection />
			<AiAssistantButton showOnPages={['/', '/service', '/products', '/partner']} />
		</main>
	)
}
