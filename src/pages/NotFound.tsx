
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-mindful-50 p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-mindful-800">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Oops! Page not found</p>
        <Button 
          className="bg-mindful-600 hover:bg-mindful-700"
          onClick={() => window.location.href = "/"}
        >
          <Home className="mr-2 h-4 w-4" />
          Return to Home
        </Button>
      </div>
    </div>
  );
}

export default NotFound;
