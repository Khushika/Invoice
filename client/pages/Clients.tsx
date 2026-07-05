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
import { Plus, Search, Mail, Phone } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  currency: string;
  createdAt: string;
}

export default function Clients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const response = await fetch("/api/clients");
      if (!response.ok) throw new Error("Failed to load clients");
      const data = await response.json();
      setClients(data.clients || []);
    } catch (error) {
      console.error("Error loading clients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.company &&
        client.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <h1 className="font-sora text-2xl sm:text-3xl font-bold">Clients</h1>
          <Link to="/clients/new" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-primary-foreground gap-2">
              <Plus className="w-4 h-4" />
              New Client
            </Button>
          </Link>
        </div>
        {/* Search Bar */}
        <div className="mb-4 sm:mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-sm sm:text-base bg-input border-border text-foreground"
          />
        </div>

        {/* Clients Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-card border border-border/40 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No clients found</p>
            <Link to="/clients/new">
              <Button className="bg-accent hover:bg-accent/90 text-primary-foreground">
                Add Your First Client
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {filteredClients.map((client) => (
              <Link key={client.id} to={`/clients/${client.id}`}>
                <Card className="bg-card border-border/40 hover:border-accent/50 transition-colors cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg truncate">{client.name}</CardTitle>
                    {client.company && (
                      <CardDescription className="truncate">{client.company}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground min-w-0">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="break-all text-xs">{client.email}</span>
                    </div>
                    {client.phone && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span className="text-xs">{client.phone}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-border/40">
                      <p className="text-xs text-muted-foreground">
                        Added {new Date(client.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
