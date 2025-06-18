import React, { useRef, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import logokhaytli from "../../assets/logo_khaytli-removebg-preview.png";
import { getAuthToken, getUserId, clearAuthData } from "@/lib/api";
import { useClickOutside } from "@/hooks/useClickOutside"; // Adjust path accordingly
const Navbar = () => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const token = getAuthToken();
  const userId = getUserId();
  useClickOutside(dropdownRef, () => {
    if (dropdownOpen) {
      setDropdownOpen(false);
    }
  });
  const [userData, setUserData] = useState<{
    role:string,
    firstName: string;
    lastName: string;
    profilePictureURL: string | null;
  } | null>(null);

  // Fetch user data when component mounts and token exists
  React.useEffect(() => {
    const fetchUserData = async () => {
      if (!userId || !token) return;

      try {
        const response = await fetch(`http://e-khayetli.runasp.net/api/Users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData({
            role:data.role,
            firstName: data.firstName,
            lastName: data.lastName,
            profilePictureURL: data.profilePictureURL,
          });
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId, token]);

  const handleLogout = () => {
    clearAuthData();
    navigate("/");
    window.location.reload(); // Ensure UI updates immediately
  };

  return (
    <nav className="flex fixed top-0 items-center justify-between px-6 py-1 shadow-md bg-white w-full z-[9999999]">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <img src={logokhaytli} alt="Logo" className="h-16 w-16" />
      </div>

      {/* Navigation Menu */}
      <NavigationMenu>
        <NavigationMenuList className="space-x-6">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/" className="text-gray-800 hover:text-blue-600 transition-colors">
                Accueil
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/tailors" className="text-gray-800 hover:text-blue-600 transition-colors">
                Tailors
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/categories" className="text-gray-800 hover:text-blue-600 transition-colors">
                Catégories
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/about" className="text-gray-800 hover:text-blue-600 transition-colors">
                Qui nous sommes ?
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/contact" className="text-gray-800 hover:text-blue-600 transition-colors">
                Contactez-nous
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Auth Section */}
      <div className="relative">
        {token ? (
          // Show Avatar & Dropdown
          <div className="flex items-center space-x-4">
            <span className="hidden md:block text-sm font-medium">
              {userData?.firstName} {userData?.lastName}
            </span>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 focus:outline-none"
            >
              {userData?.profilePictureURL ? (
                <img
                  src={userData.profilePictureURL}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-700 font-bold">
                  {userData?.firstName.charAt(0) || "U"}
                </div>
              )}
            </button>

            {/* Dropdown Menu */}
         {/* Dropdown Menu */}
{dropdownOpen && (
  <div ref={dropdownRef} className="absolute right-5 top-12 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-10">
   {userData && (
  <Link
    to={`/${userData.role === "Tailor" ? "dashboard/tailor" : "dashboard/client"}`}
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
    onClick={() => setDropdownOpen(false)}
  >
    Dashboard
  </Link>
)}
    <button
      onClick={handleLogout}
      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
    >
      Logout
    </button>
  </div>
)}
          </div>
        ) : (
          // Show Login Button
          <Link to="/login">
            <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-black hover:text-white transition-colors">
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;