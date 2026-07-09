import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { handleDemo } from "./routes/demo";
import createAuthRouter from "./routes/auth";
import { authenticateToken, authErrorHandler } from "./middleware/auth.middleware";
import { handleDashboard } from "./routes/dashboard";
import {
  handleGetInvoices,
  handleGetInvoice,
  handleCreateInvoice,
  handleUpdateInvoice,
  handleMarkPaid,
  handleSendReminder,
  handleDeleteInvoice,
} from "./routes/invoices";
import {
  handleGetClients,
  handleGetClient,
  handleCreateClient,
  handleUpdateClient,
  handleDeleteClient,
} from "./routes/clients";
import {
  handleGetTemplates,
  handleGetTemplate,
  handleCreateTemplate,
  handleUpdateTemplate,
  handleDeleteTemplate,
  handleDuplicateTemplate,
} from "./routes/templates";
import { handleGetActivity, handleLogActivity } from "./routes/activity";
import { handleSearch } from "./routes/search";
import {
  handleGetNotes,
  handleCreateNote,
  handleDeleteNote,
  handleGetCommunications,
  handleCreateCommunication,
} from "./routes/clientCommunications";
import { handleGetReports } from "./routes/reports";
import { handleExport } from "./routes/export";
import {
  handleGetBrandingSettings,
  handleSaveBrandingSettings,
} from "./routes/branding";
import {
  handleGetRecurringInvoices,
  handleGetRecurringInvoice,
  handleCreateRecurringInvoice,
  handleUpdateRecurringInvoice,
  handleDeleteRecurringInvoice,
} from "./routes/recurringInvoices";
import {
  handleGetIntegrations,
  handleSaveIntegrations,
  handleSendEmail,
  handleSendSMS,
  handleCreatePaymentIntent,
} from "./routes/integrations";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser()); // Enable cookie parsing for refresh tokens

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth routes (public and protected)
  app.use("/api/auth", createAuthRouter());

  // Apply authentication middleware to all protected routes
  app.use("/api/dashboard", authenticateToken);
  app.use("/api/invoices", authenticateToken);
  app.use("/api/clients", authenticateToken);
  app.use("/api/templates", authenticateToken);
  app.use("/api/activity", authenticateToken);
  app.use("/api/search", authenticateToken);
  app.use("/api/reports", authenticateToken);
  app.use("/api/export", authenticateToken);
  app.use("/api/settings", authenticateToken);
  app.use("/api/recurring-invoices", authenticateToken);
  app.use("/api/integrations", authenticateToken);

  // Dashboard
  app.get("/api/dashboard", handleDashboard);

  // Invoice routes
  app.get("/api/invoices", handleGetInvoices);
  app.post("/api/invoices", handleCreateInvoice);
  app.get("/api/invoices/:id", handleGetInvoice);
  app.put("/api/invoices/:id", handleUpdateInvoice);
  app.delete("/api/invoices/:id", handleDeleteInvoice);
  app.post("/api/invoices/:id/mark-paid", handleMarkPaid);
  app.post("/api/invoices/:id/remind", handleSendReminder);

  // Client routes
  app.get("/api/clients", handleGetClients);
  app.post("/api/clients", handleCreateClient);
  app.get("/api/clients/:id", handleGetClient);
  app.put("/api/clients/:id", handleUpdateClient);
  app.delete("/api/clients/:id", handleDeleteClient);

  // Template routes
  app.get("/api/templates", handleGetTemplates);
  app.post("/api/templates", handleCreateTemplate);
  app.get("/api/templates/:id", handleGetTemplate);
  app.put("/api/templates/:id", handleUpdateTemplate);
  app.delete("/api/templates/:id", handleDeleteTemplate);
  app.post("/api/templates/:id/duplicate", handleDuplicateTemplate);

  // Activity routes
  app.get("/api/activity", handleGetActivity);
  app.post("/api/activity", handleLogActivity);

  // Search route
  app.get("/api/search", handleSearch);

  // Client communications routes
  app.get("/api/clients/:clientId/notes", handleGetNotes);
  app.post("/api/clients/:clientId/notes", handleCreateNote);
  app.delete("/api/clients/:clientId/notes/:noteId", handleDeleteNote);
  app.get("/api/clients/:clientId/communications", handleGetCommunications);
  app.post("/api/clients/:clientId/communications", handleCreateCommunication);

  // Reports route
  app.get("/api/reports", handleGetReports);

  // Export route
  app.get("/api/export", handleExport);

  // Branding routes
  app.get("/api/settings/branding", handleGetBrandingSettings);
  app.post("/api/settings/branding", handleSaveBrandingSettings);

  // Recurring invoices routes
  app.get("/api/recurring-invoices", handleGetRecurringInvoices);
  app.post("/api/recurring-invoices", handleCreateRecurringInvoice);
  app.get("/api/recurring-invoices/:id", handleGetRecurringInvoice);
  app.put("/api/recurring-invoices/:id", handleUpdateRecurringInvoice);
  app.delete("/api/recurring-invoices/:id", handleDeleteRecurringInvoice);

  // Integrations routes
  app.get("/api/integrations", handleGetIntegrations);
  app.post("/api/integrations", handleSaveIntegrations);
  app.post("/api/integrations/send-email", handleSendEmail);
  app.post("/api/integrations/send-sms", handleSendSMS);
  app.post("/api/integrations/payment-intent", handleCreatePaymentIntent);

  return app;
}
