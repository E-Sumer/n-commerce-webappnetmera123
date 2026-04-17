# N·Walks — Netmera Sales Demo Guide

> A fictitious sustainable footwear brand (www.n-walks.com) built to showcase Netmera's Customer Engagement Platform capabilities.

---

## 🚀 Quick Start

```bash
npm run dev
# Open http://localhost:3000
```

---

## 🎯 What This Demo Proves

This website simulates a real e-commerce customer journey with full **Netmera event tracking** built in. Every interaction fires a structured event to the Netmera SDK — demonstrating how brands can collect behavioral data and trigger personalised campaigns.

---

## 🔔 The Debug Panel

In the **bottom-right corner** you'll see the **NETMERA debug panel**. It shows:

- Live events as they fire (colour-coded by type)
- The identified user (after login/signup)
- Full event payload with timestamp
- Session ID and URL context

**This is your primary demo tool** — keep it visible during the presentation.

---

## 📊 Events Tracked

| Event | Trigger | Key Properties |
|---|---|---|
| `page_view` | Every page load | `page`, `category` |
| `view_product` | Product detail page | `productId`, `productName`, `price`, `category` |
| `add_to_cart` | Add to Cart button | `productId`, `size`, `color`, `source` |
| `view_cart` | Cart page | `itemCount`, `totalValue`, `items[]` |
| `purchase` | Checkout button | `totalValue`, `currency`, full `items[]` |
| `signup` | Signup completion | `userId`, `email`, `gender`, `favoriteCategory` |
| `login` | Login completion | `userId`, `email`, `method` |

---

## 👤 User Identification Demo

### Scenario: Anonymous → Identified

1. Open the site in an incognito window
2. Browse products (notice: "Anonymous session" in debug panel)
3. Sign up at `/auth/signup`
4. Watch the debug panel — `identifyUser()` fires with full traits:
   - `email`, `name`, `gender`, `favoriteCategory`

**Netmera can now merge all previous anonymous behaviour to the identified profile.**

---

## 🧩 Segmentation Scenarios

### Segment: High-Intent Women's Shoppers
**Rule:** User identified as `gender: female` + `view_product` × 3 + no `purchase`
→ **Trigger:** Push notification "Still thinking? Your favourites are almost sold out."

### Segment: Cart Abandoners
**Rule:** `add_to_cart` → no `purchase` within 30 mins
→ **Trigger:** Email + push "You left something behind 🛒"

### Segment: New Arrivals Browsers
**Rule:** `page_view` on `/products/new-arrivals` × 2 in session
→ **Trigger:** In-app message "New drops land every Friday — be first."

### Segment: VIP (Repeat Purchasers)
**Rule:** `purchase` × 2+ with `totalValue > $200`
→ **Trigger:** Exclusive access email to next drop

### Segment: Material Fans
**Rule:** Product views where `material = "ZQ Merino Wool"` × 3+
→ **Trigger:** Content push "Why our wool is different"

---

## 🛒 Demo Flow (Recommended)

### Flow 1: Complete Purchase Journey
1. Land on homepage → `page_view` fires
2. Click "Women" → `page_view(category:women)` fires
3. Click a product → `view_product` fires
4. Select size + Add to Cart → `add_to_cart` fires
5. Open cart → `view_cart` fires
6. Click Checkout → `purchase` fires ✅

### Flow 2: Signup + Identification
1. Go to `/auth/signup`
2. Fill name, email, password → Continue
3. Select gender + favourite style → Create Account
4. Watch debug panel: `signup` event + `identifyUser()` fires
5. All previous events are now linked to this user ID ✅

### Flow 3: Cart Abandonment
1. Add 2-3 items to cart
2. Go to cart page → `view_cart` fires
3. Close tab (don't checkout)
4. In Netmera dashboard, show the cart abandonment segment ✅

---

## 🏗 Technical Architecture

```
app/
├── page.tsx                    # Homepage
├── products/
│   ├── women/page.tsx          # Women's listing
│   ├── men/page.tsx            # Men's listing
│   ├── new-arrivals/page.tsx   # New arrivals
│   └── [id]/page.tsx           # Product detail
├── cart/page.tsx               # Cart
└── auth/
    ├── login/page.tsx          # Login
    └── signup/page.tsx         # Signup (with gender/category)

lib/
├── netmera.ts                  # 🔔 Netmera SDK simulation
├── store.ts                    # Cart + Auth state (Zustand)
└── data/products.ts            # Mock product catalogue (16 products)

components/
├── debug/NetmeraDebugPanel.tsx # Live event debug overlay
├── layout/Navbar.tsx           # Sticky nav with cart count
├── home/                       # Hero, CategoryGrid, FeaturedProducts
└── product/                    # ProductCard, ProductGrid (with filters)
```

---

## 🔧 Integrating Real Netmera SDK

Replace `lib/netmera.ts` with the official Netmera Web SDK:

```typescript
// Install: npm install @netmera/web-sdk
import Netmera from '@netmera/web-sdk';

Netmera.init({ apiKey: 'YOUR_API_KEY' });

// User identification
Netmera.setUser({ userId, email, gender });

// Event tracking
Netmera.sendEvent('add_to_cart', { productId, price, category });
```

All `trackEvent()` calls throughout this codebase map 1:1 to the real Netmera event API.

---

## 📱 Channels Netmera Can Trigger From These Events

- **Push Notifications** (web + mobile)
- **Email campaigns** (transactional + marketing)
- **In-app messages** (pop-ups, banners, tooltips)
- **SMS**
- **WhatsApp**
- **Personalized product recommendations**
- **A/B test variants**

---

*Built for Netmera Sales POC · www.n-walks.com*
