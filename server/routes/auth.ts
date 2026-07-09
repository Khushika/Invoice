import { RequestHandler, Router } from 'express';
import { AuthService } from '../services/auth.service';
import { authenticateToken } from '../middleware/auth.middleware';
import { z } from 'zod';

// Request validation schemas
const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

const signinSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password required'),
});

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

const updatePasswordSchema = z.object({
  token: z.string().min(1, 'Reset token required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token required'),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token required'),
});

/**
 * POST /api/auth/signup
 * Create a new user account
 */
export const handleSignUp: RequestHandler = async (req, res) => {
  try {
    const { email, password, name } = signupSchema.parse(req.body);

    const result = await AuthService.signup(email, password, name);

    res.status(201).json({
      success: true,
      data: result,
      message: 'Account created successfully. Please verify your email.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors[0],
      });
    }

    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        return res.status(409).json({
          success: false,
          error: 'User already exists',
          message: error.message,
        });
      }

      return res.status(400).json({
        success: false,
        error: 'Signup failed',
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Signup failed',
      message: 'An unexpected error occurred',
    });
  }
};

/**
 * POST /api/auth/signin
 * Sign in with email and password
 */
export const handleSignIn: RequestHandler = async (req, res) => {
  try {
    const { email, password } = signinSchema.parse(req.body);

    const result = await AuthService.signin(email, password);

    // Set refresh token in secure httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      data: {
        userId: result.userId,
        email: result.email,
        name: result.name,
        emailVerified: result.emailVerified,
        accessToken: result.accessToken,
      },
      message: 'Signed in successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors[0],
      });
    }

    if (error instanceof Error) {
      return res.status(401).json({
        success: false,
        error: 'Authentication failed',
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Signin failed',
      message: 'An unexpected error occurred',
    });
  }
};

/**
 * POST /api/auth/signout
 * Sign out and invalidate session
 */
export const handleSignOut: RequestHandler = async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1];

    if (accessToken) {
      await AuthService.signout(accessToken);
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Signed out successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Signout failed',
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    });
  }
};

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
export const handleRefreshToken: RequestHandler = async (req, res) => {
  try {
    // Get refresh token from cookie or body
    let refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token required',
      });
    }

    const result = await AuthService.refreshAccessToken(refreshToken);

    // Update refresh token cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      data: {
        accessToken: result.accessToken,
        expiresIn: 900, // 15 minutes
      },
      message: 'Token refreshed',
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Token refresh failed',
      message: error instanceof Error ? error.message : 'Invalid refresh token',
    });
  }
};

/**
 * POST /api/auth/verify-email
 * Verify email address with token
 */
export const handleVerifyEmail: RequestHandler = async (req, res) => {
  try {
    const { token } = verifyEmailSchema.parse(req.body);

    await AuthService.verifyEmail(token);

    res.json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors[0],
      });
    }

    res.status(400).json({
      success: false,
      error: 'Email verification failed',
      message: error instanceof Error ? error.message : 'Invalid verification token',
    });
  }
};

/**
 * POST /api/auth/forgot-password
 * Request password reset
 */
export const handleForgotPassword: RequestHandler = async (req, res) => {
  try {
    const { email } = resetPasswordSchema.parse(req.body);

    const result = await AuthService.requestPasswordReset(email);

    res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors[0],
      });
    }

    res.status(500).json({
      success: false,
      error: 'Password reset request failed',
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    });
  }
};

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
export const handleResetPassword: RequestHandler = async (req, res) => {
  try {
    const { token, newPassword } = updatePasswordSchema.parse(req.body);

    await AuthService.resetPassword(token, newPassword);

    res.json({
      success: true,
      message: 'Password reset successfully. Please sign in with your new password.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors[0],
      });
    }

    res.status(400).json({
      success: false,
      error: 'Password reset failed',
      message: error instanceof Error ? error.message : 'Invalid reset token',
    });
  }
};

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
export const handleGetMe: RequestHandler = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    res.json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get user',
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    });
  }
};

/**
 * POST /api/auth/delete-account
 * Delete user account
 */
export const handleDeleteAccount: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    await AuthService.deleteAccount(req.user.id);

    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete account',
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    });
  }
};

/**
 * Create and return auth router
 */
export const createAuthRouter = () => {
  const router = Router();

  // Public routes
  router.post('/signup', handleSignUp);
  router.post('/signin', handleSignIn);
  router.post('/forgot-password', handleForgotPassword);
  router.post('/reset-password', handleResetPassword);
  router.post('/verify-email', handleVerifyEmail);
  router.post('/refresh', handleRefreshToken);

  // Protected routes
  router.get('/me', authenticateToken, handleGetMe);
  router.post('/signout', authenticateToken, handleSignOut);
  router.post('/delete-account', authenticateToken, handleDeleteAccount);

  return router;
};

export default createAuthRouter;
