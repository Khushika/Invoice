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
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building,
  AlertCircle,
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  currency: string;
  createdAt: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: string;
  dueDate: string;
}

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadClient();
  }, [id]);

  const loadClient = async () => {
    try {
      const response = await fetch(`/api/clients/${id}`);
      if (!response.ok) throw new Error("Failed to load client");
      const data = await response.json();
      setClient(data.client);

      // In production: fetch invoices for this client
      setInvoices([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load client");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure? This action cannot be undone.")) return;

    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete client");
      navigate("/clients");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete client");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Building className="w-12 h-12 text-accent mx-auto" />
          </div>
          <p className="text-muted-foreground">Loading client...</p>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="bg-card border-border/40 max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-400 mb-6">{error || "Client not found"}</p>
            <Button onClick={() => navigate("/clients")} className="w-full">
              Back to Clients
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <Link
            to="/clients"
            className="flex items-center gap-2 text-accent hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Clients
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="font-sora text-3xl font-bold">{client.name}</h1>
            <div className="flex gap-2">
              <Link to={`/clients/${id}/edit`}>
                <Button
                  variant="outline"
                  className="border-border text-foreground hover:bg-card gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
              </Link>
              <Button
                onClick={handleDelete}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Client Info */}
          <div className="md:col-span-2">
            <Card className="bg-card border-border/40 mb-6">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {client.company && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Company</p>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-accent" />
                      <p className="font-medium">{client.company}</p>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-accent" />
                    <a
                      href={`mailto:${client.email}`}
                      className="font-medium text-accent hover:underline"
                    >
                      {client.email}
                    </a>
                  </div>
                </div>

                {client.phone && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Phone</p>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-accent" />
                      <a
                        href={`tel:${client.phone}`}
                        className="font-medium text-accent hover:underline"
                      >
                        {client.phone}
                      </a>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-border/40">
                  <p className="text-xs text-muted-foreground">Currency</p>
                  <p className="font-medium">{client.currency}</p>
                </div>
              </CardContent>
            </Card>

            {/* Invoices */}
            <Card className="bg-card border-border/40">
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>
                  All invoices for {client.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {invoices.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      No invoices yet
                    </p>
                    <Link to="/invoices/new">
                      <Button className="bg-accent hover:bg-accent/90 text-primary-foreground">
                        Create Invoice
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {invoices.map((invoice) => (
                      <Link
                        key={invoice.id}
                        to={`/invoices/${invoice.id}`}
                        className="flex items-center justify-between p-3 bg-muted/30 border border-border/40 rounded hover:border-accent/50 transition-colors"
                      >
                        <div>
                          <p className="font-medium">{invoice.invoiceNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(invoice.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {client.currency} ${invoice.amount}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="bg-card border-border/40">
              <CardHeader>
                <CardTitle className="text-base">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Date Added
                  </p>
                  <p className="font-medium">
                    {new Date(client.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="pt-4 border-t border-border/40">
                  <p className="text-xs text-muted-foreground mb-2">Status</p>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                    Active
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
