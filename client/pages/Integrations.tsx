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
import { Mail, MessageSquare, CreditCard, CheckCircle, AlertCircle } from "lucide-react";

interface IntegrationStatus {
  resend: { enabled: boolean; apiKey: string };
  twilio: { enabled: boolean; accountSid: string; authToken: string; phoneNumber: string };
  stripe: { enabled: boolean; publishableKey: string; secretKey: string };
}

export default function Integrations() {
  const [integrations, setIntegrations] = useState<IntegrationStatus>({
    resend: { enabled: false, apiKey: "" },
    twilio: { enabled: false, accountSid: "", authToken: "", phoneNumber: "" },
    stripe: { enabled: false, publishableKey: "", secretKey: "" },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      const response = await fetch("/api/integrations");
      if (response.ok) {
        const data = await response.json();
        setIntegrations(data.integrations);
      }
    } catch (error) {
      console.error("Error loading integrations:", error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(integrations),
      });

      if (!response.ok) throw new Error("Failed to save");
      setLastSaved(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error saving integrations:", error);
      alert("Failed to save integrations");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleIntegration = (service: keyof IntegrationStatus) => {
    setIntegrations((prev) => ({
      ...prev,
      [service]: { ...prev[service], enabled: !prev[service].enabled },
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Integrations</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Connect services to power email, SMS, and payment features
        </p>
      </div>

      {/* Resend (Email) */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-blue-500" />
              <div>
                <CardTitle className="text-lg">Email Integration</CardTitle>
                <CardDescription>Send invoices and reminders via email</CardDescription>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={integrations.resend.enabled}
                onChange={() => toggleIntegration("resend")}
                className="w-5 h-5"
              />
              <span className="text-sm text-muted-foreground">Enabled</span>
            </label>
          </div>
        </CardHeader>
        {integrations.resend.enabled && (
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Resend API Key
              </label>
              <Input
                type="password"
                value={integrations.resend.apiKey}
                onChange={(e) =>
                  setIntegrations((prev) => ({
                    ...prev,
                    resend: { ...prev.resend, apiKey: e.target.value },
                  }))
                }
                placeholder="re_xxxxxxxxxxxxxxxxxxxx"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Get your API key from <a href="https://resend.com" className="text-accent hover:underline">resend.com</a>
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Twilio (SMS) */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-green-500" />
              <div>
                <CardTitle className="text-lg">SMS Integration</CardTitle>
                <CardDescription>Send payment reminders via SMS</CardDescription>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={integrations.twilio.enabled}
                onChange={() => toggleIntegration("twilio")}
                className="w-5 h-5"
              />
              <span className="text-sm text-muted-foreground">Enabled</span>
            </label>
          </div>
        </CardHeader>
        {integrations.twilio.enabled && (
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Account SID
              </label>
              <Input
                type="password"
                value={integrations.twilio.accountSid}
                onChange={(e) =>
                  setIntegrations((prev) => ({
                    ...prev,
                    twilio: { ...prev.twilio, accountSid: e.target.value },
                  }))
                }
                placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxx"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Auth Token
              </label>
              <Input
                type="password"
                value={integrations.twilio.authToken}
                onChange={(e) =>
                  setIntegrations((prev) => ({
                    ...prev,
                    twilio: { ...prev.twilio, authToken: e.target.value },
                  }))
                }
                placeholder="Your auth token"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                From Phone Number
              </label>
              <Input
                value={integrations.twilio.phoneNumber}
                onChange={(e) =>
                  setIntegrations((prev) => ({
                    ...prev,
                    twilio: { ...prev.twilio, phoneNumber: e.target.value },
                  }))
                }
                placeholder="+1234567890"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Get credentials from <a href="https://twilio.com" className="text-accent hover:underline">twilio.com</a>
            </p>
          </CardContent>
        )}
      </Card>

      {/* Stripe (Payments) */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-purple-500" />
              <div>
                <CardTitle className="text-lg">Payment Processing</CardTitle>
                <CardDescription>Accept payments via Stripe</CardDescription>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={integrations.stripe.enabled}
                onChange={() => toggleIntegration("stripe")}
                className="w-5 h-5"
              />
              <span className="text-sm text-muted-foreground">Enabled</span>
            </label>
          </div>
        </CardHeader>
        {integrations.stripe.enabled && (
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Publishable Key
              </label>
              <Input
                type="password"
                value={integrations.stripe.publishableKey}
                onChange={(e) =>
                  setIntegrations((prev) => ({
                    ...prev,
                    stripe: { ...prev.stripe, publishableKey: e.target.value },
                  }))
                }
                placeholder="pk_live_xxxxxxxxxxxxxxxxxxxx"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Secret Key
              </label>
              <Input
                type="password"
                value={integrations.stripe.secretKey}
                onChange={(e) =>
                  setIntegrations((prev) => ({
                    ...prev,
                    stripe: { ...prev.stripe, secretKey: e.target.value },
                  }))
                }
                placeholder="sk_live_xxxxxxxxxxxxxxxxxxxx"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Never share your secret key. Get keys from <a href="https://stripe.com" className="text-accent hover:underline">stripe.com</a>
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Save and Status */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-accent hover:bg-accent/90 text-background gap-2"
        >
          {isSaving ? "Saving..." : "Save Integrations"}
        </Button>
        {lastSaved && (
          <div className="flex items-center gap-2 text-sm text-green-500">
            <CheckCircle className="w-4 h-4" />
            Saved: {lastSaved}
          </div>
        )}
      </div>

      {/* Info */}
      <Card className="bg-blue-500/10 border-blue-500/30">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground mb-2">How integrations work</p>
              <ul className="text-muted-foreground space-y-1 text-xs">
                <li>✓ <strong>Email</strong>: Send invoices and reminders automatically</li>
                <li>✓ <strong>SMS</strong>: Send payment reminders via text message</li>
                <li>✓ <strong>Payments</strong>: Accept credit card payments directly in payment portal</li>
                <li>✓ Keys are stored securely and never shared</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
