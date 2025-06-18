// components/Header.tsx
import { Search, Bell, User } from "lucide-react"
// import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { motion } from "framer-motion"

export function Header() {
  return (
    <header className="bg-white border-0 shadow-md sticky top-0 z-10 px-6 py-3 flex justify-between items-center">
      <h2 className="text-xl font-semibold">Tailor Dashboard</h2>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <input placeholder="Search..." className="pl-8 pr-4 py-1 border rounded-md w-60" />
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <User className="w-5 h-5 text-gray-600" />
        </button>
        <Avatar>
          <AvatarFallback>T</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}