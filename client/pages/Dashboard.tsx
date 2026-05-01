import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Clock, AlertCircle, CheckCircle, DollarSign } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOutstanding: 0,
    overdueCount: 0,
    paidThisMonth: 0,
  });
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await fetch("/api/dashboard");
      if (!response.ok) throw new Error("Failed to load dashboard");
      const data = await response.json();
      setStats(data.stats);
      setInvoices(data.recentInvoices || []);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="font-sora text-3xl font-bold">Dashboard</h1>
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
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Outstanding"
            value={`$${stats.totalOutstanding.toLocaleString()}`}
            icon={<DollarSign className="w-8 h-8 text-accent" />}
            color="accent"
          />
          <StatsCard
            title="Overdue Invoices"
            value={stats.overdueCount}
            icon={<AlertCircle className="w-8 h-8 text-red-500" />}
            color="red"
          />
          <StatsCard
            title="Paid This Month"
            value={`$${stats.paidThisMonth.toLocaleString()}`}
            icon={<CheckCircle className="w-8 h-8 text-green-500" />}
            color="green"
          />
        </div>

        {/* Recent Invoices */}
        <Card className="bg-card border-border/40">
          <CardHeader>
            <CardTitle>Recent Unpaid Invoices</CardTitle>
            <CardDescription>
              Invoices sorted by most overdue first
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-muted/50 rounded animate-pulse"
                  />
                ))}
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No unpaid invoices</p>
                <Link to="/invoices/new">
                  <Button variant="outline" className="mt-4">
                    Create Your First Invoice
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {invoices.map((invoice: any) => (
                  <Link
                    key={invoice.id}
                    to={`/invoices/${invoice.id}`}
                    className="flex items-center justify-between p-4 bg-muted/30 border border-border/40 rounded-lg hover:border-accent/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{invoice.clientName}</p>
                      <p className="text-sm text-muted-foreground">
                        Invoice #{invoice.invoiceNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${invoice.amount}</p>
                      <div className="text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            invoice.status === "overdue"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-amber-500/20 text-amber-400"
                          }`}
                        >
                          {invoice.status === "overdue"
                            ? "Overdue"
                            : "Due Soon"}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card className="bg-card border-border/40">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-end justify-between">
        <p className="text-3xl font-bold">{value}</p>
        <div className="opacity-75">{icon}</div>
      </CardContent>
    </Card>
  );
}
