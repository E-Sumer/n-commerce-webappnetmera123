// Server component — pure CSS animation, zero JS overhead
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const stats = [
  { value: "50K+", label: "Happy walkers" },
  { value: "100%", label: "Natural materials" },
  { value: "2x", label: "Carbon negative" },
];

const tags = ["ZQ Merino Wool", "SweetFoam® Sole", "Natural Dyes"];

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F0EDE7] via-[#E8E4DC] to-[#D4C5AD]/60 -z-10" />

      {/* Decorative circles */}
      <div className="absolute top-20 right-[10%] w-72 h-72 rounded-full bg-sage/5 -z-10" />
      <div className="absolute bottom-20 left-[5%] w-48 h-48 rounded-full bg-sand/40 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text — CSS fade-in, no JS needed */}
          <div className="animate-[fadeIn_0.6s_ease-out_both]">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-sage mb-6">
              Spring / Summer 2025
            </p>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-ink leading-[1.05] mb-6">
              Walk on Earth
              <br />
              <span className="text-sage">Lightly.</span>
            </h1>

            <p className="text-lg text-muted leading-relaxed mb-10 max-w-md">
              Shoes crafted from naturally sourced wool, tree fibre, and sugarcane — so
              soft you&apos;ll forget you&apos;re wearing them.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/products/women"
                className="group inline-flex items-center gap-2 bg-ink text-white text-sm font-semibold tracking-widest uppercase px-7 py-3.5 rounded-full hover:bg-charcoal transition-all duration-200 active:scale-[0.98]"
              >
                Shop Women
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>

              <Link
                href="/products/men"
                className="group inline-flex items-center gap-2 border border-ink text-ink text-sm font-semibold tracking-widest uppercase px-7 py-3.5 rounded-full hover:bg-ink hover:text-white transition-all duration-200 active:scale-[0.98]"
              >
                Shop Men
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-10 mt-14 pt-10 border-t border-ink/10">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-ink">{stat.value}</p>
                  <p className="text-xs text-muted tracking-wide mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image — CSS slide-in, no JS needed */}
          <div className="animate-[slideIn_0.7s_ease-out_0.15s_both]">
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Main card */}
              <div className="w-full h-full rounded-3xl overflow-hidden relative">
                <img
                  src="https://www.allbirds.com/cdn/shop/files/26Q2_CanvasCruiser_Pantone_Site_Homepage_Hero_Desktop_16x9_M.png?v=1776118084&width=2560"
                  alt="N·Walks regenerative collection hero"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-12">
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="relative">
                    <div className="w-52 h-36 rounded-2xl bg-white/85 shadow-xl flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-xs font-medium text-muted tracking-wide">
                          Regenerative Collection
                        </p>
                        <p className="text-sm font-bold text-ink mt-1">Shop the New Drop</p>
                      </div>
                    </div>
                    <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-sage text-white text-xs font-bold flex items-center justify-center shadow-lg">
                      NEW
                    </div>
                  </div>

                  <div className="relative flex gap-3 flex-wrap justify-center">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium tracking-wide bg-white/85 text-ink px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badge — bottom-left */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 min-w-[140px]">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-muted mb-1">
                  Materials
                </p>
                <p className="text-sm font-bold text-ink">100% Natural</p>
                <div className="flex gap-1 mt-2">
                  {["#8FAF8E", "#D4C5AD", "#9B9B9B", "#2C2C2C"].map((c) => (
                    <span
                      key={c}
                      className="w-4 h-4 rounded-full border border-white shadow-sm"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Rating badge — top-right */}
              <div className="absolute -top-4 -right-4 bg-sage text-white rounded-2xl shadow-xl p-4">
                <p className="text-xl font-bold">4.9 ★</p>
                <p className="text-[10px] tracking-wide mt-0.5">2,341 reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 pointer-events-none">
        <p className="text-[10px] tracking-[0.3em] uppercase text-muted">Scroll</p>
        <div className="w-px h-12 bg-muted" />
      </div>
    </section>
  );
}
