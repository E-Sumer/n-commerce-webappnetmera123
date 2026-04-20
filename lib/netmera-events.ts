import type { Product } from "@/types";
import { trackEvent } from "@/lib/netmera";

export function trackLogin(userId: string, email: string, method = "email") {
  trackEvent("login", { userId, email, method, source: "account_page" });
}

export function trackRegister(userId: string, email: string, gender = "other", favoriteCategory = "new-arrivals") {
  trackEvent("signup", {
    userId,
    email,
    gender,
    favoriteCategory,
    source: "account_page",
  });
}

export function trackAddToCart(product: Product, size: number, color: string) {
  trackEvent("add_to_cart", {
    productId: product.id,
    productName: product.name,
    category: product.category,
    price: product.price,
    size,
    color,
    source: "account_wishlist",
  });
}

export function trackRemoveFromWishlist(productId: string) {
  trackEvent("remove_from_wishlist", {
    productId,
    source: "account_wishlist",
  });
}
