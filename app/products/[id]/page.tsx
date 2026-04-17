"use client";

// Stays "use client": size picker, color picker, add-to-cart — all need state.
// trackEvent removed — re-add when Netmera is re-enabled.

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { Star, Truck, RotateCcw, Shield, ChevronLeft } from "lucide-react";
import { getProductById, getRelatedProducts, resolveProductImage } from "@/lib/data/products";
import { useCartStore } from "@/lib/store";
import type { ProductColor } from "@/types";
import ProductCard from "@/components/product/ProductCard";
import ProductImage from "@/components/product/ProductImage";
import Button from "@/components/ui/Button";

export default function ProductDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const product = getProductById(id);

  // Initialise state directly — getProductById is synchronous in-memory
  const [activeVariant, setActiveVariant] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(
    product?.colors[0] ?? null
  );
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  const addItem = useCartStore((s) => s.addItem);

  if (!product) return notFound();

  const related = getRelatedProducts(product);
  const activeColor = selectedColor ?? product.colors[0];
  const VARIANTS = product.images.length;

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    setAdding(true);
    addItem(product, selectedSize, activeColor);
    // TODO(netmera): trackEvent("add_to_cart", { productId, size, color, price })
    setTimeout(() => {
      setAdding(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <Link
        href={`/products/${product.category}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-8"
      >
        <ChevronLeft size={14} />
        Back to{" "}
        {product.category === "new-arrivals"
          ? "New Arrivals"
          : product.category === "women"
          ? "Women"
          : "Men"}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* ── Image Gallery ───────────────────────────── */}
        <div className="flex gap-4">
          {/* Thumbnail strip */}
          <div className="hidden sm:flex flex-col gap-3 w-16 flex-shrink-0">
            {Array.from({ length: VARIANTS }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveVariant(i)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  activeVariant === i
                    ? "border-ink"
                    : "border-transparent opacity-50 hover:opacity-80"
                }`}
              >
                <ProductImage
                  name={product.name}
                  colorHex={activeColor.hex}
                  colorName={activeColor.name}
                  imageUrl={resolveProductImage(product, i)}
                  variant={i}
                />
              </button>
            ))}
          </div>

          {/* Main image */}
          <div className="relative flex-1 aspect-square rounded-3xl overflow-hidden">
            <ProductImage
              name={product.name}
              colorHex={activeColor.hex}
              colorName={activeColor.name}
              imageUrl={resolveProductImage(product, activeVariant)}
              variant={activeVariant}
              loading="eager"
              fetchPriority="high"
              className="transition-all duration-300"
            />
            {product.isNew && (
              <div className="absolute top-5 left-5 bg-sage text-white text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full shadow-md z-10">
                New
              </div>
            )}
          </div>
        </div>

        {/* ── Product Info ─────────────────────────────── */}
        <div className="flex flex-col">
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-sage mb-2">
              {product.material}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < Math.round(product.rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-200 fill-gray-200"
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-ink">{product.rating}</span>
              <span className="text-sm text-muted">
                ({product.reviewCount.toLocaleString()} reviews)
              </span>
            </div>

            <p className="text-3xl font-bold text-ink">${product.price}</p>
            {product.originalPrice && (
              <p className="text-sm text-muted line-through mt-1">${product.originalPrice}</p>
            )}
          </div>

          <p className="text-muted leading-relaxed mb-8">{product.description}</p>

          {/* Color selection */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-ink mb-3">
              Color:{" "}
              <span className="font-normal text-muted normal-case tracking-normal">
                {activeColor.name}
              </span>
            </p>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  title={color.name}
                  onClick={() => {
                    setSelectedColor(color);
                    setActiveVariant(0);
                  }}
                  className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                    activeColor.name === color.name
                      ? "border-ink scale-110 shadow-md"
                      : "border-gray-200"
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>

          {/* Size selection */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <p
                className={`text-xs font-semibold tracking-widest uppercase ${
                  sizeError ? "text-red-500" : "text-ink"
                }`}
              >
                {sizeError ? "Please select a size" : "Select Size"}
              </p>
              <button className="text-xs text-sage underline hover:text-sage-dark transition-colors">
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSize(size);
                    setSizeError(false);
                  }}
                  className={`w-12 h-12 rounded-xl text-sm font-medium border transition-all hover:border-ink ${
                    selectedSize === size
                      ? "border-ink bg-ink text-white"
                      : sizeError
                      ? "border-red-300 text-muted"
                      : "border-warm text-muted hover:text-ink"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <Button
            variant={added ? "secondary" : "primary"}
            size="lg"
            fullWidth
            loading={adding}
            onClick={handleAddToCart}
            className="mb-4"
          >
            {added ? "✓ Added to Cart!" : "Add to Cart"}
          </Button>

          <Link
            href="/cart"
            className="text-center text-sm text-sage hover:text-sage-dark underline transition-colors mb-8"
          >
            View Cart
          </Link>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-warm">
            {[
              { icon: <Truck size={18} />, label: "Free shipping", sub: "Orders over $100" },
              { icon: <RotateCcw size={18} />, label: "Free returns", sub: "30-day window" },
              { icon: <Shield size={18} />, label: "1-year warranty", sub: "On all styles" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="flex justify-center text-sage mb-1.5">{item.icon}</div>
                <p className="text-xs font-semibold text-ink">{item.label}</p>
                <p className="text-[10px] text-muted mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-ink mb-8">You might also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
