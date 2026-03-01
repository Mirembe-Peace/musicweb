# Ashaba Music Platform

Full-stack web platform for Ashaba Music — music sales with digital downloads, concert ticket purchasing with QR codes, event bookings, merchandise store, and tip payments. All payments processed through Pesapal (UGX).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, React Router 7, TypeScript, Vite 7, Tailwind CSS 4, shadcn/ui, Radix UI |
| **Backend** | NestJS 11, TypeORM, PostgreSQL, Passport JWT |
| **Payments** | Pesapal v3 API (Mobile Money, Card) |
| **Email** | Nodemailer (SMTP) |
| **Tickets** | QR code generation (qrcode), PDF tickets (pdfkit) |
| **Audio** | ffmpeg preview generation, AWS S3 storage |
| **Hosting** | Firebase Hosting (client), any Node host (API) |
| **Monorepo** | pnpm workspaces, Turborepo |

## Project Structure

```
musicweb/
├── .env.example                # Shared environment — both apps read from root .env
├── turbo.json                  # Turborepo config with globalEnv
├── pnpm-workspace.yaml
├── package.json
├── apps/
│   ├── api/                    # NestJS backend (port 3000)
│   │   └── src/
│   │       ├── auth/           # JWT authentication + admin seeding
│   │       ├── bookings/       # Event booking requests
│   │       ├── concerts/       # Concert CRUD
│   │       ├── config/         # TypeORM configuration
│   │       ├── email/          # Nodemailer SMTP service
│   │       ├── images/         # Image/gallery management
│   │       ├── media/          # S3 upload service
│   │       ├── merchandise/    # Store products
│   │       ├── music/          # Song catalog + preview generation
│   │       ├── payments/       # Pesapal integration + IPN handler
│   │       ├── purchases/      # Music purchase + download tokens
│   │       └── tickets/        # Concert tickets + QR + PDF
│   └── client/                 # React SPA (port 5173)
│       └── src/
│           ├── app/            # Router, contexts (Audio, Auth, SiteConfig)
│           ├── components/     # UI components (shadcn + custom)
│           ├── data/           # Mock/static data
│           ├── layouts/        # PublicLayout + AdminLayout (shadcn Sidebar)
│           ├── lib/            # API client, firebase, utils
│           ├── pages/          # Public + Admin pages
│           └── services/       # Payment service helpers
```

## Prerequisites

