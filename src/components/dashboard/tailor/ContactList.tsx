import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Client {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  lastMessage: string;
  unread?: number;
}

export default function ContactList({ onSelectClient, clients }: {
  onSelectClient: (id: string) => void;
  clients: Client[];
}) {
  return (
    <ScrollArea className="h-full p-4">
      <div className="space-y-3">
        {clients.map((client) => (
          <div
            key={client.id}
            onClick={() => onSelectClient(client.id)}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
          >
            <Avatar>
              <AvatarImage src={`https://i.pravatar.cc/150?img=${client.id}`} />
              <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {client.name && client.name.trim() !== "" ? client.name : "Client"}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {client.lastMessage || "No messages"}
              </p>
            </div>
            {client.unread && client.unread > 0 && (
              <div className="bg-indigo-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs">
                {client.unread}
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}