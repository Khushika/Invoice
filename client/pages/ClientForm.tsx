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

export default function ClientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditing) {
      loadClient();
    }
  }, [id]);

  const loadClient = async () => {
    try {
      const response = await fetch(`/api/clients/${id}`);
      if (!response.ok) throw new Error("Failed to load client");
      const data = await response.json();
      const client = data.client;

      setName(client.name);
      setEmail(client.email);
      setPhone(client.phone || "");
      setCompany(client.company || "");
      setCurrency(client.currency);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load client");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const url = isEditing ? `/api/clients/${id}` : "/api/clients";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          company: company || undefined,
          currency,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save client");
      }

      navigate("/clients");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-2xl">
        <h1 className="font-sora text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">
          {isEditing ? "Edit Client" : "Add New Client"}
        </h1>
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-3 sm:px-4 py-2 sm:py-3 rounded mb-4 sm:mb-6 text-sm sm:text-base">
            {error}
          </div>
        )}

        <Card className="bg-card border-border/40">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Client Information</CardTitle>
            <CardDescription>
              {isEditing
                ? "Update client details"
                : "Enter your client's information"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Client Name *
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Acme Corporation"
                  required
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@example.com"
                  required
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Company
                </label>
                <Input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Corp, Inc."
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Preferred Currency
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

              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={() => navigate("/clients")}
                  variant="outline"
                  className="border-border text-foreground hover:bg-card flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !name || !email}
                  className="bg-accent hover:bg-accent/90 text-primary-foreground flex-1"
                >
                  {isLoading
                    ? "Saving..."
                    : isEditing
                    ? "Update Client"
                    : "Add Client"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
