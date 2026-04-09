import { HeroSection } from "./hero-section.jsx"
import { FeaturesSection } from "./features-section.jsx"
import { PillarsSection } from "./pillars-section.jsx"
import { ProductsSection } from "./products-section.jsx"

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ProductsSection />
      <PillarsSection />
    </>
  )
}

export default LandingPage

