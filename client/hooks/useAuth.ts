import React, { useState, useEffect, useCallback, useContext, createContext } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  signup: (email: string, password: string, name: string) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  signout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem('accessToken')
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.data);
            setAccessToken(token);
          } else {
            // Token invalid, try to refresh
            await refreshAccessToken();
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('accessToken');
          setAccessToken(null);
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        const newToken = data.data.accessToken;
        localStorage.setItem('accessToken', newToken);
        setAccessToken(newToken);
        return newToken;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    return null;
  }, []);

  const signup = useCallback(
    async (email: string, password: string, name: string) => {
      try {
        setError(null);
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, name }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Signup failed');
        }

        // User created but needs to verify email
        // Don't set user yet - they need to verify
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Signup failed';
        setError(message);
        throw error;
      }
    },
    []
  );

  const signin = useCallback(
    async (email: string, password: string) => {
      try {
        setError(null);
        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Signin failed');
        }

        const data = await response.json();
        const token = data.data.accessToken;

        // Store token and user
        localStorage.setItem('accessToken', token);
        setAccessToken(token);
        setUser(data.data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Signin failed';
        setError(message);
        throw error;
      }
    },
    []
  );

  const signout = useCallback(async () => {
    try {
      setError(null);
      const token = localStorage.getItem('accessToken');

      if (token) {
        await fetch('/api/auth/signout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      localStorage.removeItem('accessToken');
      setAccessToken(null);
      setUser(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signout failed';
      setError(message);
      throw error;
    }
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    try {
      setError(null);
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Password reset request failed');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Password reset failed';
      setError(message);
      throw error;
    }
  }, []);

  const resetPassword = useCallback(
    async (token: string, newPassword: string) => {
      try {
        setError(null);
        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, newPassword }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Password reset failed');
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Password reset failed';
        setError(message);
        throw error;
      }
    },
    []
  );

  const verifyEmail = useCallback(async (token: string) => {
    try {
      setError(null);
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Email verification failed');
      }

      // Update user's email verified status
      if (user) {
        setUser({ ...user, emailVerified: true });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Email verification failed';
      setError(message);
      throw error;
    }
  }, [user]);

  const deleteAccount = useCallback(async () => {
    try {
      setError(null);
      const token = localStorage.getItem('accessToken');

      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Account deletion failed');
      }

      localStorage.removeItem('accessToken');
      setAccessToken(null);
      setUser(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Account deletion failed';
      setError(message);
      throw error;
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user && !!accessToken,
    accessToken,
    signup,
    signin,
    signout,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    refreshToken: refreshAccessToken,
    deleteAccount,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
