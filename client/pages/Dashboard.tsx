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
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h1 className="font-sora text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <Link to="/invoices/new" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-primary-foreground gap-2">
              <Plus className="w-4 h-4" />
              New Invoice
            </Button>
          </Link>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
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
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 bg-muted/30 border border-border/40 rounded-lg hover:border-accent/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{invoice.clientName}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        Invoice #{invoice.invoiceNumber}
                      </p>
                    </div>
                    <div className="flex items-center justify-between w-full sm:w-auto gap-2">
                      <p className="font-medium">${invoice.amount}</p>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
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
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
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
