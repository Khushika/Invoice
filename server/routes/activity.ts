import { RequestHandler } from "express";

// Mock activity log storage
const activityLog: any[] = [
  {
    id: "1",
    type: "invoice",
    title: "Invoice Created",
    description: "Created invoice INV-001",
    clientName: "Acme Corp",
    invoiceNumber: "INV-001",
    status: "completed",
    timestamp: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    type: "email",
    title: "Invoice Sent",
    description: "Sent invoice INV-001 to client",
    clientName: "Acme Corp",
    invoiceNumber: "INV-001",
    status: "sent",
    timestamp: new Date(Date.now() - 39 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    type: "reminder",
    title: "Payment Reminder Sent",
    description: "Sent payment reminder for overdue invoice",
    clientName: "Acme Corp",
    invoiceNumber: "INV-001",
    status: "sent",
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    type: "invoice",
    title: "Invoice Created",
    description: "Created invoice INV-002",
    clientName: "TechStart Inc",
    invoiceNumber: "INV-002",
    status: "completed",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    type: "email",
    title: "Invoice Sent",
    description: "Sent invoice INV-002 to client",
    clientName: "TechStart Inc",
    invoiceNumber: "INV-002",
    status: "sent",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "6",
    type: "payment",
    title: "Payment Received",
    description: "Payment received for INV-001",
    clientName: "Acme Corp",
    invoiceNumber: "INV-001",
    status: "completed",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

let nextId = activityLog.length + 1;

export const handleGetActivity: RequestHandler = (req, res) => {
  try {
    // In production: filter by authenticated user and apply pagination
    const sortedActivities = [...activityLog].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Limit to last 100 activities
    const activities = sortedActivities.slice(0, 100);

    res.json({ activities });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch activity log",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleLogActivity: RequestHandler = (req, res) => {
  try {
    const {
      type,
      title,
      description,
      clientName,
      invoiceNumber,
      status = "completed",
    } = req.body;

    if (!type || !title) {
      res.status(400).json({
        error: "Activity type and title are required",
      });
      return;
    }

    const activity = {
      id: nextId.toString(),
      type,
      title,
      description,
      clientName,
      invoiceNumber,
      status,
      timestamp: new Date().toISOString(),
    };

    activityLog.push(activity);
    nextId++;

    res.status(201).json({ activity });
  } catch (error) {
    res.status(500).json({
      error: "Failed to log activity",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
