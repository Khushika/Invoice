import { RequestHandler } from "express";

// Mock branding settings storage
let brandingSettings: any = {
  companyName: "Your Business Name",
  companyLogo: "",
  companyEmail: "contact@yourbusiness.com",
  companyPhone: "+1 (555) 000-0000",
  companyAddress: "123 Main St, City, State 12345",
  companyWebsite: "www.yourbusiness.com",
  invoicePrefix: "INV",
  primaryColor: "#ff6b6b",
  secondaryColor: "#224d35",
  invoiceNotes: "Thank you for your business!",
  bankDetails: "",
  taxId: "",
};

export const handleGetBrandingSettings: RequestHandler = (req, res) => {
  try {
    res.json({ settings: brandingSettings });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch branding settings",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleSaveBrandingSettings: RequestHandler = (req, res) => {
  try {
    const {
      companyName,
      companyEmail,
      companyPhone,
      companyAddress,
      companyWebsite,
      invoicePrefix,
      primaryColor,
      secondaryColor,
      invoiceNotes,
      bankDetails,
      taxId,
    } = req.body;

    if (companyName) brandingSettings.companyName = companyName;
    if (companyEmail) brandingSettings.companyEmail = companyEmail;
    if (companyPhone) brandingSettings.companyPhone = companyPhone;
    if (companyAddress) brandingSettings.companyAddress = companyAddress;
    if (companyWebsite) brandingSettings.companyWebsite = companyWebsite;
    if (invoicePrefix) brandingSettings.invoicePrefix = invoicePrefix;
    if (primaryColor) brandingSettings.primaryColor = primaryColor;
    if (secondaryColor) brandingSettings.secondaryColor = secondaryColor;
    if (invoiceNotes !== undefined)
      brandingSettings.invoiceNotes = invoiceNotes;
    if (bankDetails !== undefined) brandingSettings.bankDetails = bankDetails;
    if (taxId !== undefined) brandingSettings.taxId = taxId;

    res.json({ settings: brandingSettings });
  } catch (error) {
    res.status(500).json({
      error: "Failed to save branding settings",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
