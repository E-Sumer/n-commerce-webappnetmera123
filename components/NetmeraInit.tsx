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

    // 1. Ensure the [] queue exists before anything else
    w.netmera = w.netmera || [];

    // 2. Restore simulation-layer state from localStorage
    Netmera.init();

    // 3. Read persisted auth session (Zustand persists under "nwalks-auth")
    let sessionUser: { id: string; email: string; name?: string } | null = null;
    try {
      const raw = localStorage.getItem("nwalks-auth");
      if (raw) {
        const { state } = JSON.parse(raw);
        const u = state?.user;
        if (u?.id && u?.email) sessionUser = u;
      }
    } catch {
      /* noop */
    }

    // 4. Load the SDK script (idempotent)
    if (!document.querySelector('script[data-nwalks-netmera-wsdk="1"]')) {
      const el = document.createElement("script");
      el.src = NETMERA_WSDK_SRC;
      el.async = true;
      el.dataset.nwalksNetmeraWsdk = "1";
      document.head.appendChild(el);
    }

    // 5. Wait for "Netmera is ready…" (after service-worker handshake),
    //    then restore the user session and log available SDK methods.
    whenSDKReady((sdk: NMApi) => {
      // ── DEBUG — log available methods so we can verify the API surface ──────
      const sdkObj = sdk as unknown as Record<string, unknown>;
      const ownFns = Object.keys(sdkObj).filter((k) => typeof sdkObj[k] === "function");
      const protoFns =
        Object.getPrototypeOf(sdkObj) !== Object.prototype
          ? Object.getOwnPropertyNames(Object.getPrototypeOf(sdkObj)).filter(
              (k) => typeof sdkObj[k] === "function" && k !== "constructor"
            )
          : [];
      console.info(
        "%c[N·Walks Netmera] SDK ready ✓",
        "color:#5C7A5F;font-weight:bold;font-size:13px",
        "\nOwn methods  :", ownFns.join(", ") || "(none)",
        "\nProto methods:", protoFns.join(", ") || "(none)"
      );
      // ─────────────────────────────────────────────────────────────────────

      // Session restore: re-fire a LoginEvent so this browser session is
      // attributed to the correct user profile in Netmera (Targeting > People).
      if (sessionUser) {
        const u = sessionUser;
        try {
          const event = new sdk.LoginEvent();
          event.userId   = u.id;
          event.email    = u.email;
          event.userName = u.name ?? "";
          sdk.sendEvent(event);
        } catch (err) {
          // LoginEvent failed — log available methods for diagnosis
          console.warn(
            "[N·Walks Netmera] Session-restore LoginEvent failed:", err,
            "\nAvailable methods:", Object.keys(sdk).filter(k => typeof (sdk as Record<string,unknown>)[k] === "function").join(", ")
          );
        }

        // Keep the simulation layer in sync
        Netmera.identify(u.id, { email: u.email, name: u.name ?? "" });
      }
    });
  }, []);

  return null;
}
