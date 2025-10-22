import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { TrendingUp, DollarSign, Users, BarChart3, Home, Monitor } from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/executive", label: "Executive", icon: TrendingUp },
  { path: "/sales", label: "Sales", icon: DollarSign },
  { path: "/customer-success", label: "Customer Success", icon: Users },
  { path: "/product", label: "Product", icon: BarChart3 },
  { path: "/embeddable", label: "Embeddable", icon: Monitor },
];

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Metronome GTM Intelligence
            </h1>
          </div>

          <div className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-accent hover:shadow-sm"
                  )}
                >
                  <Icon size={18} />
                  <span className="hidden md:inline font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
