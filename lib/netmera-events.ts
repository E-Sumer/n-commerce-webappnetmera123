/**
 * Netmera e-commerce event definitions for N·Walks.
 *
 * Naming conventions
 * ──────────────────
 * • Event names   → snake_case  (Netmera platform standard)
 * • Attribute keys → camelCase  (JS convention; matches Netmera Web SDK param expectations)
 * • Monetary values → always include currency: "USD"
 * • Product events → always include the full quartet: productId / productName / price / category
 *
 * Pre-defined Netmera events used here (recognised natively by the dashboard):
 *   login · register · add_to_cart · remove_from_cart · view_cart · purchase · product_view · category_view
 *
 * Custom events (tracked as custom events in the dashboard):
 *   page_view · remove_from_wishlist · newsletter_signup
 */

import type { Product, ProductCategory } from "@/types";
import { trackEvent, identifyUser } from "@/lib/netmera";

function getUtmParams() {
  if (typeof window === "undefined") {
    return { utmSource: "", utmMedium: "", utmCampaign: "" };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") ?? "",
    utmMedium: params.get("utm_medium") ?? "",
    utmCampaign: params.get("utm_campaign") ?? "",
  };
}

// ─── Identity ────────────────────────────────────────────────────────────────

export function nmIdentify(
  userId: string,
  traits: {
    email: string;
    name: string;
    gender?: string;
    favoriteCategory?: string;
  }
) {
  identifyUser(userId, {
    email: traits.email,
    name: traits.name,
    gender: traits.gender ?? "other",
    favoriteCategory: traits.favoriteCategory ?? "",
  });
}

// ─── Auth events ─────────────────────────────────────────────────────────────

/** Fired immediately after a successful login. */
export function nmLogin(userId: string) {
  const { utmSource, utmMedium, utmCampaign } = getUtmParams();
  trackEvent("login", {
    userId,
    utmSource,
    utmMedium,
    utmCampaign,
  });
}

/** Fired immediately after a successful account creation. */
export function nmRegister(
  userId: string,
  email: string,
  gender = "other",
  favoriteCategory = ""
) {
  trackEvent("register", {
    userId,
    email,
    gender,
    favoriteCategory,
  });
}

// ─── Product events ───────────────────────────────────────────────────────────

/** Fired when the product detail page is mounted (first render). */
export function nmProductView(product: Product) {
  const { utmSource, utmMedium, utmCampaign } = getUtmParams();
  trackEvent("product_view", {
    categoryName: product.category,
    keywords: product.tags,
    brandName: "N·WALKS",
    variant: "",
    utmSource,
    utmMedium,
    categoryId: product.category,
    utmCampaign,
    itemId: product.id,
    price: product.price,
    brandId: "n-walks",
    itemName: product.name,
  });
}

/** Fired when a category / PLP grid is shown (women, men, new-arrivals). */
export function nmCategoryView(
  category: ProductCategory,
  title: string,
  productCount: number
) {
  trackEvent("category_view", {
    category,
    title,
    productCount,
  });
}

// ─── Cart events ──────────────────────────────────────────────────────────────

/**
 * Fired when a product is added to cart.
 * source = "product_page" | "quick_add"
 */
export function nmAddToCart(
  product: Product,
  size: number,
  colorName: string,
  quantity = 1,
  source: "product_page" | "quick_add" = "product_page"
) {
  trackEvent("add_to_cart", {
    productId: product.id,
    productName: product.name,
    category: product.category,
    price: product.price,
    currency: "USD",
    quantity,
    size,
    color: colorName,
    source,
  });
}

/** Fired when the /cart page is displayed. */
export function nmViewCart(
  items: Array<{ productId: string; productName: string; price: number; quantity: number }>,
  cartValue: number
) {
  const { utmSource, utmMedium, utmCampaign } = getUtmParams();
  trackEvent("view_cart", {
    utmSource,
    utmMedium,
    utmCampaign,
    subTotal: Math.round(cartValue * 100) / 100,
    itemCount: items.reduce((acc, i) => acc + i.quantity, 0),
    items: items.map((i) => ({
      itemId: i.productId,
      itemName: i.productName,
      price: i.price,
      quantity: i.quantity,
    })),
  });
}

/** Fired when the checkout is confirmed (order placed). */
export function nmPurchase(
  items: Array<{ productId: string; productName: string; price: number; quantity: number }>,
  revenue: number,
  shipping: number,
  tax: number
) {
  const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  trackEvent("purchase", {
    orderId,
    revenue: Math.round(revenue * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    currency: "USD",
    itemCount: items.reduce((acc, i) => acc + i.quantity, 0),
    items: items.map((i) => ({
      productId: i.productId,
      productName: i.productName,
      price: i.price,
      quantity: i.quantity,
    })),
  });
}

/** Fired when a single item is removed from cart. */
export function nmRemoveFromCart(
  productId: string,
  productName: string,
  quantity = 1,
  categoryName = "",
  price = 0
) {
  const { utmSource, utmMedium, utmCampaign } = getUtmParams();
  trackEvent("remove_from_cart", {
    categoryName,
    keywords: [],
    brandName: "N·WALKS",
    variant: "",
    utmSource,
    utmMedium,
    utmCampaign,
    price,
    categoryId: categoryName,
    itemId: productId,
    brandId: "n-walks",
    itemName: productName,
    itemCount: quantity,
  });
}

// ─── Wishlist / account events ────────────────────────────────────────────────

export function nmRemoveFromWishlist(productId: string) {
  trackEvent("remove_from_wishlist", { productId });
}

// ─── Page view ────────────────────────────────────────────────────────────────

/** Generic page_view for pages that don't have a more specific event. */
export function nmPageView(page: string, extra?: Record<string, unknown>) {
  const { utmSource, utmMedium, utmCampaign } = getUtmParams();
  trackEvent("pageView", {
    pageURL: page,
    referrerURL: typeof document !== "undefined" ? document.referrer : "",
    utmSource,
    utmMedium,
    utmCampaign,
    ...extra,
  });
}
