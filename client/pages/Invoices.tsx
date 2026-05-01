import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

type InvoiceStatus = "draft" | "sent" | "overdue" | "paid" | "cancelled";

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  issuedDate: string;
}

export default function Invoices() {
  const [activeFilter, setActiveFilter] = useState<InvoiceStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const response = await fetch("/api/invoices");
      if (!response.ok) throw new Error("Failed to load invoices");
      const data = await response.json();
      setInvoices(data.invoices || []);
    } catch (error) {
      console.error("Error loading invoices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesFilter =
      activeFilter === "all" || inv.status === activeFilter;
    const matchesSearch =
      inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filterTabs: Array<{ label: string; value: InvoiceStatus | "all" }> = [
    { label: "All", value: "all" },
    { label: "Draft", value: "draft" },
    { label: "Sent", value: "sent" },
    { label: "Overdue", value: "overdue" },
    { label: "Paid", value: "paid" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="font-sora text-3xl font-bold">Invoices</h1>
            <Link to="/invoices/new">
              <Button className="bg-accent hover:bg-accent/90 text-primary-foreground gap-2">
                <Plus className="w-4 h-4" />
                New Invoice
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by client name or invoice number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input border-border text-foreground"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeFilter === tab.value
                  ? "bg-accent text-primary-foreground"
                  : "bg-card border border-border/40 text-foreground hover:border-accent/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Invoices List */}
        <Card className="bg-card border-border/40">
          <CardHeader>
            <CardTitle>
              {activeFilter === "all"
                ? "All Invoices"
                : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Invoices`}
            </CardTitle>
            <CardDescription>
              {filteredInvoices.length} invoice
              {filteredInvoices.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-20 bg-muted/50 rounded animate-pulse"
                  />
                ))}
              </div>
            ) : filteredInvoices.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No invoices found</p>
                <Link to="/invoices/new">
                  <Button className="bg-accent hover:bg-accent/90 text-primary-foreground">
                    Create Your First Invoice
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/40">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Invoice #
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Client
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Due Date
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-right py-3 px-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="border-b border-border/40 hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-4 px-4 font-medium">
                          {invoice.invoiceNumber}
                        </td>
                        <td className="py-4 px-4">{invoice.clientName}</td>
                        <td className="py-4 px-4">
                          ${invoice.amount.toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <StatusBadge status={invoice.status} />
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Link to={`/invoices/${invoice.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-border text-foreground hover:bg-card"
                            >
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const badgeClasses = {
    draft: "badge-draft",
    sent: "badge-sent",
    overdue: "badge-overdue",
    paid: "badge-paid",
    cancelled: "badge-draft",
  };

  const labels = {
    draft: "Draft",
    sent: "Sent",
    overdue: "Overdue",
    paid: "Paid",
    cancelled: "Cancelled",
  };

  return <span className={badgeClasses[status]}>{labels[status]}</span>;
}
