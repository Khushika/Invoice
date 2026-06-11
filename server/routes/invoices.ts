import { RequestHandler } from "express";

// Mock invoice storage (in production, use a real database)
const invoices: Record<string, any> = {
  "1": {
    id: "1",
    invoiceNumber: "INV-001",
    clientName: "Acme Corp",
    clientEmail: "contact@acme.com",
    clientId: "client-1",
    amount: 1500,
    status: "overdue",
    dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    issuedDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    lineItems: [
      { id: "1", description: "Web Development", quantity: 40, unitPrice: 50 },
    ],
    subtotal: 1500,
    taxRate: 10,
    total: 1650,
    currency: "USD",
    notes: "Payment due upon completion",
    paymentToken: "token-123",
    paidAt: null,
    events: [
      { type: "CREATED", createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000) },
      { type: "SENT", createdAt: new Date(Date.now() - 39 * 24 * 60 * 60 * 1000) },
    ],
  },
  "2": {
    id: "2",
    invoiceNumber: "INV-002",
    clientName: "TechStart Inc",
    clientEmail: "billing@techstart.com",
    clientId: "client-2",
    amount: 2500,
    status: "sent",
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    issuedDate: new Date().toISOString(),
    lineItems: [
      { id: "1", description: "Logo Design", quantity: 1, unitPrice: 1500 },
      { id: "2", description: "Brand Guidelines", quantity: 1, unitPrice: 1000 },
    ],
    subtotal: 2500,
    taxRate: 0,
    total: 2500,
    currency: "USD",
    notes: "Net 15",
    paymentToken: "token-124",
    paidAt: null,
    events: [
      { type: "CREATED", createdAt: new Date() },
      { type: "SENT", createdAt: new Date() },
    ],
  },
};

export const handleGetInvoices: RequestHandler = (req, res) => {
  try {
    // In production: filter by authenticated user
    const invoiceList = Object.values(invoices);
    res.json({ invoices: invoiceList });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch invoices",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleGetInvoice: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const invoice = invoices[id];

    if (!invoice) {
      res.status(404).json({ error: "Invoice not found" });
      return;
    }

    // In production: verify user owns this invoice
    res.json({ invoice });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch invoice",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleCreateInvoice: RequestHandler = (req, res) => {
  try {
    const {
      clientId,
      invoiceNumber,
      issueDate,
      dueDate,
      currency,
      taxRate,
      notes,
      lineItems,
      status,
      subtotal,
      tax,
      total,
    } = req.body;

    if (!clientId || !invoiceNumber) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const id = Date.now().toString();
    const newInvoice = {
      id,
      invoiceNumber,
      clientId,
      clientName: "Client Name", // In production: fetch from clients table
      clientEmail: "client@example.com",
      issueDate,
      dueDate,
      currency,
      taxRate,
      notes,
      lineItems,
      status: status || "draft",
      subtotal,
      total,
      paymentToken: Math.random().toString(36).substring(7),
      paidAt: null,
      events: [{ type: "CREATED", createdAt: new Date() }],
    };

    invoices[id] = newInvoice;
    res.status(201).json({ success: true, invoice: newInvoice });
  } catch (error) {
    res.status(500).json({
      error: "Failed to create invoice",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleUpdateInvoice: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const invoice = invoices[id];

    if (!invoice) {
      res.status(404).json({ error: "Invoice not found" });
      return;
    }

    // In production: verify user owns this invoice
    const updatedInvoice = { ...invoice, ...req.body };
    invoices[id] = updatedInvoice;

    res.json({ success: true, invoice: updatedInvoice });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update invoice",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleMarkPaid: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const invoice = invoices[id];

    if (!invoice) {
      res.status(404).json({ error: "Invoice not found" });
      return;
    }

    // In production: verify user owns this invoice
    invoices[id] = {
      ...invoice,
      status: "paid",
      paidAt: new Date().toISOString(),
      events: [
        ...invoice.events,
        { type: "PAID", createdAt: new Date() },
      ],
    };

    res.json({ success: true, invoice: invoices[id] });
  } catch (error) {
    res.status(500).json({
      error: "Failed to mark invoice as paid",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleSendReminder: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const invoice = invoices[id];

    if (!invoice) {
      res.status(404).json({ error: "Invoice not found" });
      return;
    }

    // In production: send email via Resend
    invoices[id] = {
      ...invoice,
      events: [
        ...invoice.events,
        { type: "REMINDER_SENT", createdAt: new Date() },
      ],
    };

    res.json({ success: true, message: "Reminder sent" });
  } catch (error) {
    res.status(500).json({
      error: "Failed to send reminder",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleDeleteInvoice: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    if (!invoices[id]) {
      res.status(404).json({ error: "Invoice not found" });
      return;
    }

    // In production: verify user owns this invoice and soft-delete
    delete invoices[id];

    res.json({ success: true, message: "Invoice deleted" });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete invoice",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
