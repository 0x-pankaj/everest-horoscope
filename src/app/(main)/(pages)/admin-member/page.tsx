
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface AdminMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
}

// This would typically come from an API or database
const adminMembers: AdminMember[] = [
  { id: '1', name: 'John Doe', role: 'Senior Admin', imageUrl: '/admin1.jpg' },
  { id: '2', name: 'Jane Smith', role: 'Technical Admin', imageUrl: '/admin2.jpg' },
  { id: '3', name: 'Mike Johnson', role: 'Support Admin', imageUrl: '/admin3.jpg' },
  // Add more admin members as needed
];

const AdminMemberPage: React.FC = () => {
  // In a real app, you'd fetch the current user ID from your auth system
  const currentUserId = 'currentUserId';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Members</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminMembers.map((admin) => (
          <div key={admin.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <Image 
                src={admin.imageUrl} 
                alt={admin.name} 
                width={100} 
                height={100} 
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h2 className="text-xl font-semibold text-center">{admin.name}</h2>
              <p className="text-gray-600 text-center mb-4">{admin.role}</p>
              <Link 
                href={`/chat/${admin.id}/${currentUserId}`}
                className="block w-full bg-blue-500 text-white text-center py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
              >
                Chat with {admin.name}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMemberPage;