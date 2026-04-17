import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    label: "Women",
    href: "/products/women",
    bg: "from-[#E8C4BA] to-[#D4A8A0]",
    image:
      "https://www.allbirds.com/cdn/shop/files/A12468_26Q2_Breezer-Point-Burlwood-Dark-Cocoa-Sole_PDP_LEFT.png?v=1774475526&width=1280",
    text: "Shop the Collection",
    count: "24 styles",
    emoji: "👠",
  },
  {
    label: "Men",
    href: "/products/men",
    bg: "from-[#A8B8C8] to-[#8A9EAE]",
    image:
      "https://www.allbirds.com/cdn/shop/files/A12270_26Q1_Mens-Varsity-Parchment-Blizzard-Sole_PDP_LEFT.png?v=1765307399&width=1280",
    text: "Explore Men's",
    count: "18 styles",
    emoji: "👞",
  },
  {
    label: "New Arrivals",
    href: "/products/new-arrivals",
    bg: "from-[#8FAF8E] to-[#5C7A5F]",
    image:
      "https://www.allbirds.com/cdn/shop/files/A11645_25Q4_Wool-Cruiser-Mid-Select-Deep-Navy-Gum-Sole_PDP_LEFT_c9e6c446-9edf-4fe5-9453-725eff5326f8.png?v=1761691426&width=1280",
    text: "See What's New",
    count: "4 new styles",
    emoji: "✨",
    badge: "New",
  },
];

export default function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="mb-12 text-center">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-sage mb-3">
          Collections
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-ink">Shop by Style</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className="group relative overflow-hidden rounded-3xl aspect-[4/5] flex flex-col justify-end p-7 cursor-pointer"
          >
            {/* Background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${cat.bg} transition-transform duration-500 group-hover:scale-105`}
            />

            {/* Emoji decoration */}
            <div className="absolute top-8 right-8 text-5xl opacity-40 group-hover:opacity-70 group-hover:scale-110 transition-all duration-300">
              {cat.emoji}
            </div>

            {/* New badge */}
            {cat.badge && (
              <div className="absolute top-6 left-6 bg-white text-ink text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                {cat.badge}
              </div>
            )}

            {/* Text content */}
            <div className="relative z-10">
              <p className="text-white/80 text-xs font-medium tracking-widest uppercase mb-1">
                {cat.count}
              </p>
              <h3 className="text-white text-3xl font-bold mb-3">{cat.label}</h3>
              <div className="inline-flex items-center gap-1.5 text-white text-sm font-semibold group-hover:gap-3 transition-all duration-200">
                {cat.text}
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Overlay on hover */}
            <div
              className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 bg-contain bg-no-repeat bg-center opacity-35 group-hover:opacity-50"
              style={{ backgroundImage: `url('${cat.image}')` }}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
