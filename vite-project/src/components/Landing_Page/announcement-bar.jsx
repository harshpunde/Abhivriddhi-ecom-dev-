export function AnnouncementBar() {
  const benefits = [
    "100% Organic",
    "Gluten Free",
    "15% Discount on first purchase",
    "Chemical Free",
    "No Sugar Added",
  ]

  return (
    <div className="bg-[#4a7c23] text-white py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-6 md:gap-12 text-xs md:text-sm font-medium flex-wrap">
          {benefits.map((benefit, index) => (
            <span key={index} className="whitespace-nowrap">
              {benefit}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
