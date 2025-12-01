import { CtaSection } from '../components/cta-section'
import { FeaturesSection } from '../components/features-section'
import { HeroSection } from '../components/hero-section'

export function HomeContainer() {
	return (
		<main>
			<HeroSection />
			<FeaturesSection />
			<CtaSection />
		</main>
	)
}

