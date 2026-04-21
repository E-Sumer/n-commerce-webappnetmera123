// Server component — no tracking, no client bundle
import { getProductsByCategory } from "@/lib/data/products";
import ProductGrid from "@/components/product/ProductGrid";

export default function WomenPage() {
  const products = getProductsByCategory("women");
  return (
    <ProductGrid
      products={products}
      title="Women's Shoes"
      subtitle="Women"
      listCategory="women"
    />
  );
}
