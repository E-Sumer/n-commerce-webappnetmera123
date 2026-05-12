import type { NetmeraEvent } from "@/types";

// ─── Actual Netmera WSDK event-instance types ────────────────────────────────
// Each Event class exposes writable properties; you create an instance,
// set props, then call netmera.sendEvent(instance).

export interface NMLoginEvent {
  userId?: string;
  uid?: string;
  email?: string;
  userName?: string;
  method?: string;
  [key: string]: unknown;
}

export interface NMRegisterEvent {
  userId?: string;
  uid?: string;
  email?: string;
  userName?: string;
  gender?: string;
  favoriteCategory?: string;
  [key: string]: unknown;
}

export interface NMProductViewEvent {
  itemId?: string;
  itemName?: string;
  price?: number;
  currency?: string;
  categoryId?: string;
  categoryName?: string;
  brandId?: string;
  brandName?: string;
  keywords?: string[];
  [key: string]: unknown;
}

export interface NMAddToCartEvent {
  itemId?: string;
  itemName?: string;
  price?: number;
  currency?: string;
  quantity?: number;
  categoryId?: string;
  categoryName?: string;
  brandId?: string;
  brandName?: string;
  [key: string]: unknown;
}

export interface NMRemoveFromCartEvent {
  itemId?: string;
  itemName?: string;
  price?: number;
  currency?: string;
  quantity?: number;
  categoryId?: string;
  categoryName?: string;
  brandId?: string;
  brandName?: string;
  [key: string]: unknown;
}

export interface NMCartItem {
  itemId:    string;
  itemName:  string;
  price:     number;
  quantity:  number;
  categoryId?:   string;
  categoryName?: string;
  brandId?:      string;
  brandName?:    string;
  [key: string]: unknown;
}

export interface NMViewCartEvent {
  subTotal?:  number;
  currency?:  string;
  itemCount?: number;
  items?:     NMCartItem[];   // required by Netmera backend (code 2004 if missing)
  [key: string]: unknown;
}

export interface NMPurchaseEvent {
  orderId?:   string;
  subTotal?:  number;
  shipping?:  number;
  tax?:       number;
  discount?:  number;
  coupon?:    string;
  currency?:  string;
  itemCount?: number;
  items?:     NMCartItem[];   // required by Netmera backend (code 2004 if missing)
  [key: string]: unknown;
}

export interface NMViewCategoryEvent {
  categoryId?: string;
  categoryName?: string;
  [key: string]: unknown;
}

export interface NMSearchEvent {
  keyword?: string;
  searchText?: string;
  resultCount?: number;
  [key: string]: unknown;
}

/**
 * The live Netmera WSDK object — available on window.netmera
 * after the service-worker handshake completes ("Netmera is ready…").
 *
 * Confirmed own properties (from browser console):
 *   push, getUser, isPromptable, getDeviceInfo, prompt, pushRegister,
 *   forcePushRegister, isPushSupported, sendEvent, getVersion, getAppKey,
 *   getSessionId, OrderApproveEvent, ProductCommentEvent, OrderCancelEvent,
 *   ViewCategoryEvent, PurchaseEvent, RegisterEvent, LoginEvent,
 *   ProductRateEvent, RemoveFromCartEvent, ViewCartEvent, CommentEvent,
 *   ProductViewEvent, InAppPurchaseEvent, ViewContentEvent, ShareEvent,
 *   SearchEvent, OrderDeliverEvent, AddToCartEvent, BannerClickEvent,
 *   RateEvent, OrderShipEvent, apiKey
 */
/**
 * Netmera user object returned by sdk.getUser().
 *
 * Confirmed own keys (from browser console, getUser() inspection):
 *   save, setCustomId, setEmail, setGsmNo, setName, setSurName,
 *   addProfileAttr, getId, getCustomId
 *
 * Usage:
 *   const user = sdk.getUser();
 *   user.setCustomId(email);   ← this is "External ID" in the Netmera panel
 *   user.setEmail(email);
 *   user.setName(name);
 *   user.save();               ← sends the profile update to the backend
 */
