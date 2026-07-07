# Phase 1: Product Architecture Design
## InvoiceHound — Freelancer Revenue OS

**Objective**: Design complete application architecture for production-grade freelancer invoicing and payment system.

**Status**: Architecture Design (No Implementation)

---

## Table of Contents

1. [Application Vision](#application-vision)
2. [System Architecture Overview](#system-architecture-overview)
3. [Application Modules](#application-modules)
4. [Navigation Hierarchy](#navigation-hierarchy)
5. [Feature Boundaries](#feature-boundaries)
6. [Folder Structure](#folder-structure)
7. [Database Schema](#database-schema)
8. [Entity Relationships](#entity-relationships)
9. [API Architecture](#api-architecture)
10. [Service Layer Design](#service-layer-design)
11. [Permission Model (RBAC)](#permission-model-rbac)
12. [Data Flow Diagrams](#data-flow-diagrams)
13. [Architecture Decision Records](#architecture-decision-records)

---

## Application Vision

### Product Definition
**InvoiceHound** is a comprehensive revenue operations platform for freelancers and small service businesses.

### Core Value Proposition
- **For freelancers**: Never chase unpaid invoices again
- **For agencies**: Manage complex invoicing, teams, and automation
- **For service businesses**: Complete visibility into business revenue

### Key Principles
1. **Single source of truth** - One system for all revenue operations
2. **User-centric design** - Simplicity without losing power
3. **Automation first** - Reduce manual work through smart defaults
4. **Data integrity** - No data loss, full audit trails
5. **Scalability** - From 1 freelancer to 100+ team members
6. **Security** - Enterprise-grade data protection

### Target Users
- **Tier 1**: Freelancers (0-5 invoices/month)
- **Tier 2**: Small agencies (5-50 invoices/month)
- **Tier 3**: Growing teams (50-500 invoices/month)

---

## System Architecture Overview

### High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Client Application                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Web SPA    │  │   Mobile     │  │   API Docs   │          │
│  │  (React)     │  │  (Planned)   │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS
                ┌──────────▼──────────────┐
                │  API Gateway / Router  │
                │  - Auth Middleware     │
                │  - Rate Limiting       │
                │  - Logging             │
                └──────────┬──────────────┘
                           │
    ┌──────────────────────┼──────────────────────┐
    │                      │                      │
┌───▼────────────┐  ┌──────▼──────────┐  ┌──────▼──────────┐
│  Auth Service  │  │ Business Logic  │  │  Integration    │
│                │  │  Services       │  │  Services       │
│ - Login/Logout │  │                 │  │                 │
│ - Sessions     │  │ - Invoices      │  │ - Email (Resend)│
│ - RBAC         │  │ - Clients       │  │ - SMS (Twilio)  │
│ - Tokens       │  │ - Reports       │  │ - Payments      │
└────────────────┘  │ - Automation    │  │ - PDFs          │
                    └────────┬────────┘  └─────────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
         ┌────▼────┐   ┌─────▼──────┐   ┌──▼──────────┐
         │PostgreSQL   │   Redis    │   │Object Store │
         │Database     │  (Cache)   │   │  (S3 etc)   │
         └────────────┘   └──────────┘   └─────────────┘

External Services:
├── Email: Resend
├── SMS: Twilio
├── Payments: Stripe
├── Analytics: PostHog (optional)
└── Error Tracking: Sentry (optional)
```

### Technology Stack

#### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: React Query (data) + Zustand (UI state)
- **Styling**: Tailwind CSS
- **Components**: Radix UI
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

#### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 5
- **Language**: TypeScript
- **Database**: PostgreSQL 14+
- **ORM**: Prisma
- **Validation**: Zod
- **Auth**: JWT + iron-session
- **Password**: bcryptjs
- **Email**: Resend SDK
- **SMS**: Twilio SDK
- **Payments**: Stripe SDK
- **PDF**: PDFKit
- **Logging**: Pino
- **Cache**: Redis (optional)

#### DevOps & Infrastructure
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions
- **Database Hosting**: AWS RDS / Supabase
- **App Hosting**: Netlify / Vercel / AWS
- **File Storage**: AWS S3 / Cloudflare R2
- **Monitoring**: CloudWatch / Datadog

---

## Application Modules

### Module Breakdown

The application is divided into 8 core modules:

#### 1. **Authentication & Identity Module**
- Responsibility: User authentication, authorization, session management
- Scope:
  - User registration
  - Login/logout
  - Password management
  - Email verification
  - Social sign-in (Google, Microsoft)
  - Session/JWT management
  - Role-based access control
- Database Entities: `User`, `Session`, `PasswordReset`, `EmailVerification`

#### 2. **Workspace & Org Module**
- Responsibility: User workspace and business profile management
- Scope:
  - User profile
  - Business/organization info
  - Workspace settings
  - Currency and timezone
  - Tax configuration
  - Notification preferences
  - API keys
  - Webhooks
- Database Entities: `Organization`, `OrganizationSettings`, `TeamMember`, `Invite`

#### 3. **Client CRM Module**
- Responsibility: Client/customer data management
- Scope:
  - Client profiles
  - Contact information
  - Billing details
  - Tax information
  - Communication history
  - Client notes and files
  - Client projects
  - Activity timeline
- Database Entities: `Client`, `ClientContact`, `ClientNote`, `ClientFile`, `ClientProject`, `Communication`

#### 4. **Invoice Engine Module**
- Responsibility: Invoice lifecycle management
- Scope:
  - Invoice creation/editing/deletion
  - Invoice templates
  - Invoice numbering and sequences
  - Line items management
  - Tax calculations
  - Discount handling
  - Multi-currency support
  - Invoice status tracking
  - Version history
  - Credit notes
- Database Entities: `Invoice`, `InvoiceLineItem`, `InvoiceTemplate`, `InvoiceVersion`, `CreditNote`

#### 5. **Payment & Financial Module**
- Responsibility: Payment processing and financial tracking
- Scope:
  - Manual payment recording
  - Stripe payment processing
  - Razorpay integration (future)
  - Partial payments
  - Refunds
  - Payment reconciliation
  - Receipt generation
  - Cash flow tracking
  - Tax calculation for accounting
- Database Entities: `Payment`, `PaymentMethod`, `StripeEvent`, `Refund`, `TaxCalculation`

#### 6. **Automation & Reminders Module**
- Responsibility: Payment reminders and invoice automation
- Scope:
  - Recurring invoice scheduling
  - Reminder configuration
  - Email/SMS reminder sending
  - Escalation rules
  - Automation rules
  - Job scheduling
  - Automation history
- Database Entities: `RecurringInvoice`, `ReminderRule`, `AutomationJob`, `ReminderHistory`

#### 7. **Reporting & Analytics Module**
- Responsibility: Business intelligence and reporting
- Scope:
  - Revenue reporting
  - Cash flow analysis
  - Client analytics
  - Invoice aging
  - Payment trends
  - Tax reports
  - Custom reports
  - Data export
- Database Entities: `Report`, `ReportSchedule`, `Analytics`

#### 8. **Integration & Extension Module**
- Responsibility: External service integrations
- Scope:
  - Email service (Resend)
  - SMS service (Twilio)
  - Payment gateway (Stripe)
  - Accounting (QuickBooks, Wave - future)
  - CRM sync (Pipedrive, HubSpot - future)
  - Webhook management
  - API access
- Database Entities: `Integration`, `WebhookEvent`, `APIKey`

### Module Dependencies

```
Authentication & Identity
    │
    ├──► Workspace & Org
    │        │
    │        ├──► Client CRM
    │        │        │
    │        │        ├──► Invoice Engine
    │        │        │        │
    │        │        │        ├──► Payment & Financial
    │        │        │        │        │
    │        │        │        │        ├──► Automation & Reminders
    │        │        │        │        │
    │        │        │        │        └──► Reporting & Analytics
    │        │        │        │
    │        │        │        └──► Integration & Extension
    │        │        │
    │        │        └──► Reporting & Analytics
    │        │
    │        └──► Reporting & Analytics
    │
    └──► Integration & Extension

Note: All modules can be used independently but depend on Auth
```

---

## Navigation Hierarchy

### Information Architecture (IA)

```
Root
├── PUBLIC ROUTES (no auth required)
│   ├── /                           Landing page
│   ├── /signup                     User registration
│   ├── /signin                     User login
│   ├── /forgot-password            Password reset
│   ├── /pay/:token                 Payment portal
│   └── /404                        Not found
│
├── PROTECTED ROUTES (auth required)
│   │
│   ├── DASHBOARD LAYER
│   │   ├── /dashboard              Main dashboard
│   │   └── /settings               Settings hub
│   │
│   ├── REVENUE MANAGEMENT
│   │   ├── /invoices               Invoice list
│   │   ├── /invoices/new           New invoice
│   │   ├── /invoices/:id           Invoice detail
│   │   ├── /invoices/:id/edit      Invoice edit
│   │   ├── /invoices/:id/duplicate Invoice duplicate
│   │   ├── /invoices/:id/payment   Invoice payment
│   │   │
│   │   ├── /recurring-invoices     Recurring list
│   │   ├── /recurring-invoices/new New recurring
│   │   ├── /recurring-invoices/:id Recurring detail
│   │   │
│   │   └── /credit-notes           Credit notes
│   │
│   ├── CLIENT MANAGEMENT
│   │   ├── /clients                Client list
│   │   ├── /clients/new            New client
│   │   ├── /clients/:id            Client detail
│   │   ├── /clients/:id/edit       Client edit
│   │   ├── /clients/:id/invoices   Client invoices
│   │   └── /clients/:id/projects   Client projects
│   │
│   ├── BUSINESS OPERATIONS
│   │   ├── /templates              Invoice templates
│   │   ├── /templates/new          New template
│   │   ├── /templates/:id          Template detail
│   │   │
│   │   ├── /reports                Reports & analytics
│   │   ├── /reports/revenue        Revenue report
│   │   ├── /reports/cash-flow      Cash flow report
│   │   ├── /reports/tax            Tax report
│   │   │
│   │   ├── /activity               Activity log
│   │   └── /audit                  Audit trail
│   │
│   ├── SEARCH & BROWSE
│   │   └── /search                 Global search
│   │
│   └── SETTINGS
│       ├── /settings/profile       User profile
│       ├── /settings/organization  Business info
│       ├── /settings/branding      Invoice branding
│       ├── /settings/team          Team members
│       ├── /settings/roles         Roles & permissions
│       ├── /settings/integrations  Third-party APIs
│       ├── /settings/billing       Subscription
│       ├── /settings/export        Data export
│       ├── /settings/webhooks      Webhook config
│       ├── /settings/notifications Notification prefs
│       └── /settings/security      Security & auth
│
└── API ROUTES
    └── /api/v1/*                   RESTful API endpoints
```

### Main Navigation (Sidebar)

```
InvoiceHound Logo
├── Dashboard (icon: home)
├── Invoices (icon: file)
│   └── Quick action: New Invoice
├── Clients (icon: users)
│   └── Quick action: New Client
├── Templates (icon: file-code)
├── Reports (icon: chart-bar)
├── Activity (icon: history)
├── Recurring (icon: repeat)
└── Settings (icon: gear)

Sidebar Footer:
├── Help (?)
├── Feedback (speech bubble)
└── Sign Out (power icon)

Top Bar:
├── Search (global)
├── Notifications
├── User Menu
│   ├── Profile
│   ├── Settings
│   └── Sign Out
└── Mobile Menu (hamburger on small screens)
```

---

## Feature Boundaries

### Clear Module Ownership

| Feature | Module | Boundaries |
|---------|--------|-----------|
| User login | Auth | Handles auth only; delegates org context to Workspace module |
| Invoice creation | Invoice Engine | Creates invoice; delegates payment tracking to Payment module |
| Send reminder | Automation | Sends via Integration module; logs to Activity via services |
| Report generation | Reporting | Reads from Payment/Invoice modules; doesn't write |
| Client creation | Client CRM | Manages client data; Invoice Engine references clients |
| Payment recording | Payment | Records payment; notifies Invoice Engine to update status |
| Email sending | Integration | Executes email send; other modules call it |

### Cross-Module Communication

```
Example: User pays invoice through Stripe

1. Payment & Financial Module:
   ├── Receives Stripe webhook
   ├── Creates Payment record
   └── Publishes PaymentCreated event

2. Invoice Engine Module:
   ├── Listens for PaymentCreated
   ├── Updates invoice status
   └── Publishes InvoiceStatusChanged event

3. Automation Module:
   ├── Listens for InvoiceStatusChanged
   ├── Cancels pending reminders
   └── Publishes ReminderCancelled event

4. Activity Module:
   ├── Logs all events
   └── Makes available to Reporting

All via Event Bus (publish/subscribe pattern)
```

---

## Folder Structure

### Scalable, Modular Organization

```
invoice-hound/
│
├── client/                          # Frontend React app
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx           # Root layout
│   │   │   └── page.tsx             # Landing page
│   │   │
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── signin.tsx
│   │   │   │   │   ├── signup.tsx
│   │   │   │   │   └── forgot-password.tsx
│   │   │   │   ├── components/
│   │   │   │   │   ├── SignInForm.tsx
│   │   │   │   │   └── SignUpForm.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useAuth.ts
│   │   │   │   │   └── useLogin.ts
│   │   │   │   ├── services/
│   │   │   │   │   └── authService.ts
│   │   │   │   └── types.ts
│   │   │   │
│   │   │   ├── workspace/
│   │   │   │   ├── pages/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── services/
│   │   │   │   └── types.ts
│   │   │   │
│   │   │   ├── invoices/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── list.tsx
│   │   │   │   │   ├── create.tsx
│   │   │   │   │   ├── detail.tsx
│   │   │   │   │   └── edit.tsx
│   │   │   │   ├── components/
│   │   │   │   │   ├── InvoiceForm.tsx
│   │   │   │   │   ├── InvoiceList.tsx
│   │   │   │   │   ├── InvoiceDetail.tsx
│   │   │   │   │   └── LineItemsEditor.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useInvoices.ts
│   │   │   │   │   └── useInvoiceForm.ts
│   │   │   │   ├── services/
│   │   │   │   │   └── invoiceService.ts
│   │   │   │   └── types.ts
│   │   │   │
│   │   │   ├── clients/
│   │   │   │   ├── pages/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── services/
│   │   │   │   └── types.ts
│   │   │   │
│   │   │   ├── payments/
│   │   │   │   ├── pages/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── services/
│   │   │   │   └── types.ts
│   │   │   │
│   │   │   ├── reports/
│   │   │   │   ├── pages/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── services/
│   │   │   │   └── types.ts
│   │   │   │
│   │   │   ├── settings/
│   │   │   │   ├── pages/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── services/
│   │   │   │   └── types.ts
│   │   │   │
│   │   │   └── dashboard/
│   │   │       ├── pages/
│   │   │       ├── components/
│   │   │       ├── hooks/
│   │   │       ├── services/
│   │   │       └── types.ts
│   │   │
│   │   ├── shared/
│   │   │   ├── components/          # Shared UI components
│   │   │   │   ├── MainLayout.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── TopBar.tsx
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   └── ui/              # Radix-based components
│   │   │   │
│   │   │   ├── hooks/               # Shared hooks
│   │   │   │   ├── useApi.ts        # Generic API hook
│   │   │   │   ├── useAuth.ts       # Auth context
│   │   │   │   ├── useWorkspace.ts  # Org context
│   │   │   │   └── useMobile.ts
│   │   │   │
│   │   │   ├── lib/                 # Shared utilities
│   │   │   │   ├── api.ts           # API client
│   │   │   │   ├── fetch.ts         # Fetch wrapper
│   │   │   │   ├── validation.ts    # Validators
│   │   │   │   ├── format.ts        # Formatters
│   │   │   │   ├── constants.ts     # App constants
│   │   │   │   └── types.ts         # Global types
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useApi.ts
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useWorkspace.ts
│   │   │   │
│   │   │   └── store/               # Global state
│   │   │       ├── useAuthStore.ts
│   │   │       ├── useUIStore.ts
│   │   │       └── index.ts
│   │   │
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   └── variables.css
│   │   │
│   │   ├── types/
│   │   │   ├── index.ts             # Re-export all types
│   │   │   └── api.ts               # API response types
│   │   │
│   │   ├── App.tsx                  # Route definitions
│   │   ├── main.tsx                 # Entry point
│   │   └── env.d.ts
│   │
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── server/                          # Backend Node/Express
│   ├── src/
│   │   ├── middleware/
│   │   │   ├── auth.ts              # JWT verification
│   │   │   ├── errorHandler.ts      # Global error handler
│   │   │   ├── logger.ts            # Logging middleware
│   │   │   ├── rateLimit.ts         # Rate limiting
│   │   │   └── validation.ts        # Request validation
│   │   │
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.router.ts   # Routes
│   │   │   │   ├── auth.service.ts  # Business logic
│   │   │   │   ├── auth.controller.ts # Request handlers
│   │   │   │   ├── auth.types.ts    # TS interfaces
│   │   │   │   └── auth.validations.ts # Zod schemas
│   │   │   │
│   │   │   ├── workspace/
│   │   │   │   ├── workspace.router.ts
│   │   │   │   ├── workspace.service.ts
│   │   │   │   ├── workspace.controller.ts
│   │   │   │   ├── workspace.types.ts
│   │   │   │   └── workspace.validations.ts
│   │   │   │
│   │   │   ├── invoices/
│   │   │   │   ├── invoices.router.ts
│   │   │   │   ├── invoices.service.ts
│   │   │   │   ├── invoices.controller.ts
│   │   │   │   ├── invoices.types.ts
│   │   │   │   └── invoices.validations.ts
│   │   │   │
│   │   │   ├── clients/
│   │   │   │   └── (similar structure)
│   │   │   │
│   │   │   ├── payments/
│   │   │   │   └── (similar structure)
│   │   │   │
│   │   │   ├── reports/
│   │   │   │   └── (similar structure)
│   │   │   │
│   │   │   └── integrations/
│   │   │       └── (similar structure)
│   │   │
│   │   ├── services/
│   │   │   ├── email.service.ts     # Email via Resend
│   │   │   ├── sms.service.ts       # SMS via Twilio
│   │   │   ├── payment.service.ts   # Stripe integration
│   │   │   ├── pdf.service.ts       # PDF generation
│   │   │   ├── auth.service.ts      # JWT/session handling
│   │   │   ├── upload.service.ts    # File uploads
│   │   │   └── event.service.ts     # Event bus
│   │   │
│   │   ├── database/
│   │   │   ├── prisma.ts            # Prisma client
│   │   │   ├── migrations/          # DB migrations
│   │   │   └── schema.prisma        # Data schema
│   │   │
│   │   ├── lib/
│   │   │   ├── logger.ts            # Logging setup
│   │   │   ├── errors.ts            # Error classes
│   │   │   ├── utils.ts             # Utilities
│   │   │   └── constants.ts         # Constants
│   │   │
│   │   ├── types/
│   │   │   ├── index.ts
│   │   │   ├── express.ts           # Express augmentations
│   │   │   └── api.ts               # API types
│   │   │
│   │   ├── app.ts                   # Express app setup
│   │   ├── config.ts                # App configuration
│   │   ├── index.ts                 # Server entry point
│   │   └── env.d.ts
│   │
│   ├── prisma/
│   │   └── schema.prisma            # Database schema
│   │
│   ├── tsconfig.json
│   └── package.json
│
├── shared/                          # Shared types & utils
│   ├── types/
│   │   ├── index.ts
│   │   ├── invoice.ts
│   │   ├── client.ts
│   │   ├── payment.ts
│   │   └── auth.ts
│   │
│   ├── validations/
│   │   ├── invoice.ts
│   │   ├── client.ts
│   │   └── auth.ts
│   │
│   ├── constants/
│   │   ├── api.ts
│   │   ├── status.ts
│   │   └── roles.ts
│   │
│   └── utils/
│       ├── format.ts
│       ├── currency.ts
│       └── date.ts
│
├── docs/                            # Documentation
│   ├── PHASE_0_AUDIT_REPORT.md
│   ├── PHASE_1_ARCHITECTURE.md
│   ├── API.md
│   ├── DATABASE.md
│   ├── DEPLOYMENT.md
│   └── ADRs/
│
├── .github/
│   └── workflows/                   # CI/CD pipelines
│       ├── test.yml
│       ├── build.yml
│       └── deploy.yml
│
├── docker-compose.yml               # Local development
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── tsconfig.base.json
├── turbo.json                       # Monorepo config
└── package.json
```

### Naming Conventions

```
Folders:
  modules/      - Feature modules
  components/   - React components
  hooks/        - Custom React hooks
  services/     - Business logic
  lib/          - Utilities and helpers
  types/        - TypeScript interfaces
  styles/       - CSS/SCSS files
  
Files:
  *.service.ts     - Business logic
  *.controller.ts  - Request handlers
  *.router.ts      - Route definitions
  *.types.ts       - Type definitions
  *.validations.ts - Zod schemas
  *.test.ts        - Unit tests
  *.spec.ts        - Integration tests
  
Components:
  PascalCase.tsx   - React components
  useLikeThis.ts   - Custom hooks
  functionName.ts  - Utilities
```

---

## Database Schema

### Entity-Relationship Diagram (ERD)

```
User ─────────────────────┐
 ├─ id (PK)              │
 ├─ email (UNIQUE)       │
 ├─ passwordHash         │
 ├─ name                 │
 ├─ createdAt            │
 └─ updatedAt            │
                         │
                  ┌──────▼─────────┐
                  │ Organization   │
                  ├─ id (PK)       │
                  ├─ userId (FK)   │◄─ owns
                  ├─ name          │
                  ├─ logo          │
                  ├─ createdAt     │
                  └─ updatedAt     │
                         │
          ┌──────────────┼──────────────┐
          │              │              │
      ┌───▼────┐   ┌────▼──────┐  ┌───▼──────────┐
      │ Client │   │ Invoice   │  │ TeamMember   │
      └─────┬──┘   └──┬────────┘  └──────────────┘
            │          │
        ┌───▼──────┐   │
        │ Project  │   │
        └──────────┘   │
                       │
            ┌──────────▼──────────┐
            │ InvoiceLineItem    │
            │ ├─ invoiceId (FK)  │
            │ └─ amount          │
            └───────────────────┘
                       │
            ┌──────────▼──────────┐
            │ Payment            │
            │ ├─ invoiceId (FK)  │
            │ └─ amount          │
            └───────────────────┘
```

### Core Tables

#### Users Table
```sql
CREATE TABLE "User" (
  id                String    @id @default(cuid())
  email             String    @unique
  passwordHash      String
  name              String?
  avatar            String?
  emailVerified     DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  organizations     Organization[]
  sessions          Session[]
  passwordResets    PasswordReset[]
  
  @@map("users")
)
```

#### Organization Table
```sql
CREATE TABLE "Organization" (
  id                String    @id @default(cuid())
  userId            String    @db.VarChar
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  name              String
  logo              String?
  website           String?
  address           String?
  phone             String?
  taxId             String?
  
  currency          String    @default("USD")
  timezone          String    @default("UTC")
  
  settings          OrganizationSettings?
  clients           Client[]
  invoices          Invoice[]
  payments          Payment[]
  teamMembers       TeamMember[]
  integrations      Integration[]
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  @@index([userId])
  @@map("organizations")
}
```

#### Client Table
```sql
CREATE TABLE "Client" (
  id                String    @id @default(cuid())
  organizationId    String
  organization      Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  name              String
  email             String
  phone             String?
  company           String?
  website           String?
  address           String?
  taxId             String?
  currency          String
  
  status            String    @default("active")
  notes             String?
  
  invoices          Invoice[]
  projects          Project[]
  communications    Communication[]
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  @@unique([organizationId, email])
  @@index([organizationId])
  @@map("clients")
}
```

#### Invoice Table
```sql
CREATE TABLE "Invoice" (
  id                String    @id @default(cuid())
  organizationId    String
  organization      Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  clientId          String
  client            Client    @relation(fields: [clientId], references: [id], onDelete: Restrict)
  
  invoiceNumber     String    @unique
  status            String    @default("draft")
  
  issuedDate        DateTime
  dueDate           DateTime
  
  subtotal          Decimal   @db.Decimal(12, 2)
  taxAmount         Decimal   @db.Decimal(12, 2)
  discountAmount    Decimal   @db.Decimal(12, 2)
  total             Decimal   @db.Decimal(12, 2)
  
  taxRate           Decimal   @db.Decimal(5, 2)
  discountRate      Decimal   @db.Decimal(5, 2)
  
  notes             String?
  terms             String?
  
  lineItems         InvoiceLineItem[]
  payments          Payment[]
  reminders         ReminderHistory[]
  versions          InvoiceVersion[]
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  @@unique([organizationId, invoiceNumber])
  @@index([organizationId])
  @@index([clientId])
  @@index([status])
  @@index([dueDate])
  @@map("invoices")
}
```

#### Payment Table
```sql
CREATE TABLE "Payment" (
  id                String    @id @default(cuid())
  organizationId    String
  organization      Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  invoiceId         String
  invoice           Invoice   @relation(fields: [invoiceId], references: [id], onDelete: Restrict)
  
  amount            Decimal   @db.Decimal(12, 2)
  method            String    # "stripe", "manual", "bank_transfer"
  
  stripePaymentId   String?
  transactionId     String?
  
  notes             String?
  status            String    @default("completed")
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  @@index([organizationId])
  @@index([invoiceId])
  @@index([status])
  @@map("payments")
}
```

#### Additional Key Tables
- `InvoiceLineItem` - Line items on invoices
- `InvoiceTemplate` - Reusable invoice templates
- `InvoiceVersion` - Invoice version history
- `RecurringInvoice` - Configuration for recurring invoices
- `ReminderRule` - Reminder configuration
- `ReminderHistory` - Sent reminders log
- `Project` - Client projects
- `TeamMember` - Organization team members
- `Integration` - Third-party integrations config
- `OrganizationSettings` - Org-level settings
- `Session` - User sessions
- `PasswordReset` - Password reset tokens
- `AuditLog` - Activity tracking

Full schema will be in `server/prisma/schema.prisma`

---

## Entity Relationships

### Key Relationships

```
1. User → Organization (1:1)
   - A user owns one organization
   - Organization deleted when user deleted

2. Organization → Client (1:Many)
   - Org has many clients
   - Client belongs to one org
   - Client deleted when org deleted

3. Organization → Invoice (1:Many)
   - Org has many invoices
   - Invoice belongs to one org
   - Invoice deleted when org deleted

4. Client → Invoice (1:Many)
   - Client has many invoices
   - Invoice belongs to one client
   - Cascade prevent on delete (orphan check)

5. Invoice → InvoiceLineItem (1:Many)
   - Invoice has many line items
   - Line item belongs to one invoice
   - Line items deleted when invoice deleted

6. Invoice → Payment (1:Many)
   - Invoice can have multiple payments (partial payments)
   - Payment belongs to one invoice
   - Cascade prevent on delete

7. Organization → Payment (1:Many)
   - Org tracks all payments
   - Payment belongs to org

8. Invoice → RecurringInvoice (1:Many)
   - Recurring config generates invoices
   - Invoice knows which recurring created it (optional)

9. Organization → TeamMember (1:Many)
   - Org has team members with roles
   - Team member belongs to one org

10. Organization → Integration (1:Many)
    - Org configures integrations
    - Settings stored per org
```

---

## API Architecture

### RESTful API Design

#### Base URL & Versioning
```
https://api.invoicehound.com/api/v1
```

#### General Structure

```
GET    /api/v1/{resource}           # List with pagination/filtering
POST   /api/v1/{resource}           # Create new
GET    /api/v1/{resource}/{id}      # Get one
PUT    /api/v1/{resource}/{id}      # Update
DELETE /api/v1/{resource}/{id}      # Delete
POST   /api/v1/{resource}/{id}/{action} # Custom action
```

#### API Endpoint Map

```
AUTHENTICATION
  POST   /api/v1/auth/signup
  POST   /api/v1/auth/signin
  POST   /api/v1/auth/signout
  POST   /api/v1/auth/refresh
  POST   /api/v1/auth/forgot-password
  POST   /api/v1/auth/reset-password
  POST   /api/v1/auth/verify-email
  
ORGANIZATION
  GET    /api/v1/organization
  PUT    /api/v1/organization
  GET    /api/v1/organization/settings
  PUT    /api/v1/organization/settings
  
CLIENTS
  GET    /api/v1/clients              # Paginated list
  POST   /api/v1/clients              # Create
  GET    /api/v1/clients/:id          # Detail
  PUT    /api/v1/clients/:id          # Update
  DELETE /api/v1/clients/:id          # Delete
  GET    /api/v1/clients/:id/invoices # Client invoices
  GET    /api/v1/clients/:id/projects # Client projects
  
INVOICES
  GET    /api/v1/invoices              # List with filters
  POST   /api/v1/invoices              # Create
  GET    /api/v1/invoices/:id          # Detail
  PUT    /api/v1/invoices/:id          # Update
  DELETE /api/v1/invoices/:id          # Delete
  POST   /api/v1/invoices/:id/duplicate # Duplicate
  POST   /api/v1/invoices/:id/send      # Send to client
  POST   /api/v1/invoices/:id/mark-paid # Mark as paid
  GET    /api/v1/invoices/:id/pdf       # PDF download
  POST   /api/v1/invoices/:id/credit-note # Create credit note
  
PAYMENTS
  GET    /api/v1/payments              # List
  POST   /api/v1/payments              # Record payment
  GET    /api/v1/payments/:id          # Detail
  PUT    /api/v1/payments/:id          # Update
  DELETE /api/v1/payments/:id          # Cancel
  POST   /api/v1/payments/:id/refund   # Refund
  
TEMPLATES
  GET    /api/v1/templates             # List
  POST   /api/v1/templates             # Create
  GET    /api/v1/templates/:id         # Detail
  PUT    /api/v1/templates/:id         # Update
  DELETE /api/v1/templates/:id         # Delete
  POST   /api/v1/templates/:id/duplicate # Copy
  
RECURRING
  GET    /api/v1/recurring-invoices    # List
  POST   /api/v1/recurring-invoices    # Create
  GET    /api/v1/recurring-invoices/:id # Detail
  PUT    /api/v1/recurring-invoices/:id # Update
  DELETE /api/v1/recurring-invoices/:id # Delete
  POST   /api/v1/recurring-invoices/:id/pause # Pause
  POST   /api/v1/recurring-invoices/:id/resume # Resume
  
REMINDERS
  GET    /api/v1/reminders             # Rules
  POST   /api/v1/reminders             # Create rule
  PUT    /api/v1/reminders/:id         # Update
  DELETE /api/v1/reminders/:id         # Delete
  
REPORTS
  GET    /api/v1/reports               # Dashboard data
  GET    /api/v1/reports/revenue       # Revenue report
  GET    /api/v1/reports/cash-flow     # Cash flow
  GET    /api/v1/reports/tax           # Tax report
  GET    /api/v1/reports/aging         # Aging analysis
  
INTEGRATIONS
  GET    /api/v1/integrations          # List configured
  POST   /api/v1/integrations/:type    # Configure
  PUT    /api/v1/integrations/:type    # Update
  DELETE /api/v1/integrations/:type    # Disconnect
  POST   /api/v1/integrations/:type/test # Test connection
  
TEAM
  GET    /api/v1/team                  # Members
  POST   /api/v1/team                  # Invite
  PUT    /api/v1/team/:id              # Update role
  DELETE /api/v1/team/:id              # Remove
  
WEBHOOKS
  GET    /api/v1/webhooks              # List
  POST   /api/v1/webhooks              # Create
  PUT    /api/v1/webhooks/:id          # Update
  DELETE /api/v1/webhooks/:id          # Delete
  POST   /api/v1/webhooks/:id/test     # Test
  
SEARCH
  GET    /api/v1/search                # Global search
  
EXPORT
  POST   /api/v1/export                # Export data
  POST   /api/v1/export/:id/download   # Download file
  
AUDIT LOG
  GET    /api/v1/audit                 # Activity log
```

#### Request/Response Format

```
Request:
{
  "method": "POST",
  "url": "/api/v1/invoices",
  "headers": {
    "Authorization": "Bearer {jwt_token}",
    "Content-Type": "application/json",
    "X-Organization-ID": "{org_id}"
  },
  "body": {
    "clientId": "...",
    "dueDate": "2024-02-15",
    "lineItems": [...]
  }
}

Response (Success):
{
  "success": true,
  "data": {
    "id": "inv_123",
    "invoiceNumber": "INV-001",
    ...
  },
  "meta": {
    "timestamp": "2024-01-15T10:00:00Z"
  }
}

Response (Error):
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email address",
    "details": {
      "field": "email",
      "reason": "invalid_format"
    }
  },
  "meta": {
    "timestamp": "2024-01-15T10:00:00Z",
    "requestId": "req_abc123"
  }
}
```

#### Pagination

```
Query Parameters:
  ?page=1             # Page number (default: 1)
  &limit=20           # Per page (default: 20, max: 100)
  &sort=createdAt     # Sort field
  &order=desc         # asc or desc
  &search=term        # Text search
  &filter[status]=paid # Filters

Response:
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

## Service Layer Design

### Service Architecture

```
Controllers (Request handlers)
    │
    ▼
Services (Business logic)
    │
    ├─ Data services (Prisma)
    ├─ Integration services (Email, SMS, Stripe)
    ├─ Utility services (PDF, Export)
    └─ Event services (Publish/subscribe)
    │
    ▼
Database
```

### Service Categories

#### 1. **Data Services**
```typescript
// InvoiceService
- createInvoice(data): Invoice
- updateInvoice(id, data): Invoice
- deleteInvoice(id): void
- getInvoice(id): Invoice
- listInvoices(filters): Invoice[]
- calculateTotals(lineItems): Totals
```

#### 2. **Integration Services**
```typescript
// EmailService
- sendInvoice(invoiceId, clientEmail): void
- sendReminder(invoiceId): void
- sendNotification(userId, message): void

// SMSService
- sendSMS(phoneNumber, message): void
- sendReminder(invoiceId): void

// PaymentService
- createPaymentIntent(invoiceId, amount): PaymentIntent
- handleWebhook(event): void
- refund(paymentId): void

// PDFService
- generateInvoicePDF(invoiceId): Buffer
- generateReportPDF(reportId): Buffer
```

#### 3. **Utility Services**
```typescript
// AuthService
- hashPassword(password): string
- verifyPassword(password, hash): boolean
- generateJWT(userId): string
- verifyJWT(token): Payload

// UploadService
- uploadFile(file, path): string
- deleteFile(path): void

// ExportService
- exportJSON(data): JSON
- exportCSV(data): CSV
```

#### 4. **Event Services**
```typescript
// EventBus
- publish(event, data): void
- subscribe(event, handler): void
- unsubscribe(event, handler): void

Events:
  - InvoiceCreated
  - InvoiceUpdated
  - InvoiceStatusChanged
  - PaymentReceived
  - ReminderSent
  - ClientCreated
  - etc.
```

---

## Permission Model (RBAC)

### Role Definitions

#### Roles

```
1. OWNER
   - Full access to organization
   - Can manage team members
   - Can change subscription
   - Cannot be removed
   - Can delete organization

2. ADMIN
   - Access to invoicing features
   - Can manage clients
   - Can manage team members
   - Can view reports
   - Cannot manage billing

3. ACCOUNTANT
   - Can view all invoices and payments
   - Can record payments
   - Can view reports
   - Cannot send invoices
   - Cannot delete invoices

4. OPERATOR
   - Can create/edit invoices
   - Can send invoices
   - Can manage clients
   - Cannot delete invoices
   - Cannot view payments
   - Cannot access settings

5. VIEWER
   - Read-only access
   - Can view invoices, clients, reports
   - Cannot create or modify anything
```

### Permission Matrix

```
Feature                 | Owner | Admin | Accountant | Operator | Viewer |
Create Invoice          | ✓     | ✓     | ✗          | ✓        | ✗      |
Edit Invoice            | ✓     | ✓     | ✗          | ✓        | ✗      |
Delete Invoice          | ✓     | ✓     | ✗          | ✗        | ✗      |
Send Invoice            | ✓     | ✓     | ✗          | ✓        | ✗      |
View Invoice            | ✓     | ✓     | ✓          | ✓        | ✓      |
Create Client           | ✓     | ✓     | ✗          | ✓        | ✗      |
Edit Client             | ✓     | ✓     | ✗          | ✓        | ✗      |
Delete Client           | ✓     | ✓     | ✗          | ✗        | ✗      |
View Client             | ✓     | ✓     | ✓          | ✓        | ✓      |
Record Payment          | ✓     | ✓     | ✓          | ✗        | ✗      |
View Payment            | ✓     | ✓     | ✓          | ✗        | ✓      |
View Reports            | ✓     | ✓     | ✓          | ✗        | ✓      |
Manage Integration      | ✓     | ✓     | ✗          | ✗        | ✗      |
Manage Team             | ✓     | ✓     | ✗          | ✗        | ✗      |
Change Settings         | ✓     | ✓     | ✗          | ✗        | ✗      |
Manage Billing          | ✓     | ✗     | ✗          | ✗        | ✗      |
```

### Implementation Strategy

```typescript
// Middleware
@Authenticated()           // Require JWT
@Authorized('admin')       // Require role >= admin
@Permission('view_invoice') // Require specific permission
async handler(req, res) {
  // Handler implementation
}

// Service layer
if (!user.can('create_invoice')) {
  throw new UnauthorizedError();
}

// Database queries
// Automatically filter by organization
const invoices = await Invoice.where({
  organizationId: user.organizationId
});
```

---

## Data Flow Diagrams

### Invoice Creation Flow

```
User fills form
    │
    ▼
POST /api/v1/invoices
    │
    ├─ Validate request (Zod)
    ├─ Check permissions
    ├─ Verify client exists
    │
    ▼
InvoiceService.createInvoice()
    │
    ├─ Calculate totals
    ├─ Generate invoice number
    ├─ Create invoice in DB
    ├─ Create line items
    │
    ▼
EventBus.publish('InvoiceCreated')
    │
    ├─ ActivityService → Log action
    └─ NotificationService → Notify user
    │
    ▼
Return invoice data
    │
    ▼
Frontend updates UI
```

### Payment Processing Flow

```
Client clicks "Pay Now"
    │
    ▼
POST /api/v1/payments/stripe-intent
    │
    ├─ Get invoice details
    ├─ Verify amount
    │
    ▼
StripeService.createPaymentIntent()
    │
    ├─ Call Stripe API
    ├─ Return client secret
    │
    ▼
Frontend → Stripe.js handles payment
    │
    ▼
Payment success
    │
    ▼
Stripe webhook
    │
    ├─ POST /api/v1/webhooks/stripe
    ├─ Verify signature
    │
    ▼
PaymentService.handlePaymentSuccess()
    │
    ├─ Create Payment record
    ├─ Update Invoice status → "paid"
    │
    ▼
EventBus.publish('PaymentReceived')
    │
    ├─ InvoiceService → Update status
    ├─ EmailService → Send receipt
    ├─ ActivityService → Log payment
    └─ NotificationService → Notify user
    │
    ▼
Process complete
```

### Recurring Invoice Generation Flow

```
Scheduled job runs (daily)
    │
    ▼
RecurringService.checkSchedules()
    │
    ├─ Find due recurring invoices
    ├─ For each:
    │   ├─ Create Invoice from config
    │   ├─ Send to client (if auto-send)
    │   ├─ Schedule first reminder
    │   └─ Update nextDueDate
    │
    ▼
EventBus.publish('RecurringInvoiceGenerated')
    │
    ├─ ActivityService → Log
    └─ NotificationService → Notify user
    │
    ▼
Process complete
```

---

## Architecture Decision Records (ADRs)

### ADR-001: Database Choice

**Decision**: PostgreSQL with Prisma ORM

**Rationale**:
- Mature, reliable, PostgreSQL is battle-tested for financial applications
- Prisma provides excellent TypeScript support
- Easy migrations and schema management
- Strong ecosystem of tools

**Alternatives Considered**:
- MongoDB: Not ideal for financial data (ACID transactions needed)
- MySQL: Viable but PostgreSQL has better JSON support

**Consequences**:
- Requires database setup and maintenance
- Must plan for backups and disaster recovery
- Migrations needed for schema changes

---

### ADR-002: API Authentication

**Decision**: JWT + Refresh Tokens + Secure Cookies

**Rationale**:
- JWT allows stateless authentication (good for scaling)
- Refresh tokens improve security
- Secure httpOnly cookies prevent XSS attacks
- Session-like experience without server-side sessions

**Implementation**:
```
1. User logs in
2. Server returns:
   - accessToken (short-lived, 15min)
   - refreshToken (long-lived, 7 days)
3. accessToken sent in Authorization header
4. refreshToken stored in secure httpOnly cookie
5. When accessToken expires, use refreshToken to get new one
```

---

### ADR-003: Error Handling Strategy

**Decision**: Centralized error handling with typed errors

**Rationale**:
- Consistent error responses
- Better debugging and logging
- Type-safe error handling
- Clear error codes for frontend

**Error Classes**:
```
- ValidationError (400)
- AuthenticationError (401)
- AuthorizationError (403)
- NotFoundError (404)
- ConflictError (409)
- ServerError (500)
```

---

### ADR-004: Event-Driven Updates

**Decision**: Event Bus for cross-module communication

**Rationale**:
- Loose coupling between modules
- Easy to add new subscribers (e.g., webhooks, analytics)
- Audit trail through event log
- Can replay events for debugging

**Events**:
- All important business events published
- Other modules subscribe via EventBus
- Async processing of side effects

---

### ADR-005: File Storage

**Decision**: AWS S3 (or Cloudflare R2) with presigned URLs

**Rationale**:
- Scalable storage
- Cost-effective
- No server disk space issues
- CDN integration for fast downloads

**Implementation**:
- Files stored in organized S3 structure
- Presigned URLs for secure access
- Automatic cleanup of old files
- Versioning for important documents

---

## Summary

This Phase 1 architecture document defines:

✅ **Module Structure**: 8 core modules with clear boundaries
✅ **Navigation**: Complete IA and routing
✅ **Folder Structure**: Scalable, organized file layout
✅ **Database**: Normalized schema with proper relationships
✅ **API Design**: RESTful endpoints with consistent structure
✅ **Service Layer**: Clean separation of concerns
✅ **RBAC**: Role-based permissions system
✅ **Data Flows**: Clear diagrams for key processes
✅ **Design Decisions**: Documented rationale

---

## Next Steps

### Before Phase 2:
- Review and approve architecture
- Identify any changes needed
- Get stakeholder sign-off
- Prepare team for implementation

### Phase 2 Focus:
Implement Authentication & Identity layer using this architecture

---

**Architecture Status**: ✓ COMPLETE
**Code Implementation**: 0 lines
**Ready for Phase 2**: YES

**AWAITING PHASE 2 INSTRUCTION**
