import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Mail, Bell, FileText, CheckCircle } from "lucide-react";

interface ActivityLog {
  id: string;
  type: "email" | "reminder" | "invoice" | "payment";
  title: string;
  description: string;
  clientName: string;
  invoiceNumber?: string;
  status: "sent" | "pending" | "failed" | "completed";
  timestamp: string;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "email":
      return <Mail className="w-4 h-4 text-blue-500" />;
    case "reminder":
      return <Bell className="w-4 h-4 text-orange-500" />;
    case "invoice":
      return <FileText className="w-4 h-4 text-purple-500" />;
    case "payment":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    default:
      return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "sent":
    case "completed":
      return "text-green-500";
    case "pending":
      return "text-yellow-500";
    case "failed":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

export default function Activity() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const response = await fetch("/api/activity");
      if (!response.ok) throw new Error("Failed to load activities");
      const data = await response.json();
      setActivities(data.activities || []);
    } catch (error) {
      console.error("Error loading activities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredActivities = activities.filter(
    (activity) =>
      activity.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.invoiceNumber?.includes(searchQuery)
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Activity Log</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track all invoices, emails, reminders, and payments
        </p>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by client, invoice number, or activity..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      ) : filteredActivities.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">
              {searchQuery ? "No activities match your search" : "No activities yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredActivities.map((activity) => (
            <Card key={activity.id}>
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-foreground">
                          {activity.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                      </div>
                      <div className="text-right whitespace-nowrap">
                        <p className={`text-sm font-medium ${getStatusColor(activity.status)}`}>
                          {activity.status.charAt(0).toUpperCase() +
                            activity.status.slice(1)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                      <span>Client: {activity.clientName}</span>
                      {activity.invoiceNumber && (
                        <span>Invoice: {activity.invoiceNumber}</span>
                      )}
                      <span>{formatTime(activity.timestamp)}</span>
                    </div>
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
