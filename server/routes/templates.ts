import { RequestHandler } from "express";

// Mock template storage (in production, use a real database)
const templates: Record<string, any> = {
  "1": {
    id: "1",
    name: "Standard Web Development",
    description: "Template for web development projects",
    lineItems: [
      { id: "1", description: "Web Development", quantity: 40, unitPrice: 50 },
    ],
    notes: "Payment due upon completion",
    taxRate: 10,
    currency: "USD",
    createdAt: new Date().toISOString(),
  },
  "2": {
    id: "2",
    name: "Design Package",
    description: "Complete design package including logo and guidelines",
    lineItems: [
      { id: "1", description: "Logo Design", quantity: 1, unitPrice: 1500 },
      { id: "2", description: "Brand Guidelines", quantity: 1, unitPrice: 1000 },
    ],
    notes: "Net 15",
    taxRate: 0,
    currency: "USD",
    createdAt: new Date().toISOString(),
  },
};

let nextId = 3;

export const handleGetTemplates: RequestHandler = (req, res) => {
  try {
    const templateList = Object.values(templates);
    res.json({ templates: templateList });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch templates",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleGetTemplate: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const template = templates[id];

    if (!template) {
      res.status(404).json({ error: "Template not found" });
      return;
    }

    res.json({ template });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch template",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleCreateTemplate: RequestHandler = (req, res) => {
  try {
    const { name, description, lineItems, notes, taxRate, currency } = req.body;

    if (!name) {
      res.status(400).json({ error: "Template name is required" });
      return;
    }

    const id = nextId.toString();
    nextId++;

    const newTemplate = {
      id,
      name,
      description,
      lineItems,
      notes,
      taxRate,
      currency,
      createdAt: new Date().toISOString(),
    };

    templates[id] = newTemplate;
    res.status(201).json({ template: newTemplate });
  } catch (error) {
    res.status(500).json({
      error: "Failed to create template",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleUpdateTemplate: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, lineItems, notes, taxRate, currency } = req.body;

    const template = templates[id];
    if (!template) {
      res.status(404).json({ error: "Template not found" });
      return;
    }

    if (name) template.name = name;
    if (description !== undefined) template.description = description;
    if (lineItems) template.lineItems = lineItems;
    if (notes !== undefined) template.notes = notes;
    if (taxRate !== undefined) template.taxRate = taxRate;
    if (currency) template.currency = currency;

    res.json({ template });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update template",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleDeleteTemplate: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    if (!templates[id]) {
      res.status(404).json({ error: "Template not found" });
      return;
    }

    delete templates[id];
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete template",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleDuplicateTemplate: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const template = templates[id];

    if (!template) {
      res.status(404).json({ error: "Template not found" });
      return;
    }

    const newId = nextId.toString();
    nextId++;

    const duplicatedTemplate = {
      ...template,
      id: newId,
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString(),
    };

    templates[newId] = duplicatedTemplate;
    res.status(201).json({ template: duplicatedTemplate });
  } catch (error) {
    res.status(500).json({
      error: "Failed to duplicate template",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
