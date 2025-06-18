import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OrderListItemProps {
  orders: MappedOrder[];
}

export interface MappedOrder {
  id: string;
  status: string;
  shippingBy: string;
  estimatedDeliveryTime: string;
  trackingNumber: string;
  items: {
    name: string;
    price: number;
    image: string;
  }[];
}

export function OrderList({ orders }: OrderListItemProps) {
  return (
    <ScrollArea className="h-[70vh]">
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{order.id}</h3>
                  <p className="text-sm text-gray-500">
                    {mapStatusToFrench(order.status)}
                  </p>
                </div>
                <Link to={`/dashboard/client/orders/${order.id}`}>
                  <button className="text-indigo-600 hover:underline">
                    Voir le suivi
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}

function mapStatusToFrench(status: string): string {
  switch (status.toLowerCase()) {
    case "pending":
      return "En attente";
    case "processing":
      return "En cours";
    case "completed":
      return "Terminée";
    default:
      return status;
  }
}