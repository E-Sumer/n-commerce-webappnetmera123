// Server component — no tracking, no client bundle
import { getProductsByCategory } from "@/lib/data/products";
import ProductGrid from "@/components/product/ProductGrid";

export default function NewArrivalsPage() {
  const products = getProductsByCategory("new-arrivals");
  return <ProductGrid products={products} title="New Arrivals" subtitle="Just Dropped" />;
}
