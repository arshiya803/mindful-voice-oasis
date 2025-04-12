
import { User, Bot } from "lucide-react";
import { Message } from "@/types/chat";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
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
  );
}
