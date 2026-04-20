"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { getOrderById, getOrderItemsWithProducts, type OrderStatus } from "@/lib/mock/account";
import ProductImage from "@/components/product/ProductImage";
import { resolveProductImage } from "@/lib/data/products";

const statusBadgeClass: Record<OrderStatus, string> = {
  Processing: "bg-[#FFF7ED] text-[#C2410C]",
  Shipped: "bg-[#EFF6FF] text-[#1D4ED8]",
  Delivered: "bg-[#F0FDF4] text-[#15803D]",
  Cancelled: "bg-[#FEF2F2] text-[#B91C1C]",
};

export default function OrderDetailsPage() {
  const { isAuthenticated } = useAuthStore();
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl font-bold text-ink mb-4">Order Details</h1>
        <p className="text-muted mb-6">Please sign in to view your order details.</p>
        <Link href="/account" className="rounded-lg bg-sage text-white px-5 py-2.5 inline-flex text-sm font-semibold">
          Go to Account
        </Link>
      </div>
    );
  }

  const order = getOrderById(id);
  if (!order) return notFound();

  const items = getOrderItemsWithProducts(order);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/account" className="text-sm text-sage underline">
        ← Back to Account
      </Link>
      <div className="mt-4 bg-white border border-[#E7E2D8] rounded-2xl p-5 sm:p-7">
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            <h1 className="text-3xl font-bold text-ink">Order #{order.id}</h1>
            <p className="text-sm text-muted mt-1">{order.date}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass[order.status]}`}>
            {order.status}
          </span>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-4 rounded-xl border border-[#EEE7DA] p-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#F7F4EF]">
                <ProductImage
                  name={item.product.name}
                  colorHex={item.product.colors[0].hex}
                  colorName={item.product.colors[0].name}
                  imageUrl={resolveProductImage(item.product, 0)}
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-ink">{item.product.name}</p>
                <p className="text-sm text-muted">
                  Qty {item.quantity} · ${item.product.price.toFixed(2)}
                </p>
              </div>
              <p className="font-semibold text-ink">${(item.product.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-[#EEE7DA] flex items-center justify-between">
          <p className="text-sm text-muted">Order Total</p>
          <p className="text-xl font-bold text-ink">${order.total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
