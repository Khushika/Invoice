import { RequestHandler } from "express";

// Mock storage for client notes
const clientNotes: Record<string, any[]> = {
  "client-1": [
    {
      id: "1",
      content: "Follow up on invoice INV-001. Client mentioned budget constraints for Q2.",
      type: "note",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      author: "You",
    },
    {
      id: "2",
      content: "Called John at Acme Corp. Discussed payment timeline. Expects to pay by end of week.",
      type: "call",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      author: "You",
    },
  ],
  "client-2": [
    {
      id: "1",
      content: "Initial consultation completed. Client approved design direction.",
      type: "meeting",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      author: "You",
    },
  ],
};

// Mock storage for communications
const clientCommunications: Record<string, any[]> = {
  "client-1": [
    {
      id: "1",
      subject: "Invoice INV-001 Sent",
      type: "email",
      status: "sent",
      date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
      preview: "Invoice for web development services",
    },
    {
      id: "2",
      subject: "Payment Reminder",
      type: "email",
      status: "sent",
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      preview: "Friendly reminder about outstanding invoice",
    },
  ],
  "client-2": [
    {
      id: "1",
      subject: "Project Kickoff Meeting",
      type: "meeting",
      status: "received",
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      preview: "Discussed project scope and timeline",
    },
  ],
};

let noteIdCounter: Record<string, number> = {};

export const handleGetNotes: RequestHandler = (req, res) => {
  try {
    const { clientId } = req.params;
    const notes = clientNotes[clientId] || [];
    res.json({ notes });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch notes",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleCreateNote: RequestHandler = (req, res) => {
  try {
    const { clientId } = req.params;
    const { content, type } = req.body;

    if (!content) {
      res.status(400).json({ error: "Note content is required" });
      return;
    }

    if (!clientNotes[clientId]) {
      clientNotes[clientId] = [];
    }

    if (!noteIdCounter[clientId]) {
      noteIdCounter[clientId] = 1;
    }

    const noteId = noteIdCounter[clientId]++;
    const note = {
      id: noteId.toString(),
      content,
      type: type || "note",
      createdAt: new Date().toISOString(),
      author: "You",
    };

    clientNotes[clientId].unshift(note);
    res.status(201).json({ note });
  } catch (error) {
    res.status(500).json({
      error: "Failed to create note",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleDeleteNote: RequestHandler = (req, res) => {
  try {
    const { clientId, noteId } = req.params;

    if (!clientNotes[clientId]) {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    clientNotes[clientId] = clientNotes[clientId].filter(
      (n) => n.id !== noteId
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete note",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleGetCommunications: RequestHandler = (req, res) => {
  try {
    const { clientId } = req.params;
    const communications = clientCommunications[clientId] || [];
    res.json({ communications });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch communications",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleCreateCommunication: RequestHandler = (req, res) => {
  try {
    const { clientId } = req.params;
    const { subject, type, status, preview } = req.body;

    if (!clientCommunications[clientId]) {
      clientCommunications[clientId] = [];
    }

    const communication = {
      id: Date.now().toString(),
      subject,
      type,
      status,
      date: new Date().toISOString(),
      preview,
    };

    clientCommunications[clientId].unshift(communication);
    res.status(201).json({ communication });
  } catch (error) {
    res.status(500).json({
      error: "Failed to create communication record",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
