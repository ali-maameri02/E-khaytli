import { motion } from "framer-motion";

interface Props {
  sender: "client" | "tailor";
  text: string;
  timestamp?: string;
}

export default function MessageItem({ sender, text, timestamp }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${sender === "tailor" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-xs px-4 py-2 rounded-lg mb-2 ${
          sender === "tailor"
            ? "bg-indigo-600 text-white rounded-br-none"
            : "bg-gray-200 text-gray-800 rounded-bl-none"
        }`}
      >
        <p>{text}</p>
        {timestamp && (
          <span className="text-xs mt-1 text-white/70">{timestamp}</span>
        )}
      </div>
    </motion.div>
  );
}