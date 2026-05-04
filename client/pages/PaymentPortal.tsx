import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, AlertCircle, FileText, Lock } from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  freelancerName: string;
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
}

export default function PaymentPortal() {
  const { token } = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    loadInvoice();
  }, [token]);

  const loadInvoice = async () => {
    try {
      // Mock fetch - in production would validate token and get invoice
      if (token) {
        // Simulate API call
        const mockInvoice: Invoice = {
          id: "1",
          invoiceNumber: "INV-001",
          clientName: "Acme Corp",
          freelancerName: "John Developer",
          amount: 1650,
          status: "sent",
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          issuedDate: new Date().toISOString(),
          lineItems: [
            { description: "Web Development", quantity: 40, unitPrice: 50 },
          ],
          subtotal: 1500,
          taxRate: 10,
          total: 1650,
          currency: "USD",
          notes: "Payment due upon receipt",
          paymentToken: token,
        };
        setInvoice(mockInvoice);
      }
    } catch (err) {
      setError("Invoice not found");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    setIsPaying(true);
    try {
      // Simulate Stripe checkout
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setPaymentSuccess(true);
    } catch (err) {
      setError("Payment failed. Please try again.");
    } finally {
      setIsPaying(false);
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
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="bg-card border-border/40 max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-400">{error || "Invoice not found"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="bg-card border-border/40 max-w-md border-green-500/50">
          <CardContent className="pt-12 pb-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h1 className="font-sora text-2xl font-bold mb-2">Payment Received</h1>
            <p className="text-muted-foreground mb-4">
              Thank you! Your payment of {invoice.currency} ${invoice.total} has been
              received successfully.
            </p>
            <p className="text-sm text-muted-foreground">
              Invoice #{invoice.invoiceNumber}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const daysUntilDue = Math.ceil(
    (new Date(invoice.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const isOverdue = daysUntilDue < 0;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-6 h-6 text-accent" />
            <h1 className="font-sora text-3xl font-bold">Invoice Payment</h1>
          </div>
          <p className="text-muted-foreground">
            Secure payment portal powered by InvoiceHound
          </p>
        </div>

        {/* Security Notice */}
        <Card className="bg-blue-500/10 border-blue-500/50 mb-6">
          <CardContent className="pt-4 flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Secure Payment</p>
              <p className="text-xs text-muted-foreground">
                This payment is processed securely through Stripe
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Details Card */}
        <Card className="bg-card border-border/40 mb-6">
          <CardHeader className="border-b border-border/40">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Invoice #{invoice.invoiceNumber}</CardTitle>
                <CardDescription>
                  From: {invoice.freelancerName}
                </CardDescription>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isOverdue
                    ? "bg-red-500/20 text-red-400"
                    : "bg-amber-500/20 text-amber-400"
                }`}
              >
                {isOverdue ? "Overdue" : "Pending"}
              </span>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Invoice Info Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
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
                    <p className={`font-medium ${isOverdue ? "text-red-400" : ""}`}>
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                    {daysUntilDue > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {daysUntilDue} days remaining
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">Total Amount Due</p>
                <p className="text-4xl font-bold text-accent mb-2">
                  {invoice.currency} ${invoice.total.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Subtotal: {invoice.currency} ${invoice.subtotal.toFixed(2)}
                </p>
                {invoice.taxRate > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Tax ({invoice.taxRate}%): {invoice.currency}${" "}
                    {(invoice.subtotal * invoice.taxRate / 100).toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            {/* Line Items */}
            <div className="border-t border-border/40 pt-6">
              <h3 className="font-medium mb-4">Services & Products</h3>
              <div className="space-y-3">
                {invoice.lineItems.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{item.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} × {invoice.currency} ${item.unitPrice}
                      </p>
                    </div>
                    <p className="font-medium">
                      {invoice.currency}{" "}
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="border-t border-border/40 mt-6 pt-6">
                <h3 className="font-medium mb-2 text-sm">Notes</h3>
                <p className="text-sm text-muted-foreground">{invoice.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Section */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <Button
          onClick={handlePayment}
          disabled={isPaying || invoice.status === "paid"}
          className="w-full bg-accent hover:bg-accent/90 text-primary-foreground py-6 text-lg font-semibold"
        >
          {isPaying
            ? "Processing Payment..."
            : invoice.status === "paid"
            ? "Already Paid"
            : `Pay ${invoice.currency} $${invoice.total.toFixed(2)}`}
        </Button>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>
            Powered by{" "}
            <span className="font-semibold text-foreground">InvoiceHound</span>
          </p>
          <p className="mt-2">
            Questions? Contact: {invoice.freelancerName}
          </p>
        </div>
      </div>
    </div>
  );
}
