# InvoiceHound

A modern, feature-rich invoice management and payment tracking system designed for freelancers. Built with React, TypeScript, and Vite, InvoiceHound helps you manage clients, create invoices, track payments, and streamline your billing workflow.

## Features

### Core Features
- **Invoice Management**: Create, edit, send, and track invoices with full customization
- **Client Management**: Maintain detailed client information and communication history
- **Payment Tracking**: Monitor invoice status, track payments, and identify overdue invoices
- **Templates**: Save and reuse invoice templates for faster creation
- **Recurring Invoices**: Set up automatic recurring invoices for regular clients

### Advanced Features
- **Email & SMS Integration**: Send invoices and reminders directly to clients via email or SMS
- **Payment Gateway Integration**: Accept payments with Stripe integration
- **Invoice Branding**: Customize invoice appearance with company colors, logos, and details
- **Reports & Analytics**: View revenue trends, client performance, and invoice breakdowns
- **Activity Log**: Track all app actions with a searchable activity timeline
- **Data Export**: Export invoices, clients, templates, and settings as JSON or CSV
- **Search & Filtering**: Advanced search across all invoices, clients, and templates
- **Mobile Responsive**: Works seamlessly on desktop, tablet, and mobile devices

## Getting Started

### Prerequisites
- Node.js 16+ and pnpm
- Git and GitHub account
- (Optional) Stripe account for payment integration
- (Optional) Resend account for email integration
- (Optional) Twilio account for SMS integration

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/Invoice.git
cd Invoice

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Build the app
pnpm build

