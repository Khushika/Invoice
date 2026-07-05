# API Documentation

Complete reference for InvoiceHound REST API endpoints.

## Base URL

```
http://localhost:5173 (development)
https://yourdomain.com (production)
```

## Authentication

Most endpoints require user authentication. Authentication is handled via session cookies.

### Sign In
```
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response 200:
{
  "success": true,
  "token": "session_token"
}
```

### Sign Up
```
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response 200:
{
  "success": true,
  "token": "session_token"
}
```

### Sign Out
```
POST /api/auth/signout
Response 200:
{
  "success": true
}
```

## Invoice Endpoints

### List Invoices
```
GET /api/invoices
Query Parameters:
  - status: draft | sent | overdue | paid | cancelled
  - clientId: string (filter by client)
  - search: string (search invoice number or client name)
  - sort: field (id, amount, dueDate, status)
  - order: asc | desc

Response 200:
{
  "invoices": [
    {
      "id": "inv_123",
      "invoiceNumber": "INV-001",
      "clientId": "cli_456",
      "clientName": "John Doe",
      "amount": 1500.00,
      "status": "sent",
      "issuedDate": "2024-01-15",
      "dueDate": "2024-02-15",
      "items": [
        {
          "description": "Web Development",
          "quantity": 40,
          "rate": 37.50,
          "amount": 1500.00
        }
      ],
      "notes": "Thank you for your business",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 1
}
```

### Get Single Invoice
```
GET /api/invoices/:id

Response 200:
{
  "id": "inv_123",
  "invoiceNumber": "INV-001",
  "clientId": "cli_456",
  "clientName": "John Doe",
  "amount": 1500.00,
  "status": "sent",
  "issuedDate": "2024-01-15",
  "dueDate": "2024-02-15",
  "items": [
    {
      "id": "item_1",
      "description": "Web Development",
      "quantity": 40,
      "rate": 37.50,
      "amount": 1500.00
    }
  ],
  "notes": "Thank you for your business",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

### Create Invoice
```
POST /api/invoices
Content-Type: application/json

{
  "clientId": "cli_456",
  "invoiceNumber": "INV-002",
  "issuedDate": "2024-01-16",
  "dueDate": "2024-02-16",
  "items": [
    {
      "description": "Web Development",
      "quantity": 40,
      "rate": 37.50
    }
  ],
  "notes": "Thank you for your business",
  "tax": 0,
  "discount": 0
}

Response 201:
{
  "success": true,
  "invoice": { ... }
}
```

### Update Invoice
```
PUT /api/invoices/:id
Content-Type: application/json

{
  "status": "sent",
  "dueDate": "2024-02-20",
  "items": [ ... ],
  "notes": "Updated notes"
}

Response 200:
{
  "success": true,
  "invoice": { ... }
}
```

### Delete Invoice
```
DELETE /api/invoices/:id

Response 200:
{
  "success": true
}
```

### Mark Invoice as Paid
```
POST /api/invoices/:id/mark-paid

Response 200:
{
  "success": true,
  "invoice": { ... }
}
```

### Send Payment Reminder
```
POST /api/invoices/:id/remind

Response 200:
{
  "success": true,
  "message": "Reminder sent"
}
```

## Client Endpoints

### List Clients
```
GET /api/clients
Query Parameters:
  - search: string (search client name or email)
  - sort: field
  - order: asc | desc

