import type { Product } from "@/types";

export const products: Product[] = [
  // ─── WOMEN ───────────────────────────────────────────────
  {
    id: "w-cloud-runner",
    name: "Cloud Runner",
    price: 120,
    category: "women",
    images: [
      "view",
      "view",
      "view",
    ],
    colors: [
      { name: "Natural White", hex: "#F5F2ED" },
      { name: "Sage Green", hex: "#8FAF8E" },
      { name: "Dusk Grey", hex: "#9B9B9B" },
    ],
    sizes: [5, 6, 7, 8, 9, 10, 11],
    description:
      "Our most breathable everyday runner. Crafted from ZQ Merino Wool, it keeps your feet comfortable year-round — cool in summer, warm in winter.",
    material: "ZQ Merino Wool",
    isNew: false,
    isBestseller: true,
    rating: 4.8,
    reviewCount: 2341,
    tags: ["running", "everyday", "wool", "bestseller"],
  },
  {
    id: "w-wool-lounger",
    name: "Wool Lounger",
    price: 110,
    category: "women",
    images: [
      "view",
      "view",
      "view",
    ],
    colors: [
      { name: "Pebble", hex: "#C4BDB5" },
      { name: "Dusty Rose", hex: "#C4948A" },
    ],
    sizes: [5, 6, 7, 8, 9, 10],
    description:
      "Slip-on comfort redefined. The Wool Lounger features a seamless construction that feels like a second skin.",
    material: "ZQ Merino Wool",
    isNew: false,
    isBestseller: true,
    rating: 4.7,
    reviewCount: 1876,
    tags: ["casual", "slip-on", "wool"],
  },
  {
    id: "w-meadow-mist",
    name: "Meadow Mist",
    price: 130,
    category: "women",
    images: [
      "view",
      "view",
    ],
    colors: [
      { name: "Sage Green", hex: "#8FAF8E" },
      { name: "Forest", hex: "#3D5440" },
    ],
    sizes: [5, 6, 7, 8, 9, 10, 11],
    description:
      "Step into nature with every stride. The Meadow Mist features our plant-based SweetFoam® sole for ultra-light cushioning.",
    material: "Eucalyptus Tree Fibre",
    isNew: false,
    isBestseller: false,
    rating: 4.6,
    reviewCount: 984,
    tags: ["outdoor", "light", "tree-fibre"],
  },
  {
    id: "w-terra-lite",
    name: "Terra Lite",
    price: 115,
    category: "women",
    images: [
      "view",
      "view",
    ],
    colors: [
      { name: "Sand", hex: "#D4C5AD" },
      { name: "Natural White", hex: "#F5F2ED" },
      { name: "Blush", hex: "#E8C4BA" },
    ],
    sizes: [5, 6, 7, 8, 9, 10],
    description:
      "Feather-light and endlessly versatile. The Terra Lite transitions seamlessly from desk to dinner.",
    material: "Sugarcane-based SweetFoam®",
    isNew: false,
    isBestseller: false,
    rating: 4.5,
    reviewCount: 723,
    tags: ["everyday", "light", "versatile"],
  },
  {
    id: "w-dusk-walker",
    name: "Dusk Walker",
    price: 125,
    category: "women",
    images: [
      "view",
      "view",
    ],
    colors: [
      { name: "Violet Dusk", hex: "#9B8EAF" },
      { name: "Midnight", hex: "#2B2D42" },
    ],
    sizes: [5, 6, 7, 8, 9, 10, 11],
    description:
      "From dusk to dawn, the Dusk Walker keeps you moving in style. Featuring our signature SweetFoam® midsole.",
    material: "ZQ Merino Wool Blend",
    isNew: false,
    isBestseller: false,
    rating: 4.4,
    reviewCount: 512,
    tags: ["lifestyle", "versatile", "evening"],
  },
  {
    id: "w-shore-breeze",
    name: "Shore Breeze",
    price: 105,
    category: "women",
    images: [
      "view",
      "view",
    ],
    colors: [
      { name: "Ocean Mist", hex: "#A8C5D4" },
      { name: "Natural White", hex: "#F5F2ED" },
    ],
    sizes: [5, 6, 7, 8, 9, 10],
    description:
      "Inspired by coastal living. The Shore Breeze is your lightest companion for warm-weather walks.",
    material: "Eucalyptus Tree Fibre",
    isNew: false,
    isBestseller: false,
    rating: 4.3,
    reviewCount: 398,
    tags: ["summer", "light", "casual"],
  },

  // ─── MEN ────────────────────────────────────────────────
  {
    id: "m-trail-blazer",
    name: "Trail Blazer",
    price: 130,
    category: "men",
    images: [
      "view",
      "view",
      "view",
    ],
    colors: [
      { name: "Carbon Black", hex: "#2C2C2C" },
      { name: "Forest Green", hex: "#3D5440" },
    ],
    sizes: [7, 8, 9, 10, 11, 12, 13],
    description:
      "Built for the journey ahead. The Trail Blazer combines sustainable materials with serious performance traction.",
    material: "ZQ Merino Wool",
    isNew: false,
    isBestseller: true,
    rating: 4.9,
    reviewCount: 3102,
    tags: ["trail", "performance", "wool", "bestseller"],
  },
  {
    id: "m-urban-wool",
    name: "Urban Wool",
    price: 120,
    category: "men",
    images: [
      "view",
      "view",
    ],
    colors: [
      { name: "Navy", hex: "#2B3D6B" },
      { name: "Concrete", hex: "#8A8A8A" },
      { name: "Carbon Black", hex: "#2C2C2C" },
    ],
    sizes: [7, 8, 9, 10, 11, 12],
    description:
      "The city's most stylish commuter shoe. Clean lines and merino wool craftsmanship make the Urban Wool a wardrobe essential.",
    material: "ZQ Merino Wool",
    isNew: false,
    isBestseller: true,
    rating: 4.7,
    reviewCount: 2198,
    tags: ["urban", "commuter", "wool"],
  },
  {
    id: "m-ridge-runner",
    name: "Ridge Runner",
    price: 135,
    category: "men",
    images: [
      "view",
      "view",
    ],
    colors: [
      { name: "Earth", hex: "#8B6F47" },
      { name: "Stone", hex: "#9B9B9B" },
    ],
    sizes: [7, 8, 9, 10, 11, 12, 13],
    description:
      "Conquer every terrain. The Ridge Runner features a reinforced toe cap and deep-lug SweetFoam® sole.",
    material: "Eucalyptus Tree Fibre",
    isNew: false,
    isBestseller: false,
    rating: 4.6,
    reviewCount: 876,
    tags: ["outdoor", "trail", "rugged"],
  },
  {
    id: "m-stone-path",
    name: "Stone Path",
    price: 125,
    category: "men",
    images: [
      "view",
      "view",
    ],
    colors: [
      { name: "Concrete Grey", hex: "#8A8A8A" },
      { name: "Natural White", hex: "#F5F2ED" },
    ],
    sizes: [7, 8, 9, 10, 11, 12],
    description:
      "Understated elegance for everyday adventures. The Stone Path pairs well with everything from denim to chinos.",
    material: "ZQ Merino Wool",
    isNew: false,
    isBestseller: false,
    rating: 4.5,
    reviewCount: 641,
    tags: ["everyday", "casual", "minimal"],
  },
  {
    id: "m-solar-slip",
    name: "Solar Slip",
    price: 115,
    category: "men",
    images: [
      "view",
      "view",
    ],
    colors: [
      { name: "Warm White", hex: "#F5F2ED" },
      { name: "Sunstone", hex: "#C4A882" },
    ],
    sizes: [7, 8, 9, 10, 11, 12],
    description:
      "Summer's favourite companion. The Solar Slip features a breathable tree-fibre upper for maximum airflow.",
    material: "Eucalyptus Tree Fibre",
    isNew: false,
    isBestseller: false,
    rating: 4.4,
    reviewCount: 487,
    tags: ["summer", "slip-on", "casual"],
  },
  {
    id: "m-grove-walker",
    name: "Grove Walker",
    price: 118,
    category: "men",
    images: [
      "view",
      "view",
    ],
    colors: [
      { name: "Forest Green", hex: "#3D5440" },
      { name: "Carbon Black", hex: "#2C2C2C" },
    ],
    sizes: [7, 8, 9, 10, 11, 12, 13],
    description:
      "Nature-inspired, city-ready. The Grove Walker features a streamlined silhouette built for the modern explorer.",
    material: "ZQ Merino Wool Blend",
    isNew: false,
    isBestseller: false,
    rating: 4.3,
    reviewCount: 334,
    tags: ["lifestyle", "everyday", "green"],
  },

  // ─── NEW ARRIVALS ────────────────────────────────────────
  {
    id: "na-wave-runner",
    name: "Wave Runner",
    price: 145,
    category: "new-arrivals",
    images: [
      "view",
      "view",
      "view",
    ],
    colors: [
      { name: "Ocean Blue", hex: "#4A7FA8" },
      { name: "Sea Foam", hex: "#A8D4C4" },
      { name: "Midnight Navy", hex: "#1B2A4A" },
    ],
    sizes: [5, 6, 7, 8, 9, 10, 11, 12],
    description:
      "Introducing the Wave Runner — our most innovative shoe yet. Featuring a brand-new bio-based foam midsole that absorbs impact like water.",
    material: "Algae-based BioFoam™ + Recycled Polyester",
    isNew: true,
    isBestseller: false,
    rating: 4.9,
    reviewCount: 124,
    tags: ["new", "performance", "innovative"],
  },
  {
    id: "na-peak-climber",
    name: "Peak Climber",
    price: 150,
    category: "new-arrivals",
    images: [
      "view",
      "view",
    ],
    colors: [
      { name: "Mountain Grey", hex: "#8A8A8A" },
      { name: "Summit White", hex: "#F5F2ED" },
    ],
    sizes: [7, 8, 9, 10, 11, 12, 13],
    description:
      "Engineered for high-altitude adventures. The Peak Climber combines our lightest-ever upper with a precision-grip outsole.",
    material: "Recycled Nylon + ZQ Merino Wool",
    isNew: true,
    isBestseller: false,
    rating: 4.8,
    reviewCount: 89,
    tags: ["new", "outdoor", "performance", "trail"],
  },
  {
    id: "na-dawn-breaker",
    name: "Dawn Breaker",
    price: 140,
    category: "new-arrivals",
    images: [
      "view",
      "view",
    ],
    colors: [
      { name: "Sunrise Orange", hex: "#E8914A" },
      { name: "Golden Hour", hex: "#D4A85A" },
      { name: "Dusk Purple", hex: "#9B8EAF" },
    ],
    sizes: [5, 6, 7, 8, 9, 10, 11, 12],
    description:
      "Made for those who chase the first light. The Dawn Breaker is our boldest colourway paired with our most comfortable midsole.",
    material: "Eucalyptus Tree Fibre",
    isNew: true,
    isBestseller: false,
    rating: 4.7,
    reviewCount: 67,
    tags: ["new", "bold", "unisex", "lifestyle"],
  },
  {
    id: "na-ember-slide",
    name: "Ember Slide",
    price: 95,
    category: "new-arrivals",
    images: [
      "view",
      "view",
    ],
    colors: [
      { name: "Warm Terracotta", hex: "#C4724A" },
      { name: "Sand", hex: "#D4C5AD" },
    ],
    sizes: [5, 6, 7, 8, 9, 10, 11, 12],
    description:
      "Our first-ever slide sandal. The Ember Slide brings N·Walks' signature cushioning to open-toe comfort.",
    material: "Sugarcane-based SweetFoam®",
    isNew: true,
    isBestseller: false,
    rating: 4.6,
    reviewCount: 203,
    tags: ["new", "sandal", "summer", "casual"],
  },
];

