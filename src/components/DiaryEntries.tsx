
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type DiaryEntry = {
  id: string;
  date: Date;
  content: string;
  mood: "happy" | "neutral" | "sad" | "anxious" | "angry";
  createdAt: Date;
};

const moodEmojis = {
  happy: "😊",
  neutral: "😐",
  sad: "😔",
  anxious: "😰",
  angry: "😠",
};

export default function DiaryEntries() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [newEntry, setNewEntry] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMood, setSelectedMood] = useState<DiaryEntry["mood"]>("neutral");
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const { toast } = useToast();

  // Load entries from local storage
  useEffect(() => {
    const savedEntries = localStorage.getItem("diaryEntries");
    if (savedEntries) {
      const parsedEntries = JSON.parse(savedEntries).map((entry: any) => ({
        ...entry,
        date: new Date(entry.date),
        createdAt: new Date(entry.createdAt),
      }));
      setEntries(parsedEntries);
    }
  }, []);

  // Save entries to local storage
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem("diaryEntries", JSON.stringify(entries));
    }
  }, [entries]);

  const addEntry = () => {
    if (newEntry.trim() === "") return;

    const entry: DiaryEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      content: newEntry,
      mood: selectedMood,
      createdAt: new Date(),
    };

    setEntries((prevEntries) => [entry, ...prevEntries]);
    setNewEntry("");
    setSelectedMood("neutral");
    
    toast({
      title: "Entry added",
      description: "Your diary entry has been saved.",
    });
  };

  const updateEntry = (id: string) => {
    if (newEntry.trim() === "") return;

    setEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === id
          ? { ...entry, content: newEntry, mood: selectedMood, date: selectedDate }
          : entry
      )
    );

    setEditingEntry(null);
    setNewEntry("");
    setSelectedMood("neutral");
    setSelectedDate(new Date());

    toast({
      title: "Entry updated",
      description: "Your diary entry has been updated.",
    });
  };

  const deleteEntry = (id: string) => {
    setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
    
    toast({
      title: "Entry deleted",
      description: "Your diary entry has been deleted.",
    });
  };

  const startEditing = (entry: DiaryEntry) => {
    setEditingEntry(entry.id);
    setNewEntry(entry.content);
    setSelectedMood(entry.mood);
    setSelectedDate(new Date(entry.date));
  };

  const cancelEditing = () => {
    setEditingEntry(null);
    setNewEntry("");
    setSelectedMood("neutral");
    setSelectedDate(new Date());
  };

  return (
    <div className="space-y-6">
      <Card className="border-mindful-100">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-mindful-800">
            {editingEntry ? "Edit Entry" : "New Entry"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-mindful-200"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <p className="text-sm font-medium">How are you feeling today?</p>
              </div>
              <div className="flex justify-between">
                {(Object.keys(moodEmojis) as Array<keyof typeof moodEmojis>).map((mood) => (
                  <Button
                    key={mood}
                    variant="ghost"
                    className={`text-2xl ${
                      selectedMood === mood ? "bg-mindful-100" : ""
                    }`}
                    onClick={() => setSelectedMood(mood)}
                  >
                    {moodEmojis[mood]}
                  </Button>
                ))}
              </div>
            </div>

            <Textarea
              placeholder="Write about your day, thoughts, or feelings..."
              className="min-h-[150px] focus-visible:ring-mindful-500"
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {editingEntry ? (
            <>
              <Button variant="ghost" onClick={cancelEditing}>
                Cancel
              </Button>
              <Button 
                className="bg-mindful-600 hover:bg-mindful-700"
                onClick={() => updateEntry(editingEntry)}
              >
                Update Entry
              </Button>
            </>
          ) : (
            <Button 
              className="w-full bg-mindful-600 hover:bg-mindful-700"
              onClick={addEntry}
              disabled={newEntry.trim() === ""}
            >
              Save Entry
            </Button>
          )}
        </CardFooter>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-mindful-800">Your Entries</h2>
        {entries.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No entries yet. Start journaling to track your mental well-being.
          </p>
        ) : (
          entries
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((entry) => (
              <Card key={entry.id} className="border-mindful-100">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <span className="mr-2 text-xl">
                        {moodEmojis[entry.mood]}
                      </span>
                      {format(new Date(entry.date), "PPP")}
                    </CardTitle>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => startEditing(entry)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteEntry(entry.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{entry.content}</p>
                </CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  );
}
