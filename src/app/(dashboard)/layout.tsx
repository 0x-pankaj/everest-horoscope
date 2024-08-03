import Sidebar from "@/components/DashboardSidebar"
import Navbar from "@/components/Navbar"
import React from "react"

export default function DefaultLayout({children}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <Sidebar />
        <main className="ml-64 pt-16 p-4 ">
            {children}
        </main>
        </div>
    )
}