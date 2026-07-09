import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        emailVerified: boolean;
      };
      userId?: string;
      accessToken?: string;
    }
  }
}

/**
 * Middleware to verify JWT/access token
 * Extracts token from Authorization header and verifies it
 */
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer {token}

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required',
      });
    }

    // Verify token and get user
    const user = AuthService.verifyTokenAndGetUser(token);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired access token',
      });
    }

    // Attach user to request
    req.user = user;
    req.userId = user.id;
    req.accessToken = token;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Authentication failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Middleware to require email verification
 * Used to gate features that shouldn't be accessible to unverified users
 */
export const requireEmailVerified = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.emailVerified) {
    return res.status(403).json({
      success: false,
      error: 'Email verification required',
      message: 'Please verify your email address before using this feature',
    });
  }
  next();
};

/**
 * Middleware for optional authentication
 * Verifies token if provided, but doesn't require it
 */
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const user = AuthService.verifyTokenAndGetUser(token);
      if (user) {
        req.user = user;
        req.userId = user.id;
        req.accessToken = token;
      }
    }

    next();
  } catch (error) {
    // Log but don't fail - auth was optional
    console.error('Optional auth error:', error);
    next();
  }
};

/**
 * Error handling for 401/403 responses
 */
export const authErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error.message.includes('Unauthorized')) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  if (error.message.includes('Forbidden')) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
    });
  }

  next(error);
};
