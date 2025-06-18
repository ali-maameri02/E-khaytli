import { useEffect, useState } from "react";
import { OrderDetailsModal } from "./dashboard/tailor/OrderDetailsModal";
import { ApiOrder, Order, Statut } from "@/types";
import { updateOrderStatus } from "@/lib/api";

type TableData = ApiOrder | Order;

interface DataTableProps {
  data: TableData[];
}

export function DataTable({ data }: DataTableProps) {
  const [tableData, setTableData] = useState<TableData[]>(data);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modifiable, setModifiable] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ApiOrder | null>(null);

  // Enable editing only on /orders page
  useEffect(() => {
    const path = window.location.pathname;
    // Only enable edition if it's the tailor's orders page
    setModifiable(path.startsWith("/dashboard/tailor/orders"));
  }, []);
  const mapStatusToFrench = (status: string): Statut => {
    switch (status) {
      case "Pending":
        return "En attente";
      case "Completed":
        return "Terminée";
      case "Processing":
      case "InProcess":
        return "En cours";
      default:
        return "En attente";
    }
  };

  const handleStatutChange = async (e: React.ChangeEvent<HTMLSelectElement>, id: string) => {
    const nouveauStatut = e.target.value as Statut;
  
    // Mettre à jour l'interface immédiatement
    setTableData((prev) =>
      prev.map((ligne) => {
        if ("status" in ligne && ligne.id === id) {
          return { ...ligne, status: nouveauStatut };
        }
        return ligne;
      })
    );
  
    console.log(`Mise à jour du statut de la commande ${id} vers:`, nouveauStatut);
  
    // Appel API
    try {
      const success = await updateOrderStatus(id, nouveauStatut);
      if (!success) {
        // Revenir à l'ancien statut en cas d'échec
        setTableData((prev) =>
          prev.map((ligne) => {
            if ("status" in ligne && ligne.id === id) {
              return { ...ligne, status: ligne.status }; // Annuler le changement
            }
            return ligne;
          })
        );
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      alert("Échec de la mise à jour du statut");
      // Rollback UI
      setTableData((prev) =>
        prev.map((ligne) => {
          if ("status" in ligne && ligne.id === id) {
            return { ...ligne, status: ligne.status };
          }
          return ligne;
        })
      );
    }
  };

  const toggleEdition = (id: string) => {
    setEditingId(editingId === id ? null : id);
  };

  const handleRowClick = (order: TableData) => {
    if ("clientUser" in order) {
      setSelectedOrder(order); // C'est un ApiOrder
    } else {
      console.warn("Impossible d'afficher les détails, données incomplètes");
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-indigo-50 to-blue-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Client</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Statut</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {tableData.map((ligne) => {
                const isApiOrder = "clientUser" in ligne;
                const isOrder = "client" in ligne;

                // Garantir qu'on a un ID valide
                const orderId = typeof ligne.id === "string" ? ligne.id : "N/A";

                // Nom du client
                let clientName = "N/A";
                if (isApiOrder) {
                  const firstName = typeof ligne.clientUser.firstName === "string" ? ligne.clientUser.firstName : "";
                  const lastName = typeof ligne.clientUser.lastName === "string" ? ligne.clientUser.lastName : "";
                  clientName = `${firstName} ${lastName}`.trim() || "N/A";
                } else if (isOrder && typeof ligne.client === "string") {
                  clientName = ligne.client || "N/A";
                }

                // Date
                let dateStr = "N/A";
                if (isApiOrder && typeof ligne.orderDate === "string") {
                  try {
                    dateStr = new Date(ligne.orderDate).toLocaleDateString();
                  } catch (e) {
                    dateStr = "Date invalide";
                  }
                } else if ("date" in ligne && typeof ligne.date === "string") {
                  dateStr = ligne.date;
                }

                // Status
                const status = typeof ligne.status === "string" ? ligne.status : "Unknown";

                return (
                  <tr
                    key={orderId}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{orderId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{clientName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{dateStr}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {editingId === orderId && modifiable ? (
                        <select
                          className={`border rounded px-3 py-1 w-full sm:w-32 text-sm focus:ring-2 focus:ring-indigo-300 ${
                            status === "Terminée"
                              ? "bg-green-50 text-green-800"
                              : status === "En cours"
                              ? "bg-yellow-50 text-yellow-800"
                              : "bg-red-50 text-red-800"
                          }`}
                          value={status}
                          onChange={(e) => handleStatutChange(e, orderId)}
                        >
                          <option value="En attente">En attente</option>
                          <option value="Terminée">Terminée</option>
                          <option value="En cours">En cours</option>
                        </select>
                      ) : (
                        <span
                          className={
                            status === "Terminée"
                              ? "inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium"
                              : status === "En cours"
                              ? "inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium"
                              : "inline-block px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium"
                          }
                        >
                          {mapStatusToFrench(status)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-2">
                      <button
                        onClick={() => handleRowClick(ligne)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Voir détails
                      </button>
                      {modifiable && (
                        <button
                          onClick={() => toggleEdition(orderId)}
                          className="text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          {editingId === orderId ? "Annuler" : "Éditer"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Affichage du modal */}
      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </>
  );
}