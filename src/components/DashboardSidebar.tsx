import React from 'react';
import Link from 'next/link';
import { FaHome, FaUsers, FaStar } from 'react-icons/fa';

const Sidebar: React.FC = () => {
    const sidebarItems = [
        {
            href: "/dashboard",
            name: "Home",
            icon: <FaHome />
        },
        {
            href: "/dashboard/users",
            name: "User Management",
            icon: <FaUsers />
        },
        {
            href: "/dashboard/astrologers",
            name: "Astrologer Management",
            icon: <FaStar />
        }
    ];

    return (
        <div className="bg-gray-800 text-white w-64 fixed left-0 top-20 bottom-0 overflow-y-auto transition-all duration-300 ease-in-out">
            <div className="p-4">
                <h2 className="text-xl font-bold mb-6 pl-2">Dashboard</h2>
                <nav>
                    <ul>
                        {sidebarItems.map((item, i) => (
                            <li key={i} className="mb-2">
                                <Link href={item.href}>
                                    <span className="flex items-center py-2 px-4 hover:bg-gray-700 rounded transition-colors duration-200">
                                        <span className="mr-3">{item.icon}</span>
                                        {item.name}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;