import { RequestHandler } from "express";

// Mock integrations storage
let integrationSettings: any = {
  resend: { enabled: false, apiKey: "" },
  twilio: { enabled: false, accountSid: "", authToken: "", phoneNumber: "" },
  stripe: { enabled: false, publishableKey: "", secretKey: "" },
};

export const handleGetIntegrations: RequestHandler = (req, res) => {
  try {
    res.json({ integrations: integrationSettings });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch integrations",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleSaveIntegrations: RequestHandler = (req, res) => {
  try {
    const { resend, twilio, stripe } = req.body;

    if (resend) {
      integrationSettings.resend = {
        enabled: resend.enabled || false,
        apiKey: resend.apiKey || "",
      };
    }

    if (twilio) {
      integrationSettings.twilio = {
        enabled: twilio.enabled || false,
        accountSid: twilio.accountSid || "",
        authToken: twilio.authToken || "",
        phoneNumber: twilio.phoneNumber || "",
      };
    }

    if (stripe) {
      integrationSettings.stripe = {
        enabled: stripe.enabled || false,
        publishableKey: stripe.publishableKey || "",
        secretKey: stripe.secretKey || "",
      };
    }

    res.json({ integrations: integrationSettings });
  } catch (error) {
    res.status(500).json({
      error: "Failed to save integrations",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleSendEmail: RequestHandler = (req, res) => {
  try {
    const { to, subject, html } = req.body;

    if (!integrationSettings.resend.enabled) {
      res.status(400).json({ error: "Email integration not configured" });
      return;
    }

    // Mock email sending - in production, use Resend API
    console.log(`[Mock Email] To: ${to}, Subject: ${subject}`);

    res.json({
      success: true,
      message: "Email queued for sending",
      id: `email_${Date.now()}`,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to send email",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleSendSMS: RequestHandler = (req, res) => {
  try {
    const { to, message } = req.body;

    if (!integrationSettings.twilio.enabled) {
      res.status(400).json({ error: "SMS integration not configured" });
      return;
    }

    // Mock SMS sending - in production, use Twilio API
    console.log(`[Mock SMS] To: ${to}, Message: ${message}`);

    res.json({
      success: true,
      message: "SMS queued for sending",
      id: `sms_${Date.now()}`,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to send SMS",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleCreatePaymentIntent: RequestHandler = (req, res) => {
  try {
    const { amount, invoiceId } = req.body;

    if (!integrationSettings.stripe.enabled) {
      res.status(400).json({ error: "Payment integration not configured" });
      return;
    }

    // Mock payment intent - in production, use Stripe API
    const clientSecret = `pi_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`;

    res.json({
      success: true,
      clientSecret,
      paymentIntentId: `pi_${Date.now()}`,
      amount,
      invoiceId,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to create payment intent",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
