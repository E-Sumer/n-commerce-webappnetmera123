// Server component — data comes from in-memory mock, no hooks needed
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedProducts } from "@/lib/data/products";
import ProductCard from "@/components/product/ProductCard";

export default function FeaturedProducts() {
  const products = getFeaturedProducts();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-sage mb-3">
            Customer Favourites
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink">Bestsellers</h2>
        </div>
        <Link
          href="/products/women"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink transition-colors group"
        >
          View all
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-10 flex justify-center sm:hidden">
        <Link
          href="/products/women"
          className="inline-flex items-center gap-2 text-sm font-semibold text-ink border border-ink/20 px-6 py-3 rounded-full hover:bg-ink hover:text-white transition-all"
        >
          View all styles <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
