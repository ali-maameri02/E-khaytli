import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Paperclip } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ContactList from "./ContactList";
import MessageItem from "./MessageItem";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Import API functions
import {
  fetchAllTailors,
  sendMessageToTailor,
  fetchChatHistory,
  getUserData
} from "@/lib/api";

type Sender = "client" | "tailor";

interface Message {
  id: string;
  text: string;
  sentAt: string;
  sender: Sender;
}

interface ChatThread {
  clientName: string;
  tailorName: string;
  clientId: string;
  tailorId: string;
  messages: Message[];
}

type ChatThreadState = Record<string, ChatThread>;

interface Client {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  lastMessage: string;
  unread?: number;
}

export default function ChatComponent() {
  const userData = getUserData();
  // const currentUserRole = userData?.role ?? null;

  // const userId = userData?.userId ?? null; // Could be clientId or tailorId
  const clientId = userData?.clientId ?? null;
  // const tailorId = userData?.tailorId ?? null;

  const [currentPartnerId, setCurrentPartnerId] = useState<string | null>(null);
  const [tailors, setTailors] = useState<Client[]>([]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const [chatThreads, setChatThreads] = useState<ChatThreadState>({});

  // Load tailors that this client has messaged before
  useEffect(() => {
    const loadTailorsWithChats = async () => {
      // if (!clientId) return;

      try {
        const allTailors = await fetchAllTailors();

        const filteredTailors: Client[] = [];

        for (const tailor of allTailors) {
          const result = await fetchChatHistory(clientId, tailor.id.toString());

          if (result.messages.length > 0) {
            const lastMsg = result.messages[result.messages.length - 1]?.message || "No messages";

            // Safely handle missing names
            const fullName = `${tailor.user.firstName || ""} ${tailor.user.lastName || ""}`.trim() || "Unknown Tailor";

            filteredTailors.push({
              id: String(tailor.id), // Ensure id is a string
              name: fullName,
              firstName: tailor.firstName || "",
              lastName: tailor.lastName || "",
              lastMessage: lastMsg,
              unread: 0
            });
          }
        }

        setTailors(filteredTailors);
      } catch (error) {
        console.error("Failed to load tailors with chats:", error);
      }
    };

    loadTailorsWithChats();
  }, [clientId]);

  // Load selected chat thread
  useEffect(() => {
    if (!currentPartnerId || !clientId) return;
  
    const pollChat = async () => {
      try {
        const result = await fetchChatHistory(clientId, currentPartnerId);
  
        setChatThreads((prev) => {
          const existingThread = prev[currentPartnerId];
          if (!existingThread) return prev;
  
          // Filter out already loaded messages
          const newMessages = result.messages.filter(
            (msg) =>
              !existingThread.messages.some((m) => m.id === msg.id)
          );
  
          if (newMessages.length === 0) return prev;
  
          // Map new messages using senderId
          const mappedNewMessages = newMessages.map((msg) => {
            const isClientMessage = msg.senderId === result.clientId;
  
            return {
              id: msg.id,
              text: msg.message,
              sentAt: msg.sentAt,
              sender: isClientMessage ? ("client" as const) : ("tailor" as const)
            };
          });
  
          return {
            ...prev,
            [currentPartnerId]: {
              ...existingThread,
              messages: [...existingThread.messages, ...mappedNewMessages]
            }
          };
        });
      } catch (error) {
        console.error("Failed to poll chat:", error);
      }
    };
  
    const interval = setInterval(pollChat, 2000); // Poll every 2s
    return () => clearInterval(interval); // Cleanup
  }, [currentPartnerId, clientId]);
  // Handle sending message
  const handleSend = async () => {
    if (!inputValue.trim()) return;
  
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sentAt: new Date().toISOString(),
      sender: "client" as const
    };
  
    setChatThreads((prev) => ({
      ...prev,
      [currentPartnerId!]: {
        ...(prev[currentPartnerId!] || {
          clientName: "Unknown",
          tailorName: "Unknown",
          clientId: "unknown_client",
          tailorId: "unknown_tailor",
          messages: []
        }),
        messages: [...(prev[currentPartnerId!]?.messages || []), newMessage]
      }
    }));
  
    try {
      await sendMessageToTailor(clientId!, currentPartnerId!, inputValue);
    } catch (error) {
      alert("Échec de l'envoi du message.");
    }
  
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatThreads, currentPartnerId]);

  return (
    <Card className=" flex flex-row  bg-white shadow-md border-0">
      {/* Left Side - Contact List */}
      <div className="w-72 border-r hidden md:block">
        <ContactList onSelectClient={setCurrentPartnerId} clients={tailors} />
      </div>
  
      {/* Right Side - Chat Area */}
      <div className="flex-1 flex flex-col">
        <CardContent className="p-0 flex-1 flex flex-col h-full">
          {/* Chat Messages */}
          <ScrollArea ref={scrollRef} className="flex-1 p-4 space-y-4 h-[90vh] overflow-scroll">
            {(chatThreads[currentPartnerId!]?.messages || []).map((msg) => (
              <MessageItem
                key={msg.id}
                sender={msg.sender}
                text={msg.text}
                timestamp={new Date(msg.sentAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              />
            ))}
               <div className=" p-4 border-t">
            <div className="flex flex-col gap-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  currentPartnerId ? "Type your message..." : "Select a contact to start chatting"
                }
                rows={2}
                disabled={!currentPartnerId}
                className={`
                  w-full p-2 rounded-md border
                  ${!currentPartnerId ? "bg-gray-100 cursor-not-allowed" : ""}
                `}
              />
              <div className="flex items-center  gap-2">
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Paperclip className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                </Label>
                <Input id="file-upload" type="file" className="hidden" />
                <Button
                  onClick={handleSend}
                  className="ml-auto"
                  disabled={!currentPartnerId}
                >
                  <Send className="w-4 h-4 mr-1" /> Send
                </Button>
              </div>
            </div>
          </div>
          </ScrollArea>
  
          {/* Message Input Area */}
       
        </CardContent>
      </div>
    </Card>
  );
}