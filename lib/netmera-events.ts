/**
 * Netmera e-commerce event definitions for N·Walks.
 *
 * Naming conventions
 * ──────────────────
 * • Real SDK events  → PascalCase constructors on window.netmera
 *                      (LoginEvent, RegisterEvent, AddToCartEvent, …)
 * • Simulation layer → snake_case event names (localStorage / debug panel)
 *
 * Real SDK usage pattern
 * ───────────────────────
 *   const event = new sdk.LoginEvent();
 *   event.userId = userId;
 *   event.email  = email;
 *   sdk.sendEvent(event);
 *
 * User identification
 * ────────────────────
 * The SDK does NOT expose updateUser() or setUserId() as standalone methods.
 * User identity is carried inside LoginEvent / RegisterEvent (userId, email)
 * and Netmera associates subsequent events to the same profile automatically.
 *
 * Pre-defined events used here (all have native Netmera dashboard support):
 *   LoginEvent · RegisterEvent · AddToCartEvent · RemoveFromCartEvent ·
 *   ViewCartEvent · PurchaseEvent · ProductViewEvent · ViewCategoryEvent
 */

import type { Product, ProductCategory } from "@/types";
import { trackEvent, identifyUser, Netmera, pushToRealSDK } from "@/lib/netmera";
import type { NMApi } from "@/lib/netmera";

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

// ─── Identity (simulation layer only) ─────────────────────────────────────────

/** Updates the simulation layer's identity (localStorage + debug panel). */
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

// ─── Auth events ──────────────────────────────────────────────────────────────

/**
 * Fired on successful login.
 *
 * Real SDK: new LoginEvent() → sendEvent(event)
 *   The event carries userId + email so Netmera links this session to the
 *   correct profile in Targeting > People.
 *
 * Simulation: identifyUser + trackEvent("login")
 */
export function nmLogin(
  userId: string,
  email: string,
  name = "",
  method = "email"
) {
  const { utmSource, utmMedium, utmCampaign } = getUtmParams();

  // ── Real Netmera Web SDK ──────────────────────────────────────────────────
  pushToRealSDK((api: NMApi) => {
    try {
      const event = new api.LoginEvent();
      event.userId   = userId;
      event.email    = email;
      event.userName = name;
      event.method   = method;
      api.sendEvent(event);
    } catch (err) {
      // Fallback: log which methods are available for diagnosis
      console.warn("[N·Walks Netmera] LoginEvent failed:", err,
        "\nAvailable methods:", Object.keys(api).filter(k => typeof (api as Record<string,unknown>)[k] === "function").join(", "));
    }
  });

  // ── Simulation layer (localStorage / debug panel) ─────────────────────────
  identifyUser(userId, { email, name });
  trackEvent("login", { userId, email, method, utmSource, utmMedium, utmCampaign });
}

/**
 * Fired on successful account creation.
 *
 * Real SDK: new RegisterEvent() → sendEvent(event)
 * Simulation: identifyUser + trackEvent("register")
 */
export function nmRegister(
  userId: string,
  email: string,
  name = "",
  gender = "other",
  favoriteCategory = ""
) {
  // ── Real Netmera Web SDK ──────────────────────────────────────────────────
  pushToRealSDK((api: NMApi) => {
    try {
      const event = new api.RegisterEvent();
      event.userId           = userId;
      event.email            = email;
      event.userName         = name;
      event.gender           = gender;
      event.favoriteCategory = favoriteCategory;
      api.sendEvent(event);
    } catch (err) {
      console.warn("[N·Walks Netmera] RegisterEvent failed:", err);
    }
  });

  // ── Simulation layer ──────────────────────────────────────────────────────
  identifyUser(userId, { email, name, gender, favoriteCategory });
  trackEvent("register", { userId, email, gender, favoriteCategory });
}

/**
 * Fired on logout.
 * Simulation: clears localStorage keys.
 */
export function nmLogout() {
  Netmera.logout();
}

// ─── Product events ───────────────────────────────────────────────────────────

