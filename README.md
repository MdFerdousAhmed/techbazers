# TechBazer — Full-Stack E-Commerce Platform
> **Next-Gen Tech & Electronics Superstore**  
> **Author:** TechBazer Team | **Version:** 1.0.0 | **Specification:** SRS V1.0

A high-performance, full-stack e-commerce web platform integrating a dynamic Next.js 16 frontend with an Express REST API backend and a dual-mode persistent database (MongoDB + automatic local JSON fallback).

---

## 🌟 Key Highlights & Features

- **🛍️ Dynamic Product Catalog:** Instant keyword search, category filter, price sorting, pagination, stock status badges, and quick-view detail modal.
- **🛒 Shopping Cart System:** Slide-out drawer, quantity adjustment, out-of-stock validation, persistent cart state across page reloads (hybrid localStorage + REST API sync).
- **💳 Multi-step Checkout:** Seamless checkout flow capturing full shipping information, simulated payment options, instant order total & tax computation.
- **📦 Order History & Tracking:** Customer "My Orders" modal showing placed orders, itemized summary, total, and live status (`Pending`, `Processing`, `Shipped`, `Delivered`).
- **🛡️ JWT Authentication & RBAC:** Secure token-based authentication (`customer` and `admin` roles) with bcrypt password hashing and token persistence.
- **⚡ Admin Operations Portal:** Full administrative dashboard featuring:
  - Real-time revenue, order count, and product analytics summary.
  - Complete Product CRUD (Create, Read, Update, Delete) with image URLs and live stock editing.
  - Customer Order management with instant status dropdown updates.