export interface NMUser {
  save:           () => void;
  setCustomId:    (id: string) => void;     // External ID in Targeting > People
  setEmail:       (email: string) => void;
  setName:        (name: string) => void;
  setSurName:     (surname: string) => void;
  setGsmNo:       (gsm: string) => void;
  addProfileAttr: (key: string, value: unknown) => void;
  getId:          () => string;
  getCustomId:    () => string;
  [key: string]: unknown;
}

export interface NMApi {
  // ── Core methods ────────────────────────────────────────────────────────
  sendEvent: (event: object) => void;
  getUser: () => NMUser;
  getSessionId: () => string;
  getAppKey: () => string;
  getVersion: () => string;
  push: (fn: (this: NMApi, arg?: unknown) => void) => void;
  pushRegister: () => void;
  forcePushRegister: () => void;
  isPromptable: () => boolean;
  isPushSupported: () => boolean;
  prompt: () => void;
  getDeviceInfo: () => unknown;
  apiKey: string;

  // ── Auth event constructors ──────────────────────────────────────────────
  LoginEvent: new () => NMLoginEvent;
  RegisterEvent: new () => NMRegisterEvent;

  // ── Commerce event constructors ──────────────────────────────────────────
  AddToCartEvent: new () => NMAddToCartEvent;
  RemoveFromCartEvent: new () => NMRemoveFromCartEvent;
  ViewCartEvent: new () => NMViewCartEvent;
  PurchaseEvent: new () => NMPurchaseEvent;
  ProductViewEvent: new () => NMProductViewEvent;
  ViewCategoryEvent: new () => NMViewCategoryEvent;
  SearchEvent: new () => NMSearchEvent;

  // ── Other event constructors (available, not currently used) ──────────────
  CommentEvent: new () => Record<string, unknown>;
  ProductCommentEvent: new () => Record<string, unknown>;
  ProductRateEvent: new () => Record<string, unknown>;
  RateEvent: new () => Record<string, unknown>;
  ShareEvent: new () => Record<string, unknown>;
  InAppPurchaseEvent: new () => Record<string, unknown>;
  ViewContentEvent: new () => Record<string, unknown>;
  BannerClickEvent: new () => Record<string, unknown>;
  OrderApproveEvent: new () => Record<string, unknown>;
  OrderCancelEvent: new () => Record<string, unknown>;
  OrderDeliverEvent: new () => Record<string, unknown>;
  OrderShipEvent: new () => Record<string, unknown>;

  [key: string]: unknown;
}

/**
 * Find the live Netmera SDK object, wherever it may be attached after init.
 *
 * The SDK starts life as a `[]` queue on `window.netmera`.
 * Once the service worker installs and the SDK announces "Netmera is ready…",
 * the live API object is at window.netmera (the queue is upgraded to an object).
 *
 * We detect "live" by checking for known event constructor names confirmed
 * from browser console inspection of the actual SDK object.
 */
const SDK_PROBES = ["LoginEvent", "RegisterEvent", "AddToCartEvent", "sendEvent"] as const;

function isLiveSDK(obj: unknown): obj is NMApi {
  if (!obj || typeof obj !== "object") return false;
  // The queue is a plain Array — it has no event constructors
  if (Array.isArray(obj)) return false;
  return SDK_PROBES.some((m) => typeof (obj as Record<string, unknown>)[m] === "function");
}

export function findLiveSDK(): NMApi | null {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  for (const key of ["netmera", "Netmera", "NetmeraWebSDK", "netmeraSDK"]) {
    if (isLiveSDK(w[key])) return w[key] as NMApi;
  }
  return null;
}

/**
 * Set the user's External ID + profile in Netmera via sdk.getUser() setters.
 *
 * Confirmed API (from browser console inspection of getUser() return value):
 *   user.setCustomId(email)  ← "Custom ID" = External ID in Targeting > People
 *   user.setEmail(email)
 *   user.setName(name)
 *   user.save()              ← sends the update to the Netmera backend
 *
 * Requires the live SDK — call this from a pushToRealSDK() callback or
 * from whenSDKReady() so sdk is guaranteed to be the live object.
 */
