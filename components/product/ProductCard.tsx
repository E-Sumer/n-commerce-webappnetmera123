"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/types";
import { useCartStore } from "@/lib/store";
import { resolveProductImage } from "@/lib/data/products";
import ProductImage from "./ProductImage";
// TODO(netmera): re-import trackEvent from "@/lib/netmera" when re-enabling analytics

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const [hovered, setHovered] = useState(false);
  const [activeColor, setActiveColor] = useState(0);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const currentColor = product.colors[activeColor];
  const imageUrl = resolveProductImage(product, 0);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const size = product.sizes[Math.floor(product.sizes.length / 2)];
    addItem(product, size, currentColor);
    setAdded(true);
    // TODO(netmera): trackEvent("add_to_cart", { productId, price, category, color, size, source: "quick_add" })
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container — CSS gradient, zero network cost */}
      <div className="relative aspect-square overflow-hidden rounded-2xl mb-4 transition-transform duration-300 group-hover:scale-[1.02]">
        <ProductImage
          name={product.name}
          colorHex={currentColor.hex}
          colorName={currentColor.name}
          imageUrl={imageUrl}
          variant={0}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="bg-sage text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shadow-sm">
              New
            </span>
          )}
          {product.isBestseller && !product.isNew && (
            <span className="bg-ink text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shadow-sm">
              Bestseller
            </span>
          )}
        </div>

        {/* Quick add — slides up on hover */}
        <button
          onClick={handleQuickAdd}
          className={`absolute bottom-3 left-3 right-3 z-10 flex items-center justify-center gap-2
            text-xs font-semibold tracking-widest uppercase py-2.5 rounded-xl shadow-sm
            transition-all duration-200
            ${added
              ? "bg-sage text-white opacity-100 translate-y-0"
              : hovered
              ? "bg-white/95 text-ink opacity-100 translate-y-0 hover:bg-ink hover:text-white"
              : "bg-white/95 text-ink opacity-0 translate-y-2"
            }`}
        >
          <ShoppingBag size={12} />
          {added ? "Added!" : "Quick Add"}
        </button>
      </div>

      {/* Info */}
      <div className="px-1">
        {/* Color swatches */}
        <div className="flex gap-1.5 mb-2">
          {product.colors.map((color, i) => (
            <button
              key={color.name}
              title={color.name}
              onClick={(e) => {
                e.preventDefault();
                setActiveColor(i);
              }}
              className={`w-3 h-3 rounded-full border-2 transition-all duration-150 ${
                activeColor === i
                  ? "border-ink scale-125"
                  : "border-transparent hover:scale-110"
              }`}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>

        <p className="font-semibold text-ink text-sm sm:text-base group-hover:text-sage transition-colors leading-snug">
          {product.name}
        </p>

        <p className="text-xs text-muted mt-0.5">{product.material}</p>

        <div className="flex items-center justify-between mt-2">
          <p className="font-bold text-ink">${product.price}</p>
          <div className="flex items-center gap-1">
            <Star size={10} fill="currentColor" className="text-amber-400" />
            <span className="text-[10px] font-medium text-muted">{product.rating}</span>
            <span className="text-[10px] text-gray-400">
              ({product.reviewCount.toLocaleString()})
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
