import type { NetmeraEvent } from "@/types";

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

    // Bridge to real Netmera Web SDK
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sdk = (window as any).Netmera;
      if (sdk) {
        try {
          if (typeof sdk.setUserId === "function") sdk.setUserId(userId);
          if (traits && typeof sdk.setUserAttribute === "function") {
            Object.entries(traits).forEach(([k, v]) => {
              if (v !== undefined) sdk.setUserAttribute(k, v);
            });
          }
        } catch { /* noop */ }
      }
    }

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

    // Bridge to the real Netmera Web SDK (loaded via CDN in layout.tsx).
    // The SDK exposes window.Netmera once initialised; fall back silently if not ready yet.
    this.bridgeToRealSDK(eventName, data);

    this.log("track", event);
    this.dispatch("netmera:event", event);

    return event;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private bridgeToRealSDK(eventName: string, data: Record<string, unknown>) {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sdk = (window as any).Netmera;
    if (!sdk) return;

    try {
      if (typeof sdk.sendForCustomEvent === "function") {
        sdk.sendForCustomEvent(eventName, data);
      }
    } catch {
      /* SDK not yet ready — events already buffered by the simulation layer */
    }
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
