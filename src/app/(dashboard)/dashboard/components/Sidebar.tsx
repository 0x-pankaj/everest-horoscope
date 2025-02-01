// src/app/(dashboard)/components/Sidebar.tsx
'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { sidebarItems } from '../data/SidebarItems'

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  return (
    <aside className={`bg-gray-800 text-white ${isExpanded ? 'w-64' : 'w-20'} transition-all duration-300`}>
      <div className="p-4">
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-2xl">
          {isExpanded ? <FiChevronLeft /> : <FiChevronRight />}
        </button>
      </div>
      <nav>
        <ul>
          {sidebarItems.map((item) => (
            <li 
              key={item.name} 
              className={`p-4 hover:bg-gray-700 cursor-pointer ${
                pathname === `/dashboard/${item.path}` ? 'bg-gray-700' : ''
              }`}
              onClick={() => router.push(`/dashboard/${item.path}`)}
            >
              <div className="flex items-center">
                <item.icon className="w-6 h-6" />
                {isExpanded && <span className="ml-4">{item.name}</span>}
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}