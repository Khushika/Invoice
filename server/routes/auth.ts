import { RequestHandler } from "express";

// Mock user storage (in production, use a real database)
const users: Record<string, { password: string; email: string }> = {};

export const handleSignUp: RequestHandler = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password required" });
      return;
    }

    if (users[email]) {
      res.status(409).json({ error: "User already exists" });
      return;
    }

    // In production: hash password with bcrypt
    users[email] = { email, password };

    // In production: create database record, generate session, set httponly cookie
    res.status(201).json({ success: true, message: "User created" });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Sign up failed",
        details: error instanceof Error ? error.message : "Unknown error",
      });
  }
};

export const handleSignIn: RequestHandler = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password required" });
      return;
    }

    const user = users[email];
    if (!user || user.password !== password) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // In production: create session, set httponly cookie
    res.json({ success: true, message: "Signed in" });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Sign in failed",
        details: error instanceof Error ? error.message : "Unknown error",
      });
  }
};

export const handleSignOut: RequestHandler = (req, res) => {
  // In production: clear session/cookie
  res.json({ success: true, message: "Signed out" });
};
