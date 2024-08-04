'use client'

import { useState } from 'react'
import { sidebarItems } from './data/SidebarItems'
import DashboardContent from './components/DashboardContent'
import Sidebar from './components/Sidebar'
import Navbar from '@/components/Navbar'

export default function DashboardPage() {
  const [activeComponent, setActiveComponent] = useState(sidebarItems[0].name)

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          <DashboardContent activeComponent={activeComponent} />
        </main>
      </div>
    </div>
  )
}