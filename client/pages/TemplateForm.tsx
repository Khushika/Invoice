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
import { ArrowLeft, Trash2, Plus } from "lucide-react";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface Template {
  id: string;
  name: string;
  description: string;
  lineItems: LineItem[];
  notes: string;
  taxRate: number;
  currency: string;
}

export default function TemplateForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [notes, setNotes] = useState("");
  const [taxRate, setTaxRate] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      loadTemplate();
    }
  }, [id]);

  const loadTemplate = async () => {
    try {
      const response = await fetch(`/api/templates/${id}`);
      if (!response.ok) throw new Error("Failed to load template");
      const data = await response.json();
      const template = data.template;
      setName(template.name);
      setDescription(template.description);
      setLineItems(template.lineItems);
      setNotes(template.notes);
      setTaxRate(template.taxRate);
      setCurrency(template.currency);
    } catch (error) {
      console.error("Error loading template:", error);
      navigate("/templates");
    } finally {
      setIsLoading(false);
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
    field: string,
    value: any
  ) => {
    setLineItems(
      lineItems.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Template name is required");
      return;
    }

    if (lineItems.some((item) => !item.description.trim())) {
      alert("All line items must have a description");
      return;
    }

    setIsSaving(true);
    try {
      const templateData = {
        name,
        description,
        lineItems,
        notes,
        taxRate,
        currency,
      };

      const url = isEditMode ? `/api/templates/${id}` : "/api/templates";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) throw new Error("Failed to save template");

      navigate("/templates");
    } catch (error) {
      console.error("Error saving template:", error);
      alert("Failed to save template");
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
        onClick={() => navigate("/templates")}
        className="flex items-center gap-2 text-accent hover:text-accent/80"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Templates
      </button>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEditMode ? "Edit Template" : "Create New Template"}
          </CardTitle>
          <CardDescription>
            {isEditMode
              ? "Update this invoice template"
              : "Create a reusable invoice template"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Template Name *
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Standard Web Design"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this template"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tax Rate (%)
                  </label>
                  <Input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 bg-card text-foreground border border-border rounded-md"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-foreground">
                  Line Items *
                </label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddLineItem}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-3">
                {lineItems.map((item) => (
                  <div key={item.id} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <Input
                        value={item.description}
                        onChange={(e) =>
                          handleLineItemChange(
                            item.id,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Item description"
                      />
                    </div>
                    <div className="w-20">
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleLineItemChange(
                            item.id,
                            "quantity",
                            parseFloat(e.target.value) || 1
                          )
                        }
                        min="1"
                        placeholder="Qty"
                      />
                    </div>
                    <div className="w-32">
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
                        placeholder="Price"
                      />
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveLineItem(item.id)}
                      disabled={lineItems.length === 1}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Default Notes
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Default payment terms, notes, etc."
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-accent hover:bg-accent/90 text-background"
              >
                {isSaving ? "Saving..." : isEditMode ? "Update Template" : "Create Template"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/templates")}
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
