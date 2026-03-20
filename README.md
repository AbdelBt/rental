# Drivo — Premium Car Rental Platform

> A full-stack SaaS car rental platform built for t independent rental agencies get a complete back-office to manage their fleet, track reservations on an interactive calendar, confirm cash payments, monitor monthly revenue, and blacklist problematic customers. On the customer side, users can search and filter vehicles by city, category, fuel type and transmission, view full vehicle details with photo galleries, and complete a booking by paying a 40% deposit online via Stripe — with an automatic confirmation email sent instantly. The platform handles the entire rental lifecycle end-to-end, from vehicle discovery to post-rental payout tracking.

**Live demo**: `http://localhost:3000` (local development)
**Type**: Full-Stack Web Application
**Status**: In active development

---

## Overview

Drivo is a multi-tenant car rental platform that connects independent rental agencies with customers. Agencies get a complete back-office dashboard to manage their fleet, track reservations, and receive payouts. Customers can search, compare, and book vehicles online with a 40% deposit paid via Stripe — the balance is settled on-site at pickup.

The platform handles the full booking lifecycle: search → detail → booking form → Stripe payment → webhook → database reservation → confirmation email.

---

## Key Technical Highlights

- **Dual authentication system** — two completely separate auth flows (agencies vs. customers) built on Supabase Auth with custom `role` metadata
- **Stripe Checkout integration** — server-side session creation, webhook verification with raw body parsing, automatic reservation creation on `checkout.session.completed`
- **Real-time data** — Supabase Realtime-ready architecture with Row Level Security policies ensuring strict data isolation between tenants
- **Optimistic UI** — reservations update instantly in the UI before server confirmation, with rollback on error
- **Local cache layer** — customer data persisted in `localStorage` to survive React HMR reloads and page navigations without re-fetching
- **Context memoization** — auth context split into provider + inner component with `useMemo` to prevent unnecessary re-renders on route changes
- **Singleton Supabase client** — `window.__supabase_client__` pattern prevents Web Locks API conflicts during Vite HMR

---

## Architecture

```
rentCar/
├── rental/                        # Frontend — React SPA
│   ├── src/
│   │   ├── pages/
│   │   │   ├── client/            # Customer portal (dashboard, reservations, profile)
│   │   │   ├── dashboard/         # Agency back-office (fleet, calendar, payouts)
│   │   │   ├── CarDetailPage.jsx  # Car detail + booking widget
│   │   │   ├── ResultsPage.jsx    # Search & filter results
│   │   │   ├── BookingSuccess.jsx # Post-payment confirmation
│   │   │   └── HomePage.jsx       # Landing page
│   │   ├── components/
│   │   │   ├── BookingModal.jsx   # Multi-step booking form + Stripe redirect
│   │   │   ├── ClientLayout.jsx   # Client portal layout with auth provider
│   │   │   └── Navbar.jsx         # Responsive navigation
│   │   ├── hooks/
│   │   │   ├── useClientAuth.js   # Customer auth with localStorage cache
│   │   │   ├── ClientAuthContext.jsx # Memoized auth context
│   │   │   └── useAgencyAuth.js   # Agency auth hook
│   │   └── lib/
│   │       └── supabaseClient.js  # Singleton Supabase client
│   │
│   └── backend/                   # Backend — Node.js / Express
│       └── src/
│           ├── server.js          # Express app, middleware, route mounting
│           ├── routes/
│           │   └── stripe.js      # Stripe checkout + webhook + email
│           └── supabase.js        # Admin client (bypasses RLS)
```

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.2 | UI framework |
| React Router | 7.13 | Client-side routing |
| Supabase JS | 2.98 | Database, Auth, Storage |
| Tailwind CSS | 3.4 | Utility-first CSS |
| Three.js + R3F | 0.183 | 3D car visualization |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js + Express | 4.21 | REST API server |
| Stripe | 20.4 | Payment processing |
| Resend | 6.9 | Transactional emails |
| Supabase Admin | 2.48 | Server-side DB access |

### Infrastructure & Services
| Service | Usage |
|---|---|
| Supabase | PostgreSQL database, Auth (JWT), File storage |
| Stripe | Checkout sessions, webhook events, payment confirmation |
| Resend | Styled HTML email confirmation to customers |

