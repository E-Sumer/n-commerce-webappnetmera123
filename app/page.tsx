// Server component — no client JS, renders immediately
import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";

const commitments = [
  { icon: "🌿", label: "Natural materials" },
  { icon: "♻️", label: "Recyclable packaging" },
  { icon: "🌍", label: "Carbon neutral shipping" },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />

      {/* Mission strip */}
      <section className="bg-sage text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-white/60 mb-4">
            Our Commitment
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-5">Every step counts.</h2>
          <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
            We use ZQ Merino Wool, Eucalyptus Tree Fibre, and sugarcane-based SweetFoam® —
            because the Earth deserves better materials.
          </p>
          <div className="flex justify-center gap-10 mt-10 pt-10 border-t border-white/20">
            {commitments.map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="text-sm text-white/80 font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
