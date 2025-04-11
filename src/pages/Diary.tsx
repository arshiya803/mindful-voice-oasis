
import MainLayout from "@/components/MainLayout";
import DiaryEntries from "@/components/DiaryEntries";

export default function Diary() {
  return (
    <MainLayout>
      <div className="flex flex-col h-full min-h-[calc(100vh-3.5rem)]">
        <div className="p-4 border-b border-border/50 bg-background/80">
          <h1 className="text-2xl font-semibold text-mindful-800">Daily Journal</h1>
          <p className="text-sm text-muted-foreground">Track your thoughts and feelings</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <DiaryEntries />
        </div>
      </div>
    </MainLayout>
  );
}
