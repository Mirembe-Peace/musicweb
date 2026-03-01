# Ashaba Music Platform

Full-stack web platform for Ashaba Music — featuring music sales with digital downloads, concert ticket purchasing with QR codes, event bookings, merchandise, and tip payments. All payments are processed through Pesapal (UGX).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, React Router 7, TypeScript, Vite, TailwindCSS 4, Radix UI |
| **Backend** | NestJS 11, TypeORM, PostgreSQL, Passport JWT |
| **Payments** | Pesapal v3 API (Mobile Money, Card) |
| **Email** | Nodemailer (SMTP) |
| **Tickets** | QR code generation (qrcode), PDF tickets (pdfkit) |
| **Audio** | ffmpeg preview generation, S3 storage |
| **Monorepo** | pnpm workspaces, Turborepo |

## Project Structure

```
musicweb/
├── apps/
│   ├── api/                    # NestJS backend
│   │   ├── src/
│   │   │   ├── auth/           # JWT authentication + admin seeding
│   │   │   ├── bookings/       # Event booking requests
│   │   │   ├── concerts/       # Concert management
│   │   │   ├── config/         # TypeORM + app configuration
│   │   │   ├── email/          # Nodemailer service
│   │   │   ├── images/         # Image/gallery management
│   │   │   ├── media/          # S3 upload service
│   │   │   ├── merchandise/    # Store products
│   │   │   ├── music/          # Song catalog + preview generation
│   │   │   ├── payments/       # Pesapal integration + IPN handler
│   │   │   ├── purchases/      # Music purchase + download tokens
│   │   │   └── tickets/        # Concert tickets + QR + PDF
│   │   └── .env.example
│   └── client/                 # React frontend
│       ├── src/
│       │   ├── app/            # Router, contexts, providers
│       │   ├── components/     # UI components + dialogs
│       │   ├── data/           # Mock data (gallery, videos, store)
│       │   ├── layouts/        # Public + Admin layouts
│       │   ├── lib/            # API client, utils
│       │   ├── pages/          # Route pages (public + admin)
│       │   └── services/       # Payment service helpers
│       └── .env.example
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
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

### 3. Configure environment variables

```bash
# API
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your actual credentials

# Client
cp apps/client/.env.example apps/client/.env
```

### 4. Seed the admin account

```bash
# Start the API first, then seed
pnpm --filter ashabamusic-api dev

# In another terminal:
curl -X POST http://localhost:3000/api/auth/seed
```

### 5. Run development servers

```bash
# Run both apps concurrently
pnpm dev

# Or individually:
pnpm --filter ashabamusic-api dev     # API on :3000
pnpm --filter ashabamusic-web dev     # Client on :5173
```

## Environment Variables

### API (`apps/api/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DB_HOST` | Yes | PostgreSQL host |
| `DB_PORT` | No | PostgreSQL port (default: 5432) |
| `DB_USERNAME` | Yes | Database username |
| `DB_PASSWORD` | Yes | Database password |
| `DB_NAME` | Yes | Database name |
| `NODE_ENV` | No | `development` or `production` |
| `PORT` | No | API port (default: 3000) |
| `API_URL` | Yes* | Public API URL (for IPN callbacks) |
| `CLIENT_URL` | Yes* | Public client URL (for email links) |
| `CORS_ORIGINS` | No | Comma-separated allowed origins |
| `JWT_SECRET` | **Yes (prod)** | JWT signing secret (min 32 chars) |
| `ADMIN_EMAIL` | No | Initial admin email |
| `ADMIN_PASSWORD` | No | Initial admin password |
| `PESAPAL_CONSUMER_KEY` | Yes | Pesapal API consumer key |
| `PESAPAL_CONSUMER_SECRET` | Yes | Pesapal API consumer secret |
| `PESAPAL_BASE_URL` | No | Pesapal API base URL |
| `SMTP_HOST` | No | SMTP server for emails |
| `SMTP_PORT` | No | SMTP port (default: 587) |
| `SMTP_USER` | No | SMTP username |
| `SMTP_PASS` | No | SMTP password |
| `SMTP_FROM` | No | From address for emails |
| `AWS_ACCESS_KEY_ID` | No | AWS key (for S3 preview uploads) |
| `AWS_SECRET_ACCESS_KEY` | No | AWS secret |
| `AWS_S3_BUCKET` | No | S3 bucket name |
| `AWS_REGION` | No | AWS region |

*Required in production for correct email links and IPN callbacks.

### Client (`apps/client/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | API base URL (default: `http://localhost:3000`) |

## Build

```bash
# Build both apps
pnpm build

# Build individually
pnpm --filter ashabamusic-api build    # Outputs to apps/api/dist/
pnpm --filter ashabamusic-web build    # Outputs to apps/client/dist/
```

## Production Deployment

### API

```bash
cd apps/api
NODE_ENV=production node dist/main.js
```

Key production considerations:
- Set `NODE_ENV=production` to disable `synchronize` (use TypeORM migrations instead)
- Set `JWT_SECRET` to a strong random string (the app will refuse to start without it)
- Set `API_URL` and `CLIENT_URL` to your public domain
- Set `CORS_ORIGINS` to your frontend domain(s)
- The `/api/auth/seed` endpoint is automatically disabled in production

### Client

The client builds to static files — serve with any static file server (Nginx, Caddy, Vercel, etc.):

```bash
cd apps/client
pnpm build
# Serve the dist/ directory
```

## API Endpoints

### Public

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/music` | List songs (no audio URLs) |
| `GET` | `/api/music/:id` | Get song details |
| `GET` | `/api/concerts` | List all concerts |
| `GET` | `/api/concerts/active` | Get active concert |
| `POST` | `/api/bookings` | Submit booking request |
| `POST` | `/api/payments/initiate` | Initiate Pesapal payment |
| `POST` | `/api/payments/tip` | Send a tip |
| `GET` | `/api/payments/ipn` | Pesapal IPN callback |
| `POST` | `/api/tickets/purchase` | Buy concert ticket |
| `GET` | `/api/tickets/verify/:code` | Verify ticket (for door staff) |
| `GET` | `/api/tickets/my/:email` | Get tickets by email |
| `GET` | `/api/tickets/qr/:code` | Get ticket QR code |
| `POST` | `/api/purchases/initiate` | Buy music |
| `GET` | `/api/purchases/download/:token` | Download purchased music |
| `GET` | `/api/purchases/status/:paymentId` | Check purchase status |
| `POST` | `/api/auth/login` | Admin login |
| `POST` | `/api/auth/seed` | Seed admin (dev only) |

### Protected (JWT required)

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
| `GET` | `/api/bookings` | List bookings |
| `GET` | `/api/tickets` | List all tickets |
| `GET` | `/api/tickets/concert/:id` | Tickets by concert |
| `POST` | `/api/tickets/mark-used/:code` | Mark ticket used |
| `POST` | `/api/images` | Upload image |
| `POST` | `/api/merchandise` | Create product |

## Payment Flow

1. User initiates payment (music purchase, ticket, or tip) from the frontend
2. Backend creates a Pesapal order and returns a `redirect_url`
3. User is redirected to Pesapal's hosted payment page
4. After payment, Pesapal redirects user to `/payment-success`
5. Pesapal sends IPN callback to `/api/payments/ipn`
6. Backend verifies the payment status with Pesapal's API
7. On success: downloads are unlocked, ticket PDFs are generated, emails are sent

## License

Private — All rights reserved.
