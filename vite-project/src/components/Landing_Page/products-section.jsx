import { Link } from "react-router-dom"
import { Button } from "../ui/button.jsx"
import { Card, CardContent } from "../ui/card.jsx"

const products = [
  {
    id: 1,
    name: "Jowar Atta",
    description:
      "Light, gluten-free, and rooted in tradition just the way your body understands nourishment.",
    price: 275,
    image: "/images/jowar-atta.jpg",
  },
  {
    id: 2,
    name: "Ragi Atta",
    description:
      "Built on strength and simplicity, ragi delivers natural calcium and everyday nourishment.",
    price: 275,
    image: "/images/ragi-atta.jpg",
  },
  {
    id: 3,
    name: "Wheat Atta",
    description:
      "Built on strength and simplicity, wheat delivers natural calcium and everyday nourishment.",
    price: 275,
    image: "/images/wheat-atta.jpg",
  },
  {
    id: 4,
    name: "Multigrain Atta",
    description:
      "Built on strength and simplicity, multigrain delivers natural calcium and everyday nourishment.",
    price: 275,
    image: "/images/multigrain-atta.jpg",
  },
]

export function ProductsSection() {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a3d0c]">
            Our Products
          </h2>
          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-full bg-[#4a7c23] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#3d6a1c]"
          >
            View All Products
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <Card key={product.id} className="bg-white border-0 shadow-sm overflow-hidden">
              <CardContent className="p-4">
                {/* Product Image */}
                <div className="aspect-square relative mb-4 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <h3 className="text-base md:text-lg font-semibold text-[#4a7c23] mb-2">
                  {product.name}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
                <p className="text-sm md:text-base font-bold text-[#1a3d0c] mb-3">
                  Price: ₹{product.price}/-
                </p>

                {/* Add to Cart Button */}
                <Button 
                  className="w-full bg-[#4a7c23] hover:bg-[#3d6a1c] text-white text-sm"
                  size="sm"
                >
                  Add to cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
