import { RequestHandler } from "express";

// Mock recurring invoices storage
const recurringInvoices: Record<string, any> = {
  "1": {
    id: "1",
    name: "Monthly Retainer - Acme Corp",
    clientId: "client-1",
    clientName: "Acme Corp",
    amount: 2000,
    frequency: "monthly",
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: "",
    dayOfMonth: 1,
    description: "Monthly retainer for ongoing support",
    notes: "Payment due within 15 days",
    status: "active",
    lastGenerated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    nextDueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  },
  "2": {
    id: "2",
    name: "Quarterly Design Services",
    clientId: "client-2",
    clientName: "TechStart Inc",
    amount: 5000,
    frequency: "quarterly",
    startDate: new Date().toISOString(),
    endDate: "",
    description: "Quarterly design consultation and updates",
    notes: "Invoice due upon receipt",
    status: "active",
    nextDueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  },
};

let nextId = 3;

export const handleGetRecurringInvoices: RequestHandler = (req, res) => {
  try {
    const recurringList = Object.values(recurringInvoices);
    res.json({ recurringInvoices: recurringList });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch recurring invoices",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleGetRecurringInvoice: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const recurring = recurringInvoices[id];

    if (!recurring) {
      res.status(404).json({ error: "Recurring invoice not found" });
      return;
    }

    res.json({ recurringInvoice: recurring });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch recurring invoice",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleCreateRecurringInvoice: RequestHandler = (req, res) => {
  try {
    const {
      name,
      clientId,
      clientName,
      amount,
      frequency,
      startDate,
      endDate,
      dayOfMonth,
      description,
      notes,
    } = req.body;

    if (!name || !clientId || !amount || !frequency) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const id = nextId.toString();
    nextId++;

    const newRecurring = {
      id,
      name,
      clientId,
      clientName,
      amount,
      frequency,
      startDate,
      endDate,
      dayOfMonth,
      description,
      notes,
      status: "active",
      nextDueDate: new Date(startDate).toISOString(),
      createdAt: new Date().toISOString(),
    };

    recurringInvoices[id] = newRecurring;
    res.status(201).json({ recurringInvoice: newRecurring });
  } catch (error) {
    res.status(500).json({
      error: "Failed to create recurring invoice",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleUpdateRecurringInvoice: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const recurring = recurringInvoices[id];

    if (!recurring) {
      res.status(404).json({ error: "Recurring invoice not found" });
      return;
    }

    const updated = {
      ...recurring,
      ...req.body,
      id,
      createdAt: recurring.createdAt,
    };

    recurringInvoices[id] = updated;
    res.json({ recurringInvoice: updated });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update recurring invoice",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleDeleteRecurringInvoice: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    if (!recurringInvoices[id]) {
      res.status(404).json({ error: "Recurring invoice not found" });
      return;
    }

    delete recurringInvoices[id];
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete recurring invoice",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
