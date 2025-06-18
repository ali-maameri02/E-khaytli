// components/Sidebar.tsx
import { Link, useNavigate } from "react-router-dom";
import { Home , Scissors, Package, Settings, LogOutIcon } from "lucide-react";
import { motion } from "framer-motion";
import logo from "../../../assets/logo_khaytli-removebg-preview.png";
// import { clearAuthData } from "@/lib/api";

// Liste des éléments du menu de la barre latérale
const menuItems = [
  { titre: "Tableau de bord", icone: Home, chemin: "/dashboard/client" },
  { titre: "Chat", icone: Scissors, chemin: "/dashboard/client/chat" },
  { titre: "Mes Commandes", icone: Package, chemin: "/dashboard/client/orders" },
  { titre: "Paramètres", icone: Settings, chemin: "/dashboard/client/settings" },
];

export function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload(); // Ensure UI updates immediately
  };
  return (
    <div className="w-64 bg-white border-0 shadow-md z-20 h-[100vh] p-4 fixed">
      {/* En-tête avec logo et nom de l'application */}
      <h2 className="text-xl font-bold mb-6 flex flex-col justify-center items-center gap-2 w-full p-0">
        <a href="/">
        <div className="logo shadow-sm text-center flex justify-center items-center rounded-full">
          <img src={logo} width={100} alt="" className="ml-2" />
          
        </div></a>
        <span>E-khaytli</span>
      </h2>

      {/* Menu de navigation */}
      <nav className="space-y-1">
        {menuItems.map((item, index) => (
          <motion.div key={index} whileHover={{ scale: 1.03 }} transition={{ type: "spring" }}>
            <Link
              to={item.chemin}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <item.icone className="w-5 h-5" />
              <span>{item.titre}</span>
            </Link>
          </motion.div>
        ))}
         <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring" }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-gray-700 hover:bg-red-50 hover:text-red-600 cursor-pointer mt-6"
          >
            <LogOutIcon className="w-5 h-5" />
            <span>Se déconnecter</span>
          </button>
        </motion.div>
      </nav>
    </div>
  );
}


