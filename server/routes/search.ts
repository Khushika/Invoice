import { RequestHandler } from "express";

// Mock data references (in production, would query database)
const mockInvoices: any[] = [
  {
    id: "1",
    invoiceNumber: "INV-001",
    clientName: "Acme Corp",
    amount: 1500,
    status: "overdue",
    dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    issuedDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    invoiceNumber: "INV-002",
    clientName: "TechStart Inc",
    amount: 2500,
    status: "sent",
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    issuedDate: new Date().toISOString(),
  },
];

const mockClients: any[] = [
  {
    id: "client-1",
    name: "Acme Corp",
    email: "contact@acme.com",
    company: "Acme Corp",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "client-2",
    name: "TechStart Inc",
    email: "billing@techstart.com",
    company: "TechStart Inc",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const mockTemplates: any[] = [
  {
    id: "1",
    name: "Standard Web Development",
    description: "Template for web development projects",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Design Package",
    description: "Complete design package including logo and guidelines",
    createdAt: new Date().toISOString(),
  },
];

const filterByDateRange = (
  date: string,
  dateRange: string
): boolean => {
  if (dateRange === "all") return true;

  const itemDate = new Date(date).getTime();
  const now = new Date().getTime();
  const dayMs = 24 * 60 * 60 * 1000;

  switch (dateRange) {
    case "week":
      return now - itemDate <= 7 * dayMs;
    case "month":
      return now - itemDate <= 30 * dayMs;
    case "quarter":
      return now - itemDate <= 90 * dayMs;
    case "year":
      return now - itemDate <= 365 * dayMs;
    default:
      return true;
  }
};

export const handleSearch: RequestHandler = (req, res) => {
  try {
    const {
      q = "",
      statuses = "",
      minAmount = "",
      maxAmount = "",
      dateRange = "all",
    } = req.query;

    const query = String(q).toLowerCase();
    const statusList = String(statuses)
      .split(",")
      .filter((s) => s.length > 0);
    const min = minAmount ? parseInt(String(minAmount)) : 0;
    const max = maxAmount ? parseInt(String(maxAmount)) : Infinity;

    const results: any[] = [];

    // Search invoices
    mockInvoices.forEach((invoice) => {
      const matchesQuery =
        invoice.invoiceNumber.toLowerCase().includes(query) ||
        invoice.clientName.toLowerCase().includes(query);

      const matchesStatus =
        statusList.length === 0 || statusList.includes(invoice.status);

      const matchesAmount =
        invoice.amount >= min && invoice.amount <= max;

      const matchesDate = filterByDateRange(
        invoice.issuedDate,
        String(dateRange)
      );

      if (matchesQuery && matchesStatus && matchesAmount && matchesDate) {
        results.push({
          id: invoice.id,
          type: "invoice",
          title: invoice.invoiceNumber,
          subtitle: `Invoice from ${invoice.clientName}`,
          amount: invoice.amount,
          status: invoice.status,
          date: new Date(invoice.issuedDate).toLocaleDateString(),
          link: `/invoices/${invoice.id}`,
        });
      }
    });

    // Search clients
    mockClients.forEach((client) => {
      const matchesQuery =
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.company.toLowerCase().includes(query);

      const matchesDate = filterByDateRange(
        client.createdAt,
        String(dateRange)
      );

      if (matchesQuery && matchesDate) {
        results.push({
          id: client.id,
          type: "client",
          title: client.name,
          subtitle: `${client.email} • ${client.company}`,
          date: new Date(client.createdAt).toLocaleDateString(),
          link: `/clients/${client.id}`,
        });
      }
    });

    // Search templates
    mockTemplates.forEach((template) => {
      const matchesQuery =
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query);

      const matchesDate = filterByDateRange(
        template.createdAt,
        String(dateRange)
      );

      if (matchesQuery && matchesDate) {
        results.push({
          id: template.id,
          type: "template",
          title: template.name,
          subtitle: template.description,
          date: new Date(template.createdAt).toLocaleDateString(),
          link: `/templates/${template.id}`,
        });
      }
    });

    res.json({ results });
  } catch (error) {
    res.status(500).json({
      error: "Search failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
