import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { BarChart3, Users, FileText, Mail, BookOpen, UserPlus } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Applications", icon: Users },
    { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { path: "/email-templates", label: "Email Templates", icon: Mail },
    { path: "/docs", label: "Docs", icon: BookOpen },
    { path: "/create-applicant", label: "Add Applicant", icon: UserPlus }
  ];

  return (
    <nav className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <FileText className="w-8 h-8 text-primary" />
              <span className="font-bold text-xl text-card-foreground">HR Platform</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={location.pathname === item.path ? "default" : "ghost"}
                      className="gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;