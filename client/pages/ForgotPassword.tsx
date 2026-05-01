import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, CheckCircle } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send reset link");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-card border border-border/40 rounded-lg p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h1 className="font-sora text-2xl font-bold mb-2">Check Your Email</h1>
            <p className="text-muted-foreground mb-6">
              We've sent a password reset link to <strong>{email}</strong>. Check
              your inbox and follow the instructions to reset your password.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Didn't receive the email? Check your spam folder or{" "}
              <button
                onClick={() => {
                  setSubmitted(false);
                  setEmail("");
                }}
                className="text-accent hover:underline"
              >
                try again
              </button>
              .
            </p>
            <Link to="/signin">
              <Button className="w-full bg-accent hover:bg-accent/90 text-primary-foreground">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <FileText className="w-8 h-8 text-accent" />
          <span className="font-sora font-bold text-2xl text-foreground">
            InvoiceHound
          </span>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border/40 rounded-lg p-8">
          <h1 className="font-sora text-2xl font-bold mb-2">Reset Password</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Enter your email address and we'll send you a link to reset your password
          </p>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input border-border text-foreground"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent hover:bg-accent/90 text-primary-foreground font-medium"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border/40">
            <p className="text-sm text-muted-foreground text-center">
              Remember your password?{" "}
              <Link to="/signin" className="text-accent hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
