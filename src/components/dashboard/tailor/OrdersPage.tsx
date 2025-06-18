// pages/Orders.tsx
import { useState, useEffect } from "react";
import { getUserData } from "@/lib/api"; // ⬅️ Importer getUserData
import { fetchOrdersByTailor } from "@/lib/api";
import { DataTable } from "../../data-table";
import { ApiOrder } from "@/types";

export default function Orders() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      const userData = getUserData(); // Récupère les données utilisateur depuis localStorage

      if (!userData || !userData.tailorId) {
        console.error("Aucun tailorId trouvé dans les données utilisateur");
        setOrders([]);
        setIsLoading(false);
        return;
      }

      const { tailorId } = userData;

      try {
        const fetchedOrders = await fetchOrdersByTailor(tailorId);
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Échec du chargement des commandes", error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []); // ⬅️ Pas besoin de dépendance, on charge une fois

  if (isLoading) {
    return <div>Chargement des commandes...</div>;
  }

  return (
    <div className="p-6 mt-20 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Commandes du couturier</h1>
      <DataTable data={orders} />
    </div>
  );
}