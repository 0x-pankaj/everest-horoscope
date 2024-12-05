// src/app/(dashboard)/layout.tsx
'use client'

import { useRoleAccess } from '@/hooks/useRoleAccess'
import Sidebar from './components/Sidebar'
import Navbar from '@/components/Navbar'
import UnauthorizedPage from '@/components/Unauthorized'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAdmin } = useRoleAccess()

  if (!isAdmin()) {
    return <UnauthorizedPage />
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}