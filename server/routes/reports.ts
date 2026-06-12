import { RequestHandler } from "express";

// Mock invoice data for generating reports
const mockInvoices = [
  {
    id: "1",
    invoiceNumber: "INV-001",
    clientName: "Acme Corp",
    amount: 1500,
    status: "paid",
    issuedDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    invoiceNumber: "INV-002",
    clientName: "TechStart Inc",
    amount: 2500,
    status: "sent",
    issuedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    invoiceNumber: "INV-003",
    clientName: "Acme Corp",
    amount: 800,
    status: "paid",
    issuedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    invoiceNumber: "INV-004",
    clientName: "Design Studio",
    amount: 3200,
    status: "overdue",
    issuedDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    invoiceNumber: "INV-005",
    clientName: "Tech Startup",
    amount: 1200,
    status: "paid",
    issuedDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const getMonthlyRevenue = (range: string) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthsToShow = range === "month" ? 1 : range === "quarter" ? 3 : 12;

  const data = [];
  for (let i = monthsToShow - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    data.push({
      month: months[date.getMonth()],
      revenue: Math.floor(Math.random() * 5000 + 2000),
    });
  }
  return data;
};

export const handleGetReports: RequestHandler = (req, res) => {
  try {
    const { range = "month" } = req.query;

    // Filter invoices by date range
    let filteredInvoices = mockInvoices;
    const rangeStr = String(range);

    if (rangeStr === "month") {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      filteredInvoices = mockInvoices.filter(
        (inv) => new Date(inv.issuedDate) >= thirtyDaysAgo
      );
    } else if (rangeStr === "quarter") {
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      filteredInvoices = mockInvoices.filter(
        (inv) => new Date(inv.issuedDate) >= ninetyDaysAgo
      );
    }

    // Calculate metrics
    const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const paidInvoices = filteredInvoices.filter(
      (inv) => inv.status === "paid"
    );
    const unpaidInvoices = filteredInvoices.filter(
      (inv) => inv.status !== "paid"
    );

    const overallPaymentRate =
      filteredInvoices.length > 0
        ? Math.round((paidInvoices.length / filteredInvoices.length) * 100)
        : 0;

    // Invoice status breakdown
    const invoicesByStatus = [
      {
        status: "paid",
        count: paidInvoices.length,
      },
      {
        status: "overdue",
        count: filteredInvoices.filter((inv) => inv.status === "overdue").length,
      },
      {
        status: "sent",
        count: filteredInvoices.filter((inv) => inv.status === "sent").length,
      },
      {
        status: "draft",
        count: filteredInvoices.filter((inv) => inv.status === "draft").length,
      },
    ];

    // Top clients
    const clientMap = new Map<
      string,
      { totalAmount: number; invoiceCount: number }
    >();
    filteredInvoices.forEach((inv) => {
      const existing = clientMap.get(inv.clientName) || {
        totalAmount: 0,
        invoiceCount: 0,
      };
      clientMap.set(inv.clientName, {
        totalAmount: existing.totalAmount + inv.amount,
        invoiceCount: existing.invoiceCount + 1,
      });
    });

    const topClients = Array.from(clientMap.entries())
      .map(([name, data]) => ({
        name,
        ...data,
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5);

    const reportData = {
      totalRevenue,
      averageInvoiceAmount:
        filteredInvoices.length > 0
          ? Math.round(totalRevenue / filteredInvoices.length)
          : 0,
      totalInvoices: filteredInvoices.length,
      paidInvoices: paidInvoices.length,
      unpaidInvoices: unpaidInvoices.length,
      overallPaymentRate,
      monthlyRevenue: getMonthlyRevenue(rangeStr),
      invoicesByStatus,
      topClients,
    };

    res.json(reportData);
  } catch (error) {
    res.status(500).json({
      error: "Failed to generate reports",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
