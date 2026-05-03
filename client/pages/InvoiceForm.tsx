import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function InvoiceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [clientId, setClientId] = useState("");
  const [clients, setClients] = useState<any[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [taxRate, setTaxRate] = useState("0");
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadClients();
    if (isEditing) {
      loadInvoice();
    } else {
      // Auto-generate invoice number for new invoices
      const timestamp = Date.now().toString().slice(-6);
      setInvoiceNumber(`INV-${timestamp}`);
    }
  }, [id]);

  const loadClients = async () => {
    try {
      const response = await fetch("/api/clients");
      if (!response.ok) throw new Error("Failed to load clients");
      const data = await response.json();
      setClients(data.clients || []);
    } catch (err) {
      console.error("Error loading clients:", err);
    }
  };

  const loadInvoice = async () => {
    try {
      const response = await fetch(`/api/invoices/${id}`);
      if (!response.ok) throw new Error("Failed to load invoice");
      const data = await response.json();
      const invoice = data.invoice;

      setClientId(invoice.clientId);
      setInvoiceNumber(invoice.invoiceNumber);
      setIssueDate(invoice.issueDate.split("T")[0]);
      setDueDate(invoice.dueDate.split("T")[0]);
      setCurrency(invoice.currency);
      setTaxRate(invoice.taxRate.toString());
      setNotes(invoice.notes || "");
      setLineItems(invoice.lineItems || lineItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load invoice");
    }
  };

  const handleAddLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: Date.now().toString(),
        description: "",
        quantity: 1,
        unitPrice: 0,
      },
    ]);
  };

  const handleRemoveLineItem = (itemId: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== itemId));
    }
  };

  const handleLineItemChange = (
    itemId: string,
    field: keyof LineItem,
    value: any
  ) => {
    setLineItems(
      lineItems.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    );
  };

  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const tax = (subtotal * parseFloat(taxRate || "0")) / 100;
  const total = subtotal + tax;

  const handleSave = async (status: "draft" | "sent") => {
    setError("");
    setIsLoading(true);

    try {
      const url = isEditing ? `/api/invoices/${id}` : "/api/invoices";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          invoiceNumber,
          issueDate,
          dueDate,
          currency,
          taxRate: parseFloat(taxRate),
          notes,
          lineItems,
          status,
          subtotal,
          tax,
          total,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save invoice");
      }

      navigate("/invoices");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="font-sora text-3xl font-bold mb-8">
          {isEditing ? "Edit Invoice" : "Create Invoice"}
        </h1>
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Client & Dates */}
          <Card className="bg-card border-border/40">
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Client
                  </label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full px-3 py-2 bg-input border border-border rounded text-foreground"
                    required
                  >
                    <option value="">Select a client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Invoice Number
                  </label>
                  <Input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="INV-001"
                    className="bg-input border-border text-foreground"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Issue Date
                  </label>
                  <Input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Due Date
                  </label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="bg-input border-border text-foreground"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 bg-input border border-border rounded text-foreground"
                  >
                    <option>USD</option>
                    <option>GBP</option>
                    <option>EUR</option>
                    <option>INR</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card className="bg-card border-border/40">
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
              <CardDescription>Add services or products</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {lineItems.map((item) => (
                <div key={item.id} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">
                      Description
                    </label>
                    <Input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        handleLineItemChange(item.id, "description", e.target.value)
                      }
                      placeholder="Service or product name"
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-sm font-medium mb-2">
                      Qty
                    </label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleLineItemChange(
                          item.id,
                          "quantity",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      min="0"
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-sm font-medium mb-2">
                      Unit Price
                    </label>
                    <Input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleLineItemChange(
                          item.id,
                          "unitPrice",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      min="0"
                      step="0.01"
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-sm font-medium mb-2">
                      Total
                    </label>
                    <div className="px-3 py-2 bg-muted/50 rounded text-sm font-medium">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveLineItem(item.id)}
                    className="p-2 hover:bg-muted rounded transition-colors"
                    disabled={lineItems.length === 1}
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              ))}

              <Button
                type="button"
                onClick={handleAddLineItem}
                variant="outline"
                className="w-full border-border text-foreground hover:bg-card gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Line Item
              </Button>
            </CardContent>
          </Card>

          {/* Totals & Tax */}
          <Card className="bg-card border-border/40">
            <CardContent className="pt-6">
              <div className="space-y-3 max-w-sm ml-auto">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    {currency} ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Tax</span>
                  <Input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="0"
                    className="w-20 px-2 py-1 text-sm bg-input border-border text-foreground"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                  <span className="ml-auto font-medium">
                    ${tax.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-border/40 pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-accent">
                    {currency} ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="bg-card border-border/40">
            <CardHeader>
              <CardTitle className="text-base">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes or payment instructions..."
                className="w-full px-3 py-2 bg-input border border-border rounded text-foreground min-h-24"
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              onClick={() => handleSave("draft")}
              disabled={isLoading || !clientId}
              variant="outline"
              className="border-border text-foreground hover:bg-card flex-1"
            >
              {isLoading ? "Saving..." : "Save as Draft"}
            </Button>
            <Button
              onClick={() => handleSave("sent")}
              disabled={isLoading || !clientId}
              className="bg-accent hover:bg-accent/90 text-primary-foreground flex-1"
            >
              {isLoading ? "Saving..." : "Send to Client"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
