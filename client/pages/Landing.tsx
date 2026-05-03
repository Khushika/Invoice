import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, Bell, CreditCard } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-accent" />
            <span className="font-sora font-bold text-lg text-foreground">
              InvoiceHound
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/signin">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-accent hover:bg-accent/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="font-sora text-4xl md:text-6xl font-bold text-foreground mb-6">
            Stop Chasing Overdue Invoices
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            InvoiceHound automates your invoice reminders and payment tracking.
            Get paid faster with smart reminders, payment links, and detailed
            analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-primary-foreground"
              >
                Start Free Trial
              </Button>
            </Link>
            <Link to="/signin">
              <Button
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:bg-card"
              >
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-card/30 border-t border-border/40">
        <div className="container mx-auto">
          <h2 className="font-sora text-3xl md:text-4xl font-bold text-center mb-16">
            Powerful Features for Freelancers
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Bell className="w-8 h-8 text-accent" />}
              title="Smart Reminders"
              description="Automatic payment reminders before and after due date. Customize tone and timing."
            />
            <FeatureCard
              icon={<CreditCard className="w-8 h-8 text-accent" />}
              title="Payment Links"
              description="Secure payment links with Stripe. Clients pay directly. You get notified instantly."
            />
            <FeatureCard
              icon={<FileText className="w-8 h-8 text-accent" />}
              title="Professional Invoices"
              description="Create beautiful invoices with your branding. PDF exports and payment QR codes."
            />
            <FeatureCard
              icon={<CheckCircle className="w-8 h-8 text-accent" />}
              title="Payment Tracking"
              description="Real-time dashboard showing paid, overdue, and pending invoices. Never miss a payment."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="font-sora text-3xl md:text-4xl font-bold text-center mb-16">
            Simple Pricing
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              name="Free"
              price="$0"
              features={[
                "Up to 5 invoices/month",
                "3 clients",
                "Email reminders",
                "Basic dashboard",
              ]}
            />
            <PricingCard
              name="Pro"
              price="$9"
              period="/month"
              features={[
                "Unlimited invoices",
                "Unlimited clients",
                "Email + SMS reminders",
                "Payment portal",
                "PDF export",
              ]}
              highlighted
            />
            <PricingCard
              name="Business"
              price="$29"
              period="/month"
              features={[
                "Everything in Pro",
                "Custom branding",
                "Team members (5)",
                "Priority support",
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-card/50 border-t border-border/40">
        <div className="container mx-auto text-center">
          <h2 className="font-sora text-3xl md:text-4xl font-bold mb-6">
            Ready to get paid faster?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join freelancers who've recovered thousands in overdue payments
          </p>
          <Link to="/signup">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-primary-foreground"
            >
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; 2024 InvoiceHound. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-card border border-border/40 rounded-lg p-6 hover:border-accent/50 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="font-sora font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function PricingCard({
  name,
  price,
  period,
  features,
  highlighted,
}: {
  name: string;
  price: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <div
      className={`border rounded-lg p-8 ${
        highlighted
          ? "bg-card border-accent shadow-lg shadow-accent/20 scale-105"
          : "bg-card/50 border-border/40"
      }`}
    >
      <h3 className="font-sora font-bold text-xl mb-2">{name}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold text-accent">{price}</span>
        {period && <span className="text-muted-foreground text-sm">{period}</span>}
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link to="/signup">
        <Button
          className={
            highlighted
              ? "w-full bg-accent hover:bg-accent/90 text-primary-foreground"
              : "w-full border-border text-foreground hover:bg-card"
          }
          variant={highlighted ? "default" : "outline"}
        >
          Get Started
        </Button>
      </Link>
    </div>
  );
}
