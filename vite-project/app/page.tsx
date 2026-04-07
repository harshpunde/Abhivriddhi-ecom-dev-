import { AnnouncementBar } from "@/components/announcement-bar"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { ProductsSection } from "@/components/products-section"
import { PillarsSection } from "@/components/pillars-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <ProductsSection />
      <PillarsSection />
      <Footer />
    </main>
  )
}
