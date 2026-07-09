import { v4 as uuidv4 } from 'uuid';

// In-memory user storage (Phase 2 - will migrate to DB in Phase 3)
interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Session {
  id: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
}

const users = new Map<string, User>();
const usersByEmail = new Map<string, string>(); // email -> userId
const sessions = new Map<string, Session>();
const passwordResets = new Map<string, { userId: string; expiresAt: Date }>();
const emailVerificationTokens = new Map<string, { userId: string; expiresAt: Date }>();

// Simple password hashing (in production, use bcryptjs)
// For now, using a simple base64 encoding to demonstrate concept
// IMPORTANT: This is NOT secure - production must use bcryptjs
function hashPassword(password: string): string {
  // TODO: Replace with bcryptjs in production
  return Buffer.from(password).toString('base64');
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// JWT-like token generation (simplified - use jsonwebtoken in production)
function generateToken(): string {
  return uuidv4() + '.' + Date.now() + '.' + Math.random().toString(36).slice(2);
}

function generateAccessToken(userId: string): string {
  return 'access_' + generateToken();
}

function generateRefreshToken(userId: string): string {
  return 'refresh_' + generateToken();
}

// Token verification
function verifyAccessToken(token: string): string | null {
  // In production: use jsonwebtoken.verify()
  // For now, check if token exists in sessions
  for (const session of sessions.values()) {
    if (session.accessToken === token && new Date() < session.expiresAt) {
      return session.userId;
    }
  }
  return null;
}

function verifyRefreshToken(token: string): string | null {
  for (const session of sessions.values()) {
    if (session.refreshToken === token && new Date() < session.expiresAt) {
      return session.userId;
    }
  }
  return null;
}

// Authentication Service
export const AuthService = {
  /**
   * Sign up a new user
   */
  async signup(email: string, password: string, name: string) {
    // Validate input
    if (!email || !password || !name) {
      throw new Error('Email, password, and name are required');
    }

    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    // Check if user already exists
    if (usersByEmail.has(email)) {
      throw new Error('User already exists with this email');
    }

    // Create user
    const userId = uuidv4();
    const user: User = {
      id: userId,
      email,
      passwordHash: hashPassword(password),
      name,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.set(userId, user);
    usersByEmail.set(email, userId);

    // Generate email verification token
    const verificationToken = generateToken();
    emailVerificationTokens.set(verificationToken, {
      userId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // In production: Send verification email via Resend
    console.log(`[DEV] Verification token for ${email}: ${verificationToken}`);

    return {
      userId,
      email,
      name,
      emailVerified: false,
      message: 'User created. Please verify your email.',
    };
  },

  /**
   * Sign in with email and password
   */
  async signin(email: string, password: string) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Find user
    const userId = usersByEmail.get(email);
    if (!userId) {
      throw new Error('Invalid email or password');
    }

    const user = users.get(userId);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    if (!verifyPassword(password, user.passwordHash)) {
      throw new Error('Invalid email or password');
    }

    // Create session
    const session = this.createSession(userId);

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    };
  },

  /**
   * Create a new session with tokens
   */
  createSession(userId: string) {
    const user = users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const sessionId = uuidv4();
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session: Session = {
      id: sessionId,
      userId,
      accessToken,
      refreshToken,
      expiresAt,
      createdAt: new Date(),
    };

    sessions.set(sessionId, session);

    return {
      accessToken,
      refreshToken,
      expiresAt,
    };
  },

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string) {
    const userId = verifyRefreshToken(refreshToken);
    if (!userId) {
      throw new Error('Invalid or expired refresh token');
    }

    // Invalidate old session
    for (const [, session] of sessions) {
      if (session.refreshToken === refreshToken) {
        sessions.delete(session.id);
      }
    }

    // Create new session
    const newSession = this.createSession(userId);
    return {
      accessToken: newSession.accessToken,
      refreshToken: newSession.refreshToken,
      expiresAt: newSession.expiresAt,
    };
  },

  /**
   * Sign out - invalidate session
   */
  async signout(accessToken: string) {
    // Find and delete session
    for (const [, session] of sessions) {
      if (session.accessToken === accessToken) {
        sessions.delete(session.id);
        return { success: true };
      }
    }
    return { success: true };
  },

  /**
   * Verify email address
   */
  async verifyEmail(token: string) {
    const verificationData = emailVerificationTokens.get(token);
    if (!verificationData || new Date() > verificationData.expiresAt) {
      throw new Error('Invalid or expired verification token');
    }

    const user = users.get(verificationData.userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.emailVerified = true;
    user.updatedAt = new Date();

    emailVerificationTokens.delete(token);

    return {
      success: true,
      message: 'Email verified successfully',
    };
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string) {
    const userId = usersByEmail.get(email);
    if (!userId) {
      // Don't reveal if email exists (security best practice)
      return {
        success: true,
        message: 'If an account exists with this email, a reset link has been sent',
      };
    }

    const resetToken = generateToken();
    passwordResets.set(resetToken, {
      userId,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    // In production: Send reset email via Resend
    console.log(`[DEV] Password reset token for ${email}: ${resetToken}`);

    return {
      success: true,
      message: 'If an account exists with this email, a reset link has been sent',
    };
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string) {
    if (!token || !newPassword) {
      throw new Error('Token and new password are required');
    }

    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    const resetData = passwordResets.get(token);
    if (!resetData || new Date() > resetData.expiresAt) {
      throw new Error('Invalid or expired reset token');
    }

    const user = users.get(resetData.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update password
    user.passwordHash = hashPassword(newPassword);
    user.updatedAt = new Date();

    // Invalidate all sessions for this user
    for (const [, session] of sessions) {
      if (session.userId === resetData.userId) {
        sessions.delete(session.id);
      }
    }

    passwordResets.delete(token);

    return {
      success: true,
      message: 'Password reset successfully. Please sign in with your new password.',
    };
  },

  /**
   * Delete user account
   */
  async deleteAccount(userId: string) {
    const user = users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Delete user
    users.delete(userId);
    usersByEmail.delete(user.email);

    // Invalidate all sessions
    for (const [, session] of sessions) {
      if (session.userId === userId) {
        sessions.delete(session.id);
      }
    }

    return {
      success: true,
      message: 'Account deleted',
    };
  },

  /**
   * Get user by ID
   */
  getUserById(userId: string) {
    const user = users.get(userId);
    if (!user) {
      return null;
    }

    // Don't return password hash
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  /**
   * Get user by email
   */
  getUserByEmail(email: string) {
    const userId = usersByEmail.get(email);
    if (!userId) {
      return null;
    }
    return this.getUserById(userId);
  },

  /**
   * Verify access token and get user
   */
  verifyTokenAndGetUser(accessToken: string) {
    const userId = verifyAccessToken(accessToken);
    if (!userId) {
      return null;
    }
    return this.getUserById(userId);
  },

  /**
   * Validation helpers
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPassword(password: string): boolean {
    return password && password.length >= 8;
  },
};

export type AuthUser = Omit<User, 'passwordHash'>;
