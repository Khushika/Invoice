import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Download,
  FileJson,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface ExportOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  format: "json" | "csv" | "pdf";
  dataTypes: string[];
}

export default function DataExport() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([
    "invoices",
    "clients",
  ]);
  const [lastExportTime, setLastExportTime] = useState<string | null>(null);

  const exportOptions: ExportOption[] = [
    {
      id: "json",
      label: "JSON Export",
      description: "Complete data export in JSON format. Best for backups.",
      icon: <FileJson className="w-6 h-6 text-blue-500" />,
      format: "json",
      dataTypes: ["invoices", "clients", "templates", "settings"],
    },
    {
      id: "csv",
      label: "CSV Export",
      description: "Spreadsheet-compatible format. Easy to import elsewhere.",
      icon: <FileText className="w-6 h-6 text-green-500" />,
      format: "csv",
      dataTypes: ["invoices", "clients"],
    },
  ];

  const dataTypeOptions = [
    { id: "invoices", label: "Invoices", description: "All invoice records" },
    { id: "clients", label: "Clients", description: "Client contact information" },
    {
      id: "templates",
      label: "Templates",
      description: "Invoice templates",
    },
    {
      id: "activity",
      label: "Activity Log",
      description: "Email and reminder history",
    },
    {
      id: "settings",
      label: "Settings",
      description: "Your account preferences",
    },
  ];

  const toggleDataType = (id: string) => {
    setSelectedDataTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleExport = async (format: "json" | "csv" | "pdf") => {
    if (selectedDataTypes.length === 0) {
      alert("Please select at least one data type to export");
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        format,
        types: selectedDataTypes.join(","),
      });

      const response = await fetch(`/api/export?${params}`);
      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoicehound-backup-${new Date().toISOString().split("T")[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setLastExportTime(new Date().toLocaleString());
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Data Export & Backup</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Download and backup all your InvoiceHound data
        </p>
      </div>

      {/* Info Banner */}
      <Card className="bg-blue-500/10 border-blue-500/30">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Regular backups recommended</p>
              <p className="text-sm text-muted-foreground mt-1">
                We recommend exporting your data at least monthly to ensure you have a
                backup of all your invoices and client information.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last Export Info */}
      {lastExportTime && (
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Last export completed</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {lastExportTime}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Data Selection */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Select Data Types</CardTitle>
            <CardDescription>
              Choose what to include in your export
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {dataTypeOptions.map((option) => (
              <label
                key={option.id}
                className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedDataTypes.includes(option.id)}
                  onChange={() => toggleDataType(option.id)}
                  className="mt-1 rounded border-border cursor-pointer"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {option.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </label>
            ))}
            <div className="pt-4 border-t border-border/40">
              <p className="text-xs text-muted-foreground">
                {selectedDataTypes.length} of {dataTypeOptions.length} selected
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <div className="lg:col-span-2 space-y-4">
          {exportOptions.map((option) => (
            <Card key={option.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    {option.icon}
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {option.label}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {option.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {option.dataTypes.map((type) => (
                          <span
                            key={type}
                            className={`text-xs px-2 py-1 rounded ${
                              selectedDataTypes.includes(type)
                                ? "bg-accent/20 text-accent"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleExport(option.format)}
                    disabled={isLoading}
                    className="bg-accent hover:bg-accent/90 text-background gap-2 whitespace-nowrap"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What's Included</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-3">Invoices</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>✓ Invoice details and amounts</li>
                <li>✓ Line items and totals</li>
                <li>✓ Payment status and dates</li>
                <li>✓ Client information</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-3">Clients</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>✓ Contact information</li>
                <li>✓ Company details</li>
                <li>✓ Email and phone</li>
                <li>✓ Payment history summary</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-3">Templates</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>✓ Template configurations</li>
                <li>✓ Line item templates</li>
                <li>✓ Default settings</li>
                <li>✓ Creation dates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-3">Activity Log</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>✓ Email sending history</li>
                <li>✓ Reminder logs</li>
                <li>✓ Payment records</li>
                <li>✓ User actions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Note */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Data Security</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Exported data is encrypted during transfer and downloaded directly to your
            device. We do not store export files on our servers. Your data remains secure
            and is only visible to you.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
