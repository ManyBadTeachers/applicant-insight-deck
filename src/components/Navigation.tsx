import { Link, useLocation } from "react-router-dom";
import { Users, ClipboardCheck, Activity, BarChart3, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    {
      name: "Application Form",
      href: "/application",
      icon: FileText,
    },
    {
      name: "Applications Overview",
      href: "/",
      icon: Users,
    },
    {
      name: "Action Center",
      href: "/actions",
      icon: Activity,
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
    },
  ];

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-primary">ARHR Platform</h1>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center">
            <div className="ml-4 flex items-center md:ml-6">
              <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">JD</span>
              </div>
              <span className="ml-2 text-sm font-medium text-foreground">John Doe</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;