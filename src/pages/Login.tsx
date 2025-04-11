
import AuthForm from "@/components/AuthForm";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-mindful-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-mindful-800 mb-2">Mindful Voice</h1>
          <p className="text-muted-foreground">Your mental health companion</p>
        </div>
        <AuthForm isLogin={true} />
      </div>
    </div>
  );
}