export function setUserIdentity(sdk: NMApi, params: {
  externalId: string;
  email: string;
  name?: string;
}) {
  try {
    const user = sdk.getUser();
    user.setCustomId(params.externalId);
    user.setEmail(params.email);
    if (params.name) user.setName(params.name);
    user.save();
    console.info(
      "%c[N·Walks Netmera] setUserIdentity ✓",
      "color:#5C7A5F;font-weight:bold",
      { customId: params.externalId, email: params.email, name: params.name }
    );
  } catch (err) {
    console.warn("[N·Walks Netmera] setUserIdentity failed:", err);
  }
}

/**
 * @deprecated Use setUserIdentity(sdk, params) instead.
 * Kept as a localStorage-only fallback — does NOT sync to the Netmera backend.
 */
export function pushUserIdentity(params: {
  externalId: string;
  email: string;
  name?: string;
}) {
  if (typeof window === "undefined") return;
  try {
    const raw   = localStorage.getItem("_n_user");
    const nUser = raw ? JSON.parse(raw) : {};
    nUser.prfl  = { ...(nUser.prfl ?? {}), externalId: params.externalId, email: params.email, name: params.name ?? "" };
    localStorage.setItem("_n_user", JSON.stringify(nUser));
  } catch { /* noop */ }
}

/**
 * Call the real Netmera Web SDK — handles two lifecycle states:
 *
 * AFTER "Netmera is ready…" (login / register on user interaction):
 *   findLiveSDK() returns the live object → callback runs immediately.
 *
 * BEFORE SDK ready (session-restore in NetmeraInit, pre-queued):
 *   Push a wrapper into the `[]` queue; the SDK calls it on startup.
 *   The wrapper handles both arg-based fn(api) and this-based fn.call(sdk).
 */
export function pushToRealSDK(callback: (api: NMApi) => void) {
  if (typeof window === "undefined") return;

  // ── Case A: SDK already live (post "Netmera is ready…") ──────────────────
  const live = findLiveSDK();
  if (live) {
    try { callback(live); } catch { /* noop */ }
    return;
  }

  // ── Case B: SDK not yet live — push to the [] queue ──────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const q = (window as any).netmera;
  if (q && typeof q.push === "function") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      q.push(function(this: unknown, arg?: unknown) {
        const sdk = isLiveSDK(arg) ? (arg as NMApi)
          : isLiveSDK(this)        ? (this as NMApi)
          : findLiveSDK();          // last resort: re-scan globals
        if (sdk) try { callback(sdk); } catch { /* noop */ }
      });
    } catch { /* noop */ }
  }
}

/**
 * Wait for "Netmera is ready…" then call fn once.
 * Polls every 250 ms and also listens for common SDK ready events.
 * Logs a diagnostic on timeout so we can see what went wrong.
 */
export function whenSDKReady(fn: (api: NMApi) => void, maxMs = 15_000) {
  if (typeof window === "undefined") return;
  let fired = false;

  const fire = (sdk: NMApi) => {
    if (fired) return;
    fired = true;
    try { fn(sdk); } catch { /* noop */ }
  };

  // ── Polling every 250 ms ──────────────────────────────────────────────────
  const deadline = Date.now() + maxMs;
  const tick = () => {
    if (fired) return;
    const sdk = findLiveSDK();
    if (sdk) { fire(sdk); return; }
    if (Date.now() < deadline) {
      setTimeout(tick, 250);
    } else {
      // ── Timeout diagnostic — always visible in Console ──────────────────
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      console.warn(
        "%c[N·Walks Netmera] SDK ready timeout — live API not found after " + maxMs / 1000 + "s",
        "color:orange;font-weight:bold",
        "\ntypeof window.netmera :", typeof w.netmera,
        "\nIs array?             :", Array.isArray(w.netmera),
        "\nOwn props             :", Object.getOwnPropertyNames(w.netmera ?? {}).join(", ") || "(none)",
        "\ntypeof window.Netmera :", typeof w.Netmera,
        "\nWindow keys w/ 'etmera':", Object.keys(w).filter((k: string) => /etmera/i.test(k)).join(", ") || "(none)"
      );
    }
  };
  tick();

  // ── Event-based fallback — some SDK versions dispatch a ready event ────────
  const onReady = () => {
    const sdk = findLiveSDK();
    if (sdk) fire(sdk);
  };
  window.addEventListener("netmera:ready", onReady, { once: true });
  window.addEventListener("NetmeraReady",  onReady, { once: true });
  document.addEventListener("netmera:ready", onReady, { once: true });
}