- **Node.js** >= 18
- **pnpm** >= 9 (`npm install -g pnpm`)
- **PostgreSQL** >= 14 (via [Postgres.app](https://postgresapp.com/) on macOS or system install)

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd musicweb
pnpm install
```

### 2. Set up the database

```bash
# Create the database (using psql or Postgres.app)
createdb payment
```

### 3. Configure environment

Both apps share a **single `.env` file at the monorepo root**. Each app uses `dotenv-cli` to load it before running.

```bash
# Create your .env from the template
pnpm setup
# — or manually:
cp .env.example .env
```

Edit `.env` with your actual database credentials and secrets.

### 4. Run development servers

```bash
# Start both apps concurrently (API on :3000, Client on :5173)
pnpm dev
```

The admin account is seeded automatically on first API start when the users table is empty. Default credentials:

| | Value |
|---|---|
| **Email** | `admin@ashabamusic.com` |
| **Password** | `admin123` |

Change these via `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`.

### 5. Run individually (optional)

```bash
pnpm --filter ashabamusic-api dev     # API only
pnpm --filter ashabamusic-web dev     # Client only
```

## Environment Variables

All variables live in a single `.env` at the project root. Both apps load it via `dotenv-cli`:

```json
"with-env": "dotenv -e ../../.env --",
"dev": "pnpm with-env nest start --watch"
```

### Variable Reference

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| **Database** | | | |
| `DB_HOST` | `localhost` | Yes | PostgreSQL host |
| `DB_PORT` | `5432` | No | PostgreSQL port |
| `DB_USERNAME` | `postgres` | Yes | Database user |
| `DB_PASSWORD` | — | Dev: No | Database password (Postgres.app uses trust auth locally) |
| `DB_NAME` | `payment` | Yes | Database name |
| **Application** | | | |
| `NODE_ENV` | `development` | No | `development` / `production` |
| `PORT` | `3000` | No | API server port |
| `API_URL` | `http://localhost:3000` | Prod: Yes | Public API URL (for Pesapal IPN callbacks) |
| `CLIENT_URL` | `http://localhost:5173` | Prod: Yes | Public client URL (for email links) |
| `CORS_ORIGINS` | `http://localhost:5173` | No | Comma-separated allowed origins |
| **Authentication** | | | |
| `JWT_SECRET` | `dev-secret-change-me` | **Prod: Yes** | JWT signing secret (min 32 chars in production) |
| `ADMIN_EMAIL` | `admin@ashabamusic.com` | No | Initial admin email |
| `ADMIN_PASSWORD` | `admin123` | No | Initial admin password |
| **Pesapal Payments** | | | |
| `PESAPAL_CONSUMER_KEY` | — | For payments | Pesapal API consumer key |
| `PESAPAL_CONSUMER_SECRET` | — | For payments | Pesapal API consumer secret |
| `PESAPAL_IPN_ID` | — | For payments | Pesapal IPN registration ID |
| **Email (SMTP)** | | | |
| `SMTP_HOST` | — | No | SMTP server (emails skipped if not set) |
| `SMTP_PORT` | `587` | No | SMTP port |
| `SMTP_USER` | — | No | SMTP username |
| `SMTP_PASS` | — | No | SMTP password |
| `SMTP_FROM` | `noreply@ashabamusic.com` | No | Sender address |
| **AWS S3** | | | |
| `AWS_ACCESS_KEY_ID` | — | No | For audio preview uploads |
| `AWS_SECRET_ACCESS_KEY` | — | No | AWS secret |
| `AWS_S3_BUCKET` | — | No | S3 bucket name |
| `AWS_REGION` | `us-east-1` | No | AWS region |
| **Client (Vite)** | | | |
| `VITE_API_URL` | `http://localhost:3000` | No | API URL (baked into client build) |

## Client Routes

### Public Pages

| Path | Page |
|------|------|
| `/` | Home |
| `/music` | Music catalog |
| `/albums/:id` | Album details |
| `/store` | Merchandise store |
| `/gallery` | Photo gallery (masonry) |
| `/videos` | Video gallery (Vimeo) |
| `/bookings` | Event booking form |
| `/social` | Social media links |
| `/payment-success` | Post-payment redirect |
| `/download/:token` | Music download page |

### Admin Panel (`/admin`)

| Path | Page |
|------|------|
| `/admin/login` | Login |
| `/admin` | Dashboard (stats, recent bookings) |
| `/admin/music` | Song management |
| `/admin/images` | Image/gallery management |
| `/admin/merchandise` | Product management |
| `/admin/concerts` | Concert management (with date picker) |
| `/admin/bookings` | Booking list |
| `/admin/tickets` | Ticket verification + list |

## API Endpoints

All routes are prefixed with `/api`. 37 endpoints across 9 controllers.

### Public

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api` | Health check |
| `POST` | `/api/auth/login` | Admin login → JWT |
| `POST` | `/api/auth/seed` | Seed admin (dev only) |
| `GET` | `/api/music` | List released songs |
| `GET` | `/api/music/:id` | Song details |
| `GET` | `/api/concerts` | List all concerts |
| `GET` | `/api/concerts/active` | Active/enabled concerts |
| `GET` | `/api/concerts/:id` | Concert details |
| `GET` | `/api/images` | List images |
| `GET` | `/api/images/:id` | Image details |
| `GET` | `/api/merchandise` | List products |
| `GET` | `/api/merchandise/:id` | Product details |
| `POST` | `/api/bookings` | Submit booking |
| `POST` | `/api/payments/initiate` | Initiate Pesapal payment |
| `POST` | `/api/payments/tip` | Send a tip |
| `GET` | `/api/payments/ipn` | Pesapal IPN callback |
| `POST` | `/api/tickets/purchase` | Buy concert ticket |
| `GET` | `/api/tickets/verify/:ticketCode` | Verify ticket (door staff) |
| `GET` | `/api/tickets/my/:email` | Tickets by buyer email |
| `GET` | `/api/tickets/qr/:ticketCode` | Ticket QR code image |
| `POST` | `/api/purchases/initiate` | Buy music |
| `GET` | `/api/purchases/download/:token` | Download purchased music |
| `GET` | `/api/purchases/status/:paymentId` | Purchase status |

### Protected (JWT Required)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/stats` | Dashboard statistics |
| `GET` | `/api/music/admin/all` | All songs (with audio URLs) |
| `POST` | `/api/music` | Create song |
| `PATCH` | `/api/music/:id` | Update song |
| `DELETE` | `/api/music/:id` | Delete song |
| `POST` | `/api/concerts` | Create concert |
| `PATCH` | `/api/concerts/:id` | Update concert |
| `DELETE` | `/api/concerts/:id` | Delete concert |
| `POST` | `/api/images` | Upload image |
| `PATCH` | `/api/images/:id` | Update image |
| `DELETE` | `/api/images/:id` | Delete image |
| `POST` | `/api/merchandise` | Create product |
| `PATCH` | `/api/merchandise/:id` | Update product |
| `DELETE` | `/api/merchandise/:id` | Delete product |
| `GET` | `/api/bookings` | List bookings |
| `GET` | `/api/bookings/:id` | Booking details |
| `GET` | `/api/tickets` | List all tickets |
| `GET` | `/api/tickets/concert/:concertId` | Tickets by concert |
| `POST` | `/api/tickets/mark-used/:ticketCode` | Mark ticket used |
| `GET` | `/api/payments` | List payments |
| `GET` | `/api/payments/:id` | Payment details |
| `PATCH` | `/api/payments/:id` | Update payment |
| `DELETE` | `/api/payments/:id` | Delete payment |

## Payment Flow

1. User initiates payment (music purchase, ticket, or tip) from the frontend
2. Backend creates a Pesapal order and returns a `redirect_url`
3. User completes payment on Pesapal's hosted page (Mobile Money or Card)
4. Pesapal redirects user back to `/payment-success`
5. Pesapal sends IPN callback to `/api/payments/ipn`
6. Backend verifies payment status with Pesapal's API
7. On success: downloads are unlocked (48h expiry), ticket PDFs with QR codes are generated, confirmation emails are sent

## Build & Deploy

### Build

```bash
pnpm build                # Both apps
pnpm build:api            # API → apps/api/dist/
pnpm build:web            # Client → apps/client/dist/
```

### Deploy Client (Firebase Hosting)

```bash
pnpm deploy:firebase
```

Or deploy `apps/client/dist/` to any static host (Vercel, Netlify, etc.). Set `VITE_API_URL` in `.env` to your production API URL before building.

### Deploy API

```bash
pnpm build:api
pnpm start:api            # Runs: NODE_ENV=production node dist/main
```

**Production safeguards:**
- `synchronize` is disabled (use TypeORM migrations)
- `/api/auth/seed` is blocked
- JWT requires a strong secret

## Database Schema

| Entity | Table | Key Fields |
|--------|-------|------------|
| `User` | `user` | email, password (bcrypt) |
| `Song` | `songs` | title, audioUrl, coverImageUrl, albumId, albumTitle, price, isReleased, previewUrl |
| `Concert` | `concerts` | title, dateTime, location, price, imageUrl, isEnabled |
| `ArtistImage` | `images` | url, type (ARTIST/GALLERY), description |
| `Product` | `merchandise` | name, price, description, imageUrl |
| `Booking` | `booking` | fullName, email, phone, eventType, eventDate, location, budgetUGX |
| `Payment` | `payment` | orderTrackingId, amount, currency, type (MUSIC_PURCHASE/TICKET/TIP), status |
| `Ticket` | `tickets` | concertId, buyerName, buyerEmail, ticketCode, status (PENDING/PAID/USED/CANCELLED) |
| `Purchase` | `purchases` | buyerEmail, paymentId, downloadToken, downloadExpiresAt, status |
| `PurchaseItem` | `purchase_items` | purchaseId, songId |

## License

Private — All rights reserved.
