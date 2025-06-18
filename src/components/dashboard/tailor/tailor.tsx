import { motion } from "framer-motion";
import { SectionCards } from "../../section-cards";
import { ChartAreaInteractive } from "../../chart-area-interactive";
// import { DataTable } from "../../data-table";
import { useEffect, useState } from "react";

// API
// import {  fetchOrdersByTailor,  } from "@/lib/api";

// Types
type Statut = "En attente" | "Terminée" | "En cours";

interface Order {
  id: string;
  client: string;
  date: string;
  statut: Statut;
}

export default function Tailor() {
  const [, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // // Fonction pour mapper ApiOrder vers Order
  // const mapApiOrderToOrder = (apiOrder: ApiOrder): Order => ({
  //   id: apiOrder.id,
  //   client: `${apiOrder.clientUser.firstName} ${apiOrder.clientUser.lastName}`,
  //   date: new Date(apiOrder.orderDate).toLocaleDateString(),
  //   statut: mapStatutToApiFormat(apiOrder.status),
  // });

  // Charger les 3 dernières commandes
  useEffect(() => {
    const loadRecentOrders = async () => {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const tailorId = userData?.tailorId;

      if (!tailorId) {
        console.warn("Aucun ID de couturier trouvé.");
        setIsLoading(false);
        return;
      }

      try {
        // const allOrders = await fetchOrdersByTailor(tailorId);

        // Tri par date descendante et prend les 3 dernières commandes
        // const sortedOrders = [...allOrders]
        //   .sort((a, b) => {
        //     const dateA = new Date(a.orderDate).getTime();
        //     const dateB = new Date(b.orderDate).getTime();
        //     return dateB - dateA; // Descendant
        //   })
        //   .slice(0, 3);

        // Mapper ApiOrder vers Order
        // const recentOrdersMapped = sortedOrders.map(mapApiOrderToOrder);

        // setRecentOrders(recentOrdersMapped);
      } catch (error) {
        console.error("Échec de la récupération des commandes:", error);
        setRecentOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecentOrders();
  }, []);

  if (isLoading) {
    return <div>Chargement des dernières commandes...</div>;
  }

  return (
    <>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6"
      >
        Bienvenue, Couturier
      </motion.h1>

      <SectionCards />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8"
      >
        <ChartAreaInteractive />
      </motion.div>

      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        <h2 className="text-xl font-semibold mb-4">Dernières Commandes</h2>
        {recentOrders.length > 0 ? (
          <DataTable data={recentOrders} />
        ) : (
          <p className="text-gray-500 italic">Aucune commande trouvée.</p>
        )}
      </motion.div> */}
    </>
  );
}