# Preview production build
pnpm preview
```

## Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Integrations (optional)
VITE_RESEND_API_KEY=your_resend_api_key
VITE_TWILIO_ACCOUNT_SID=your_twilio_account_sid
VITE_TWILIO_AUTH_TOKEN=your_twilio_auth_token
VITE_TWILIO_PHONE_NUMBER=your_twilio_phone_number
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

> Note: Integration keys can be configured directly in the app's Integrations settings page.

## Project Structure

```
invoice/
├── client/                  # Frontend React application
│   ├── components/         # Reusable React components
│   │   └── ui/            # Radix UI components
│   ├── pages/             # Page components (routes)
│   ├── utils/             # Utility functions
│   │   ├── errorHandler.ts # Error handling & validation
│   │   └── pdfExport.ts   # PDF export utilities
│   ├── App.tsx            # Main routing component
│   ├── main.tsx           # React entry point
│   └── global.css         # Global styles
├── server/                 # Backend Express server
│   ├── routes/            # API route handlers
│   │   ├── auth.ts
│   │   ├── invoices.ts
│   │   ├── clients.ts
│   │   ├── integrations.ts
│   │   ├── branding.ts
│   │   └── ... (more routes)
│   └── index.ts           # Express server setup
├── tailwind.config.ts     # Tailwind CSS configuration
├── vite.config.ts         # Vite configuration
└── package.json           # Dependencies and scripts
```

## API Documentation

### Authentication

**POST /api/auth/signin**
- Sign in with email and password
- Returns: `{ success: boolean, token?: string }`

**POST /api/auth/signup**
- Create a new account
- Returns: `{ success: boolean, token?: string }`

**POST /api/auth/signout**
- Sign out the current user
- Returns: `{ success: boolean }`

### Invoices

**GET /api/invoices**
- Get all invoices with optional filters
- Query params: `status`, `clientId`, `search`
- Returns: `{ invoices: Invoice[], total: number }`

**GET /api/invoices/:id**
- Get a single invoice by ID
- Returns: `Invoice`

**POST /api/invoices**
- Create a new invoice
- Body: Invoice data
- Returns: `{ success: boolean, invoice: Invoice }`

**PUT /api/invoices/:id**
- Update an invoice
- Body: Updated invoice data
- Returns: `{ success: boolean, invoice: Invoice }`

**DELETE /api/invoices/:id**
- Delete an invoice
- Returns: `{ success: boolean }`

**POST /api/invoices/:id/mark-paid**
- Mark an invoice as paid
- Returns: `{ success: boolean }`

**POST /api/invoices/:id/remind**
- Send a payment reminder to the client
- Returns: `{ success: boolean }`

### Clients

**GET /api/clients**
- Get all clients
- Returns: `{ clients: Client[], total: number }`

**GET /api/clients/:id**
- Get a single client
- Returns: `Client` with communication history

**POST /api/clients**
- Create a new client
- Body: Client data
- Returns: `{ success: boolean, client: Client }`

**PUT /api/clients/:id**
- Update a client
- Body: Updated client data
- Returns: `{ success: boolean, client: Client }`

**DELETE /api/clients/:id**
- Delete a client
- Returns: `{ success: boolean }`

### Reports & Analytics

**GET /api/reports**
- Get dashboard analytics
- Returns: `{ stats: DashboardStats, charts: ChartData[] }`

**GET /api/dashboard**
- Get dashboard overview
- Returns: `{ stats: Stats, recentInvoices: Invoice[] }`

### Integrations

**GET /api/integrations**
- Get configured integrations
- Returns: `{ integrations: IntegrationStatus }`

**POST /api/integrations**
- Save integration settings
- Body: Integration configuration
- Returns: `{ success: boolean }`

**POST /api/integrations/send-email**
- Send email to client
- Body: `{ recipientEmail: string, subject: string, body: string }`
- Returns: `{ success: boolean, messageId: string }`

**POST /api/integrations/send-sms**
- Send SMS to client
- Body: `{ phoneNumber: string, message: string }`
- Returns: `{ success: boolean, messageId: string }`

**POST /api/integrations/payment-intent**
- Create Stripe payment intent
- Body: `{ amount: number, invoiceId: string }`
- Returns: `{ clientSecret: string }`

### Branding

**GET /api/settings/branding**
- Get branding settings
- Returns: `BrandingSettings`

**POST /api/settings/branding**
- Update branding settings
- Body: Branding data (colors, logo, company info)
- Returns: `{ success: boolean }`

### Data Export

**POST /api/export**
- Export data in specified format
- Body: `{ format: "json" | "csv", types: string[] }`
- Returns: Downloadable file

## Usage Guide

### Creating an Invoice

1. Click the **"New Invoice"** button on the Dashboard
2. Select a client (or create a new one)
3. Add line items with descriptions and amounts
4. Set the due date and payment terms
5. Customize with your branding (logo, colors)
6. Click **"Save & Send"** to save and email to client

### Managing Recurring Invoices

1. Navigate to **Recurring Invoices**
2. Click **"New Recurring Invoice"**
3. Select client and set up frequency (weekly, monthly, etc.)
4. Configure start date and optional end date
5. Invoices will be created automatically on schedule

### Sending Reminders

1. Go to **Invoices** and filter by status
2. Select invoices to remind
3. Click **"Send Reminder"** bulk action
4. Select email or SMS as delivery method
5. Reminders are sent immediately to clients

### Configuring Integrations

1. Go to **Settings > Integrations**
2. Enable desired services (Email, SMS, Payments)
3. Enter API keys (stored securely)
4. Test the integration
5. Services are now available throughout the app

### Viewing Reports

1. Click **"Reports"** in navigation
2. View revenue trends, invoice status breakdown, and top clients
3. Filter by date range
4. Export report data as needed

## Error Handling

The app includes comprehensive error handling and user-friendly error messages:

- **Validation Errors**: Email, phone, amount, and URL validation
- **API Errors**: Server errors are caught and displayed
- **Network Errors**: Graceful handling of connection issues
- **Form Errors**: Real-time validation feedback

All errors are logged to the browser console for debugging.

## Mobile Support

InvoiceHound is fully responsive and works on all devices:

- **Desktop**: Full-featured experience with sidebar navigation
- **Tablet**: Optimized layout with collapsible sidebar
- **Mobile**: Touch-friendly interface with mobile-first design

The app uses Tailwind's responsive classes (`sm:`, `md:`, `lg:`) for adaptive layouts.

## Deployment

### Netlify

1. Connect repository to Netlify
2. Set build command: `pnpm build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy!

### Vercel

1. Import project to Vercel
2. Environment variables are auto-configured
3. Vercel handles build and deployment
4. Deploy with a single push to `main`

## Contributing

1. Create a new branch for your feature
2. Make your changes and test thoroughly
3. Commit with clear messages
4. Push and create a pull request
5. Review and merge

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
pnpm dev
```

### Dependencies Not Installed
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Build Fails
```bash
pnpm clean
pnpm install
pnpm build
```

## Performance Tips

- Use the **Search** feature to quickly find invoices
- Create **Templates** for recurring invoice types
- Enable **Recurring Invoices** for regular clients
- Export data regularly for backup

## Security

- All API calls use HTTPS in production
- Integration keys are stored securely (not exposed in code)
- User sessions are managed with HTTP-only cookies
- Sensitive data is never logged to the browser console

## Support

For issues, feature requests, or questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the API documentation above

## License

MIT License - feel free to use for personal or commercial projects

## Version History

- **v1.0.0** (Current)
  - Core invoice management
  - Client management
  - Email/SMS/Payment integrations
  - Reports and analytics
  - Mobile responsive design
  - Comprehensive error handling