/** Fired when the product detail page is mounted (first render). */
export function nmProductView(product: Product) {
  const { utmSource, utmMedium, utmCampaign } = getUtmParams();

  // ── Real SDK ──────────────────────────────────────────────────────────────
  pushToRealSDK((api: NMApi) => {
    try {
      const event = new api.ProductViewEvent();
      event.itemId       = product.id;
      event.itemName     = product.name;
      event.price        = product.price;
      event.currency     = "USD";
      event.categoryId   = product.category;
      event.categoryName = product.category;
      event.brandId      = "n-walks";
      event.brandName    = "N·WALKS";
      event.keywords     = product.tags ?? [];
      api.sendEvent(event);
    } catch (err) {
      console.warn("[N·Walks Netmera] ProductViewEvent failed:", err);
    }
  });

  // ── Simulation layer ──────────────────────────────────────────────────────
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
  // ── Real SDK ──────────────────────────────────────────────────────────────
  pushToRealSDK((api: NMApi) => {
    try {
      const event = new api.ViewCategoryEvent();
      event.categoryId   = category;
      event.categoryName = title;
      api.sendEvent(event);
    } catch (err) {
      console.warn("[N·Walks Netmera] ViewCategoryEvent failed:", err);
    }
  });

  // ── Simulation layer ──────────────────────────────────────────────────────
  trackEvent("category_view", { category, title, productCount });
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
  // ── Real SDK ──────────────────────────────────────────────────────────────
  pushToRealSDK((api: NMApi) => {
    try {
      const event = new api.AddToCartEvent();
      event.itemId       = product.id;
      event.itemName     = product.name;
      event.price        = product.price;
      event.currency     = "USD";
      event.quantity     = quantity;
      event.categoryId   = product.category;
      event.categoryName = product.category;
      event.brandId      = "n-walks";
      event.brandName    = "N·WALKS";
      api.sendEvent(event);
    } catch (err) {
      console.warn("[N·Walks Netmera] AddToCartEvent failed:", err);
    }
  });

  // ── Simulation layer ──────────────────────────────────────────────────────
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

  // ── Real SDK ──────────────────────────────────────────────────────────────
  pushToRealSDK((api: NMApi) => {
    try {
      const event = new api.ViewCartEvent();
      event.subTotal  = Math.round(cartValue * 100) / 100;
      event.currency  = "USD";
      event.itemCount = items.reduce((acc, i) => acc + i.quantity, 0);
      api.sendEvent(event);
    } catch (err) {
      console.warn("[N·Walks Netmera] ViewCartEvent failed:", err);
    }
  });

  // ── Simulation layer ──────────────────────────────────────────────────────
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

  // ── Real SDK ──────────────────────────────────────────────────────────────
  pushToRealSDK((api: NMApi) => {
    try {
      const event = new api.PurchaseEvent();
      event.orderId   = orderId;
      event.subTotal  = Math.round(revenue * 100) / 100;
      event.shipping  = Math.round(shipping * 100) / 100;
      event.tax       = Math.round(tax * 100) / 100;
      event.currency  = "USD";
      event.itemCount = items.reduce((acc, i) => acc + i.quantity, 0);
      api.sendEvent(event);
    } catch (err) {
      console.warn("[N·Walks Netmera] PurchaseEvent failed:", err);
    }
  });

  // ── Simulation layer ──────────────────────────────────────────────────────
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

  // ── Real SDK ──────────────────────────────────────────────────────────────
  pushToRealSDK((api: NMApi) => {
    try {
      const event = new api.RemoveFromCartEvent();
      event.itemId       = productId;
      event.itemName     = productName;
      event.price        = price;
      event.currency     = "USD";
      event.quantity     = quantity;
      event.categoryId   = categoryName;
      event.categoryName = categoryName;
      event.brandId      = "n-walks";
      event.brandName    = "N·WALKS";
      api.sendEvent(event);
    } catch (err) {
      console.warn("[N·Walks Netmera] RemoveFromCartEvent failed:", err);
    }
  });

  // ── Simulation layer ──────────────────────────────────────────────────────
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
