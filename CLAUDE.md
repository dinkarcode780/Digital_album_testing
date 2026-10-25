# Digital Album — Project Guide

## Overview
Digital Album is a full-stack web application for photography/videography studios to manage events, media, bookings, subscriptions, and client interactions. Studios (Admins) upload event media, clients (Users) view, favorite, and select photos/videos from their events.

**Author:** Dinkar  
**Repo:** https://github.com/dinkarcode780/Digital_album  
**Branches:** `main` (original), `beta` (security-hardened)

---

## Tech Stack

### Client (`Client/`)
- **React 19** + **Vite 8** (ES modules, `type: "module"`)
- **Redux Toolkit** for state management
- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin)
- **React Router DOM v7** for routing
- **Axios** for API calls
- **Framer Motion** for animations
- **React Hook Form** for forms
- **React Hot Toast** for notifications

### Server (`Server/`)
- **Express 5** (ES modules, `type: "module"`)
- **Mongoose 9** + **MongoDB** (localhost:27017/digital_album)
- **JWT** (jsonwebtoken) for auth
- **Bcrypt** for password hashing
- **Cloudinary** for media storage (images/videos)
- **Razorpay** for payments
- **MSG91** for SMS/OTP
- **Nodemailer** for emails
- **Helmet** for security headers
- **express-rate-limit** for rate limiting

---

## How to Run

### Prerequisites
- Node.js v22+
- MongoDB v5+ running on localhost:27017

### Server
```bash
cd Server
npm install
# Create .env file (see .env.example or Environment Variables section)
npm run dev    # Runs on PORT from .env (default 1000)
```

### Client
```bash
cd Client
npm install
npm run dev    # Runs on http://localhost:5173
```

---

## Environment Variables (Server/.env)
**NEVER commit .env to git.** It's in `.gitignore`.

