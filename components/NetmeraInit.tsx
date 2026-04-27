"use client";

import { useEffect } from "react";
import { Netmera, findLiveSDK, whenSDKReady } from "@/lib/netmera";
import type { NMApi } from "@/lib/netmera";

const NETMERA_WSDK_SRC =
  "https://cdn.netmera-web.com/wsdkjs/1WbE47mRaA3HqEyx0O3afNPgUyJImYuYezJ_kbsR2JPIKiJ4y02b-w";

export default function NetmeraInit() {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;

    // ── Step 1: Ensure the [] queue exists ────────────────────────────────────
    w.netmera = w.netmera || [];

    // ── Step 2: Read persisted auth session (Zustand → "nwalks-auth") ────────
    let sessionUser: { id: string; email: string; name?: string } | null = null;
    try {
      const raw = localStorage.getItem("nwalks-auth");
      if (raw) {
        const { state } = JSON.parse(raw);
        const u = state?.user;
        if (u?.id && u?.email) sessionUser = u;
      }
    } catch { /* noop */ }

    // ── Step 3: Queue updateUser BEFORE the SDK script loads ─────────────────
    //
    // KEY INSIGHT: updateUser / setUserId only exist on the internal command
    // API that the Netmera SDK injects as `this` while it processes the []
    // queue during initialization.  They are NEVER available on the live
    // window.netmera object.
    //
    // So: if the SDK hasn't initialised yet (window.netmera is still an Array),
    // push the updateUser call NOW — the SDK will call it with the right `this`
    // context as part of its startup sequence.
    //
    // This runs on every page load, so returning users (session from
    // localStorage) always have their External ID registered on the server.
    if (Array.isArray(w.netmera) && sessionUser) {
      const u = sessionUser;
      w.netmera.push(function(this: Record<string, unknown>) {
        try {
          if (typeof this.updateUser === "function") {
            (this.updateUser as Function)({
              externalId: u.email,   // email = External ID (searchable in panel)
              email:      u.email,
              name:       u.name ?? "",
            });
          }
          if (typeof this.setUserId === "function") {
            (this.setUserId as Function)(u.id);
          }
          console.info(
            "%c[N·Walks Netmera] updateUser queued ✓",
            "color:#5C7A5F;font-weight:bold",
            { externalId: u.email, name: u.name }
          );
        } catch (err) {
          console.warn("[N·Walks Netmera] updateUser queue callback failed:", err);
        }
      });
    }

    // ── Step 4: Restore simulation-layer state ────────────────────────────────
    Netmera.init();

    // ── Step 5: Load the SDK script (idempotent) ──────────────────────────────
    if (!document.querySelector('script[data-nwalks-netmera-wsdk="1"]')) {
      const el = document.createElement("script");
      el.src = NETMERA_WSDK_SRC;
      el.async = true;
      el.dataset.nwalksNetmeraWsdk = "1";
      document.head.appendChild(el);
    }

    // ── Step 6: whenSDKReady → fire analytics events ──────────────────────────
    //
    // Note: updateUser is handled above in the queue (Step 3) and runs
    // BEFORE "Netmera is ready…".  Step 6 is only for event-constructor calls
    // (LoginEvent etc.) which require the live SDK object.
    whenSDKReady((sdk: NMApi) => {
      // ── DEBUG ─────────────────────────────────────────────────────────────
      const sdkObj = sdk as unknown as Record<string, unknown>;
      const ownFns = Object.keys(sdkObj).filter((k) => typeof sdkObj[k] === "function");
      console.info(
        "%c[N·Walks Netmera] SDK ready ✓",
        "color:#5C7A5F;font-weight:bold;font-size:13px",
        "\nOwn methods:", ownFns.join(", ") || "(none)"
      );
      // ─────────────────────────────────────────────────────────────────────

      if (sessionUser) {
        const u = sessionUser;

        // Fire a LoginEvent so this session is attributed in analytics
        try {
          const event = new sdk.LoginEvent();
          event.userId   = u.id;
          event.email    = u.email;
          event.userName = u.name ?? "";
          sdk.sendEvent(event);
        } catch (err) {
          console.warn("[N·Walks Netmera] Session-restore LoginEvent failed:", err);
        }

        // Keep the simulation layer in sync
        Netmera.identify(u.id, { email: u.email, name: u.name ?? "" });
      }
    });
  }, []);

  return null;
}
