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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      w.netmera.push(function(this: any, arg0?: any) {
        // The SDK may pass its internal command API as 'this' OR as the first argument.
        // Check both, then fall back to window.netmera itself.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const candidates: any[] = [arg0, this, w.netmera];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cmd = candidates.find((c: any) => c && typeof c.updateUser === "function");

        // ── DIAGNOSTIC — always visible ──────────────────────────────────
        console.info(
          "%c[N·Walks Netmera] queue callback fired",
          "color:#5C7A5F;font-weight:bold",
          "\ntypeof arg0         :", typeof arg0,
          "\ntypeof this         :", typeof this,
          "\narg0.updateUser     :", typeof arg0?.updateUser,
          "\nthis.updateUser     :", typeof this?.updateUser,
          "\ncmd found           :", !!cmd,
          "\narg0 own keys       :", Object.keys(arg0 ?? {}).slice(0, 6).join(", ") || "(none)",
          "\nthis own keys       :", Object.keys(this  ?? {}).slice(0, 6).join(", ") || "(none)",
        );

        if (cmd) {
          try {
            cmd.updateUser({ externalId: u.email, email: u.email, name: u.name ?? "" });
            if (typeof cmd.setUserId === "function") cmd.setUserId(u.id);
            console.info(
              "%c[N·Walks Netmera] updateUser CALLED ✓",
              "color:#5C7A5F;font-weight:bold",
              { externalId: u.email }
            );
          } catch (err) {
            console.warn("[N·Walks Netmera] updateUser threw:", err);
          }
        } else {
          console.warn(
            "[N·Walks Netmera] updateUser NOT found — neither arg0 nor this has it.",
            "\nAll arg0 keys:", Object.keys(arg0 ?? {}).join(", ") || "(none)",
            "\nAll this keys:", Object.keys(this  ?? {}).join(", ") || "(none)",
          );
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

      // Inspect getUser() return value — might expose setExternalId or updateUser
      try {
        const userObj = sdk.getUser();
        console.info(
          "%c[N·Walks Netmera] getUser() →",
          "color:#5C7A5F;font-weight:bold",
          userObj,
          "\ngetUser own keys:", Object.keys(userObj as object ?? {}).join(", ") || "(none)",
          "\ngetUser methods :", Object.keys(userObj as object ?? {})
            .filter(k => typeof (userObj as Record<string,unknown>)?.[k] === "function")
            .join(", ") || "(none)"
        );
      } catch { /* noop */ }
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
