import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogOut, Trash2, Bell, CreditCard } from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "profile" | "notifications" | "billing"
  >("profile");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure? This will permanently delete your account and all data. This action cannot be undone."
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/delete-account", {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to delete account");
      navigate("/");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="font-sora text-3xl font-bold mb-8">Settings</h1>
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border/40 pb-4">
          {[
            { id: "profile", label: "Profile", icon: "👤" },
            { id: "notifications", label: "Notifications", icon: "🔔" },
            { id: "billing", label: "Billing", icon: "💳" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-accent border-b-2 border-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <Card className="bg-card border-border/40">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Manage your account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="bg-input border-border text-foreground"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Your primary account email
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Business Name
                  </label>
                  <Input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Your Business"
                    className="bg-input border-border text-foreground"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Displayed on your invoices
                  </p>
                </div>

                <Button
                  onClick={() => alert('Profile updated successfully!')}
                  className="bg-accent hover:bg-accent/90 text-primary-foreground"
                >
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/40">
              <CardHeader>
                <CardTitle>Password</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => alert('Password change functionality coming soon!')}
                  variant="outline"
                  className="border-border text-foreground hover:bg-card"
                >
                  Change Password
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-red-500/20 border-red-500/50">
              <CardHeader>
                <CardTitle className="text-red-400">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Delete Account</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Permanently delete your account and all associated data. This
                    action cannot be undone.
                  </p>
                  <Button
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10 gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    {isLoading ? "Deleting..." : "Delete Account"}
                  </Button>
                </div>

                <div className="pt-4 border-t border-border/40">
                  <h3 className="font-medium mb-2">Sign Out</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sign out of your account on this device
                  </p>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    className="border-border text-foreground hover:bg-card gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <Card className="bg-card border-border/40">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Control how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/30 border border-border/40 rounded">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-accent" />
                  <div>
                    <p className="font-medium">Email Reminders</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified before invoices are due
                    </p>
                  </div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 border border-border/40 rounded">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-accent" />
                  <div>
                    <p className="font-medium">Payment Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when payments are received
                    </p>
                  </div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 border border-border/40 rounded">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-accent" />
                  <div>
                    <p className="font-medium">Overdue Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Get alerted about overdue invoices
                    </p>
                  </div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>

              <Button
                onClick={() => alert('Notification preferences saved!')}
                className="bg-accent hover:bg-accent/90 text-primary-foreground w-full"
              >
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Billing Tab */}
        {activeTab === "billing" && (
          <div className="space-y-6">
            <Card className="bg-card border-border/40">
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>
                  Manage your billing and subscription
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 bg-muted/30 border border-border/40 rounded">
                  <p className="text-sm text-muted-foreground mb-2">
                    Current Plan
                  </p>
                  <p className="font-sora text-2xl font-bold text-accent mb-4">
                    Free
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    5 invoices/month • 3 clients • Email reminders
                  </p>
                  <Button
                    onClick={() => alert('Stripe integration coming soon! You will be redirected to Stripe checkout.')}
                    className="bg-accent hover:bg-accent/90 text-primary-foreground gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    Upgrade to Pro
                  </Button>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Billing History</h3>
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No billing history yet</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
