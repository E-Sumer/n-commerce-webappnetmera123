import { getProductById } from "@/lib/data/products";

export type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

export interface OrderRecord {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface AddressRecord {
  id: string;
  fullName: string;
  street: string;
  city: string;
  postcode: string;
  country: string;
  isDefault: boolean;
}

export interface PointsRecord {
  id: string;
  date: string;
  label: string;
  delta: number;
}

export const mockOrders: OrderRecord[] = [
  {
    id: "NW-20931",
    date: "2026-04-11",
    total: 264,
    status: "Delivered",
    items: [
      { productId: "w-cloud-runner", quantity: 1 },
      { productId: "m-trail-blazer", quantity: 1 },
    ],
  },
  {
    id: "NW-20890",
    date: "2026-04-06",
    total: 145,
    status: "Shipped",
    items: [{ productId: "na-wave-runner", quantity: 1 }],
  },
  {
    id: "NW-20777",
    date: "2026-03-29",
    total: 110,
    status: "Processing",
    items: [{ productId: "w-wool-lounger", quantity: 1 }],
  },
  {
    id: "NW-20598",
    date: "2026-03-10",
    total: 95,
    status: "Cancelled",
    items: [{ productId: "na-ember-slide", quantity: 1 }],
  },
];

export const mockAddresses: AddressRecord[] = [
  {
    id: "addr-1",
    fullName: "Emre Sumer",
    street: "Ataturk Cad. No: 21",
    city: "Istanbul",
    postcode: "34700",
    country: "Turkey",
    isDefault: true,
  },
  {
    id: "addr-2",
    fullName: "Emre Sumer",
    street: "10 Market Street",
    city: "London",
    postcode: "E1 6AN",
    country: "United Kingdom",
    isDefault: false,
  },
];

export const mockWishlistIds = [
  "w-terra-lite",
  "m-urban-wool",
  "na-dawn-breaker",
  "m-solar-slip",
];

export const mockPoints = {
  balance: 248,
  tier: "Bronze",
  nextTier: "Silver",
  nextTierAt: 400,
  history: [
    { id: "pt-1", date: "2026-04-11", label: "Order NW-20931", delta: 42 },
    { id: "pt-2", date: "2026-04-06", label: "Order NW-20890", delta: 24 },
    { id: "pt-3", date: "2026-04-02", label: "Referral Bonus", delta: 40 },
    { id: "pt-4", date: "2026-03-18", label: "Reward Redemption", delta: -20 },
  ] satisfies PointsRecord[],
};

export function getOrderById(orderId: string) {
  return mockOrders.find((order) => order.id === orderId);
}

export function getOrderItemsWithProducts(order: OrderRecord) {
  return order.items
    .map((item) => {
      const product = getProductById(item.productId);
      if (!product) return null;
      return { ...item, product };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
}

