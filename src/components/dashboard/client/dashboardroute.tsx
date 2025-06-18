// src/routes/DashboardRoutes.tsx

import React from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "./Layout";
import Chat from "./Chat";
import Client from "./client";
import OrdersPage from "./OrdersPage";
import OrderTracking from "./OrderTracking";

const DashboardRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Client />} />
        <Route path="/chat" element={<Chat />} />

        {/* Orders Page */}
        <Route path="/orders" element={<OrdersPage />}>
          <Route index element={<p>Sélectionnez une commande pour afficher les détails</p>} />
          <Route path=":orderId" element={<OrderTracking />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default DashboardRoutes;