# Phase 4 — Checkout + Orders (COD + Stripe Checkout)

Adds on top of Phase 3:
- Checkout page (address + payment method)
- Cash on Delivery orders
- Stripe Checkout payment
- Orders list + details

## Backend
```bash
cd backend
npm install
copy .env.example .env
npm run seed
npm run dev
```

Edit `backend/.env` and set:
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `FRONTEND_URL=http://localhost:5173`

## Frontend
```bash
cd ../frontend
npm install
npm run dev
```

Routes:
- `/checkout`
- `/orders`
- `/payment/success?session_id=...`
- `/payment/cancel`
