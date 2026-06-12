import { RequestHandler } from "express";

// Mock data (in production, fetch from database)
const mockInvoices = [
  {
    id: "1",
    invoiceNumber: "INV-001",
    clientName: "Acme Corp",
    amount: 1500,
    status: "paid",
    dueDate: new Date().toISOString(),
  },
  {
    id: "2",
    invoiceNumber: "INV-002",
    clientName: "TechStart Inc",
    amount: 2500,
    status: "sent",
    dueDate: new Date().toISOString(),
  },
];

const mockClients = [
  {
    id: "1",
    name: "Acme Corp",
    email: "contact@acme.com",
    phone: "555-0100",
    company: "Acme Corporation",
  },
  {
    id: "2",
    name: "TechStart Inc",
    email: "billing@techstart.com",
    phone: "555-0200",
    company: "TechStart Inc",
  },
];

const mockTemplates = [
  {
    id: "1",
    name: "Web Development",
    lineItems: [{ description: "Development", quantity: 40, unitPrice: 50 }],
  },
];

const mockActivityLog = [
  {
    id: "1",
    type: "email",
    title: "Invoice Sent",
    clientName: "Acme Corp",
    timestamp: new Date().toISOString(),
  },
];

const generateJSON = (data: any) => {
  return JSON.stringify(data, null, 2);
};

const generateCSV = (data: any[], headers: string[]) => {
  const csvHeaders = headers.join(",");
  const csvRows = data.map((row) =>
    headers.map((header) => {
      const value = row[header.toLowerCase().replace(/\s+/g, "_")];
      if (typeof value === "string" && value.includes(",")) {
        return `"${value}"`;
      }
      return value || "";
    })
  );
  return [csvHeaders, ...csvRows.map((row) => row.join(","))].join("\n");
};

export const handleExport: RequestHandler = (req, res) => {
  try {
    const { format = "json", types = "invoices,clients" } = req.query;

    const typesList = String(types)
      .split(",")
      .map((t) => t.trim());
    const exportData: any = {
      exportedAt: new Date().toISOString(),
      version: "1.0",
    };

    let content = "";
    let mimeType = "application/json";
    let filename = `invoicehound-backup-${new Date().toISOString().split("T")[0]}.json`;

    // Collect requested data
    if (typesList.includes("invoices")) {
      exportData.invoices = mockInvoices;
    }
    if (typesList.includes("clients")) {
      exportData.clients = mockClients;
    }
    if (typesList.includes("templates")) {
      exportData.templates = mockTemplates;
    }
    if (typesList.includes("activity")) {
      exportData.activityLog = mockActivityLog;
    }

    // Format based on type
    if (format === "csv") {
      mimeType = "text/csv";
      filename = `invoicehound-backup-${new Date().toISOString().split("T")[0]}.csv`;

      // Generate CSV for invoices
      if (typesList.includes("invoices")) {
        const invoiceHeaders = [
          "Invoice Number",
          "Client Name",
          "Amount",
          "Status",
          "Due Date",
        ];
        const invoiceCSV = generateCSV(mockInvoices, invoiceHeaders);
        content += "=== INVOICES ===\n" + invoiceCSV + "\n\n";
      }

      // Generate CSV for clients
      if (typesList.includes("clients")) {
        const clientHeaders = ["Name", "Email", "Phone", "Company"];
        const clientCSV = generateCSV(mockClients, clientHeaders);
        content += "=== CLIENTS ===\n" + clientCSV + "\n\n";
      }
    } else {
      // JSON format
      content = generateJSON(exportData);
    }

    res.setHeader("Content-Type", mimeType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );
    res.send(content);
  } catch (error) {
    res.status(500).json({
      error: "Export failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
