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
import { Plus, Edit, Trash2, Copy } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
  notes: string;
  taxRate: number;
  currency: string;
  createdAt: string;
}

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await fetch("/api/templates");
      if (!response.ok) throw new Error("Failed to load templates");
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error("Error loading templates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this template?")) return;
    try {
      await fetch(`/api/templates/${id}`, { method: "DELETE" });
      setTemplates(templates.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting template:", error);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const response = await fetch(`/api/templates/${id}/duplicate`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to duplicate");
      const data = await response.json();
      setTemplates([...templates, data.template]);
    } catch (error) {
      console.error("Error duplicating template:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Templates</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage reusable invoice templates
          </p>
        </div>
        <Link to="/templates/new">
          <Button className="bg-accent hover:bg-accent/90 text-background gap-2">
            <Plus className="w-4 h-4" />
            New Template
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">
              Loading templates...
            </p>
          </CardContent>
        </Card>
      ) : templates.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">No templates yet</p>
              <Link to="/templates/new">
                <Button variant="outline">Create your first template</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDuplicate(template.id)}
                      title="Duplicate template"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Link to={`/templates/${template.id}`}>
                      <Button size="sm" variant="ghost" title="Edit template">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(template.id)}
                      title="Delete template"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Line Items
                  </p>
                  <div className="space-y-1">
                    {template.lineItems.map((item, idx) => (
                      <p key={idx} className="text-sm text-foreground">
                        • {item.description} ({item.quantity}x @{" "}
                        {template.currency} {item.unitPrice})
                      </p>
                    ))}
                  </div>
                </div>
                {template.notes && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Default Notes
                    </p>
                    <p className="text-sm text-foreground">{template.notes}</p>
                  </div>
                )}
                <div className="flex gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Tax Rate
                    </p>
                    <p className="text-sm text-foreground">{template.taxRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Currency
                    </p>
                    <p className="text-sm text-foreground">{template.currency}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
