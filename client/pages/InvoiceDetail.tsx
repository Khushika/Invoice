import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  ArrowLeft,
  Edit,
  Copy,
  CheckCircle,
  Clock,
  AlertCircle,
  Send,
  Download,
} from "lucide-react";
import { exportInvoiceAsJSON } from "@/utils/pdfExport";

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  status: string;
  dueDate: string;
  issuedDate: string;
  lineItems: any[];
  subtotal: number;
  taxRate: number;
  total: number;
  currency: string;
  notes: string;
  paymentToken: string;
  paidAt?: string;
  events: any[];
}

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    loadInvoice();
  }, [id]);

  const loadInvoice = async () => {
    try {
      const response = await fetch(`/api/invoices/${id}`);
      if (!response.ok) throw new Error("Failed to load invoice");
      const data = await response.json();
      setInvoice(data.invoice);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load invoice");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPaymentLink = async () => {
    if (!invoice) return;
    setCopying(true);
    try {
      const paymentLink = `${window.location.origin}/pay/${invoice.paymentToken}`;
      await navigator.clipboard.writeText(paymentLink);
      alert("Payment link copied to clipboard!");
    } catch {
      alert("Failed to copy link");
    } finally {
      setCopying(false);
    }
  };

  const handleMarkPaid = async () => {
    if (!invoice) return;
    try {
      const response = await fetch(`/api/invoices/${id}/mark-paid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to mark as paid");
      loadInvoice();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to mark as paid");
    }
  };

  const handleSendReminder = async () => {
    if (!invoice) return;
    try {
      const response = await fetch(`/api/invoices/${id}/remind`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to send reminder");
      alert("Reminder sent to client!");
      loadInvoice();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to send reminder");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <FileText className="w-12 h-12 text-accent mx-auto" />
          </div>
          <p className="text-muted-foreground">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="bg-card border-border/40 max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-400 mb-6">{error || "Invoice not found"}</p>
            <Button onClick={() => navigate("/invoices")} className="w-full">
              Back to Invoices
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusColors = {
    draft: "bg-gray-500/20 text-gray-400",
    sent: "bg-amber-500/20 text-amber-400",
    overdue: "bg-red-500/20 text-red-400",
    paid: "bg-green-500/20 text-green-400",
  };

  const statusLabels = {
    draft: "Draft",
    sent: "Sent",
    overdue: "Overdue",
    paid: "Paid",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/invoices"
            className="flex items-center gap-2 text-accent hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Invoices
          </Link>
          <div className="flex gap-2">
            {invoice.status !== "paid" && (
              <Button
                onClick={handleSendReminder}
                variant="outline"
                className="border-border text-foreground hover:bg-card gap-2"
              >
                <Send className="w-4 h-4" />
                Send Reminder
              </Button>
            )}
            {invoice.status === "draft" && (
              <Link to={`/invoices/${id}/edit`}>
                <Button
                  variant="outline"
                  className="border-border text-foreground hover:bg-card gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
              </Link>
            )}
          </div>
        </div>
        {/* Invoice Summary */}
        <Card className="bg-card border-border/40 mb-6">
          <CardHeader className="border-b border-border/40 pb-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="font-sora text-3xl font-bold">
                    {invoice.invoiceNumber}
                  </h1>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[invoice.status as keyof typeof statusColors] ||
                      statusColors.draft
                    }`}
                  >
                    {statusLabels[invoice.status as keyof typeof statusLabels] ||
                      invoice.status}
                  </span>
                </div>
                <p className="text-muted-foreground">
                  Client: {invoice.clientName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-accent mb-2">
                  {invoice.currency} ${invoice.total.toFixed(2)}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              {/* Dates */}
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-4">
                  Dates
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Issued</p>
                    <p className="font-medium">
                      {new Date(invoice.issuedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Due</p>
                    <p className="font-medium">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  {invoice.paidAt && (
                    <div>
                      <p className="text-xs text-muted-foreground">Paid</p>
                      <p className="font-medium text-green-400">
                        {new Date(invoice.paidAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Breakdown */}
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-4">
                  Breakdown
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">
                      {invoice.currency} ${invoice.subtotal.toFixed(2)}
                    </span>
                  </div>
                  {invoice.taxRate > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Tax ({invoice.taxRate}%)
                      </span>
                      <span className="font-medium">
                        {invoice.currency}${" "}
                        {(invoice.subtotal * invoice.taxRate) / 100}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-border/40 pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-accent">
                      {invoice.currency} ${invoice.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="border-t border-border/40 pt-6 mb-6">
              <h3 className="font-medium mb-4">Line Items</h3>
              <div className="space-y-2">
                {invoice.lineItems.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2 border-b border-border/40 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{item.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} x {invoice.currency} ${item.unitPrice}
                      </p>
                    </div>
                    <p className="font-medium">
                      {invoice.currency} ${(item.quantity * item.unitPrice).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="border-t border-border/40 pt-6 mb-6">
                <h3 className="font-medium mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground">{invoice.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {invoice.status !== "paid" && (
            <Button
              onClick={handleMarkPaid}
              className="bg-green-600 hover:bg-green-700 text-white gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Mark as Paid
            </Button>
          )}
          <Button
            onClick={handleCopyPaymentLink}
            disabled={copying}
            variant="outline"
            className="border-border text-foreground hover:bg-card gap-2"
          >
            <Copy className="w-4 h-4" />
            {copying ? "Copied!" : "Copy Link"}
          </Button>
          <Button
            onClick={() =>
              exportInvoiceAsJSON({
                invoiceNumber: invoice.invoiceNumber,
                clientName: invoice.clientName,
                freelancerName: "Your Name",
                freelancerEmail: "you@example.com",
                issueDate: invoice.issuedDate,
                dueDate: invoice.dueDate,
                lineItems: invoice.lineItems,
                subtotal: invoice.subtotal,
                taxRate: invoice.taxRate,
                total: invoice.total,
                currency: invoice.currency,
                notes: invoice.notes,
              })
            }
            variant="outline"
            className="border-border text-foreground hover:bg-card gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {/* Timeline */}
        {invoice.events && invoice.events.length > 0 && (
          <Card className="bg-card border-border/40">
            <CardHeader>
              <CardTitle className="text-lg">Event Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoice.events.map((event: any, i: number) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">
                        {event.type === "CREATED" && "Invoice Created"}
                        {event.type === "SENT" && "Invoice Sent"}
                        {event.type === "PAID" && "Payment Received"}
                        {event.type === "REMINDER_SENT" && "Reminder Sent"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
