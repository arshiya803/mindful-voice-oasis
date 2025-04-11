
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, BookOpen, LogOut, User } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [userName, setUserName] = useState("");
  
  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserName(parsedUser.name || "User");
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/login");
  };

  const navItems = [
    { path: "/chat", icon: <MessageSquare size={20} />, label: "Chat" },
    { path: "/diary", icon: <BookOpen size={20} />, label: "Diary" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-mindful-50">
      <header className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-mindful-800">Mindful Voice</h1>
          </div>
          <div className="flex items-center space-x-1">
            <div className="mr-2 flex items-center">
              <User size={16} className="mr-1 text-mindful-700" />
              <span className="text-sm text-muted-foreground">{userName}</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        <nav className="md:w-64 p-4 md:border-r border-border/50 bg-background/80">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  location.pathname === item.path && "bg-mindful-100 text-mindful-800"
                )}
                onClick={() => navigate(item.path)}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Button>
            ))}
          </div>
        </nav>

        <main className="flex-1 p-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
