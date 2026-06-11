import { Link, useLocation } from "react-router-dom";
import {
  FileText,
  Home,
  FileCheck,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  FileCode,
  History,
} from "lucide-react";
import { useState } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/invoices", icon: FileCheck, label: "Invoices" },
    { href: "/clients", icon: Users, label: "Clients" },
    { href: "/templates", icon: FileCode, label: "Templates" },
    { href: "/activity", icon: History, label: "Activity" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  const isActive = (href: string) => location.pathname.startsWith(href);

  const handleLogout = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-card border-r border-border/40 flex flex-col transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <Link
          to="/dashboard"
          className="flex items-center gap-3 px-6 py-6 border-b border-border/40 hover:bg-muted/30 transition-colors"
          onClick={() => setSidebarOpen(false)}
        >
          <FileText className="w-8 h-8 text-accent flex-shrink-0" />
          <div>
            <p className="font-sora font-bold text-foreground">InvoiceHound</p>
            <p className="text-xs text-muted-foreground">Freelance Tools</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? "bg-accent/20 text-accent border border-accent/50"
                    : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-border/40">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-card border border-border/40 rounded-lg"
      >
        {sidebarOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 md:hidden z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {children}
      </main>
    </div>
  );
}
