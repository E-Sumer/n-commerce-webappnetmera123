/**
 * Netmera e-commerce event definitions for N·Walks.
 *
 * Event firing strategy
 * ─────────────────────
 * All WSDK events use their constructor + setter-method pattern confirmed
 * from WSDK source inspection (netmera_sdk.js).
 *
 *   const e = new api.AddToCartEvent();
 *   e.setItemId("...");          ← sets abbreviated property code "ea"
 *   e.setBrandName("...");       ← sets abbreviated property code "eh"
 *   api.sendEvent(e);
 *
 * Direct property assignment (e.itemId = "…") does NOT populate Event Data —
 * only the SDK setter methods set the abbreviated codes the backend expects.
 *
 * Confirmed WSDK event codes (differ from iOS docs):
 *   n:cl  Login           n:rg  Register
 *   n:vp  Product View    n:cv  Category View
 *   n:acp Add to Cart     n:rcp Remove from Cart
 *   n:vt  View Cart       n:ph  Purchase
 */

import type { Product, ProductCategory } from "@/types";
import { trackEvent, identifyUser, Netmera, pushToRealSDK, setUserIdentity } from "@/lib/netmera";
import type { NMApi } from "@/lib/netmera";

function getUtmParams() {
  if (typeof window === "undefined") {
    return { utmSource: "", utmMedium: "", utmCampaign: "" };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource:   params.get("utm_source")   ?? "",
    utmMedium:   params.get("utm_medium")   ?? "",
    utmCampaign: params.get("utm_campaign") ?? "",
  };
}

// ─── Identity (simulation layer only) ─────────────────────────────────────────

export function nmIdentify(
  userId: string,
  traits: { email: string; name: string; gender?: string; favoriteCategory?: string }
) {
  identifyUser(userId, {
    email:            traits.email,
    name:             traits.name,
    gender:           traits.gender ?? "other",
    favoriteCategory: traits.favoriteCategory ?? "",
  });
}

// ─── Auth events ──────────────────────────────────────────────────────────────

/** n:cl — Login */
export function nmLogin(userId: string, email: string, name = "", method = "email") {
  const { utmSource, utmMedium, utmCampaign } = getUtmParams();

  pushToRealSDK((api: NMApi) => {
    // 1. Set External ID (Targeting > People, searchable by email)
    setUserIdentity(api, { externalId: email, email, name });

    // 2. Fire Login event via setter methods
    try {
      const e = new api.LoginEvent();
      e.setUserId(userId);
      api.sendEvent(e);
    } catch (err) {
      console.warn("[N·Walks Netmera] Login (n:cl) failed:", err);
    }
  });

  identifyUser(userId, { email, name });
  trackEvent("n:cl", { userId, email, method, utmSource, utmMedium, utmCampaign });
}

/** n:rg — Register */
export function nmRegister(
  userId: string,
  email: string,
  name = "",
  gender = "other",
  favoriteCategory = ""
) {
  pushToRealSDK((api: NMApi) => {
    setUserIdentity(api, { externalId: email, email, name });
    try {
      const e = new api.RegisterEvent();
      e.setUserId(userId);
      api.sendEvent(e);
    } catch (err) {
      console.warn("[N·Walks Netmera] Register (n:rg) failed:", err);
    }
  });

  identifyUser(userId, { email, name, gender, favoriteCategory });
  trackEvent("n:rg", { userId, email, gender, favoriteCategory });
}

/** Logout — clears simulation-layer state */
export function nmLogout() {
  Netmera.logout();
}

// ─── Product events ───────────────────────────────────────────────────────────

/** n:vp — Product View */
export function nmProductView(product: Product) {
  const { utmSource, utmMedium, utmCampaign } = getUtmParams();

  pushToRealSDK((api: NMApi) => {
    try {
      const e = new api.ProductViewEvent();
      e.setItemId(product.id);
      e.setItemName(product.name);
      e.setPrice(product.price);
      e.setCategoryId(product.category);
      e.setCategoryName(product.category);
      e.setBrandId("n-walks");
      e.setBrandName("N·WALKS");
      e.setKeywords((product.tags ?? []).join(", "));
      api.sendEvent(e);
    } catch (err) {
      console.warn("[N·Walks Netmera] Product View (n:vp) failed:", err);
    }
  });

  trackEvent("n:vp", {
    itemId:       product.id,
    itemName:     product.name,
    price:        product.price,
    categoryId:   product.category,
    categoryName: product.category,
    brandName:    "N·WALKS",
    keywords:     product.tags,
    utmSource,
    utmMedium,
    utmCampaign,
  });
}

/** n:cv — Category View */
export function nmCategoryView(category: ProductCategory, title: string, productCount: number) {
  const { utmSource, utmMedium, utmCampaign } = getUtmParams();

  pushToRealSDK((api: NMApi) => {
    try {
      const e = new api.ViewCategoryEvent();
      e.setCategoryId(category);
      e.setCategoryName(title);
      api.sendEvent(e);
    } catch (err) {
      console.warn("[N·Walks Netmera] Category View (n:cv) failed:", err);
    }
  });

  trackEvent("n:cv", { category, title, productCount, utmSource, utmMedium, utmCampaign });
}

