# Quick Start Guide

Get InvoiceHound up and running in 5 minutes!

## 1. Clone & Install (1 minute)

```bash
git clone https://github.com/your-username/Invoice.git
cd Invoice
pnpm install
```

## 2. Start Development Server (30 seconds)

```bash
pnpm dev
```

The app opens at `http://localhost:5173`

## 3. Login

Use any email/password combination:
- Email: `demo@example.com`
- Password: `password123`

## 4. Create Your First Invoice (2 minutes)

1. Click **"New Invoice"** button
2. Select or create a client
3. Add line items (description, quantity, rate)
4. Set due date
5. Click **"Save & Send"**

## 5. Explore Features

- **Dashboard**: View outstanding invoices and payment stats
- **Invoices**: Manage all invoices, filter by status
- **Clients**: Add and organize client information
- **Templates**: Save invoice templates for reuse
- **Reports**: View revenue trends and analytics
- **Settings**: Configure integrations and branding

## Production Deployment

### Deploy to Netlify (Free)

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect repository
5. Set build command: `pnpm build`
6. Set publish directory: `dist`
7. Done! Your app is live

[Full Deployment Guide →](DEPLOYMENT.md)

## Configuration

### Add Integrations (Optional)

Go to **Settings > Integrations** and add:
- **Email**: Resend API key
- **SMS**: Twilio credentials
- **Payments**: Stripe publishable key

[Full API Setup Guide →](API.md)

## Mobile Version

### Test on Mobile

1. Run development server
2. Get your computer's IP address:
   ```bash
   ipconfig getifaddr en0  # macOS
   # or
   hostname -I | awk '{print $1}'  # Linux
   ```
3. Open `http://YOUR_IP:5173` on your phone
4. App works on all screen sizes!

### Native Mobile App

Ready to build iOS/Android apps?

[Mobile App Setup Guide →](SETUP_MOBILE_APP.md)

## Common Tasks

### Create Recurring Invoice

1. Go to **Recurring Invoices**
2. Click **"New Recurring"**
3. Select client and frequency
4. Save!

Invoices automatically generate on schedule.

### Send Payment Reminder

1. Go to **Invoices**
2. Select unpaid invoices
3. Click **"Send Reminder"** (bulk action)
4. Choose SMS or email
5. Done!

### Export Your Data

1. Go to **Settings > Data Export**
2. Select what to export (invoices, clients, etc.)
3. Choose format (JSON or CSV)
4. Download backup file

### Customize Invoice Branding

1. Go to **Settings > Branding**
2. Add company name and details
3. Choose colors
4. See live preview
5. Save!

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

### Need Help?

- Check [README.md](README.md) for detailed features
- See [API.md](API.md) for API endpoints
- Read [MOBILE_GUIDE.md](MOBILE_GUIDE.md) for mobile tips
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production setup

## Next Steps

### For Developers

1. [Set up GitHub integration](README.md#github-setup)
2. [Configure environment variables](.env.example)
3. [Build integrations](API.md#integrations)
4. [Deploy to production](DEPLOYMENT.md)

### For Users

1. [Add your first client](README.md#usage-guide)
2. [Create your first invoice](#4-create-your-first-invoice-2-minutes)
3. [Set up integrations](#add-integrations-optional)
4. [Configure branding](#customize-invoice-branding)
5. [Enable recurring invoices](#create-recurring-invoice)

## Key Features You Can Use Right Now

✅ **Invoice Management** - Create, edit, track invoices  
✅ **Client Management** - Organize client info and communication  
✅ **Payment Tracking** - Monitor invoice status and due dates  
✅ **Reports** - View revenue trends and analytics  
✅ **Data Export** - Backup your invoices as JSON or CSV  
✅ **Mobile Responsive** - Works on desktop, tablet, and phone  
✅ **Email/SMS Integration** - Send invoices and reminders  
✅ **Payment Integration** - Accept Stripe payments  
✅ **Invoice Customization** - Brand invoices with colors and logo  
✅ **Recurring Invoices** - Automatic invoice generation  

## Video Tutorials (Coming Soon)

- Setting up your first invoice
- Managing clients
- Configuring integrations
- Sending payment reminders
- Customizing invoice branding

---

**Ready to automate your invoicing? Start with [pnpm dev](#2-start-development-server-30-seconds) right now!**

For a detailed overview, see [README.md](README.md)  
For deployment help, see [DEPLOYMENT.md](DEPLOYMENT.md)  
For API reference, see [API.md](API.md)
