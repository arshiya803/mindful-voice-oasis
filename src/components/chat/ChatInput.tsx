
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, Send } from "lucide-react";
import { SpeechRecognition } from "@/utils/speechRecognition";

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  isListening: boolean;
  toggleListening: () => void;
  sendMessage: () => void;
  isProcessing: boolean;
}

export default function ChatInput({
  input,
  setInput,
  isListening,
  toggleListening,
  sendMessage,
  isProcessing,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="pt-4">
      <div className="flex space-x-2">
        <Textarea
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[60px] focus-visible:ring-mindful-500"
          disabled={isProcessing}
        />
        <div className="flex flex-col space-y-2">
          <Button
            onClick={toggleListening}
            variant={isListening ? "destructive" : "outline"}
            size="icon"
            className={isListening ? "" : "border-mindful-300 hover:bg-mindful-100"}
            disabled={isProcessing}
            title={isListening ? "Stop listening" : "Start voice input"}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </Button>
          <Button
            onClick={sendMessage}
            variant="default"
            size="icon"
            className="bg-mindful-600 hover:bg-mindful-700"
            disabled={input.trim() === "" || isProcessing}
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        {isListening ? "Listening... Speak now" : "Press the mic button to use voice input"}
      </p>
    </div>
  );
}
