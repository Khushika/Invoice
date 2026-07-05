import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, DollarSign, AlertCircle, CheckCircle } from "lucide-react";

interface ReportData {
  totalRevenue: number;
  averageInvoiceAmount: number;
  totalInvoices: number;
  paidInvoices: number;
  unpaidInvoices: number;
  overallPaymentRate: number;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  invoicesByStatus: Array<{ status: string; count: number }>;
  topClients: Array<{ name: string; totalAmount: number; invoiceCount: number }>;
}

const COLORS = {
  paid: "#4ade80",
  overdue: "#ef4444",
  sent: "#fbbf24",
  draft: "#9ca3af",
};

export default function Reports() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<"month" | "quarter" | "year">("month");

  useEffect(() => {
    loadReports();
  }, [dateRange]);

  const loadReports = async () => {
    try {
      const response = await fetch(`/api/reports?range=${dateRange}`);
      if (!response.ok) throw new Error("Failed to load reports");
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error("Error loading reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">Loading reports...</p>
        </CardContent>
      </Card>
    );
  }

  if (!reportData) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">
            No data available for the selected period
          </p>
        </CardContent>
      </Card>
    );
  }

  const pieChartData = reportData.invoicesByStatus.map((item) => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    value: item.count,
  }));

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Track your business performance and trends
          </p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as any)}
          className="px-3 sm:px-4 py-2 bg-card text-foreground text-sm border border-border rounded-lg"
        >
          <option value="month">Last 30 Days</option>
          <option value="quarter">Last 90 Days</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Total Revenue
                </p>
                <p className="text-lg sm:text-2xl font-bold text-foreground">
                  ${reportData.totalRevenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 sm:w-10 h-8 sm:h-10 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Avg Invoice Amount
                </p>
                <p className="text-2xl font-bold text-foreground">
                  ${reportData.averageInvoiceAmount.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Payment Rate
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {reportData.overallPaymentRate}%
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Unpaid Invoices
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {reportData.unpaidInvoices}
                </p>
              </div>
              <AlertCircle className="w-10 h-10 text-orange-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>
                Monthly revenue over the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={reportData.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#ff6b6b"
                    strokeWidth={2}
                    dot={{ fill: "#ff6b6b", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Invoice Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Status</CardTitle>
            <CardDescription>Distribution of invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        Object.values(COLORS)[
                          index % Object.values(COLORS).length
                        ]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Clients */}
      <Card>
        <CardHeader>
          <CardTitle>Top Clients</CardTitle>
          <CardDescription>Clients by total invoice amount</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.topClients.map((client, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between pb-4 border-b border-border/40 last:border-0"
              >
                <div>
                  <p className="font-medium text-foreground">{client.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {client.invoiceCount} invoice
                    {client.invoiceCount !== 1 ? "s" : ""}
                  </p>
                </div>
                <p className="font-semibold text-accent">
                  ${client.totalAmount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Total Invoices</p>
              <p className="text-3xl font-bold text-foreground">
                {reportData.totalInvoices}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Paid Invoices</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-green-500">
                  {reportData.paidInvoices}
                </p>
                <p className="text-sm text-muted-foreground">
                  {reportData.totalInvoices > 0
                    ? Math.round(
                        (reportData.paidInvoices / reportData.totalInvoices) *
                          100
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Outstanding Amount
              </p>
              <p className="text-3xl font-bold text-orange-500">
                ${(reportData.totalRevenue * 0.2).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
