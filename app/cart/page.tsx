"use client";

// Stays "use client": cart state, quantity controls, checkout — all need client interaction.
// trackEvent removed — re-add when Netmera is re-enabled.

import Link from "next/link";
import ProductImage from "@/components/product/ProductImage";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useAuthStore } from "@/lib/store";
import { resolveProductImage } from "@/lib/data/products";
import Button from "@/components/ui/Button";
import { nmViewCart, nmPurchase, nmRemoveFromCart } from "@/lib/netmera-events";
import { useState, useEffect, useRef } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [lastOrderTotal, setLastOrderTotal] = useState<number | null>(null);
  const [lastOrderCount, setLastOrderCount] = useState<number>(0);

  // view_cart: Zustand `persist` hydrates asynchronously, so items is [] on the
  // very first render. We watch `items` and fire once — only after items is non-empty.
  const viewCartFiredRef = useRef(false);
  useEffect(() => {
    if (viewCartFiredRef.current || items.length === 0) return;
    viewCartFiredRef.current = true;
    nmViewCart(
      items.map((i) => ({
        productId: i.productId,
        productName: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
      })),
      totalPrice()
    );
  }, [items]); // re-runs after rehydration; ref prevents double-fire

  const handleCheckout = () => {
    const subtotal = totalPrice();
    const shipping = subtotal >= 100 ? 0 : 12;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const revenue = subtotal + shipping + tax;

    nmPurchase(
      items.map((i) => ({
        productId: i.productId,
        productName: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
      })),
      revenue,
      shipping,
      tax
    );

    setLastOrderTotal(revenue);
    setLastOrderCount(totalItems());
    clearCart();
    setOrderPlaced(true);
  };

  const subtotal = totalPrice();
  const shipping = subtotal >= 100 ? 0 : 12;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + shipping + tax;

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-sage/15 text-sage mx-auto mb-6 flex items-center justify-center text-2xl">
          ✓
        </div>
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-sage mb-3">
          Order Confirmed
        </p>
        <h1 className="text-3xl font-bold text-ink mb-3">Thank you for your purchase</h1>
        <p className="text-muted mb-8">
          Your demo order has been placed successfully.
          {lastOrderTotal !== null && (
            <>
              {" "}
              Total: <span className="font-semibold text-ink">${lastOrderTotal.toFixed(2)}</span>
              {" · "}
              {lastOrderCount} item{lastOrderCount === 1 ? "" : "s"}.
            </>
          )}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/products/new-arrivals">
            <Button variant="primary">Continue Shopping</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag size={64} className="mx-auto text-warm mb-6" strokeWidth={1} />
        <h1 className="text-3xl font-bold text-ink mb-3">Your cart is empty</h1>
        <p className="text-muted mb-10">Looks like you haven&apos;t added anything yet.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/products/women">
            <Button variant="primary">Shop Women</Button>
          </Link>
          <Link href="/products/men">
            <Button variant="outline">Shop Men</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-ink mb-10">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-5">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.size}-${item.selectedColor.name}`}
              className="flex gap-5 p-5 bg-white rounded-2xl border border-warm"
            >
              <Link
                href={`/products/${item.productId}`}
                className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden"
              >
                <ProductImage
                  name={item.product.name}
                  colorHex={item.selectedColor.hex}
                  colorName={item.selectedColor.name}
                  imageUrl={resolveProductImage(item.product, 0)}
                  variant={0}
                />
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <Link
                    href={`/products/${item.productId}`}
                    className="font-semibold text-ink hover:text-sage transition-colors"
                  >
                    {item.product.name}
                  </Link>
                  <button
                    onClick={() => {
                      nmRemoveFromCart(
                        item.productId,
                        item.product.name,
                        item.quantity,
                        item.product.category,
                        item.product.price
                      );
                      removeItem(item.productId, item.size, item.selectedColor.name);
                    }}
                    className="text-muted hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs text-muted">Size {item.size}</span>
                  <span className="text-muted">·</span>
                  <span className="flex items-center gap-1 text-xs text-muted">
                    <span
                      className="w-3 h-3 rounded-full border border-gray-200"
                      style={{ backgroundColor: item.selectedColor.hex }}
                    />
                    {item.selectedColor.name}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-warm rounded-full">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.size,
                          item.selectedColor.name,
                          item.quantity - 1
                        )
                      }
                      className="w-8 h-8 flex items-center justify-center text-muted hover:text-ink transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-semibold w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.size,
                          item.selectedColor.name,
                          item.quantity + 1
                        )
                      }
                      className="w-8 h-8 flex items-center justify-center text-muted hover:text-ink transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <p className="font-bold text-ink">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-warm p-6 sticky top-24">
            <h2 className="text-lg font-bold text-ink mb-6">Order Summary</h2>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-muted">
                <span>Subtotal ({totalItems()} items)</span>
                <span className="text-ink font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Shipping</span>
                <span
                  className={
                    shipping === 0 ? "text-sage font-medium" : "text-ink font-medium"
                  }
                >
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Tax (8%)</span>
                <span className="text-ink font-medium">${tax.toFixed(2)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-[11px] text-sage bg-sage/10 rounded-lg px-3 py-2">
                  Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}
            </div>

            <div className="flex justify-between font-bold text-ink text-lg border-t border-warm pt-4 mb-6">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Button variant="primary" size="lg" fullWidth onClick={handleCheckout}>
              Checkout
              <ArrowRight size={14} />
            </Button>

            {!isAuthenticated && (
              <p className="text-xs text-center text-muted mt-4">
                <Link
                  href="/auth/login"
                  className="text-sage underline hover:text-sage-dark"
                >
                  Sign in
                </Link>{" "}
                to earn rewards on this purchase.
              </p>
            )}

            <div className="flex items-center justify-center gap-3 mt-6 text-[10px] text-muted">
              {["Visa", "Mastercard", "PayPal", "Apple Pay"].map((p) => (
                <span key={p} className="border border-warm rounded px-2 py-0.5 font-medium">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
