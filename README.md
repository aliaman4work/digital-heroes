# 🏆 Digital Heroes

> **Play Golf. Win Prizes. Change Lives.**

A modern, subscription-driven web platform that combines golf performance tracking, monthly prize draws, and charitable giving — built with the MERN stack.

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| 🎨 Frontend | [digital-heroes.vercel.app](https://digital-heroes-three-theta.vercel.app) |
| ⚙️ Backend API | [digital-heroes-api.onrender.com](https://digital-heroes-api.onrender.com) |

### 🔑 Test Credentials
```
Admin →  admin@digitalheroes.co.in  /  Admin@1234
User  →  Register a new account at /register
```

---

## ✨ What is Digital Heroes?

Digital Heroes is not your typical golf app. It's a **purpose-driven platform** where every subscription:

- 🎯 Enters you into a **monthly prize draw**
- ⛳ Tracks your **Stableford golf scores**
- ❤️ Funds a **charity of your choice**

The more you play, the more impact you create.

---

## 🚀 Features

### For Players
- 📝 **Score Tracking** — Log your last 5 Stableford scores (1–45). Rolling system auto-removes the oldest.
- 🎰 **Monthly Draw** — Your scores become your draw numbers. Match 3, 4, or 5 to win.
- 💚 **Charity Selection** — Choose a charity and set your contribution percentage (min 10%).
- 💰 **Prize Dashboard** — Track winnings, draw history, and payment status.
- 📸 **Winner Verification** — Upload score proof to claim prizes.
- 💳 **Subscription Management** — Monthly (£10) or Yearly (£99) plans via Stripe.

### For Admins
- 👥 **User Management** — View, search, and manage all users.
- 🎲 **Draw Engine** — Run random or algorithmic draws. Simulate before publishing.
- 🏆 **Winner Verification** — Approve/reject proofs and mark payouts as complete.
- ❤️ **Charity Manager** — Add, edit, and feature charities.
- 📊 **Analytics Dashboard** — Live stats on subscribers, prize pools, and charity totals.

---

## 🏗️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-10-FF0055?style=flat)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=flat&logo=node.js)
![Express](https://img.shields.io/badge/Express-4-000000?style=flat&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat&logo=stripe)

### Deployment
![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?style=flat&logo=vercel)
![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=flat&logo=render)

---

## 🎰 Draw & Prize System

```
Monthly Prize Pool
├── 5-Number Match → 40% of pool  (Jackpot — rolls over if unclaimed)
├── 4-Number Match → 35% of pool
└── 3-Number Match → 25% of pool
```

Draw types:
- **Random** — Standard lottery-style number generation
- **Algorithmic** — Weighted by least/most frequent scores across all players

---

## 📁 Project Structure

```
digital-heroes/
├── client/                    # React + Vite frontend
│   └── src/
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Subscribe.jsx
│       │   ├── Charities.jsx
│       │   ├── HowItWorks.jsx
│       │   └── admin/
│       │       ├── AdminDashboard.jsx
│       │       ├── DrawManager.jsx
│       │       ├── UserManager.jsx
│       │       ├── CharityManager.jsx
│       │       └── Winners.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── ProofUpload.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       └── api/
│           └── axios.js
└── server/                    # Express + MongoDB backend
    ├── models/
    │   ├── User.js
    │   ├── Score.js
    │   ├── Draw.js
    │   └── Charity.js
    ├── routes/
    │   ├── auth.js
    │   ├── scores.js
    │   ├── draws.js
    │   ├── charities.js
    │   ├── subscriptions.js
    │   └── admin.js
    ├── controllers/
    │   └── drawEngine.js
    ├── middleware/
    │   └── auth.js
    ├── utils/
    │   └── sendEmail.js
    └── index.js
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Stripe account (test mode)

### 1. Clone the repository
```bash
git clone https://github.com/aliaman4work/digital-heroes.git
cd digital-heroes
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

Seed the database:
```bash
node seed.js
```

Start the server:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd ../client
npm install
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

---

## 🔐 API Endpoints

### Auth
```
POST   /api/auth/register     Register new user
POST   /api/auth/login        Login
GET    /api/auth/me           Get current user
```

### Scores
```
GET    /api/scores            Get user's scores
POST   /api/scores            Add new score
PUT    /api/scores/:id        Edit score
DELETE /api/scores/:id        Delete score
```

### Draws
```
GET    /api/draws             Get published draws
GET    /api/draws/my-results  Get user's draw results
POST   /api/draws/:id/upload-proof  Upload winner proof
```

### Charities
```
GET    /api/charities         List all charities
GET    /api/charities/:id     Get single charity
POST   /api/charities/select  Select charity
POST   /api/charities/donate  Make donation
```

### Subscriptions
```
POST   /api/subscriptions/create-checkout   Start Stripe checkout
POST   /api/subscriptions/cancel            Cancel subscription
GET    /api/subscriptions/status            Get status
```

### Admin
```
GET    /api/admin/users                              All users
DELETE /api/admin/users/:id                          Delete user
POST   /api/admin/draws/simulate                     Simulate draw
POST   /api/admin/draws/:id/publish                  Publish draw
PUT    /api/admin/draws/:drawId/winners/:userId/verify   Verify winner
PUT    /api/admin/draws/:drawId/winners/:userId/payout   Mark paid
POST   /api/admin/charities                          Add charity
DELETE /api/admin/charities/:id                      Delete charity
GET    /api/admin/analytics                          Platform stats
```

---

## 🧪 Testing Checklist

```
✅ User signup & login
✅ Subscription flow (monthly and yearly)
✅ Score entry — 5-score rolling logic
✅ Duplicate date prevention
✅ Draw simulation & publish
✅ Charity selection & contribution
✅ Winner verification & payout tracking
✅ User dashboard — all modules
✅ Admin panel — full control
✅ Responsive design on mobile & desktop
✅ CORS & security headers
✅ Error handling & edge cases
```

---

## 💳 Stripe Test Cards

```
Success:  4242 4242 4242 4242  (any future date, any CVC)
Decline:  4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
```

---

## 👤 User Roles

| Role | Capabilities |
|---|---|
| **Public Visitor** | View home, charities, how it works |
| **Subscriber** | Score entry, draw participation, charity selection |
| **Admin** | Full platform control, draw management, analytics |

---

## 📄 License

This project was built as part of the **Digital Heroes** Full Stack Developer selection process.

© 2026 Digital Heroes · [digitalheroes.co.in](https://digitalheroes.co.in)

---

<div align="center">
  <strong>Built with ❤️ for golfers who want to make a difference</strong>
</div>
