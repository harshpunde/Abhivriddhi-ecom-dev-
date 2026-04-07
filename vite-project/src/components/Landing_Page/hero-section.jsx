import { Button } from "../ui/button.jsx"

export function HeroSection() {
  return (
    <section className="relative h-[85vh] min-h-[500px] overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-farmer.jpg"
          alt="Farmer in wheat field"
          className="w-full h-full object-cover object-center"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/10" />
      </div>

      {/* Centered Content */}
      <div className="relative max-w-[1600px] mx-auto px-6 h-full flex items-center justify-center text-center">
        
        <div className="max-w-xl">

          {/* Tagline */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4 leading-tight">
            <span className="text-white/80">“</span>
            शुद्धता सत्यता सनातनता
            <span className="text-white/80">”</span>
          </h1>

          {/* Description */}
          <p className="text-white/90 text-sm md:text-base mb-6 leading-relaxed">
            Abhivriddhi Organics, rooted in Jabalpur, crafts pure, chemical-free flours 
            inspired by India’s timeless food wisdom.
          </p>

          {/* Button */}
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-6 py-2 rounded-md shadow-md transition">
            Shop now
          </Button>

        </div>
      </div>
    </section>
  )
}