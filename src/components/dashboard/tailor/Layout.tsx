// components/Layout.tsx
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { Outlet } from "react-router-dom"

export function Layout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-16 bg-gray-50 flex-1 px-32 justify-center items-center ml-52">
          <Outlet />
        </main>
      </div>
    </div>
  )
}