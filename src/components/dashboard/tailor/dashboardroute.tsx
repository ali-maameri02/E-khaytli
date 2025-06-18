import React from "react";
import { Routes, Route, } from "react-router-dom";
import Tailor from "./tailor";
import { Layout } from "./Layout";
import Portfolio from "./Portfolio";
import Orders from "./OrdersPage";
import Chat from "./Chat";



const DashboardRoutes: React.FC = () => {
 return(
    // <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Tailor />} />
        {/* <Route path="/dashboard" element={<Tailor />} /> */}
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/chat" element={<Chat />} />
        {/* 

        <Route path="/settings" element={<SettingsPage />} /> */}
      </Route>
    </Routes>
//   </BrowserRouter>
 )

}
export default DashboardRoutes