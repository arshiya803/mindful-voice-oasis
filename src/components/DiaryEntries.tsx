import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Edit, Trash, PlusCircle, Frown, Meh, Smile } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type MoodType = "happy" | "neutral" | "sad" | undefined;

interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  mood: MoodType;
}

export default function DiaryEntries() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [mood, setMood] = useState<MoodType>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedEntries = localStorage.getItem("diaryEntries");
    if (savedEntries) {
      try {
        const parsedEntries = JSON.parse(savedEntries).map((entry: any) => ({
          ...entry,
          date: new Date(entry.date)
        }));
        setEntries(parsedEntries);
      } catch (error) {
        console.error("Error parsing diary entries:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("diaryEntries", JSON.stringify(entries));
  }, [entries]);

  const handleSubmitEntry = () => {
    if (!title.trim() || !content.trim() || !mood) {
      toast({
        title: "Missing information",
        description: "Please fill out all fields, including your mood.",
        variant: "destructive",
      });
      return;
    }

    if (isEditing && currentEntryId) {
      setEntries(entries.map(entry => 
        entry.id === currentEntryId 
          ? { ...entry, title, content, date, mood } 
          : entry
      ));
      toast({
        title: "Entry updated",
        description: "Your diary entry has been updated successfully.",
      });
    } else {
      const newEntry: DiaryEntry = {
        id: Date.now().toString(),
        title,
        content,
        date,
        mood,
      };
      setEntries([...entries, newEntry]);
      toast({
        title: "Entry added",
        description: "Your diary entry has been saved successfully.",
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEditEntry = (entry: DiaryEntry) => {
    setTitle(entry.title);
    setContent(entry.content);
    setDate(entry.date);
    setMood(entry.mood);
    setIsEditing(true);
    setCurrentEntryId(entry.id);
    setIsDialogOpen(true);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
    toast({
      title: "Entry deleted",
      description: "Your diary entry has been deleted.",
    });
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setDate(new Date());
    setMood(undefined);
    setIsEditing(false);
    setCurrentEntryId(null);
  };

  const getMoodIcon = (moodType: MoodType) => {
    switch(moodType) {
      case "happy": return <Smile className="text-green-500" />;
      case "neutral": return <Meh className="text-amber-500" />;
      case "sad": return <Frown className="text-rose-500" />;
      default: return null;
    }
  };

  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4">
      <div className="flex justify-end mb-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-mindful-600 hover:bg-mindful-700"
              onClick={resetForm}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Diary Entry" : "New Diary Entry"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Title</label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Entry title"
                  className="focus-visible:ring-mindful-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal focus-visible:ring-mindful-500"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">How are you feeling today?</label>
                <div className="flex justify-center space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "px-6 py-6", 
                      mood === "happy" && "bg-green-100 border-green-500"
                    )}
                    onClick={() => setMood("happy")}
                  >
                    <Smile size={32} className={cn(
                      "text-gray-400",
                      mood === "happy" && "text-green-500"
                    )} />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "px-6 py-6", 
                      mood === "neutral" && "bg-amber-100 border-amber-500"
                    )}
                    onClick={() => setMood("neutral")}
                  >
                    <Meh size={32} className={cn(
                      "text-gray-400",
                      mood === "neutral" && "text-amber-500"
                    )} />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "px-6 py-6", 
                      mood === "sad" && "bg-rose-100 border-rose-500"
                    )}
                    onClick={() => setMood("sad")}
                  >
                    <Frown size={32} className={cn(
                      "text-gray-400",
                      mood === "sad" && "text-rose-500"
                    )} />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium">Content</label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write about your thoughts and feelings..."
                  className="min-h-[120px] focus-visible:ring-mindful-500"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                className="bg-mindful-600 hover:bg-mindful-700"
                onClick={handleSubmitEntry}
              >
                {isEditing ? "Update Entry" : "Save Entry"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {sortedEntries.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium mb-2">No entries yet</h3>
          <p className="text-muted-foreground mb-6">
            Start your journaling journey by adding your first diary entry
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                className="bg-mindful-600 hover:bg-mindful-700"
                onClick={resetForm}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>New Diary Entry</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">Title</label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Entry title"
                    className="focus-visible:ring-mindful-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal focus-visible:ring-mindful-500"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => date && setDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">How are you feeling today?</label>
                  <div className="flex justify-center space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "px-6 py-6", 
                        mood === "happy" && "bg-green-100 border-green-500"
                      )}
                      onClick={() => setMood("happy")}
                    >
                      <Smile size={32} className={cn(
                        "text-gray-400",
                        mood === "happy" && "text-green-500"
                      )} />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "px-6 py-6", 
                        mood === "neutral" && "bg-amber-100 border-amber-500"
                      )}
                      onClick={() => setMood("neutral")}
                    >
                      <Meh size={32} className={cn(
                        "text-gray-400",
                        mood === "neutral" && "text-amber-500"
                      )} />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "px-6 py-6", 
                        mood === "sad" && "bg-rose-100 border-rose-500"
                      )}
                      onClick={() => setMood("sad")}
                    >
                      <Frown size={32} className={cn(
                        "text-gray-400",
                        mood === "sad" && "text-rose-500"
                      )} />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium">Content</label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write about your thoughts and feelings..."
                    className="min-h-[120px] focus-visible:ring-mindful-500"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                  className="bg-mindful-600 hover:bg-mindful-700"
                  onClick={handleSubmitEntry}
                >
                  Save Entry
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedEntries.map((entry) => (
            <Card key={entry.id} className="diary-card transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{entry.title}</CardTitle>
                <div className="flex items-center space-x-1">
                  {getMoodIcon(entry.mood)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground pb-2">
                  {format(new Date(entry.date), "MMMM d, yyyy")}
                </div>
                <p className="line-clamp-3 text-sm">
                  {entry.content}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                  onClick={() => handleDeleteEntry(entry.id)}
                >
                  <Trash size={16} />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-mindful-700 border-mindful-200 hover:bg-mindful-50 hover:text-mindful-800"
                  onClick={() => handleEditEntry(entry)}
                >
                  <Edit size={16} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
