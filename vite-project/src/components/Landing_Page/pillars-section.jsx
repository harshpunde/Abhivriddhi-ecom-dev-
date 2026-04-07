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
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1a3d0c] mb-12">
          Meet Our Pillars
        </h2>

        {/* Satendra Singh - Farmer */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left - Content */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-[#1a3d0c] mb-2">
                Satendra Singh,{" "}
                <span className="font-normal text-gray-600">
                  a dedicated farmer from Satna, is the driving force behind Abhivriddhi Organics.
                </span>
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                With years spent working closely with the land, his belief is simple: real food
                doesn't need to be engineered, it needs to be respected.
              </p>

              <h4 className="text-lg font-semibold text-[#4a7c23] mb-4">His Words</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {satendraQuotes.map((quote, index) => (
                  <Card key={index} className="bg-[#4a7c23] border-0">
                    <CardContent className="p-4">
                      <p className="text-white text-sm leading-relaxed">{`"${quote}"`}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right - Image */}
            <div className="flex flex-col items-center md:items-end">
              <div className="relative w-64 h-80 md:w-72 md:h-96 rounded-lg overflow-hidden">
                <img
                  src="/images/satendra-singh.jpg"
                  alt="Mr. Satendra Singh - Farmer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center mt-4">
                <h4 className="text-xl font-bold text-[#1a3d0c]">Mr. Satendra Singh</h4>
                <p className="text-gray-600">Farmer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Meena Singh - Housewife */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a3d0c] mb-8">
            Meet Our Pillars
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left - Image */}
            <div className="flex flex-col items-center md:items-start order-2 md:order-1">
              <div className="relative w-64 h-80 md:w-72 md:h-96 rounded-lg overflow-hidden">
                <img
                  src="/images/meena-singh.jpg"
                  alt="Mrs. Meena Singh - Housewife"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center mt-4">
                <h4 className="text-xl font-bold text-[#1a3d0c]">Mrs. Meena Singh</h4>
                <p className="text-gray-600">Housewife</p>
              </div>
            </div>

            {/* Right - Content */}
            <div className="order-1 md:order-2">
              <h3 className="text-xl md:text-2xl font-bold text-[#1a3d0c] mb-2">
                Meena Singh,{" "}
                <span className="font-normal text-gray-600">
                  the backbone of Abhivriddhi Organics, represents the heart of every Indian household.
                </span>
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                As a homemaker and a mother, she understands that food is not just about taste,
                it's about the health, care, and well-being of the entire family.
              </p>

              <h4 className="text-lg font-semibold text-[#4a7c23] mb-4">Her Words</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {meenaQuotes.map((quote, index) => (
                  <Card key={index} className="bg-[#4a7c23] border-0">
                    <CardContent className="p-4">
                      <p className="text-white text-sm leading-relaxed">{`"${quote}"`}</p>
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