const PRODUCT_IMAGE_BY_ID: Record<string, string> = {
  // Women (6 unique)
  "w-cloud-runner":
    "https://www.allbirds.com/cdn/shop/files/A12467_26Q1_Tree-Glider-Burlwood-Burlwood-Sole_PDP_LEFT.png?v=1774480073&width=1280",
  "w-wool-lounger":
    "https://www.allbirds.com/cdn/shop/files/A12378_26Q2_Breezer-Mary-Jane-Dusty-Pink-Dusty-Pink-Sole_PDP_LEFT.png?v=1774475317&width=1280",
  "w-meadow-mist":
    "https://www.allbirds.com/cdn/shop/files/A12469_26Q2_Womens-Varsity-Strap-Burlwood-Natural-White-Sole_PDP_LEFT.png?v=1774566733&width=1280",
  "w-terra-lite":
    "https://www.allbirds.com/cdn/shop/files/A12258_26Q1_Cruiser-Slip-On-Terry-Ochre-Warm-White-Sole_PDP_LEFT.png?v=1774566112&width=1280",
  "w-dusk-walker":
    "https://www.allbirds.com/cdn/shop/files/A12468_26Q2_Breezer-Point-Burlwood-Dark-Cocoa-Sole_PDP_LEFT.png?v=1774475526&width=1280",
  "w-shore-breeze":
    "https://www.allbirds.com/cdn/shop/files/A12852_26Q1_Cruiser-Canvas-Sea-Spray-Natural-White-Sole_PDP_LEFT.png?v=1771027497&width=1280",

  // Men (6 unique)
  "m-trail-blazer":
    "https://www.allbirds.com/cdn/shop/files/A12500_26Q1_Runner-NZ-Canvas-Stripes-Deep-Navy-Blizzard-Sole_PDP_LEFT.png?v=1774550585&width=1280",
  "m-urban-wool":
    "https://www.allbirds.com/cdn/shop/files/A12852_26Q1_Cruiser-Canvas-Sea-Spray-Natural-White-Sole_PDP_LEFT.png?v=1771027497&width=1280",
  "m-ridge-runner":
    "https://www.allbirds.com/cdn/shop/files/A12286_26Q1_Dasher-NZ-Seagrass-Parchment_PDP_LEFT.png?v=1774484356&width=1280",
  "m-stone-path":
    "https://www.allbirds.com/cdn/shop/files/A12270_26Q1_Mens-Varsity-Parchment-Blizzard-Sole_PDP_LEFT.png?v=1765307399&width=1280",
  "m-solar-slip":
    "https://www.allbirds.com/cdn/shop/files/A11645_25Q4_Wool-Cruiser-Mid-Select-Deep-Navy-Gum-Sole_PDP_LEFT_c9e6c446-9edf-4fe5-9453-725eff5326f8.png?v=1761691426&width=1280",
  "m-grove-walker":
    "https://www.allbirds.com/cdn/shop/files/A12468_26Q2_Breezer-Point-Burlwood-Dark-Cocoa-Sole_PDP_LEFT.png?v=1774475526&width=1280",

  // New arrivals (4 unique)
  "na-wave-runner":
    "https://www.allbirds.com/cdn/shop/files/A12469_26Q2_Womens-Varsity-Strap-Burlwood-Natural-White-Sole_PDP_LEFT.png?v=1774566733&width=1280",
  "na-peak-climber":
    "https://www.allbirds.com/cdn/shop/files/A12270_26Q1_Mens-Varsity-Parchment-Blizzard-Sole_PDP_LEFT.png?v=1765307399&width=1280",
  "na-dawn-breaker":
    "https://www.allbirds.com/cdn/shop/files/A12378_26Q2_Breezer-Mary-Jane-Dusty-Pink-Dusty-Pink-Sole_PDP_LEFT.png?v=1774475317&width=1280",
  "na-ember-slide":
    "https://www.allbirds.com/cdn/shop/files/A12258_26Q1_Cruiser-Slip-On-Terry-Ochre-Warm-White-Sole_PDP_LEFT.png?v=1774566112&width=1280",
};

const FALLBACK_IMAGE =
  "https://www.allbirds.com/cdn/shop/files/A12467_26Q1_Tree-Glider-Burlwood-Burlwood-Sole_PDP_LEFT.png?v=1774480073&width=1280";

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "new-arrivals") {
    return products.filter((p) => p.category === "new-arrivals");
  }
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isBestseller || p.isNew).slice(0, 6);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}

export function resolveProductImage(product: Product, variant = 0): string {
  const explicitImage = product.images[variant];
  if (typeof explicitImage === "string" && explicitImage.startsWith("http")) {
    return explicitImage;
  }
  return PRODUCT_IMAGE_BY_ID[product.id] ?? FALLBACK_IMAGE;
}
