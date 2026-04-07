import { Link } from "react-router-dom"
import { Globe, Mail } from "lucide-react"

const footerLinks = [
  { label: "Products", href: "/products" },
  { label: "Contact Us", href: "/contact" },
  { label: "Categories", href: "/categories" },
  { label: "Blogs", href: "/blogs" },
]

const bottomLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Shipping", href: "/shipping" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Cancellation & Return Policy", href: "/returns" },
]

export function Footer() {
  return (
    <footer className="bg-[#1a3d0c] text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left - Logo and Address */}
          <div>
            <div className="mb-4">
              <span className="text-2xl font-bold">अभिवृद्धि</span>
              <br />
              <span className="text-lg">Organics</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed max-w-md mb-6">
              Abhivriddhi Organics, Post Mauhar, Near Society Office/ Near
              Panchayat Office, Tikaitan Tola, Kothi, Didaundh Satna Madhya
              Pradesh, 485666
            </p>
            <div className="flex items-center gap-4">
              <a
                href="mailto:info@abhivriddhi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/80 transition-colors"
                aria-label="Email us"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="https://abhivriddhi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/80 transition-colors"
                aria-label="Visit our website"
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right - Links */}
          <div className="md:text-right">
            <nav className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <nav className="flex flex-wrap items-center gap-4 md:gap-6">
              {bottomLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-white/60 hover:text-white transition-colors text-xs"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <p className="text-white/60 text-xs">
              Team Abhivriddhi Organics
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
