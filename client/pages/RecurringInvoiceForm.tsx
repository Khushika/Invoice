import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";

interface RecurringInvoiceForm {
  name: string;
  clientId: string;
  clientName: string;
  amount: number;
  frequency: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly";
  startDate: string;
  endDate: string;
  dayOfMonth?: number;
  description: string;
  notes: string;
}

export default function RecurringInvoiceForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<RecurringInvoiceForm>({
    name: "",
    clientId: "",
    clientName: "",
    amount: 0,
    frequency: "monthly",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    description: "",
    notes: "",
  });

  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadClients();
    if (isEditMode) {
      loadRecurringInvoice();
    }
  }, [id]);

  const loadClients = async () => {
    try {
      const response = await fetch("/api/clients");
      if (!response.ok) throw new Error("Failed to load clients");
      const data = await response.json();
      setClients(data.clients || []);
    } catch (error) {
      console.error("Error loading clients:", error);
    }
  };

  const loadRecurringInvoice = async () => {
    try {
      const response = await fetch(`/api/recurring-invoices/${id}`);
      if (!response.ok) throw new Error("Failed to load");
      const data = await response.json();
      setFormData(data.recurringInvoice);
    } catch (error) {
      console.error("Error loading:", error);
      navigate("/recurring-invoices");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    field: keyof RecurringInvoiceForm,
    value: any
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClientSelect = (clientId: string) => {
    const selected = clients.find((c) => c.id === clientId);
    setFormData((prev) => ({
      ...prev,
      clientId,
      clientName: selected?.name || "",
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Name is required");
      return;
    }

    if (!formData.clientId) {
      alert("Please select a client");
      return;
    }

    if (formData.amount <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    setIsSaving(true);
    try {
      const url = isEditMode
        ? `/api/recurring-invoices/${id}`
        : "/api/recurring-invoices";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save");

      navigate("/recurring-invoices");
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save recurring invoice");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/recurring-invoices")}
        className="flex items-center gap-2 text-accent hover:text-accent/80"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Recurring Invoices
      </button>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEditMode ? "Edit Recurring Invoice" : "Create Recurring Invoice"}
          </CardTitle>
          <CardDescription>
            Set up an invoice that will automatically generate on a schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="e.g., Monthly Retainer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Client *
                </label>
                <select
                  value={formData.clientId}
                  onChange={(e) => handleClientSelect(e.target.value)}
                  className="w-full px-3 py-2 bg-card text-foreground border border-border rounded-md"
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
                <label className="block text-sm font-medium text-foreground mb-2">
                  Amount *
                </label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleChange("amount", parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Frequency *
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => handleChange("frequency", e.target.value)}
                  className="w-full px-3 py-2 bg-card text-foreground border border-border rounded-md"
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Every 2 Weeks</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Start Date *
                </label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  End Date (Optional)
                </label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  placeholder="Leave empty for ongoing"
                />
              </div>
            </div>

            {formData.frequency === "monthly" && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Day of Month (Optional)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="31"
                  value={formData.dayOfMonth || ""}
                  onChange={(e) =>
                    handleChange("dayOfMonth", parseInt(e.target.value) || undefined)
                  }
                  placeholder="Leave empty to use start date"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <Input
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Brief description of services"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Notes
              </label>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Additional notes or terms"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-accent hover:bg-accent/90 text-background"
              >
                {isSaving ? "Saving..." : isEditMode ? "Update" : "Create"} Recurring Invoice
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/recurring-invoices")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
