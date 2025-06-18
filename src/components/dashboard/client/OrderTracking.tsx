import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { fetchOrdersByClient } from "@/lib/api";
import { ApiOrder } from "@/types";

export default function OrderTracking() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        const allOrders = await fetchOrdersByClient(orderId); // Fetch all client's orders
        const foundOrder = allOrders.find((o) => o.id === orderId);

        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          setError("Commande non trouvée");
        }
      } catch (err) {
        console.error("Failed to load order:", err);
        setError("Erreur lors du chargement de la commande");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <div>Chargement de la commande...</div>;
  }

  if (error || !order) {
    return <div className="text-red-500">{error || "Commande introuvable"}</div>;
  }

  // const steps = [
  //   // { label: "Commande confirmée", completed: !!order.createdAt },
  //   { label: "Prise en charge par le tailleur", completed: !!order.tailorId },
  //   { label: "En cours de confection", completed: order.status === "Completed" },
  //   // { label: "Livraison", completed: !!order.deliveredAt }
  // ];

  return (
    <div className="w-full mx-auto px-4 py-6">
      <Card className="border-0 shadow-lg bg-white w-full">
        <CardHeader>
          <CardTitle>ID de la commande : {order.id}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Order Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Statut</p>
              <p className="font-bold">{mapStatusToFrench(order.status)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Prix</p>
              {/* <p className="font-bold">{order.price || 0} €</p> */}
            </div>
            <div>
              <p className="text-sm text-gray-500">Payé</p>
              {/* <p className="font-bold">{order.isPaid ? "Oui" : "Non"}</p> */}
            </div>
            <div>
              <p className="text-sm text-gray-500">Date d'expédition estimée</p>
              {/* <p className="font-bold">{new Date(order.updatedAt).toLocaleDateString()}</p> */}
            </div>
            <div>
              <p className="text-sm text-gray-500">Tailleur</p>
              <p className="font-bold">
                {/* {order.tailorUser?.user?.firstName} {order.tailorUser?.user?.lastName} */}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Client</p>
              <p className="font-bold">
                {order.clientUser.firstName} {order.clientUser.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Adresse de livraison</p>
              <p className="font-bold">{order.deliveryAddress}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Notes</p>
              <p className="font-bold">{order.notes}</p>
            </div>
          </div>

          {/* Ordered Items */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {order.productMeasurements.map((pm, _idx) => (
              <div key={pm.productId} className="bg-white shadow rounded-lg p-4 flex items-center gap-4">
                <img
                  src={`https://i.pravatar.cc/150?img=${pm.portfolioId}`}
                  alt="Vêtement personnalisé"
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-bold">Vêtement ID: {pm.portfolioId}</p>
                  <p className="text-gray-500">
                    Poitrine: {pm.chest}, Taille: {pm.waist}, Hanche: {pm.hip}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Back Button */}
          <div className="mt-6">
            <Button asChild>
              <Link to="/dashboard/client/orders" className="flex items-center gap-2">
                <ArrowLeftIcon className="w-4 h-4" /> Retour aux commandes
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
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