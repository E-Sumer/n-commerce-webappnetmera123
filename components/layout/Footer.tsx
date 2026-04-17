// Server component — all static links, newsletter form extracted to client child
import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

const footerLinks = {
  Shop: [
    { label: "Women", href: "/products/women" },
    { label: "Men", href: "/products/men" },
    { label: "New Arrivals", href: "/products/new-arrivals" },
    { label: "Bestsellers", href: "/products/women" },
  ],
  Company: [
    { label: "Our Mission", href: "#" },
    { label: "Materials", href: "#" },
    { label: "Carbon Footprint", href: "#" },
    { label: "Careers", href: "#" },
  ],
  Support: [
    { label: "FAQ", href: "#" },
    { label: "Shipping & Returns", href: "#" },
    { label: "Size Guide", href: "#" },
    { label: "Contact Us", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-ink text-white mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <p className="text-2xl font-bold tracking-[0.15em] mb-4">N·WALKS</p>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Walk lightly on the Earth. Every pair made with naturally sourced,
              sustainably crafted materials.
            </p>
            <p className="mt-4 text-xs text-gray-500">www.n-walks.com</p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-10 mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="font-medium mb-1">Join the journey.</p>
              <p className="text-sm text-gray-400">
                Sustainable steps, delivered to your inbox.
              </p>
            </div>
            {/* Only this piece is a client component */}
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} N·Walks. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">
              Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
