import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, FileText, BookOpen, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";

const Navigation = () => {
  const location = useLocation();
  const [newApplicantsCount, setNewApplicantsCount] = useState(0);
  
  const navItems = [
    { path: "/", label: "Home", icon: Users },
    { path: "/docs", label: "Docs", icon: BookOpen },
    { path: "/create-applicant", label: "New Applicants", icon: UserPlus }
  ];

  useEffect(() => {
    const fetchNewApplicants = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/new_applicants");
        const data = await response.json();
        if (data.status === "ok" && data.new_applicants) {
          setNewApplicantsCount(data.new_applicants.length);
        }
      } catch (error) {
        console.error("Error fetching new applicants:", error);
      }
    };

    fetchNewApplicants();
  }, []);

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
                      className="gap-2 relative"
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                      {item.path === "/create-applicant" && newApplicantsCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {newApplicantsCount}
                        </span>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;