import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product, ProductColor, User } from "@/types";

// ─── Cart Store ────────────────────────────────────────────
interface CartStore {
  items: CartItem[];
  addItem: (product: Product, size: number, color: ProductColor) => void;
  removeItem: (productId: string, size: number, colorName: string) => void;
  updateQuantity: (productId: string, size: number, colorName: string, qty: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, size, color) => {
        const match = (item: CartItem) =>
          item.productId === product.id &&
          item.size === size &&
          item.selectedColor.name === color.name;

        const exists = get().items.find(match);
        if (exists) {
          set((s) => ({
            items: s.items.map((item) =>
              match(item) ? { ...item, quantity: item.quantity + 1 } : item
            ),
          }));
        } else {
          set((s) => ({
            items: [
              ...s.items,
              { productId: product.id, product, size, quantity: 1, selectedColor: color },
            ],
          }));
        }
      },

      removeItem: (productId, size, colorName) => {
        set((s) => ({
          items: s.items.filter(
            (item) =>
              !(item.productId === productId &&
                item.size === size &&
                item.selectedColor.name === colorName)
          ),
        }));
      },

      updateQuantity: (productId, size, colorName, qty) => {
        if (qty < 1) {
          get().removeItem(productId, size, colorName);
          return;
        }
        set((s) => ({
          items: s.items.map((item) =>
            item.productId === productId &&
            item.size === size &&
            item.selectedColor.name === colorName
              ? { ...item, quantity: qty }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }),
    { name: "nwalks-cart" }
  )
);

// ─── Auth Store ────────────────────────────────────────────
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "nwalks-auth" }
  )
);
