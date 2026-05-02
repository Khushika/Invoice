# InvoiceHound - Freelancer Invoice Management System

A modern SaaS application for freelancers to manage invoices, track payments, and automate payment reminders.

## ✅ Completed Features

### Authentication
- [x] Sign Up page (email/password)
- [x] Sign In page (email/password)
- [x] Forgot Password page (email reset flow)
- [x] Auth API routes (signup, signin, signout, reset-password, delete-account)

### Dashboard
- [x] Dashboard with stats cards (Total Outstanding, Overdue Count, Paid This Month)
- [x] Recent unpaid invoices list
- [x] Dashboard API endpoint

### Invoice Management
- [x] Invoices list page with filters (All, Draft, Sent, Overdue, Paid)
- [x] Search by client name or invoice number
- [x] Create/Edit invoice page with:
  - Client selection dropdown
  - Auto-generated invoice number
  - Issue date + Due date pickers
  - Line items with description, qty, unit price
  - Tax % field
  - Notes field
  - Currency selector (USD, GBP, EUR, INR)
  - Save as Draft / Send to Client buttons
- [x] Invoice detail page with:
  - Full invoice summary
  - Event timeline (Created, Sent, Paid, Reminders)
  - Mark as Paid button
  - Copy Payment Link button
  - Send Manual Reminder button
  - Edit button (draft/sent invoices)
- [x] Invoice API routes (list, create, read, update, mark-paid, send reminder)

### Client Management
- [x] Clients list page with search
- [x] Client cards showing contact info and company
- [x] Create/Edit client page with:
  - Name, email, phone, company, currency
- [x] Client detail page with:
  - Contact information
  - Client invoices list
  - Edit and delete options
- [x] Client API routes (list, create, read, update, delete)

### Settings
- [x] Settings page with tabs:
  - Profile: Email, business name
  - Notifications: Email/payment/overdue alert toggles
  - Billing: Current plan display, upgrade button
  - Sign out button
  - Delete account button

### Design System
- [x] Brand colors implemented:
  - Deep navy background (#1A1A2E)
  - Accent red (#E94560) for urgent/action items
  - Status colors: Paid (green), Overdue (red), Sent (amber), Draft (gray)
- [x] Typography: Sora (headings) + Inter (body)
- [x] Responsive design
- [x] Dark theme with HSL color variables
- [x] Status badge components
- [x] Loading skeletons and empty states

## 📱 Pages Created

### Public Pages
- `/` - Landing page with features, pricing, CTAs
- `/signup` - Account registration
- `/signin` - Login
- `/forgot-password` - Password reset flow

### Authenticated Pages
- `/dashboard` - Dashboard with stats and recent invoices
- `/invoices` - Invoices list with filters
- `/invoices/new` - Create invoice
- `/invoices/:id` - Invoice detail page
- `/invoices/:id/edit` - Edit invoice
- `/clients` - Clients list
- `/clients/new` - Create client
- `/clients/:id` - Client detail page
- `/clients/:id/edit` - Edit client
- `/settings` - User settings

## 🔗 API Endpoints

### Auth
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `POST /api/auth/reset-password` - Password reset
- `POST /api/auth/delete-account` - Delete user account

### Dashboard
- `GET /api/dashboard` - Dashboard stats and recent invoices

### Invoices
- `GET /api/invoices` - List all invoices
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/:id` - Get invoice detail
- `PUT /api/invoices/:id` - Update invoice
- `POST /api/invoices/:id/mark-paid` - Mark invoice as paid
- `POST /api/invoices/:id/remind` - Send payment reminder

### Clients
- `GET /api/clients` - List all clients
- `POST /api/clients` - Create client
- `GET /api/clients/:id` - Get client detail
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

## 🚀 Running the App

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run type checking
pnpm typecheck

# Run tests
pnpm test
```

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **UI**: Radix UI components + TailwindCSS 3
- **Backend**: Express.js
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router 6 (SPA mode)
- **Styling**: TailwindCSS with custom design tokens

## 📊 Mock Data

The app includes mock data for demonstration:
- 2 sample clients (Acme Corp, TechStart Inc)
- 2 sample invoices (1 overdue, 1 sent)
- Mock dashboard stats

In production, replace with real database (Supabase + Prisma).

## 🔐 Security Considerations

Current implementation uses in-memory storage and mock authentication. For production:

1. Replace mock auth with:
   - Supabase Auth or similar
   - Bcrypt password hashing
   - Session/JWT management
   - CSRF protection

2. Add database (Prisma + Supabase PostgreSQL):
   - User, Client, Invoice, Reminder, InvoiceEvent models
   - Row-level security (RLS) policies
   - Database migrations

3. Add rate limiting:
   - Auth endpoints: 5 attempts/15 min
   - API endpoints: 100 req/min per user
   - Password reset: 3 attempts/hour

4. Add payment security:
   - Stripe integration for subscriptions
   - Webhook signature verification
   - Idempotency keys on API calls

5. Compliance:
   - SSL/HTTPS everywhere
   - GDPR compliance (export/delete data)
   - Security headers (HSTS, X-Frame-Options, etc.)

## 🎯 Next Steps for Production

1. **Database Setup**
   - Create Prisma schema
   - Connect to Supabase PostgreSQL
   - Set up migrations

2. **Authentication**
   - Integrate Supabase Auth
   - Add Google OAuth
   - Implement session management

3. **Payments**
   - Integrate Stripe for subscriptions
   - Implement payment portal
   - Add webhook handlers

4. **Email**
   - Integrate Resend for transactional emails
   - Create email templates for invoices and reminders
   - Set up reminder scheduling (BullMQ)

5. **PDF & Exports**
   - Add PDF invoice generation
   - Implement QR code on PDFs
   - Add CSV export functionality

6. **Observability**
   - Set up Sentry for error tracking
   - Add structured logging
   - Implement Posthog analytics

7. **Testing**
   - Unit tests for business logic
   - Integration tests for API routes
   - E2E tests with Playwright

8. **Deployment**
   - Configure for Vercel (Next.js) or similar
   - Set up CI/CD with GitHub Actions
   - Configure environment variables

## 📝 Notes

- All UI components use Tailwind CSS with custom design tokens
- Responsive design works on mobile, tablet, and desktop
- Empty states and loading skeletons on all list pages
- Error handling with user-friendly messages
- Status badges with color-coded styles

## 🎨 Color Scheme

- **Background**: Deep navy (`#1A1A2E`)
- **Accent**: Urgent red (`#E94560`) - for CTAs, overdue items
- **Card**: Slightly lighter navy (`#24293a`)
- **Paid**: Green (`#22C55E`)
- **Overdue**: Red (`#EF4444`)
- **Sent/Pending**: Amber (`#F59E0B`)
- **Draft**: Gray (`#6B7280`)
