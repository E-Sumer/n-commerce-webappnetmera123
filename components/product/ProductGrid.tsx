"use client";

import { useState, useMemo, useEffect } from "react";
import type { Product, ProductCategory, SortOption } from "@/types";
import ProductCard from "./ProductCard";
import { SlidersHorizontal } from "lucide-react";
import { nmCategoryView } from "@/lib/netmera-events";

interface Props {
  products: Product[];
  title: string;
  subtitle?: string;
  /** Which collection this grid is for (Netmera category_view). */
  listCategory: ProductCategory;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function ProductGrid({ products, title, subtitle, listCategory }: Props) {
  const [sort, setSort] = useState<SortOption>("featured");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (products.length === 0) return;
    Promise.resolve().then(() => {
      nmCategoryView(listCategory, title, products.length);
    });
  }, [listCategory, title, products.length]);

  const allColors = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) =>
      p.colors.forEach((c) => map.set(c.name, c.hex))
    );
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, [products]);

  const toggleColor = (name: string) => {
    setSelectedColors((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const filtered = useMemo(() => {
    let list = [...products];

    if (selectedColors.length > 0) {
      list = list.filter((p) =>
        p.colors.some((c) => selectedColors.includes(c.name))
      );
    }

    list = list.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }

    return list;
  }, [products, sort, selectedColors, priceRange]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-sage mb-2">
          {subtitle || "Collection"}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink">{title}</h1>
        <p className="text-muted text-sm mt-2">{filtered.length} styles</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="flex items-center gap-2 text-sm font-medium text-ink border border-warm rounded-full px-4 py-2 hover:bg-warm transition-colors"
        >
          <SlidersHorizontal size={14} />
          Filters
          {(selectedColors.length > 0) && (
            <span className="bg-sage text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              {selectedColors.length}
            </span>
          )}
        </button>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="text-sm text-ink bg-transparent border border-warm rounded-full px-4 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sage"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="mb-8 p-6 bg-white rounded-2xl border border-warm animate-[slideUp_0.2s_ease-out]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Color filter */}
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-3">Color</p>
              <div className="flex flex-wrap gap-2">
                {allColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => toggleColor(color.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      selectedColors.includes(color.name)
                        ? "border-ink bg-ink text-white"
                        : "border-warm hover:border-muted text-muted"
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-gray-200"
                      style={{ backgroundColor: color.hex }}
                    />
                    {color.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price filter */}
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-3">
                Price: ${priceRange[0]} – ${priceRange[1]}
              </p>
              <input
                type="range"
                min={80}
                max={200}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                className="w-full accent-sage"
              />
            </div>
          </div>

          {(selectedColors.length > 0) && (
            <button
              onClick={() => { setSelectedColors([]); }}
              className="mt-4 text-xs text-muted hover:text-ink underline transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-lg font-medium mb-2">No products match your filters.</p>
          <button
            onClick={() => { setSelectedColors([]); setPriceRange([0, 200]); }}
            className="text-sm text-sage underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
