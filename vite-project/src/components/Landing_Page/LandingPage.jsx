import Navbar from "./navbar.jsx"
import { HeroSection } from "./hero-section.jsx"
import { FeaturesSection } from "./features-section.jsx"
import { PillarsSection } from "./pillars-section.jsx"
import { ProductsSection } from "./products-section.jsx"
import { Footer } from "./footer.jsx"

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <ProductsSection />
        <PillarsSection />
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage
