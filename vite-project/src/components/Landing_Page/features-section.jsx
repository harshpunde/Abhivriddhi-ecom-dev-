import { Sprout, Eye, Target } from "lucide-react"

const features = [
  {
    icon: Sprout,
    title: "The Beginning",
    description:
      "Real health starts with pure, honest food grown naturally and brought straight from our farms to your kitchen.",
  },
  {
    icon: Eye,
    title: "Vision",
    description:
      "To bring pure, honest, chemical-free food to every household while preserving our farming traditions and supporting the hands that grow it.",
  },
  {
    icon: Target,
    title: "Mission",
    description:
      "To deliver pure, high-quality staples from our farms to your home with honesty, transparency, and a commitment to health and sustainability.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-[#f5f5f5]">
      <div className="max-w-[1200px] mx-auto px-6">

        <div className="grid md:grid-cols-3 gap-8">

          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#2f6f0f] hover:bg-[#27610c] transition duration-300 
              text-white rounded-2xl p-8 min-h-[240px] flex flex-col"
            >
              
              {/* Icon + Title */}
              <div className="flex items-center gap-3 mb-8 h-12">
                <feature.icon className="w-6 h-6 text-white/90" />
                <h3 className="text-xl font-semibold tracking-wide">
                  {feature.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-[15px] leading-relaxed text-white/85 font-light tracking-wide">
                {feature.description}
              </p>

            </div>
          ))}

        </div>
      </div>
    </section>
  )
}