---

## Features

### Customer-Facing
- **Vehicle search** with filters: city, category (Economy / SUV / Luxury), fuel type, transmission, price range
- **Car detail page** with photo gallery, full specs, and an interactive booking widget (date range picker, price calculator)
- **Booking flow**: fill in personal details → pay 40% deposit on Stripe → receive confirmation email
- **Customer portal**: view reservations, cancel bookings (with cancellation policy), update profile, upload KYC documents (driver's license, ID card)
- **Auth**: email/password sign-up with role guard — agency accounts are blocked from the customer portal and vice versa

### Agency Back-Office
- **Fleet management**: add, edit, delete vehicles with photo upload to Supabase Storage, pricing tiers (daily / weekly / monthly), extras (GPS, baby seat, delivery)
- **Reservation calendar**: multi-day spanning bars, per-reservation sidebar with full client details, cash payment confirmation flow
- **Monthly stats**: confirmed / pending / completed reservation counts per month
- **Payout tracking**: commission tracking with agency net revenue
- **Customer blacklist**: flag clients with severity levels and notes

### Payment & Booking Engine
- Stripe Checkout session created server-side with booking metadata embedded
- Webhook handler verifies Stripe signature with raw body, then:
  1. Looks up or creates a customer record in Supabase
  2. Creates the reservation with status `confirmed` and `deposit_paid: true`
  3. Sends a styled HTML email to the customer via Resend
- Deposit = 40% of total; balance collected on-site

---

## Database Schema

Built on **Supabase (PostgreSQL)** with Row Level Security enforced on every table.

| Table | Description |
|---|---|
| `agencies` | Rental agency accounts linked to Supabase Auth |
| `cars` | Vehicle inventory with pricing, specs, photos |
| `reservations` | Bookings: dates, amounts, status, customer info |
| `customers` | Customer accounts linked to Supabase Auth |
| `customer_documents` | KYC uploads (license, ID) stored in Supabase Storage |
| `payouts` | Agency commission payouts with period tracking |
| `blacklist` | Per-agency blacklisted customers with severity |

**RLS policies** ensure:
- Agencies only access their own fleet, reservations, and payouts
- Customers only access their own bookings and documents
- The Express backend uses the `service_role_key` to bypass RLS for trusted server operations (webhook reservation creation)

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/stripe/create-checkout` | Create Stripe Checkout session |
| `POST` | `/api/stripe/webhook` | Handle Stripe events (raw body, signature verified) |
| `GET` | `/api/stripe/session/:id` | Retrieve session data for success page |

---

## Local Development

### Prerequisites
- Node.js 18+
- Supabase project (free tier works)
- Stripe account in test mode
- Resend account with a verified domain
- Stripe CLI

### Frontend
```bash
cd rental
npm install
npm start          # http://localhost:3000
```

### Backend
```bash
cd rental/backend
npm install
npm run dev        # http://localhost:4000
```

### Stripe Webhooks (local)
```bash
stripe login
stripe listen --forward-to localhost:4000/api/stripe/webhook
# Paste the whsec_... secret into backend/.env
```

---

## Environment Variables

### `rental/.env`
```env
REACT_APP_SUPABASE_URL=https://xxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJ...
REACT_APP_BACKEND_URL=http://localhost:4000
```

### `rental/backend/.env`
```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
PORT=4000

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

RESEND_API_KEY=re_...
CLIENT_URL=http://localhost:3000
```

---

## What I Built & Learned

- Designed a **multi-tenant SaaS architecture** from scratch with strict data isolation using Supabase RLS
- Implemented a **complete Stripe payment flow**: server-side session creation, webhook signature verification, idempotent reservation creation
- Solved **React performance issues**: context memoization, HMR-safe singleton pattern, localStorage caching for instant navigation
- Built a **dual-role auth system** without a third-party auth library on top of Supabase Auth
- Designed and built a **custom calendar UI** with multi-day reservation bars, weekend highlights, and animated sidebars
- Integrated **Resend** for transactional emails with custom HTML templates
- Handled **React StrictMode double-mount** with cleanup flags and `requestAnimationFrame` for smooth animations
