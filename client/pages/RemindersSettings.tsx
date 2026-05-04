import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Bell, Clock } from "lucide-react";

interface ReminderConfig {
  id: string;
  daysBeforeDue: number;
  channel: "email" | "sms";
  tone: "professional" | "friendly" | "firm" | "final";
  label: string;
}

export default function RemindersSettings() {
  const [reminders, setReminders] = useState<ReminderConfig[]>([
    {
      id: "1",
      daysBeforeDue: 3,
      channel: "email",
      tone: "professional",
      label: "First reminder",
    },
    {
      id: "2",
      daysBeforeDue: 0,
      channel: "email",
      tone: "friendly",
      label: "Due date reminder",
    },
    {
      id: "3",
      daysBeforeDue: -7,
      channel: "email",
      tone: "firm",
      label: "Overdue reminder",
    },
  ]);

  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateReminder = (
    id: string,
    field: keyof ReminderConfig,
    value: any
  ) => {
    setReminders(
      reminders.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleAddReminder = () => {
    setReminders([
      ...reminders,
      {
        id: Date.now().toString(),
        daysBeforeDue: -14,
        channel: "email",
        tone: "final",
        label: "Final notice",
      },
    ]);
  };

  const handleDeleteReminder = (id: string) => {
    if (reminders.length > 1) {
      setReminders(reminders.filter((r) => r.id !== id));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Reminder settings saved successfully!");
    } finally {
      setIsSaving(false);
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case "email":
        return "bg-blue-500/20 text-blue-400";
      case "sms":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getToneColor = (tone: string) => {
    switch (tone) {
      case "professional":
        return "bg-blue-500/20 text-blue-400";
      case "friendly":
        return "bg-green-500/20 text-green-400";
      case "firm":
        return "bg-amber-500/20 text-amber-400";
      case "final":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const formatDaysLabel = (days: number) => {
    if (days === 0) return "On due date";
    if (days > 0) return `${days} day${days !== 1 ? "s" : ""} before due date`;
    return `${Math.abs(days)} day${Math.abs(days) !== 1 ? "s" : ""} after due date`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <Link
          to="/settings"
          className="flex items-center gap-2 text-accent hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Settings
        </Link>

        <h1 className="font-sora text-3xl font-bold mb-2">Reminder Settings</h1>
        <p className="text-muted-foreground mb-8">
          Configure automatic payment reminders for your invoices
        </p>

        {/* Info Card */}
        <Card className="bg-card border-border/40 mb-6">
          <CardContent className="pt-6 flex items-start gap-3">
            <Bell className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">How it works</p>
              <p className="text-xs text-muted-foreground mt-1">
                These reminders will be automatically sent to your clients based on
                their invoice due dates. You can customize the timing, channel
                (email/SMS), and tone for each reminder.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Reminders List */}
        <div className="space-y-4 mb-8">
          {reminders.map((reminder, index) => (
            <Card key={reminder.id} className="bg-card border-border/40">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Label */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Reminder Label
                    </label>
                    <input
                      type="text"
                      value={reminder.label}
                      onChange={(e) =>
                        handleUpdateReminder(reminder.id, "label", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-input border border-border rounded text-foreground text-sm"
                    />
                  </div>

                  {/* Timing */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        When to send
                      </label>
                      <select
                        value={reminder.daysBeforeDue}
                        onChange={(e) =>
                          handleUpdateReminder(
                            reminder.id,
                            "daysBeforeDue",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 bg-input border border-border rounded text-foreground text-sm"
                      >
                        <option value="7">7 days before</option>
                        <option value="5">5 days before</option>
                        <option value="3">3 days before</option>
                        <option value="1">1 day before</option>
                        <option value="0">On due date</option>
                        <option value="-3">3 days after</option>
                        <option value="-7">7 days after</option>
                        <option value="-14">14 days after</option>
                      </select>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDaysLabel(reminder.daysBeforeDue)}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Channel
                      </label>
                      <select
                        value={reminder.channel}
                        onChange={(e) =>
                          handleUpdateReminder(
                            reminder.id,
                            "channel",
                            e.target.value as "email" | "sms"
                          )
                        }
                        className="w-full px-3 py-2 bg-input border border-border rounded text-foreground text-sm"
                      >
                        <option value="email">Email</option>
                        <option value="sms">SMS (Premium)</option>
                      </select>
                    </div>
                  </div>

                  {/* Tone */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Tone</label>
                    <select
                      value={reminder.tone}
                      onChange={(e) =>
                        handleUpdateReminder(
                          reminder.id,
                          "tone",
                          e.target.value as
                            | "professional"
                            | "friendly"
                            | "firm"
                            | "final"
                        )
                      }
                      className="w-full px-3 py-2 bg-input border border-border rounded text-foreground text-sm"
                    >
                      <option value="professional">
                        Professional ("Friendly reminder...")
                      </option>
                      <option value="friendly">
                        Friendly ("Hope you received...")
                      </option>
                      <option value="firm">
                        Firm ("Payment now overdue...")
                      </option>
                      <option value="final">
                        Final Notice ("Immediate payment required...")
                      </option>
                    </select>
                  </div>

                  {/* Preview */}
                  <div className="bg-muted/30 border border-border/40 rounded p-3">
                    <p className="text-xs text-muted-foreground mb-1">Preview:</p>
                    <p className="text-sm">
                      {reminder.tone === "professional" &&
                        "Friendly reminder: Invoice #INV-001 is due on May 10, 2024. Please arrange payment."}
                      {reminder.tone === "friendly" &&
                        "Hope you're doing well! Just a friendly follow-up on Invoice #INV-001 due May 10."}
                      {reminder.tone === "firm" &&
                        "Action required: Invoice #INV-001 is now overdue. Please arrange payment immediately."}
                      {reminder.tone === "final" &&
                        "Final Notice: Invoice #INV-001 requires immediate payment. Contact us urgently."}
                    </p>
                  </div>

                  {/* Delete Button */}
                  {reminders.length > 1 && (
                    <button
                      onClick={() => handleDeleteReminder(reminder.id)}
                      className="text-sm text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove this reminder
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Button */}
        <Button
          onClick={handleAddReminder}
          variant="outline"
          className="w-full border-border text-foreground hover:bg-card mb-8 gap-2"
        >
          <Clock className="w-4 h-4" />
          Add Another Reminder
        </Button>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-accent hover:bg-accent/90 text-primary-foreground py-6 text-base font-semibold"
        >
          {isSaving ? "Saving..." : "Save Reminder Settings"}
        </Button>

        {/* Tips */}
        <div className="mt-8 p-4 bg-card border border-border/40 rounded">
          <p className="font-medium text-sm mb-2">💡 Tips:</p>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>• Start with reminders 3-7 days before the due date</li>
            <li>• Add a reminder on the due date for best results</li>
            <li>• Use firm/final tone for overdue reminders</li>
            <li>• SMS requires a Premium plan</li>
            <li>• Clients will see these emails as coming from you</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
