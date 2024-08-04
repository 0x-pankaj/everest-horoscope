import { sidebarItems } from "../data/SidebarItems";


interface DashboardContentProps {
  activeComponent: string;
}

export default function DashboardContent({ activeComponent }: DashboardContentProps) {
  const ActiveComponent = sidebarItems.find(item => item.name === activeComponent)?.component

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{activeComponent}</h1>
      {ActiveComponent && <ActiveComponent />}
    </div>
  )
}