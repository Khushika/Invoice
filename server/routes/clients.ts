import { RequestHandler } from "express";

// Mock client storage (in production, use a real database)
const clients: Record<string, any> = {
  "client-1": {
    id: "client-1",
    name: "Acme Corp",
    email: "contact@acme.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Corporation",
    currency: "USD",
    createdAt: new Date(),
  },
  "client-2": {
    id: "client-2",
    name: "TechStart Inc",
    email: "billing@techstart.com",
    phone: "+1 (555) 987-6543",
    company: "TechStart Innovations",
    currency: "USD",
    createdAt: new Date(),
  },
};

export const handleGetClients: RequestHandler = (req, res) => {
  try {
    // In production: filter by authenticated user
    const clientList = Object.values(clients);
    res.json({ clients: clientList });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch clients",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleGetClient: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const client = clients[id];

    if (!client) {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    // In production: verify user owns this client
    res.json({ client });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch client",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleCreateClient: RequestHandler = (req, res) => {
  try {
    const { name, email, phone, company, currency } = req.body;

    if (!name || !email) {
      res.status(400).json({ error: "Name and email are required" });
      return;
    }

    const id = Date.now().toString();
    const newClient = {
      id,
      name,
      email,
      phone: phone || null,
      company: company || null,
      currency: currency || "USD",
      createdAt: new Date(),
    };

    clients[id] = newClient;
    res.status(201).json({ success: true, client: newClient });
  } catch (error) {
    res.status(500).json({
      error: "Failed to create client",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleUpdateClient: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const client = clients[id];

    if (!client) {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    // In production: verify user owns this client
    const updatedClient = { ...client, ...req.body };
    clients[id] = updatedClient;

    res.json({ success: true, client: updatedClient });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update client",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleDeleteClient: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const client = clients[id];

    if (!client) {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    // In production: soft delete with deletedAt field
    delete clients[id];

    res.json({ success: true, message: "Client deleted" });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete client",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
