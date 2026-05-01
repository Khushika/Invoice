import { RequestHandler } from "express";

export const handleDashboard: RequestHandler = (req, res) => {
  try {
    // In production: fetch real data from database for authenticated user
    const stats = {
      totalOutstanding: 2500,
      overdueCount: 1,
      paidThisMonth: 5200,
    };

    const recentInvoices = [
      {
        id: "1",
        invoiceNumber: "INV-001",
        clientName: "Acme Corp",
        amount: 1500,
        status: "overdue",
        dueDate: "2024-01-10",
      },
      {
        id: "2",
        invoiceNumber: "INV-002",
        clientName: "TechStart Inc",
        amount: 1000,
        status: "pending",
        dueDate: "2024-02-05",
      },
    ];

    res.json({ stats, recentInvoices });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to load dashboard",
        details: error instanceof Error ? error.message : "Unknown error",
      });
  }
};