Response 200:
{
  "clients": [
    {
      "id": "cli_456",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "555-1234",
      "company": "Acme Corp",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zip": "10001",
      "country": "USA",
      "taxId": "12-3456789",
      "notes": "VIP Client",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 1
}
```

### Get Single Client
```
GET /api/clients/:id

Response 200:
{
  "id": "cli_456",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "company": "Acme Corp",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zip": "10001",
  "country": "USA",
  "taxId": "12-3456789",
  "notes": "VIP Client",
  "invoices": [
    {
      "id": "inv_123",
      "invoiceNumber": "INV-001",
      "amount": 1500.00,
      "status": "paid",
      "dueDate": "2024-02-15"
    }
  ],
  "communications": [
    {
      "id": "note_1",
      "type": "note",
      "content": "Follow up on project",
      "createdAt": "2024-01-20T10:00:00Z",
      "author": "You"
    }
  ],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Create Client
```
POST /api/clients
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "company": "Acme Corp",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zip": "10001",
  "country": "USA",
  "taxId": "12-3456789",
  "notes": "VIP Client"
}

Response 201:
{
  "success": true,
  "client": { ... }
}
```

### Update Client
```
PUT /api/clients/:id
Content-Type: application/json

{
  "email": "newemail@example.com",
  "phone": "555-5678",
  "notes": "Updated notes"
}

Response 200:
{
  "success": true,
  "client": { ... }
}
```

### Delete Client
```
DELETE /api/clients/:id

Response 200:
{
  "success": true
}
```

### Add Client Note
```
POST /api/clients/:id/notes
Content-Type: application/json

{
  "content": "Follow up on project",
  "type": "note"
}

Response 201:
{
  "success": true,
  "note": {
    "id": "note_1",
    "content": "Follow up on project",
    "type": "note",
    "createdAt": "2024-01-20T10:00:00Z",
    "author": "You"
  }
}
```

## Template Endpoints

### List Templates
```
GET /api/templates

Response 200:
{
  "templates": [
    {
      "id": "tpl_123",
      "name": "Standard Invoice",
      "description": "Basic invoice template",
      "items": [ ... ],
      "notes": "Default terms apply",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 1
}
```

### Create Template
```
POST /api/templates
Content-Type: application/json

{
  "name": "Standard Invoice",
  "description": "Basic invoice template",
  "items": [
    {
      "description": "Service",
      "quantity": 1,
      "rate": 100.00
    }
  ],
  "notes": "Default terms apply"
}

Response 201:
{
  "success": true,
  "template": { ... }
}
```

### Update Template
```
PUT /api/templates/:id
Content-Type: application/json

{
  "name": "Updated Template",
  "items": [ ... ]
}

Response 200:
{
  "success": true,
  "template": { ... }
}
```

### Delete Template
```
DELETE /api/templates/:id

Response 200:
{
  "success": true
}
```

## Recurring Invoice Endpoints

### List Recurring Invoices
```
GET /api/recurring-invoices
Query Parameters:
  - status: active | paused | completed

Response 200:
{
  "recurringInvoices": [
    {
      "id": "rec_123",
      "clientId": "cli_456",
      "clientName": "John Doe",
      "amount": 500.00,
      "frequency": "monthly",
      "startDate": "2024-01-15",
      "endDate": null,
      "status": "active",
      "nextInvoiceDate": "2024-02-15",
      "createdAt": "2024-01-15T00:00:00Z"
    }
  ],
  "total": 1
}
```

### Create Recurring Invoice
```
POST /api/recurring-invoices
Content-Type: application/json

{
  "clientId": "cli_456",
  "amount": 500.00,
  "frequency": "monthly",
  "startDate": "2024-01-15",
  "endDate": null,
  "description": "Monthly retainer",
  "notes": "Due on 15th of each month"
}

Response 201:
{
  "success": true,
  "recurringInvoice": { ... }
}
```

### Update Recurring Invoice
```
PUT /api/recurring-invoices/:id
Content-Type: application/json

{
  "status": "paused",
  "amount": 600.00
}

Response 200:
{
  "success": true,
  "recurringInvoice": { ... }
}
```

### Delete Recurring Invoice
```
DELETE /api/recurring-invoices/:id

Response 200:
{
  "success": true
}
```

## Integration Endpoints

### Get Integrations
```
GET /api/integrations

Response 200:
{
  "resend": {
    "enabled": false,
    "apiKey": ""
  },
  "twilio": {
    "enabled": false,
    "accountSid": "",
    "authToken": "",
    "phoneNumber": ""
  },
  "stripe": {
    "enabled": false,
    "publishableKey": "",
    "secretKey": ""
  }
}
```

### Save Integrations
```
POST /api/integrations
Content-Type: application/json

{
  "resend": {
    "enabled": true,
    "apiKey": "re_xxx"
  },
  "twilio": {
    "enabled": false,
    "accountSid": "",
    "authToken": "",
    "phoneNumber": ""
  },
  "stripe": {
    "enabled": true,
    "publishableKey": "pk_xxx",
    "secretKey": "sk_xxx"
  }
}

Response 200:
{
  "success": true
}
```

### Send Email
```
POST /api/integrations/send-email
Content-Type: application/json

{
  "recipientEmail": "client@example.com",
  "subject": "Invoice INV-001 Due",
  "body": "Please find your invoice attached..."
}

Response 200:
{
  "success": true,
  "messageId": "msg_xxx"
}
```

### Send SMS
```
POST /api/integrations/send-sms
Content-Type: application/json

{
  "phoneNumber": "+1234567890",
  "message": "Your invoice is due on Feb 15. Amount: $1500"
}

Response 200:
{
  "success": true,
  "messageId": "msg_xxx"
}
```

### Create Payment Intent
```
POST /api/integrations/payment-intent
Content-Type: application/json

{
  "amount": 150000,
  "invoiceId": "inv_123"
}

Response 200:
{
  "clientSecret": "pi_xxx_secret_xxx"
}
```

## Reports Endpoints

### Get Reports
```
GET /api/reports
Query Parameters:
  - startDate: YYYY-MM-DD
  - endDate: YYYY-MM-DD
  - period: daily | weekly | monthly

Response 200:
{
  "stats": {
    "totalRevenue": 5000.00,
    "avgInvoiceValue": 1250.00,
    "totalInvoices": 4,
    "paidInvoices": 2,
    "overdueInvoices": 1
  },
  "charts": [
    {
      "type": "revenue_trend",
      "data": [
        { "date": "2024-01-15", "amount": 1500.00 },
        { "date": "2024-01-20", "amount": 2000.00 }
      ]
    },
    {
      "type": "status_breakdown",
      "data": [
        { "status": "paid", "count": 2 },
        { "status": "overdue", "count": 1 }
      ]
    }
  ]
}
```

## Data Export Endpoints

### Export Data
```
POST /api/export
Content-Type: application/json

{
  "format": "json",
  "types": ["invoices", "clients", "templates", "activity"]
}

Response 200: (File download)
application/octet-stream

{
  "invoices": [ ... ],
  "clients": [ ... ],
  "templates": [ ... ],
  "activity": [ ... ],
  "exportedAt": "2024-01-20T10:00:00Z"
}
```

## Branding Endpoints

### Get Branding Settings
```
GET /api/settings/branding

Response 200:
{
  "companyName": "Acme Corp",
  "companyEmail": "billing@acme.com",
  "companyPhone": "555-1234",
  "companyAddress": "123 Main St, New York, NY 10001",
  "invoicePrefix": "INV",
  "invoiceStartNumber": 1,
  "primaryColor": "#3b82f6",
  "secondaryColor": "#1e40af",
  "notes": "Thank you for your business",
  "bankDetails": "Bank Name, Account 123456",
  "taxId": "12-3456789"
}
```

### Update Branding Settings
```
POST /api/settings/branding
Content-Type: application/json

{
  "companyName": "Acme Corp",
  "companyEmail": "billing@acme.com",
  "companyPhone": "555-1234",
  "primaryColor": "#3b82f6",
  "secondaryColor": "#1e40af",
  "notes": "Thank you for your business"
}

Response 200:
{
  "success": true
}
```

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "status": 400
}
```

### Common HTTP Status Codes

- **200**: Successful GET request
- **201**: Resource created successfully
- **400**: Bad request (validation error)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (insufficient permissions)
- **404**: Resource not found
- **500**: Server error

### Common Error Codes

- `VALIDATION_ERROR`: Input validation failed
- `AUTH_ERROR`: Authentication failed
- `NOT_FOUND`: Resource not found
- `DUPLICATE_ERROR`: Resource already exists
- `SERVER_ERROR`: Internal server error

## Rate Limiting

API endpoints are rate limited to prevent abuse:
- 100 requests per minute per IP address
- 1000 requests per hour per authenticated user

Excess requests return `429 Too Many Requests`.

## Pagination

List endpoints support pagination:

```
GET /api/invoices?page=1&limit=20

Response:
{
  "invoices": [ ... ],
  "total": 100,
  "page": 1,
  "pageSize": 20,
  "totalPages": 5
}
```

## Webhooks (Future)

Webhooks will be available for:
- Invoice created/updated/deleted
- Payment received
- Reminder sent
- Client added/updated

Configure webhooks in Settings > Webhooks.
