import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import InvoiceForm from "./pages/InvoiceForm";
import InvoiceDetail from "./pages/InvoiceDetail";
import Clients from "./pages/Clients";
import ClientForm from "./pages/ClientForm";
import ClientDetail from "./pages/ClientDetail";
import Settings from "./pages/Settings";
import PaymentPortal from "./pages/PaymentPortal";
import RemindersSettings from "./pages/RemindersSettings";
import Templates from "./pages/Templates";
import TemplateForm from "./pages/TemplateForm";
import Activity from "./pages/Activity";
import Search from "./pages/Search";
import ClientCommunication from "./pages/ClientCommunication";
import Reports from "./pages/Reports";
import DataExport from "./pages/DataExport";
import InvoiceBranding from "./pages/InvoiceBranding";
import RecurringInvoices from "./pages/RecurringInvoices";
import RecurringInvoiceForm from "./pages/RecurringInvoiceForm";
import Integrations from "./pages/Integrations";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/MainLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/pay/:token" element={<PaymentPortal />} />

          {/* Protected Routes with Sidebar */}
          <Route
            path="/dashboard"
            element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            }
          />
          <Route
            path="/invoices"
            element={
              <MainLayout>
                <Invoices />
              </MainLayout>
            }
          />
          <Route
            path="/invoices/new"
            element={
              <MainLayout>
                <InvoiceForm />
              </MainLayout>
            }
          />
          <Route
            path="/invoices/:id"
            element={
              <MainLayout>
                <InvoiceDetail />
              </MainLayout>
            }
          />
          <Route
            path="/invoices/:id/edit"
            element={
              <MainLayout>
                <InvoiceForm />
              </MainLayout>
            }
          />
          <Route
            path="/clients"
            element={
              <MainLayout>
                <Clients />
              </MainLayout>
            }
          />
          <Route
            path="/clients/new"
            element={
              <MainLayout>
                <ClientForm />
              </MainLayout>
            }
          />
          <Route
            path="/clients/:id"
            element={
              <MainLayout>
                <ClientDetail />
              </MainLayout>
            }
          />
          <Route
            path="/clients/:id/edit"
            element={
              <MainLayout>
                <ClientForm />
              </MainLayout>
            }
          />
          <Route
            path="/clients/:id/communications"
            element={
              <MainLayout>
                <ClientCommunication />
              </MainLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <MainLayout>
                <Settings />
              </MainLayout>
            }
          />
          <Route
            path="/settings/reminders"
            element={
              <MainLayout>
                <RemindersSettings />
              </MainLayout>
            }
          />
          <Route
            path="/templates"
            element={
              <MainLayout>
                <Templates />
              </MainLayout>
            }
          />
          <Route
            path="/templates/new"
            element={
              <MainLayout>
                <TemplateForm />
              </MainLayout>
            }
          />
          <Route
            path="/templates/:id"
            element={
              <MainLayout>
                <TemplateForm />
              </MainLayout>
            }
          />
          <Route
            path="/activity"
            element={
              <MainLayout>
                <Activity />
              </MainLayout>
            }
          />
          <Route
            path="/search"
            element={
              <MainLayout>
                <Search />
              </MainLayout>
            }
          />
          <Route
            path="/reports"
            element={
              <MainLayout>
                <Reports />
              </MainLayout>
            }
          />
          <Route
            path="/settings/export"
            element={
              <MainLayout>
                <DataExport />
              </MainLayout>
            }
          />
          <Route
            path="/settings/branding"
            element={
              <MainLayout>
                <InvoiceBranding />
              </MainLayout>
            }
          />
          <Route
            path="/recurring-invoices"
            element={
              <MainLayout>
                <RecurringInvoices />
              </MainLayout>
            }
          />
          <Route
            path="/recurring-invoices/new"
            element={
              <MainLayout>
                <RecurringInvoiceForm />
              </MainLayout>
            }
          />
          <Route
            path="/recurring-invoices/:id"
            element={
              <MainLayout>
                <RecurringInvoiceForm />
              </MainLayout>
            }
          />
          <Route
            path="/settings/integrations"
            element={
              <MainLayout>
                <Integrations />
              </MainLayout>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