- **🚀 One-Click Demo Mode:** Top navbar buttons (`Demo Admin` and `Demo Customer`) for instant zero-friction credential loading and testing.
- **💾 Dual-Mode Resilience:** Out-of-the-box local JSON storage engine (`server/data/db.json`) if MongoDB is not running locally, seamlessly migrating to MongoDB when `MONGODB_URI` is connected.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | [Next.js 16 (Turbopack)](https://nextjs.org/), React 19, [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) Icons |
| **Backend API** | [Node.js](https://nodejs.org/), [Express 5](https://expressjs.com/), `cors`, `dotenv`, `morgan` |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` password hashing |
| **Database & Storage** | [Mongoose](https://mongoosejs.com/) (MongoDB) with automated resilient fallback to file-based JSON store (`server/data/db.json`) |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18.x or v20.x+)
- npm or yarn

### 1. Backend Server Setup
```bash
# Navigate to the server folder
cd server

# Install dependencies
npm install

# Start the Express server (runs on http://localhost:5000)
npm run dev
```

The server initializes on port `5000`. If MongoDB is detected via `MONGODB_URI` in `.env`, it connects to MongoDB; otherwise, it boots up with the built-in resilient JSON file store (`server/data/db.json`).

### 2. Frontend Client Setup
```bash
# In a new terminal, navigate to the client folder
cd client

# Install dependencies
npm install

# Start the Next.js development server (runs on http://localhost:3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Credentials

To test both role-based workflows immediately:

| Role | Email | Password | Quick Action |
|---|---|---|---|
| **Admin** | `admin@techbazer.com` *(or admin@auspify.com)* | `admin123` | Click **"Demo Admin"** in top bar |
| **Customer** | `customer@techbazer.com` *(or customer@auspify.com)* | `customer123` | Click **"Demo Customer"** in top bar |

*You can also click **"Quick Demo Fill"** inside the Sign In modal.*

---

## 📡 REST API Reference

Base URL: `http://localhost:5000/api`

### 1. Authentication (`/api/auth`)
- `POST /register` — Register a new customer (`name`, `email`, `password`)
- `POST /login` — Authenticate user and receive JWT token
- `GET /me` — Get authenticated user profile *(Requires Bearer token)*

### 2. Products (`/api/products`)
- `GET /` — List products with filters (`category`, `search`, `sort`, `page`, `limit`)
- `GET /categories/all` — List unique category names
- `GET /:id` — Retrieve product details by ID
- `POST /` — Create a new product *(Admin only)*
- `PUT /:id` — Update product details or stock *(Admin only)*
- `DELETE /:id` — Delete a product *(Admin only)*

### 3. Shopping Cart (`/api/cart`)
- `GET /` — Retrieve current active cart
- `POST /` — Add item to cart (`productId`, `quantity`)
- `PUT /:productId` — Update item quantity (`quantity`)
- `DELETE /:productId` — Remove item from cart
- `DELETE /` — Clear all items from cart

### 4. Orders (`/api/orders`)
- `POST /` — Create order from cart items + shipping details
- `GET /my-orders` — Retrieve logged-in customer's order history *(Protected)*
- `GET /:id` — Get single order details

### 5. Admin Portal (`/api/admin`) *(Admin only)*
- `GET /orders` — Retrieve all customer orders with filtering
- `PATCH /orders/:id/status` — Update order fulfillment status (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`)
- `GET /analytics` — Retrieve sales totals, revenue, and product counts

---

## 🧪 Acceptance Test Verification (SRS Compliance)

| Test ID | Scenario | Expected Result | Status |
|---|---|---|---|
| **TC-01** | **Product Browsing & Filtering** | Customer browses catalog, filters by category, searches by keyword, and views item details. | ✅ **VERIFIED** |
| **TC-02** | **Cart Operations & Persistence** | Customer adds multiple items, edits quantities, observes subtotal calculations, and refreshes the page with cart retained. | ✅ **VERIFIED** |
| **TC-03** | **Order Placement & Status** | Logged-in customer submits order via Checkout. Order persists with status `Pending` in My Orders. | ✅ **VERIFIED** |
| **TC-04** | **Admin Inventory & Order Control** | Admin logs in, creates a new product (instantly appearing in catalog), and updates an order's status to `Shipped`. | ✅ **VERIFIED** |

---

## 📁 Project Directory Structure

```text
E-Commerce Website/
├── README.md                      # This comprehensive documentation
├── client/                        # Next.js 16 (App Router) Frontend
│   ├── .env.local                 # Frontend environment (API URL)
│   ├── package.json
│   ├── next.config.mjs            # Image hostname configuration
│   └── src/
│       ├── app/
│       │   ├── layout.js          # Root layout with SEO meta & Providers
│       │   ├── page.js            # Home Storefront page
│       │   └── globals.css        # Tailwind CSS v4 styling
│       ├── components/
│       │   ├── Navbar.js          # Responsive navigation + Demo switchers
│       │   ├── HeroBanner.js      # Promotional showcase banner
│       │   ├── ProductCard.js     # Responsive product card with quick-add
│       │   ├── ProductDetailModal.js
│       │   ├── CartDrawer.js      # Slide-out shopping cart drawer
│       │   ├── AuthModal.js       # Login & Register modal
│       │   ├── CheckoutModal.js   # Multi-field checkout flow
│       │   ├── MyOrdersModal.js   # Customer order tracking
│       │   ├── AdminPortal.js     # Full admin analytics & inventory management
│       │   └── Providers.js       # Context providers wrapper
│       ├── context/
│       │   ├── AuthContext.js     # JWT & session state management
│       │   ├── CartContext.js     # Cart state & sync logic
│       │   └── ToastContext.js    # Interactive notifications
│       └── services/
│           └── api.js             # Centralized Axios/Fetch client
│
└── server/                        # Express 5 REST API Backend
    ├── .env                       # Backend configuration (PORT, JWT, MongoDB)
    ├── package.json
    ├── server.js                  # Application entry point
    ├── config/
    │   └── db.js                  # Database connection & fallback logic
    ├── data/
    │   ├── initialData.js         # 12 seed products
    │   └── db.json                # Resilient JSON persistent data store
    ├── models/                    # Mongoose schemas (Product, User, Order, Cart)
    ├── controllers/               # Business logic handlers
    ├── routes/                    # Express routing endpoints
    ├── middleware/                # Auth verification & error handling
    └── services/
        └── dataService.js         # Unified dual-mode database access abstraction
```

---

## 🛡️ License & Acknowledgements

Developed for the **Auspify Internship Program — Task 4 (Full-Stack E-Commerce Platform)**.