Required variables:
- `NODE_ENV` — development/production
- `PORT` — Server port (default: 1000)
- `DB_URL` — MongoDB connection string
- `JWT_SECRET` — Crypto-random 128-char hex (use `openssl rand -hex 64`)
- `CLIENT_URL` — Frontend URL for CORS (e.g., http://localhost:5173)
- `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` — Auto-created SuperAdmin credentials
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`
- `EMAIL_USER` / `EMAIL_PASSWORD` — Gmail app password for Nodemailer
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` / `RAZORPAY_WEBHOOK_SECRET`
- `MSG91_SENDER` / `MSG91_AUTH_KEY` / `MSG91_FLOW_ID` / `MSG91_INVITE_FLOW_ID`
- `SUBSCRIPTION_TRIAL_DAYS`

---

## Project Structure

### Server
```
Server/
├── src/
│   ├── server.js              # Entry point, crash handlers
│   ├── app.js                 # Express app setup, middleware, routes, rate limiters
│   ├── config/
│   │   └── db.js              # MongoDB connection (exits on failure)
│   ├── api/
│   │   ├── controllers/       # Business logic
│   │   │   ├── userController.js       # User auth, profile, CRUD
│   │   │   ├── adminController.js      # Admin auth, profile, client management
│   │   │   ├── mediaController.js      # Media upload/delete via Cloudinary
│   │   │   ├── eventRoute.js           # Event CRUD
│   │   │   ├── bookingController.js    # Razorpay booking/payment
│   │   │   ├── subscriptionController.js # Razorpay subscriptions
│   │   │   ├── blogController.js       # Blog CRUD (HTML sanitized)
│   │   │   ├── inviteController.js     # Event invites via MSG91/email
│   │   │   ├── studioShowcaseController.js # Studio profiles, services, testimonials
│   │   │   ├── publicStudioController.js   # Public studio pages
│   │   │   └── userslectedMediaController.js # User media favorites/selection
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js  # JWT auth (isUser, isAdmin, isSuperAdmin)
│   │   │   ├── multerS3.js       # File upload + Cloudinary (MIME + extension validation)
│   │   │   └── nodemailer.js     # Email sending with HTML escaping
│   │   └── routes/            # Express route definitions
│   ├── models/                # Mongoose schemas (18 models)
│   └── utils/
│       ├── asyncHandler.js    # Async error wrapper
│       ├── escapeRegex.js     # Regex escaper for $regex queries (NoSQL injection prevention)
│       ├── sanitizeHtml.js    # HTML sanitizer (XSS prevention)
│       ├── validatePassword.js # Password complexity validation (8-128 chars)
│       └── sendInviteEmail.js # Invite email template
```

### Client
```
Client/
├── src/
│   ├── main.jsx               # React entry
│   ├── App.jsx                # Router setup
│   ├── components/            # UI components
│   │   └── common/
│   │       └── ProtectedImage.jsx  # Token-authenticated image loading
│   ├── pages/                 # Route pages
│   ├── redux/                 # Redux slices + store
│   └── utils/                 # Helpers
```

---

## User Roles (3 levels)
1. **SuperAdmin** — Platform owner. Manages all Admins, Users, subscriptions, and system settings. Auto-created from env vars on first run.
2. **Admin** — Studio owner. Manages their assigned clients, events, media, blogs, services, testimonials, bookings.
3. **User** — Client. Views their events/media, favorites photos, submits selections, makes bookings.

---

## Key API Patterns

### Authentication
- JWT tokens with `tokenVersion` — incrementing tokenVersion invalidates all old tokens
- Tokens expire in **1 day** (`1d`)
- Auth middleware strips `password`, `resetOTP`, `resetOTPExpires` from `req.user`
- Admin logout requires auth (`isAdmin` middleware)

### Security (applied in beta branch)
- **Rate limiting**: auth routes (5 req/15min), OTP (3 req/15min), booking (20 req/15min)
- **Helmet.js** security headers
- **CORS** restricted to `CLIENT_URL` (not wildcard)
- **Body size limit**: 10mb
- **NoSQL injection prevention**: `escapeRegex()` on all `$regex` queries
- **XSS prevention**: `sanitizeHtml()` on blog content
- **Timing-safe HMAC**: `crypto.timingSafeEquals` for Razorpay payment/webhook verification
- **IDOR prevention**: Ownership checks on all user-facing endpoints
- **Account enumeration prevention**: Generic error messages on login/forgot-password
- **MIME + extension validation**: Double-check on file uploads
- **Password validation**: 8-128 chars, uppercase, lowercase, number required
- **No mass assignment**: Explicit field whitelists on update endpoints

### Common Patterns
- All controllers use `asyncHandler` wrapper (no try-catch needed)
- File uploads go through Cloudinary via `multerS3.js`
- Auth middleware runs BEFORE multer on media routes (prevents unauthenticated upload DoS)
- Webhook endpoint has dedicated secret (no fallback to payment key)

---

## Database (MongoDB)

**Connection:** `mongodb://localhost:27017/digital_album`

### Models (18)
| Model | Purpose |
|-------|---------|
| userModel | Users (all 3 roles), has `tokenVersion` for JWT invalidation |
| eventModel | Events (weddings etc), linked to user + subcategory |
| mediaModel | Photos/videos stored in Cloudinary |
| inviteModel | Event invitations (email/phone) |
| bookingModel | Razorpay bookings/payments |
| subscriptionModel | Studio subscriptions |
| subscriptionPlanModel | Subscription plan definitions |
| blogModel | Studio blogs (HTML sanitized) |
| servicesModel | Studio service packages |
| testimonialModel | Client testimonials |
| studioProfileModel | Studio public profile |
| companyModel | Company/platform info |
| aboutModel | About page content |
| memberModel | Team members |
| emailModel | Email records |
| eventCateogoryModel | Event categories (typo in filename is intentional) |
| subCategoryModel | Event sub-categories |
| userslectedMediaModel | User's selected/favorited media (typo in filename is intentional) |

**Note:** Some filenames have typos (`eventCateogoryModel`, `userslectedMediaModel`) — these are intentional and match throughout the codebase. Don't rename without updating all references.

---

## Important Notes

### Things NOT to do
- **Never commit `.env`** — contains real API keys and secrets
- **Never use wildcard CORS** — always use `CLIENT_URL`
- **Never skip tokenVersion check** in auth middleware
- **Never return password hash** in API responses
- **Never use `$regex` without `escapeRegex()`** — NoSQL injection risk
- **Never run multer before auth** on protected routes

### Known Filename Typos (DO NOT RENAME)
- `eventCateogoryModel.js` (should be "Category")
- `userslectedMediaModel.js` / `userslectedMediaController.js` / `userslectedMediaRoute.js` (should be "Selected")

### Git
- `.env` is in `.gitignore` for both Client/ and Server/
- `node_modules/` is gitignored
- Primary branch: `beta` (security-hardened), `main` (original)
