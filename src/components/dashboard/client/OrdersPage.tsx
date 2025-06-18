// src/pages/OrdersPage.tsx

import { useState, useEffect } from "react";
import { getUserData } from "@/lib/api";
import { fetchOrdersByClient } from "@/lib/api";
import { DataTable } from "../../data-table";
import { ApiOrder } from "@/types";

export default function OrdersPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      const userData = getUserData();

      if (!userData || !userData.clientId) {
        setError("Aucune donnée utilisateur trouvée.");
        setIsLoading(false);
        return;
      }

      try {
        const fetchedOrders = await fetchOrdersByClient(userData.clientId);
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Failed to load orders", err);
        setError("Échec de la récupération des commandes");
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (isLoading) {
    return <div>Chargement des commandes...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 mt-20 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Mes Commandes</h1>
      <DataTable data={orders} />
    </div>
  );
}