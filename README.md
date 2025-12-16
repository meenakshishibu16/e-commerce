# Phase 2 — Variants + Cart (Local, no-auth)

This is **Phase 2** of the e‑commerce build:
- Product listing + detail (Phase 1)
- **Size variants** per product
- **Cart** (no login yet)
  - Backend cart stored in MongoDB, keyed by a generated `cartId`
  - Frontend stores `cartId` in `localStorage`
  - Add/update/remove items + totals

> Next phases will add: authentication (user carts), checkout + COD, Stripe, admin dashboard, wishlist, reviews.

---

## 1) Backend setup

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` (Windows PowerShell):
```powershell
copy .env.example .env
```

Run:
```bash
npm run seed
npm run dev
```

---

## 2) Frontend setup

```bash
cd ../frontend
npm install
npm run dev
```

Open http://localhost:5173

---

## 3) Key Phase 2 request flow (Add to cart)
1) Select size on product detail
2) Frontend calls `POST /api/cart/:cartId/items`
3) Backend validates product + size, updates DB cart
4) Backend returns cart JSON
5) UI updates cart count + cart page

