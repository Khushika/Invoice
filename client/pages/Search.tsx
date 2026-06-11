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
import { Search, ArrowRight } from "lucide-react";

interface SearchResult {
  id: string;
  type: "invoice" | "client" | "template";
  title: string;
  subtitle: string;
  amount?: number;
  status?: string;
  date?: string;
  link: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    invoiceStatuses: [] as string[],
    minAmount: "",
    maxAmount: "",
    dateRange: "all" as "all" | "week" | "month" | "quarter" | "year",
  });

  useEffect(() => {
    if (query.length > 0) {
      performSearch();
    } else {
      setResults([]);
    }
  }, [query, selectedFilters]);

  const performSearch = async () => {
    setIsSearching(true);
    try {
      const params = new URLSearchParams({
        q: query,
        statuses: selectedFilters.invoiceStatuses.join(","),
        minAmount: selectedFilters.minAmount,
        maxAmount: selectedFilters.maxAmount,
        dateRange: selectedFilters.dateRange,
      });

      const response = await fetch(`/api/search?${params}`);
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleStatusFilter = (status: string) => {
    setSelectedFilters((prev) => {
      const statuses = prev.invoiceStatuses.includes(status)
        ? prev.invoiceStatuses.filter((s) => s !== status)
        : [...prev.invoiceStatuses, status];
      return { ...prev, invoiceStatuses: statuses };
    });
  };

  const clearFilters = () => {
    setSelectedFilters({
      invoiceStatuses: [],
      minAmount: "",
      maxAmount: "",
      dateRange: "all",
    });
  };

  const statuses = ["draft", "sent", "overdue", "paid"];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "invoice":
        return "bg-blue-100 text-blue-700";
      case "client":
        return "bg-purple-100 text-purple-700";
      case "template":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Search</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Find invoices, clients, and templates across your account
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search invoices, clients, templates..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 text-lg h-12"
          autoFocus
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
              {(selectedFilters.invoiceStatuses.length > 0 ||
                selectedFilters.minAmount ||
                selectedFilters.maxAmount ||
                selectedFilters.dateRange !== "all") && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-accent hover:underline"
                >
                  Clear all
                </button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Filter */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-3">
                  Invoice Status
                </label>
                <div className="space-y-2">
                  {statuses.map((status) => (
                    <label
                      key={status}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFilters.invoiceStatuses.includes(
                          status
                        )}
                        onChange={() => toggleStatusFilter(status)}
                        className="rounded border-border"
                      />
                      <span className="text-sm capitalize text-foreground">
                        {status}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amount Range */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-3">
                  Amount Range
                </label>
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={selectedFilters.minAmount}
                    onChange={(e) =>
                      setSelectedFilters((prev) => ({
                        ...prev,
                        minAmount: e.target.value,
                      }))
                    }
                    className="text-sm"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={selectedFilters.maxAmount}
                    onChange={(e) =>
                      setSelectedFilters((prev) => ({
                        ...prev,
                        maxAmount: e.target.value,
                      }))
                    }
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-3">
                  Date Range
                </label>
                <select
                  value={selectedFilters.dateRange}
                  onChange={(e) =>
                    setSelectedFilters((prev) => ({
                      ...prev,
                      dateRange: e.target.value as any,
                    }))
                  }
                  className="w-full px-3 py-2 bg-card text-foreground border border-border rounded-md text-sm"
                >
                  <option value="all">All time</option>
                  <option value="week">Last 7 days</option>
                  <option value="month">Last 30 days</option>
                  <option value="quarter">Last 90 days</option>
                  <option value="year">Last year</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="md:col-span-3">
          {query === "" ? (
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-muted-foreground">
                  Start typing to search
                </p>
              </CardContent>
            </Card>
          ) : isSearching ? (
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-muted-foreground">
                  Searching...
                </p>
              </CardContent>
            </Card>
          ) : results.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-muted-foreground">
                  No results found for "{query}"
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground px-1">
                {results.length} result{results.length !== 1 ? "s" : ""} found
              </p>
              {results.map((result) => (
                <Link key={`${result.type}-${result.id}`} to={result.link}>
                  <Card className="hover:border-accent/50 hover:bg-muted/30 transition-colors cursor-pointer">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getTypeColor(
                                result.type
                              )}`}
                            >
                              {result.type}
                            </span>
                          </div>
                          <h3 className="font-medium text-foreground">
                            {result.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {result.subtitle}
                          </p>
                          {result.amount && (
                            <p className="text-sm font-medium text-accent mt-2">
                              ${result.amount.toLocaleString()}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {result.status && (
                            <span className="text-xs text-muted-foreground capitalize">
                              {result.status}
                            </span>
                          )}
                          {result.date && (
                            <span className="text-xs text-muted-foreground">
                              {result.date}
                            </span>
                          )}
                          <ArrowRight className="w-4 h-4 text-accent" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
