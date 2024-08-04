import Sidebar from './components/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* <Sidebar /> */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
        {children}
      </main>
    </div>
  )
}