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
