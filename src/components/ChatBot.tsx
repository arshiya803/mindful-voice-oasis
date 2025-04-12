
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/types/chat";
import { createSpeechRecognition, SpeechRecognition, SpeechRecognitionEvent, SpeechRecognitionErrorEvent } from "@/utils/speechRecognition";
import { getSimpleResponse } from "@/utils/responseGenerator";
import ChatMessages from "./chat/ChatMessages";
import ChatInput from "./chat/ChatInput";

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  // Speech recognition setup
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    recognitionRef.current = createSpeechRecognition();
    
    if (recognitionRef.current) {
      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
          
        setInput(transcript);
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
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

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto px-4 pb-4">
      <ChatMessages messages={messages} isProcessing={isProcessing} />
      <ChatInput 
        input={input}
        setInput={setInput}
        isListening={isListening}
        toggleListening={toggleListening}
        sendMessage={sendMessage}
        isProcessing={isProcessing}
      />
    </div>
  );
}
