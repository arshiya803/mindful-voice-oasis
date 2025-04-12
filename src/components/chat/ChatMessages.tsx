
import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/types/chat";
import ChatMessage from "./ChatMessage";
import LoadingMessage from "./LoadingMessage";

interface ChatMessagesProps {
  messages: Message[];
  isProcessing: boolean;
}

export default function ChatMessages({ messages, isProcessing }: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to latest message
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, isProcessing]);

  return (
    <div className="flex-1 min-h-0">
      <ScrollArea ref={scrollAreaRef} className="h-full pr-4">
        <div className="space-y-4 pt-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isProcessing && <LoadingMessage />}
        </div>
      </ScrollArea>
    </div>
  );
}
