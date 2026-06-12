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
import { Plus, Edit, Trash2, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface RecurringInvoice {
  id: string;
  name: string;
  clientName: string;
  amount: number;
  frequency: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly";
  nextDueDate: string;
  status: "active" | "paused" | "ended";
  startDate: string;
  endDate?: string;
  dayOfWeek?: number;
  dayOfMonth?: number;
  lastGenerated?: string;
}

const frequencyLabels = {
  weekly: "Every Week",
  biweekly: "Every 2 Weeks",
  monthly: "Every Month",
  quarterly: "Every Quarter",
  yearly: "Every Year",
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "text-green-500";
    case "paused":
      return "text-yellow-500";
    case "ended":
      return "text-gray-500";
    default:
      return "text-gray-500";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <CheckCircle className="w-4 h-4" />;
    case "paused":
      return <Clock className="w-4 h-4" />;
    case "ended":
      return <AlertCircle className="w-4 h-4" />;
    default:
      return null;
  }
};

export default function RecurringInvoices() {
  const [recurring, setRecurring] = useState<RecurringInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "paused" | "ended">("all");

  useEffect(() => {
    loadRecurringInvoices();
  }, []);

  const loadRecurringInvoices = async () => {
    try {
      const response = await fetch("/api/recurring-invoices");
      if (!response.ok) throw new Error("Failed to load");
      const data = await response.json();
      setRecurring(data.recurringInvoices || []);
    } catch (error) {
      console.error("Error loading recurring invoices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRecurring = recurring.filter(
    (inv) => filterStatus === "all" || inv.status === filterStatus
  );

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this recurring invoice?")) return;
    try {
      await fetch(`/api/recurring-invoices/${id}`, { method: "DELETE" });
      setRecurring(recurring.filter((inv) => inv.id !== id));
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleToggleStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/recurring-invoices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setRecurring(
        recurring.map((inv) =>
          inv.id === id ? { ...inv, status: newStatus as any } : inv
        )
      );
    } catch (error) {
      console.error("Error updating:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Recurring Invoices</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Set up automatic invoices that repeat on a schedule
          </p>
        </div>
        <Link to="/recurring-invoices/new">
          <Button className="bg-accent hover:bg-accent/90 text-background gap-2">
            <Plus className="w-4 h-4" />
            New Recurring Invoice
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "active", "paused", "ended"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
              filterStatus === status
                ? "bg-accent text-background"
                : "bg-card border border-border/40 text-foreground hover:border-accent/50"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      ) : filteredRecurring.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">
                No recurring invoices found
              </p>
              <Link to="/recurring-invoices/new">
                <Button variant="outline">Create your first recurring invoice</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredRecurring.map((rec) => (
            <Card key={rec.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">
                        {rec.name}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getStatusColor(rec.status)}`}
                      >
                        {getStatusIcon(rec.status)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {rec.clientName} • {frequencyLabels[rec.frequency]}
                    </p>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Amount: ${rec.amount.toLocaleString()}</span>
                      <span>
                        Next: {new Date(rec.nextDueDate).toLocaleDateString()}
                      </span>
                      {rec.lastGenerated && (
                        <span>
                          Last: {new Date(rec.lastGenerated).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <select
                      value={rec.status}
                      onChange={(e) => handleToggleStatus(rec.id, e.target.value)}
                      className="px-3 py-1 bg-card text-foreground border border-border rounded text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="ended">Ended</option>
                    </select>

                    <Link to={`/recurring-invoices/${rec.id}`}>
                      <Button size="sm" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(rec.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info */}
      <Card className="bg-blue-500/10 border-blue-500/30">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-foreground mb-2">How it works</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>✓ Create once, bill automatically on your schedule</li>
            <li>✓ Choose from weekly, monthly, quarterly, or yearly</li>
            <li>✓ Invoices are generated automatically before each due date</li>
            <li>✓ Pause or end anytime without deleting the setup</li>
            <li>✓ Perfect for retainers, subscriptions, and retainer fees</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