// ─── Cart events ──────────────────────────────────────────────────────────────

/** n:acp — Add to Cart */
export function nmAddToCart(
  product: Product,
  size: number,
  colorName: string,
  quantity = 1,
  source: "product_page" | "quick_add" = "product_page"
) {
  pushToRealSDK((api: NMApi) => {
    try {
      const e = new api.AddToCartEvent();
      e.setItemId(product.id);
      e.setItemName(product.name);
      e.setPrice(product.price);
      e.setItemCount(quantity);
      e.setCategoryId(product.category);
      e.setCategoryName(product.category);
      e.setBrandId("n-walks");
      e.setBrandName("N·WALKS");
      e.setVariant(`${colorName} / ${size}`);  // matches iOS format "Color / Size"
      e.setKeywords((product.tags ?? []).join(", "));
      api.sendEvent(e);
    } catch (err) {
      console.warn("[N·Walks Netmera] Add to Cart (n:acp) failed:", err);
    }
  });

  trackEvent("n:acp", {
    productId:   product.id,
    productName: product.name,
    category:    product.category,
    price:       product.price,
    quantity,
    variant:     `${colorName} / ${size}`,
    source,
  });
}

/**
 * n:vt — View Cart
 * Fired on /cart page mount.
 */
export function nmViewCart(
  items: Array<{ productId: string; productName: string; price: number; quantity: number }>,
  cartValue: number
) {
  const { utmSource, utmMedium, utmCampaign } = getUtmParams();
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  pushToRealSDK((api: NMApi) => {
    try {
      const e = new api.ViewCartEvent();
      e.setSubTotal(Math.round(cartValue * 100) / 100);
      e.setItemCount(itemCount);
      api.sendEvent(e);
    } catch (err) {
      console.warn("[N·Walks Netmera] View Cart (n:vt) failed:", err);
    }
  });

  trackEvent("n:vt", {
    subTotal:  Math.round(cartValue * 100) / 100,
    itemCount,
    utmSource,
    utmMedium,
    utmCampaign,
    items: items.map((i) => ({
      itemId:   i.productId,
      itemName: i.productName,
      price:    i.price,
      quantity: i.quantity,
    })),
  });
}

/**
 * n:ph — Purchase
 * Fired on Checkout button click.
 */
export function nmPurchase(
  items: Array<{ productId: string; productName: string; price: number; quantity: number }>,
  revenue: number,
  shipping: number,
  tax: number
) {
  const subtotal  = Math.round((revenue - shipping - tax) * 100) / 100;
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  pushToRealSDK((api: NMApi) => {
    try {
      const e = new api.PurchaseEvent();
      e.setSubTotal(subtotal);
      e.setGrandTotal(Math.round(revenue * 100) / 100);
      e.setShippingCost(Math.round(shipping * 100) / 100);
      e.setDiscount(0);
      e.setCoupon("");
      e.setPaymentMethod("card");
      e.setItemCount(itemCount);
      // Line items use abbreviated property codes (ea=itemId, eb=itemName, eq=price, ec=qty)
      e.setPurchaseLineItemEvent(
        items.map((i) => ({
          ea: i.productId,
          eb: i.productName,
          eq: i.price,
          ec: i.quantity,
        }))
      );
      api.sendEvent(e);
    } catch (err) {
      console.warn("[N·Walks Netmera] Purchase (n:ph) failed:", err);
    }
  });

  trackEvent("n:ph", {
    revenue:   Math.round(revenue * 100) / 100,
    subtotal,
    shipping:  Math.round(shipping * 100) / 100,
    tax:       Math.round(tax * 100) / 100,
    itemCount,
    items: items.map((i) => ({
      productId:   i.productId,
      productName: i.productName,
      price:       i.price,
      quantity:    i.quantity,
    })),
  });
}

/** n:rcp — Remove from Cart */
export function nmRemoveFromCart(
  productId: string,
  productName: string,
  quantity = 1,
  categoryName = "",
  price = 0
) {
  pushToRealSDK((api: NMApi) => {
    try {
      const e = new api.RemoveFromCartEvent();
      e.setItemId(productId);
      e.setItemName(productName);
      e.setPrice(price);
      e.setItemCount(quantity);
      e.setCategoryId(categoryName);
      e.setCategoryName(categoryName);
      e.setBrandId("n-walks");
      e.setBrandName("N·WALKS");
      api.sendEvent(e);
    } catch (err) {
      console.warn("[N·Walks Netmera] Remove from Cart (n:rcp) failed:", err);
    }
  });

  trackEvent("n:rcp", {
    itemId:       productId,
    itemName:     productName,
    price,
    categoryName,
    quantity,
  });
}

// ─── Wishlist / misc events ───────────────────────────────────────────────────

export function nmRemoveFromWishlist(productId: string) {
  trackEvent("remove_from_wishlist", { productId });
}

/** Generic page_view */
export function nmPageView(page: string, extra?: Record<string, unknown>) {
  const { utmSource, utmMedium, utmCampaign } = getUtmParams();
  trackEvent("pageView", {
    pageURL:     page,
    referrerURL: typeof document !== "undefined" ? document.referrer : "",
    utmSource,
    utmMedium,
    utmCampaign,
    ...extra,
  });
}
