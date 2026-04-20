// Server component — no tracking, no client bundle
import { getProductsByCategory } from "@/lib/data/products";
import ProductGrid from "@/components/product/ProductGrid";

export default function MenPage() {
  const products = getProductsByCategory("men").filter(
    (product) => product.id !== "m-grove-walker"
  );
  return <ProductGrid products={products} title="Men's Shoes" subtitle="Men" />;
}
