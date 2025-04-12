
export default function LoadingMessage() {
  return (
    <div className="flex justify-start">
      <div className="chat-bubble-bot">
        <div className="flex space-x-2">
          <div className="w-2 h-2 rounded-full bg-mindful-400 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-mindful-400 animate-pulse delay-150"></div>
          <div className="w-2 h-2 rounded-full bg-mindful-400 animate-pulse delay-300"></div>
        </div>
      </div>
    </div>
  );
}
