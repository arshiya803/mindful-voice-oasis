
import MainLayout from "@/components/MainLayout";
import ChatBot from "@/components/ChatBot";

export default function Chat() {
  return (
    <MainLayout>
      <div className="flex flex-col h-full min-h-[calc(100vh-3.5rem)]">
        <div className="p-4 border-b border-border/50 bg-background/80">
          <h1 className="text-2xl font-semibold text-mindful-800">Chat Support</h1>
          <p className="text-sm text-muted-foreground">Talk to your mental health assistant</p>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatBot />
        </div>
      </div>
    </MainLayout>
  );
}
