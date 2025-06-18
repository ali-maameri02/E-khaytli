import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ContactList from "./ContactList"; // Reuse same contact list
import MessageItem from "./MessageItem";
import {  Textarea } from "@/components/ui/textarea";

// Import API functions
import {
  fetchAllClients,
  sendMessageToClient,
  fetchclientChatHistory,
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

export default function TailorChatComponent() {
  const userData = getUserData();
  // const currentUserRole = userData?.role ?? null;

  // const userId = userData?.userId ?? null; // Could be clientId or tailorId
  const tailorId = userData?.tailorId ?? null;
  const [currentClientId, setCurrentClientId] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const [chatThreads, setChatThreads] = useState<ChatThreadState>({});

  // Load clients that this tailor has messaged before
  useEffect(() => {
    const loadClientsWithChats = async () => {
      // if (!tailorId) return;

      try {
        const allClients = await fetchAllClients(); 
        console.log(allClients)// Fetch all clients
        const filteredClients: Client[] = [];

        for (const client of allClients) {
          const result = await fetchclientChatHistory(client.id.toString(), tailorId); // Get chat between this client and current tailor
         console.log(result)
          if (result.messages.length > 0) {
            const lastMsg = result.messages[result.messages.length - 1]?.message || "No messages";
            const fullName = `${client.firstName || ""} ${client.lastName || ""}`.trim() || "Unknown Client";

            filteredClients.push({
              id: client.id,
              name: fullName,
              firstName: client.firstName || "",
              lastName: client.lastName || "",
              lastMessage: lastMsg,
              unread: 0
            });
          }
        }

        setClients(filteredClients);
      } catch (error) {
        console.error("Failed to load clients with chats:", error);
      }
    };

    loadClientsWithChats();
  }, [tailorId]);

  // Load selected chat thread
  useEffect(() => {
    if (!currentClientId || !tailorId) return;

    const pollChat = async () => {
      try {
        const result = await fetchclientChatHistory(currentClientId, tailorId);

        const existingThread = chatThreads[currentClientId];

        // Map messages using senderId
        const mappedMessages = result.messages.map((msg) => ({
          id: msg.id,
          text: msg.message,
          sentAt: msg.sentAt,
          sender: msg.senderId === currentClientId ? ("client" as const) : ("tailor" as const)
        }));

        // Only update state if new messages are present
        if (
          existingThread &&
          existingThread.messages.some(m => !mappedMessages.some(msg => msg.id === m.id))
        ) {
          setChatThreads((prev) => ({
            ...prev,
            [currentClientId]: {
              clientName: `${result.clientFirstName} ${result.clientLastName}`,
              tailorName: `${result.tailorFirstName} ${result.tailorLastName}`,
              clientId: result.clientId,
              tailorId: result.tailorId,
              messages: [...mappedMessages]
            }
          }));
        }
      } catch (error) {
        console.error("Failed to poll chat:", error);
      }
    };

    const interval = setInterval(pollChat, 2000);
    return () => clearInterval(interval);
  }, [currentClientId, tailorId]);

  // Handle sending message
  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sentAt: new Date().toISOString(),
      sender: "tailor" as const
    };

    // Optimistically update UI
    setChatThreads((prev) => {
      const currentThread = prev[currentClientId!] || {
        clientName: "Unknown",
        tailorName: "Unknown",
        clientId: "unknown_client",
        tailorId: "unknown_tailor",
        messages: []
      };

      return {
        ...prev,
        [currentClientId!]: {
          ...currentThread,
          messages: [...currentThread.messages, newMessage]
        }
      };
    });

    try {
      await sendMessageToClient(tailorId!, currentClientId!, inputValue);
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
  }, [chatThreads, currentClientId]);

  return (
    <Card className="h-[90vh] flex flex-row overflow-hidden bg-white shadow-md border-0">
      {/* Left Side - Contact List */}
      <div className="w-72 border-r hidden md:block">
        <ContactList onSelectClient={setCurrentClientId} clients={clients} />
      </div>

      {/* Right Side - Chat Area */}
      <div className="flex-1 flex flex-col">
        <CardContent className="p-0 flex-1 flex flex-col h-full">
          {/* Chat Messages */}
          <ScrollArea ref={scrollRef} className="flex-1 p-4 space-y-4">
            {(chatThreads[currentClientId!]?.messages || []).map((msg) => (
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
          </ScrollArea>

          {/* Message Input Area */}
          <div className="p-4 border-t">
            <div className="flex flex-col gap-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={currentClientId ? "Type your message..." : "Select a client to start chatting"}
                rows={2}
                disabled={!currentClientId}
                className={`border rounded-md ${
                  !currentClientId ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
              <Button onClick={handleSend} disabled={!currentClientId} className="ml-auto">
                <Send className="w-4 h-4 mr-1" /> Send
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}