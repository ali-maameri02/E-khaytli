// components/OrderDetailsModal.tsx
import React from "react";
import { ApiOrder } from "@/types";

interface OrderDetailsModalProps {
  order: ApiOrder | null;
  onClose: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-800">Détails de la commande #{order.id}</h2>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-2">Client</h3>
              <p className="text-gray-800">{order.clientUser.firstName} {order.clientUser.lastName}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-2">Email</h3>
              <p className="text-gray-800">{order.clientUser.emailAddress}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-2">Date de commande</h3>
              <p className="text-gray-800">{new Date(order.orderDate).toLocaleDateString()}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-2">Statut</h3>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                order.status === "Completed" 
                  ? "bg-green-100 text-green-800" 
                  : order.status === "Processing" || order.status === "InProcess"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }`}>
                {order.status}
              </span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm md:col-span-2">
              <h3 className="font-semibold text-gray-700 mb-2">Adresse de livraison</h3>
              <p className="text-gray-800">{order.deliveryAddress || "Non spécifiée"}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm md:col-span-2">
              <h3 className="font-semibold text-gray-700 mb-2">Notes</h3>
              <p className="text-gray-800 italic">{order.notes || "Aucune note"}</p>
            </div>
          </div>

          {/* Product Measurements Table */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Mesures des produits</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Produit ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Chest</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Waist</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Hip</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Sleeve</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Inseam</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Height</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.productMeasurements.map((pm, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-4 py-3 text-sm text-gray-800">{pm.productId}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{pm.chest}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{pm.waist}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{pm.hip}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{pm.sleeveLength}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{pm.inseam}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{pm.height}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{pm.notes ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};