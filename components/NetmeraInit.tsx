"use client";

import { useEffect } from "react";
import { Netmera, findLiveSDK, whenSDKReady, setUserIdentity } from "@/lib/netmera";
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

    // ── Step 3: Restore simulation-layer state ────────────────────────────────
    Netmera.init();

    // ── Step 4: Load the SDK script (idempotent) ──────────────────────────────
    if (!document.querySelector('script[data-nwalks-netmera-wsdk="1"]')) {
      const el = document.createElement("script");
      el.src = NETMERA_WSDK_SRC;
      el.async = true;
      el.dataset.nwalksNetmeraWsdk = "1";
      document.head.appendChild(el);
    }

    // ── Step 5: whenSDKReady → set External ID + fire analytics events ────────
    //
    // The correct API for user identification (confirmed from getUser() inspection):
    //   sdk.getUser().setCustomId(email)  ← External ID in Targeting > People
    //   sdk.getUser().setEmail(email)
    //   sdk.getUser().setName(name)
    //   sdk.getUser().save()              ← syncs to Netmera backend
    whenSDKReady((sdk: NMApi) => {
      console.info(
        "%c[N·Walks Netmera] SDK ready ✓",
        "color:#5C7A5F;font-weight:bold;font-size:13px"
      );

      if (sessionUser) {
        const u = sessionUser;

        // 1. Set External ID via getUser() setters — syncs to Netmera backend
        setUserIdentity(sdk, { externalId: u.email, email: u.email, name: u.name ?? "" });

        // 2. Fire LoginEvent so this session is attributed in analytics
        try {
          const event = new sdk.LoginEvent();
          event.setUserId(u.id);  // only setter confirmed on LoginEvent
          sdk.sendEvent(event);
        } catch (err) {
          console.warn("[N·Walks Netmera] Session-restore LoginEvent failed:", err);
        }

        // 3. Keep the simulation layer in sync
        Netmera.identify(u.id, { email: u.email, name: u.name ?? "" });
      }
    });
  }, []);

  return null;
}
