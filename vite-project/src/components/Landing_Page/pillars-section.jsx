import { Card, CardContent } from "../ui/card.jsx"

const satendraQuotes = [
  "Hamare aate ka har dana shuddh hai bilkul waise hi jaise pahle gharon mein peesa jaata tha.",
  "Hamare products mein koi milavat nahi sirf wahi jo zameen se aata hai, seedha aapke ghar tak.",
  "Yeh sirf atta nahi, yai ke khane ka sehat aur sachhai se pehle ka ek tareeka hai.",
  "Yeh wahi anaaj hai jo hamari paramparaon ka hissa tha aur ab jo se aapki rasoi mein.",
]

const meenaQuotes = [
  "Ghar ka khana banana sirf zimmedari nahi, parivaar ki sehat ki zimmedari hoti hai.",
  "Bahar se sab kuch aasf dikhta hai, par asli cheez hoti hai andar kya jaa raha hai.",
  "Maa hone ke naate, har roti mein sirf swad nahi, parivaar ki sehat bhi hoti hai.",
  "Isliye humne faislaa kiya jo hum apne ghar ke liye choose kare, wahi sabke liye banayenge.",
]

export function PillarsSection() {
  return (
    <section className="py-12 md:py-16 pb-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-[#000000] mb-12 font-bakbak">
          Meet Our Pillars
        </h2>

        {/* Satendra Singh - Farmer */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left - Content */}
            <div>
              <div className="mb-6">
                <h3 className="text-2xl md:text-3xl font-bold text-[#1a3d0c] mb-1">
                  Mr. Satendra Singh
                </h3>
                <p className="text-gray-500 font-medium tracking-wide">Farmer</p>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Satendra Singh, a dedicated farmer from Satna, is the driving force behind Abhivriddhi Organics.
              </p>

              <h4 className="text-lg font-semibold text-[#4a7c23] mb-4">His Words</h4>
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                {satendraQuotes.map((quote, index) => (
                  <Card key={index} className="bg-[#4a7c23] border-0">
                    <CardContent className="p-3 sm:p-4">
                      <p className="text-white text-[11px] sm:text-sm leading-relaxed font-league-spartan font-semibold">{`"${quote}"`}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right - Image */}
            <div className="flex flex-col items-center md:ml-20">
              <div className="relative w-full max-w-[450px] rounded-2xl">
                <img
                  src="/images/satendra-singh.jpg"
                  alt="Mr. Satendra Singh - Farmer"
                  className="w-full h-auto transform hover:scale-105 transition duration-500"
                />
              </div>
              {/* <div className="text-center mt-6">
                <h4 className="text-2xl font-bold text-[#1a3d0c]">Mr. Satendra Singh</h4>
                <p className="text-gray-600 font-medium tracking-wide">Farmer</p>
              </div> */}
            </div>
          </div>
        </div>

        {/* Meena Singh - Housewife */}
        <div className="mt-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Image */}
            <div className="flex flex-col items-center order-2 md:order-1 md:mr-20">
              <div className="relative w-full max-w-[450px] rounded-2xl">
                <img
                  src="/images/meena-singh.jpg"
                  alt="Mrs. Meena Singh - Housewife"
                  className="w-full h-auto transform hover:scale-105 transition duration-500"
                />
              </div>
              {/* <div className="text-center mt-6">
                <h4 className="text-2xl font-bold text-[#1a3d0c]">Mrs. Meena Singh</h4>
                <p className="text-gray-600 font-medium tracking-wide">Housewife</p>
              </div> */}
            </div>

            {/* Right - Content */}
            <div className="order-1 md:order-2">
              <div className="mb-6">
                <h3 className="text-2xl md:text-3xl font-bold text-[#1a3d0c] mb-1">
                  Mrs. Meena Singh
                </h3>
                <p className="text-gray-500 font-medium tracking-wide">Housewife & Backbone</p>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                As a homemaker and a mother, she understands that food is not just about taste,
                it's about the health, care, and well-being of the entire family.
              </p>

              <h4 className="text-lg font-semibold text-[#4a7c23] mb-4">Her Words</h4>
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                {meenaQuotes.map((quote, index) => (
                  <Card key={index} className="bg-[#4a7c23] border-0">
                    <CardContent className="p-3 sm:p-4">
                      <p className="text-white text-[11px] sm:text-sm leading-relaxed font-league-spartan font-semibold">{`"${quote}"`}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
