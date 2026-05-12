/**
 * Netmera e-commerce event definitions for N·Walks.
 *
 * Event firing strategy
 * ─────────────────────
 * All real-SDK events use direct sendEvent({ code, ...attrs }) instead of
 * typed constructors.  This ensures every attribute appears in the Netmera
 * dashboard's "Event Data" column — constructor instances store fields in
 * structured schema columns only, leaving Event Data empty.
 *
 * Standard event codes used:
 *   n:cl  Login          n:rg  Register
 *   n:pv  Product View   n:vc  Category View
 *   n:at  Add to Cart    n:rc  Remove from Cart
 *   n:vt  View Cart      n:ph  Purchase
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

    // 2. Fire Login event — constructor for server recognition + Object.assign
    //    for all attributes (non-schema fields land in Event Data)
    try {
      const e = new api.LoginEvent();
      Object.assign(e, { userId, email, userName: name, method, utmSource, utmMedium, utmCampaign });
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
      Object.assign(e, { userId, email, userName: name, gender, favoriteCategory });
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

/** n:pv — Product View */
export function nmProductView(product: Product) {
  const { utmSource, utmMedium, utmCampaign } = getUtmParams();

  pushToRealSDK((api: NMApi) => {
    try {
      const e = new api.ProductViewEvent();
      Object.assign(e, {
        itemId:       product.id,
        itemName:     product.name,
        price:        product.price,
        currency:     "USD",
        categoryId:   product.category,
        categoryName: product.category,
        brandId:      "n-walks",
        brandName:    "N·WALKS",
        keywords:     (product.tags ?? []).join(", "),
        utmSource,
        utmMedium,
        utmCampaign,
        pageUrl:      typeof window !== "undefined" ? window.location.pathname : "",
      });
      api.sendEvent(e);
    } catch (err) {
      console.warn("[N·Walks Netmera] Product View (n:pv) failed:", err);
    }
  });

  trackEvent("n:pv", {
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

/** n:vc — Category View */
export function nmCategoryView(category: ProductCategory, title: string, productCount: number) {
  const { utmSource, utmMedium, utmCampaign } = getUtmParams();

  pushToRealSDK((api: NMApi) => {
    try {
      const e = new api.ViewCategoryEvent();
      Object.assign(e, {
        categoryId:   category,
        categoryName: title,
        productCount,
        utmSource,
        utmMedium,
        utmCampaign,
        pageUrl:      typeof window !== "undefined" ? window.location.pathname : "",
      });
      api.sendEvent(e);
    } catch (err) {
      console.warn("[N·Walks Netmera] Category View (n:vc) failed:", err);
    }
  });

  trackEvent("n:vc", { category, title, productCount, utmSource, utmMedium, utmCampaign });
}

// ─── Cart events ──────────────────────────────────────────────────────────────

/** n:at — Add to Cart */
export function nmAddToCart(
  product: Product,
  size: number,
  colorName: string,
  quantity = 1,
  source: "product_page" | "quick_add" = "product_page"
) {
  pushToRealSDK((api: NMApi) => {
    try {
      // Use the constructor so the server recognises the event definition,
      // then assign ALL attributes (standard + custom) onto the instance.
      // Standard fields map to schema columns; non-schema fields (size, color,
      // source, utm*) appear in the Netmera dashboard Event Data column.
      const e = new api.AddToCartEvent();
      Object.assign(e, {
        itemId:       product.id,
        itemName:     product.name,
        price:        product.price,
        currency:     "USD",
        quantity,
        size,
        color:        colorName,
        categoryId:   product.category,
        categoryName: product.category,
        brandId:      "n-walks",
        brandName:    "N·WALKS",
        source,
      });
      api.sendEvent(e);
    } catch (err) {
      console.warn("[N·Walks Netmera] Add to Cart (n:at) failed:", err);
    }
  });

  trackEvent("n:at", {
    productId:   product.id,
    productName: product.name,
    category:    product.category,
    price:       product.price,
    currency:    "USD",
    quantity,
    size,
    color:       colorName,
    source,
  });
}

/**
 * Standard Netmera event: View Cart  (code: n:vt)
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
      Object.assign(e, {
        subTotal:  Math.round(cartValue * 100) / 100,
        currency:  "USD",
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
 * Standard Netmera event: Purchase  (code: n:ph)
 * Fired on Checkout button click.
 */
export function nmPurchase(
  items: Array<{ productId: string; productName: string; price: number; quantity: number }>,
  revenue: number,
  shipping: number,
  tax: number
) {
  const orderId   = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  pushToRealSDK((api: NMApi) => {
    try {
      const e = new api.PurchaseEvent();
      Object.assign(e, {
        orderId,
        subTotal:  Math.round(revenue * 100) / 100,
        shipping:  Math.round(shipping * 100) / 100,
        tax:       Math.round(tax * 100) / 100,
        discount:  0,
        coupon:    "",
        currency:  "USD",
        itemCount,
        items: items.map((i) => ({
          itemId:   i.productId,
          itemName: i.productName,
          price:    i.price,
          quantity: i.quantity,
        })),
      });
      api.sendEvent(e);
    } catch (err) {
      console.warn("[N·Walks Netmera] Purchase (n:ph) failed:", err);
    }
  });

  trackEvent("n:ph", {
    orderId,
    revenue:   Math.round(revenue * 100) / 100,
    shipping:  Math.round(shipping * 100) / 100,
    tax:       Math.round(tax * 100) / 100,
    currency:  "USD",
    itemCount,
    items: items.map((i) => ({
      productId:   i.productId,
      productName: i.productName,
      price:       i.price,
      quantity:    i.quantity,
    })),
  });
}

/** n:rc — Remove from Cart */
export function nmRemoveFromCart(
  productId: string,
  productName: string,
  quantity = 1,
  categoryName = "",
  price = 0
) {
  const { utmSource, utmMedium, utmCampaign } = getUtmParams();

  pushToRealSDK((api: NMApi) => {
    try {
      const e = new api.RemoveFromCartEvent();
      Object.assign(e, {
        itemId:       productId,
        itemName:     productName,
        price,
        currency:     "USD",
        quantity,
        categoryId:   categoryName,
        categoryName,
        brandId:      "n-walks",
        brandName:    "N·WALKS",
        utmSource,
        utmMedium,
        utmCampaign,
      });
      api.sendEvent(e);
    } catch (err) {
      console.warn("[N·Walks Netmera] Remove from Cart (n:rc) failed:", err);
    }
  });

  trackEvent("n:rc", {
    itemId:       productId,
    itemName:     productName,
    price,
    categoryName,
    quantity,
    utmSource,
    utmMedium,
    utmCampaign,
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
