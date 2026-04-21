"use client";

// Stays "use client": cart badge count (Zustand), mobile menu toggle, active link detection.
// Scroll listener removed — replaced with a permanent static border (saves ~60fps JS calls).

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useAuthStore } from "@/lib/store";
import { useMemo, useState, useSyncExternalStore } from "react";

const navLinks = [
  { id: "shop", label: "Shop", href: "/" },
  { id: "women", label: "Women", href: "/products/women" },
  { id: "men", label: "Men", href: "/products/men" },
  { id: "new-arrivals", label: "New Arrivals", href: "/products/new-arrivals" },
];

function subscribePersistHydration(onStoreChange: () => void) {
  const unsubCart = useCartStore.persist.onFinishHydration(onStoreChange);
  const unsubAuth = useAuthStore.persist.onFinishHydration(onStoreChange);
  return () => {
    unsubCart();
    unsubAuth();
  };
}

function getPersistHydrated() {
  return useCartStore.persist.hasHydrated() && useAuthStore.persist.hasHydrated();
}

export default function Navbar() {
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.totalItems);
  const { isAuthenticated, user } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  /** SSR + first client frame match empty persist; then Zustand rehydrates from localStorage. */
  const persistReady = useSyncExternalStore(
    subscribePersistHydration,
    getPersistHydrated,
    () => false
  );
  const cartCount = persistReady ? totalItems() : 0;
  const showAuth = persistReady && isAuthenticated;
  const isMenuOpen = menuOpen && menuPath === pathname;

  const activeNavId = useMemo(() => {
    if (pathname === "/") return "shop";
    if (pathname === "/products/women") return "women";
    if (pathname === "/products/men") return "men";
    if (pathname === "/products/new-arrivals") return "new-arrivals";
    return null;
  }, [pathname]);

  return (
    <>
      {/* Static header — no scroll-triggered class changes, no event listeners */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-cream border-b border-warm/60">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold tracking-[0.15em] text-ink hover:text-sage transition-colors"
          >
            N·WALKS
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={`text-xs font-medium tracking-widest uppercase transition-colors hover:text-sage ${
                  activeNavId === link.id
                    ? "text-sage border-b border-sage pb-0.5"
                    : "text-ink"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <Link
              href={showAuth ? "/account" : "/auth/login"}
              className="text-ink hover:text-sage transition-colors"
              title={showAuth ? user?.name || "Account" : "Login"}
            >
              <User size={20} strokeWidth={1.5} />
            </Link>

            <Link
              href="/cart"
              className="relative text-ink hover:text-sage transition-colors"
              title="Cart"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-sage text-white text-[9px] font-bold flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => {
                setMenuPath(pathname);
                setMenuOpen((v) => !v);
              }}
              className="md:hidden text-ink hover:text-sage transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav-menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div
            id="mobile-nav-menu"
            className="md:hidden bg-white border-t border-warm px-6 py-6 flex flex-col gap-5"
          >
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium tracking-widest uppercase text-ink hover:text-sage transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-warm" />
            <Link
              href={showAuth ? "/account" : "/auth/login"}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium tracking-widest uppercase text-ink hover:text-sage transition-colors"
            >
              {showAuth ? "My Account" : "Login / Sign Up"}
            </Link>
          </div>
        )}
      </header>

      {/* Layout spacer */}
      <div className="h-16" />
    </>
  );
}