interface UserTraits {
  email?: string;
  name?: string;
  gender?: string;
  favoriteCategory?: string;
  [key: string]: unknown;
}

class NetmeraSDK {
  private readonly apiKey: string;
  private readonly debug: boolean;
  private userId?: string;
  private userTraits?: UserTraits;
  private readonly sessionId: string;
  private events: NetmeraEvent[] = [];
  private initialized = false;

  constructor(apiKey: string, debug = false) {
    this.apiKey = apiKey;
    this.debug = debug;
    this.sessionId = this.generateId("ses");
  }

  init() {
    if (this.initialized || typeof window === "undefined") return;
    this.initialized = true;

    const storedUserId = localStorage.getItem("nm_user_id");
    const storedTraits = localStorage.getItem("nm_user_traits");
    const storedEvents = localStorage.getItem("nm_events");

    if (storedUserId) this.userId = storedUserId;
    if (storedTraits) {
      try { this.userTraits = JSON.parse(storedTraits); } catch { /* noop */ }
    }
    if (storedEvents) {
      try { this.events = JSON.parse(storedEvents); } catch { /* noop */ }
    }

    this.log("SDK initialized", { apiKey: this.apiKey.slice(0, 10) + "…", sessionId: this.sessionId });
    this.dispatch("netmera:ready", { sessionId: this.sessionId });
  }

  identify(userId: string, traits?: UserTraits) {
    this.userId = userId;
    this.userTraits = traits;

    if (typeof window !== "undefined") {
      localStorage.setItem("nm_user_id", userId);
      if (traits) localStorage.setItem("nm_user_traits", JSON.stringify(traits));
    }

    // NOTE: the real SDK's user binding is handled via LoginEvent/RegisterEvent
    // in netmera-events.ts — not here — so we don't double-fire.

    this.log("identify", { userId, traits });
    this.dispatch("netmera:identify", { userId, traits });
  }

  track(eventName: string, data: Record<string, unknown> = {}): NetmeraEvent {
    const event: NetmeraEvent = {
      id: this.generateId("evt"),
      eventName,
      userId: this.userId,
      sessionId: this.sessionId,
      data: {
        ...data,
        url: typeof window !== "undefined" ? window.location.pathname : undefined,
      },
      timestamp: new Date().toISOString(),
    };

    this.events.push(event);
    if (this.events.length > 100) this.events = this.events.slice(-100);

    if (typeof window !== "undefined") {
      localStorage.setItem("nm_events", JSON.stringify(this.events));
    }

    this.log("track", event);
    this.dispatch("netmera:event", event);

    return event;
  }

  logout() {
    this.userId = undefined;
    this.userTraits = undefined;
    if (typeof window !== "undefined") {
      localStorage.removeItem("nm_user_id");
      localStorage.removeItem("nm_user_traits");
    }
    this.log("logout", {});
    this.dispatch("netmera:logout", {});
  }

  getCurrentUser() {
    return this.userId ? { userId: this.userId, traits: this.userTraits } : null;
  }

  getEvents(limit = 20): NetmeraEvent[] {
    return [...this.events].reverse().slice(0, limit);
  }

  clearEvents() {
    this.events = [];
    if (typeof window !== "undefined") localStorage.removeItem("nm_events");
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  }

  private log(action: string, data: unknown) {
    if (!this.debug) return;
    console.group(`%c🔔 Netmera.${action}`, "color:#5C7A5F;font-weight:bold;font-size:12px;");
    console.log(data);
    console.groupEnd();
  }

  private dispatch(eventType: string, detail: unknown) {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent(eventType, { detail }));
  }
}

export const Netmera = new NetmeraSDK("nm_demo_nwalks_2024", false);

export function trackEvent(eventName: string, data?: Record<string, unknown>) {
  return Netmera.track(eventName, data ?? {});
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  Netmera.identify(userId, traits);
}
