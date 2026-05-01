import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleSignUp, handleSignIn, handleSignOut } from "./routes/auth";
import { handleDashboard } from "./routes/dashboard";
import {
  handleSignUp,
  handleSignIn,
  handleSignOut,
  handleResetPassword,
  handleDeleteAccount,
} from "./routes/auth";
import {
  handleGetInvoices,
  handleGetInvoice,
  handleCreateInvoice,
  handleUpdateInvoice,
  handleMarkPaid,
  handleSendReminder,
} from "./routes/invoices";
import {
  handleGetClients,
  handleGetClient,
  handleCreateClient,
  handleUpdateClient,
  handleDeleteClient,
} from "./routes/clients";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth routes
  app.post("/api/auth/signup", handleSignUp);
  app.post("/api/auth/signin", handleSignIn);
  app.post("/api/auth/signout", handleSignOut);

  // Dashboard
  app.get("/api/dashboard", handleDashboard);

  // Invoice routes
  app.get("/api/invoices", handleGetInvoices);
  app.post("/api/invoices", handleCreateInvoice);
  app.get("/api/invoices/:id", handleGetInvoice);
  app.put("/api/invoices/:id", handleUpdateInvoice);
  app.post("/api/invoices/:id/mark-paid", handleMarkPaid);
  app.post("/api/invoices/:id/remind", handleSendReminder);

  // Client routes
  app.get("/api/clients", handleGetClients);
  app.post("/api/clients", handleCreateClient);
  app.get("/api/clients/:id", handleGetClient);
  app.put("/api/clients/:id", handleUpdateClient);
  app.delete("/api/clients/:id", handleDeleteClient);

  return app;
}
