import { cn } from "@/lib/utils";

interface Message {
  id: number;
  senderId: number;
  content: string;
  timestamp: string;
}

interface ChatMessageProps {
  message: Message;
  isOwn: boolean;
}

const ChatMessage = ({ message, isOwn }: ChatMessageProps) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[70%] rounded-lg px-4 py-2",
          isOwn
            ? "bg-chat-bubble-user text-primary-foreground"
            : "bg-chat-bubble-other text-foreground"
        )}
      >
        <p className="break-words">{message.content}</p>
        <p className="text-xs opacity-70 mt-1">{formatTime(message.timestamp)}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
