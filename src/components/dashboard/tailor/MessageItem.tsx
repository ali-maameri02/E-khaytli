import { cn } from "@/lib/utils";

interface MessageItemProps {
  sender: "client" | "tailor";
  text: string;
  timestamp: string;
}

export default function MessageItem({ sender, text, timestamp }: MessageItemProps) {
  return (
    <div
      className={cn(
        "max-w-[70%] px-4 py-2 rounded-lg self-start",
        sender === "client" ? "bg-gray-200 ml-auto" : "bg-indigo-100 mr-auto"
      )}
    >
      <p>{text}</p>
      <span className="text-xs text-gray-500 block mt-1">{timestamp}</span>
    </div>
  );
}