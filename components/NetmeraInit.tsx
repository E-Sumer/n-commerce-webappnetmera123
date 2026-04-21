"use client";

// Client-only Netmera bootstrap: avoids next/script beforeInteractive in the root
// layout (which can hoist to <head> and cause React hydration mismatches + console
// warnings about <script> during render).
import { useEffect } from "react";
import { Netmera } from "@/lib/netmera";

const NETMERA_WSDK_SRC =
  "https://cdn.netmera-web.com/wsdkjs/1WbE47mRaA3HqEyx0O3afNPgUyJImYuYezJ_kbsR2JPIKiJ4y02b-w";

export default function NetmeraInit() {
  useEffect(() => {
    // Same as former inline script: var netmera = netmera || []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    w.netmera = w.netmera || [];

    Netmera.init();

    if (!document.querySelector('script[data-nwalks-netmera-wsdk="1"]')) {
      const el = document.createElement("script");
      el.src = NETMERA_WSDK_SRC;
      el.async = true;
      el.dataset.nwalksNetmeraWsdk = "1";
      document.head.appendChild(el);
    }
  }, []);

  return null;
}
