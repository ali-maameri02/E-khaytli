import { Routes, Route } from "react-router-dom";
import Home from './components/Landing/Home'
import './App.css'
import TailorsList from './components/Landing/Tailorslist';
import TailorPortfolio from './components/Landing/Pages/TailorPortfolio';
import Order from './components/Landing/Pages/Order';
import Login from './components/Landing/Pages/Login';
import DashboardRoutes from './components/dashboard/tailor/dashboardroute';
import ClientDashboardRoutes from "./components/dashboard/client/dashboardroute";
import { useEffect } from "react";
import { fetchAndSaveUserData } from "./lib/api";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
function App() {
  useEffect(() => {
    const loadUserData = async () => {
      await fetchAndSaveUserData();
    };
    loadUserData();
  }, []);
  return (
    <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/tailors" element={<TailorsList />} />
      <Route path="/tailors/:tailorId" element={<TailorPortfolio />} />
      <Route path="/order/:tailorId/:projectId" element={<Order />} />
      <Route path="/dashboard/tailor/*" element={<DashboardRoutes />} />
      <Route path="/dashboard/client/*" element={<ClientDashboardRoutes />} />


  </Routes>
  )
}

export default App
