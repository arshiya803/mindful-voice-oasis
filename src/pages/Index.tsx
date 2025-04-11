
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already logged in, redirect to chat
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      navigate("/chat");
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-mindful-50 p-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-mindful-800">
          Welcome to <span className="text-mindful-600">Mindful Voice</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          Your personal mental health companion for support and reflection
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          className="bg-mindful-600 hover:bg-mindful-700 text-lg px-8 py-6"
          onClick={() => navigate("/login")}
        >
          Sign In
        </Button>
        <Button 
          variant="outline" 
          className="border-mindful-600 text-mindful-700 hover:bg-mindful-50 text-lg px-8 py-6"
          onClick={() => navigate("/register")}
        >
          Create Account
        </Button>
      </div>
    </div>
  );
};

export default Index;
