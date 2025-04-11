
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, MicOff, Send, User, Bot } from "lucide-react";
import { useToast } from "@/components/ui/toast";

type Message = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
};

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Speech recognition setup
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
          
        setInput(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        toast({
          title: "Voice recognition error",
          description: "There was a problem with the voice recognition. Please try again.",
          variant: "destructive",
        });
      };
    }
    
    // Add welcome message
    setMessages([
      {
        id: "welcome",
        content: "Hello! I'm your mental health support assistant. How are you feeling today?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);

  useEffect(() => {
    // Scroll to latest message
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Speech recognition not supported",
        description: "Your browser doesn't support speech recognition. Please type your message instead.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      setInput("");
    }
  };

  const sendMessage = async () => {
    if (input.trim() === "" || isProcessing) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);

    // Stop listening if active
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    try {
      // Simulate API call to backend NLP service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simple response logic (to be replaced with actual backend call)
      let response = getSimpleResponse(userMessage.content);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Text-to-speech for bot response
      if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance(response);
        speech.rate = 1;
        speech.pitch = 1;
        speech.volume = 1;
        window.speechSynthesis.speak(speech);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Simple response logic to simulate NLP
  const getSimpleResponse = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("sad") || lowerMessage.includes("depressed") || lowerMessage.includes("unhappy")) {
      return "I'm sorry to hear you're feeling down. Remember that it's okay to not be okay sometimes. Would you like to talk about what's been bothering you?";
    } else if (lowerMessage.includes("anxious") || lowerMessage.includes("worried") || lowerMessage.includes("stress")) {
      return "Anxiety can be really challenging. Let's take a deep breath together. In for 4 counts, hold for 4, and out for 4. How do you feel now?";
    } else if (lowerMessage.includes("happy") || lowerMessage.includes("good") || lowerMessage.includes("great")) {
      return "I'm glad to hear you're doing well! It's important to acknowledge positive emotions too. What's something that contributed to your good mood today?";
    } else if (lowerMessage.includes("tired") || lowerMessage.includes("exhausted") || lowerMessage.includes("sleep")) {
      return "Rest is so important for mental health. Have you been having trouble sleeping lately? Sometimes establishing a calming bedtime routine can help.";
    } else if (lowerMessage.includes("thank")) {
      return "You're very welcome. I'm here to support you anytime you need to talk.";
    } else if (lowerMessage.includes("bye") || lowerMessage.includes("goodbye")) {
      return "Take care! Remember, I'm here whenever you need someone to talk to.";
    } else if (lowerMessage.includes("help")) {
      return "I'm here to help. You can talk to me about how you're feeling, ask for coping strategies, or just chat. What would be most helpful right now?";
    } else {
      return "Thank you for sharing that with me. How does talking about this make you feel?";
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto px-4 pb-4">
      <div className="flex-1 min-h-0">
        <ScrollArea ref={scrollAreaRef} className="h-full pr-4">
          <div className="space-y-4 pt-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                } animate-in-custom`}
              >
                <div className="flex items-start max-w-[80%]">
                  {message.sender === "bot" && (
                    <div className="mt-1 mr-2">
                      <div className="bg-mindful-200 rounded-full p-1.5">
                        <Bot size={18} className="text-mindful-700" />
                      </div>
                    </div>
                  )}
                  <div
                    className={
                      message.sender === "user"
                        ? "chat-bubble-user"
                        : "chat-bubble-bot"
                    }
                  >
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                  {message.sender === "user" && (
                    <div className="mt-1 ml-2">
                      <div className="bg-primary rounded-full p-1.5">
                        <User size={18} className="text-primary-foreground" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="chat-bubble-bot">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-mindful-400 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-mindful-400 animate-pulse delay-150"></div>
                    <div className="w-2 h-2 rounded-full bg-mindful-400 animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      
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
    </div>
  );
}
