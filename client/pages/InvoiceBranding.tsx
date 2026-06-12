import { useState, useEffect } from "react";
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
import { Palette, Save, Eye } from "lucide-react";

interface BrandingSettings {
  companyName: string;
  companyLogo: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  companyWebsite: string;
  invoicePrefix: string;
  primaryColor: string;
  secondaryColor: string;
  invoiceNotes: string;
  bankDetails: string;
  taxId: string;
}

export default function InvoiceBranding() {
  const [settings, setSettings] = useState<BrandingSettings>({
    companyName: "Your Business Name",
    companyLogo: "",
    companyEmail: "contact@yourbusiness.com",
    companyPhone: "+1 (555) 000-0000",
    companyAddress: "123 Main St, City, State 12345",
    companyWebsite: "www.yourbusiness.com",
    invoicePrefix: "INV",
    primaryColor: "#ff6b6b",
    secondaryColor: "#224d35",
    invoiceNotes: "Thank you for your business!",
    bankDetails: "",
    taxId: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  useEffect(() => {
    loadBrandingSettings();
  }, []);

  const loadBrandingSettings = async () => {
    try {
      const response = await fetch("/api/settings/branding");
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error("Error loading branding settings:", error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/settings/branding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error("Failed to save settings");
      setLastSaved(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error saving branding settings:", error);
      alert("Failed to save branding settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof BrandingSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Invoice Branding</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customize how your invoices look and feel
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Company Name *
                </label>
                <Input
                  value={settings.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  placeholder="Your Business Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={settings.companyEmail}
                  onChange={(e) => handleChange("companyEmail", e.target.value)}
                  placeholder="contact@yourbusiness.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone
                </label>
                <Input
                  value={settings.companyPhone}
                  onChange={(e) => handleChange("companyPhone", e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Address
                </label>
                <Textarea
                  value={settings.companyAddress}
                  onChange={(e) => handleChange("companyAddress", e.target.value)}
                  placeholder="Street address, city, state, zip"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Website
                </label>
                <Input
                  value={settings.companyWebsite}
                  onChange={(e) => handleChange("companyWebsite", e.target.value)}
                  placeholder="www.yourbusiness.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Invoice Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Invoice Number Prefix
                </label>
                <Input
                  value={settings.invoicePrefix}
                  onChange={(e) => handleChange("invoicePrefix", e.target.value)}
                  placeholder="INV"
                  maxLength={10}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Example: {settings.invoicePrefix}-001, {settings.invoicePrefix}-002
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Default Invoice Notes
                </label>
                <Textarea
                  value={settings.invoiceNotes}
                  onChange={(e) => handleChange("invoiceNotes", e.target.value)}
                  placeholder="Thank you for your business!"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Bank Details
                </label>
                <Textarea
                  value={settings.bankDetails}
                  onChange={(e) => handleChange("bankDetails", e.target.value)}
                  placeholder="Bank name, account number, routing number (optional)"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tax ID / VAT Number
                </label>
                <Input
                  value={settings.taxId}
                  onChange={(e) => handleChange("taxId", e.target.value)}
                  placeholder="e.g., 12-3456789"
                />
              </div>
            </CardContent>
          </Card>

          {/* Colors */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Colors</CardTitle>
              <CardDescription>
                Choose colors for your invoice headers and accents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Primary Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) =>
                        handleChange("primaryColor", e.target.value)
                      }
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) =>
                        handleChange("primaryColor", e.target.value)
                      }
                      placeholder="#ff6b6b"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Secondary Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) =>
                        handleChange("secondaryColor", e.target.value)
                      }
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={settings.secondaryColor}
                      onChange={(e) =>
                        handleChange("secondaryColor", e.target.value)
                      }
                      placeholder="#224d35"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save */}
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-accent hover:bg-accent/90 text-background gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Branding"}
            </Button>
            {lastSaved && (
              <p className="text-xs text-muted-foreground flex items-center">
                Last saved: {lastSaved}
              </p>
            )}
          </div>
        </div>

        {/* Preview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Eye className="w-4 h-4" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="p-6 rounded-lg border-2"
                style={{ borderColor: settings.primaryColor }}
              >
                {/* Invoice Header */}
                <div
                  className="p-4 rounded text-white mb-4"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  <p className="text-sm font-medium">INVOICE</p>
                  <p className="text-2xl font-bold mt-1">
                    {settings.invoicePrefix}-001
                  </p>
                </div>

                {/* Company Info */}
                <div className="space-y-2 mb-4 text-xs">
                  <p className="font-bold text-foreground">
                    {settings.companyName}
                  </p>
                  <p className="text-muted-foreground">
                    {settings.companyEmail}
                  </p>
                  <p className="text-muted-foreground">
                    {settings.companyPhone}
                  </p>
                </div>

                {/* Colors Preview */}
                <div className="space-y-2 mt-6">
                  <p className="text-xs font-medium text-muted-foreground">
                    COLOR SCHEME
                  </p>
                  <div className="flex gap-2">
                    <div
                      className="w-full h-8 rounded"
                      style={{ backgroundColor: settings.primaryColor }}
                      title="Primary"
                    />
                    <div
                      className="w-full h-8 rounded"
                      style={{ backgroundColor: settings.secondaryColor }}
                      title="Secondary"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
