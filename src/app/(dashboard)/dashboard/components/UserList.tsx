// src/components/UserManagement/UserList.tsx
import React from 'react';
import { User } from '@/types/user';

interface UserListProps {
  users: User[];
  onUserClick: (user: User) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const UserList: React.FC<UserListProps> = ({
  users,
  onUserClick,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.$id} onClick={() => onUserClick(user)} className="cursor-pointer hover:bg-gray-100">
              <td className="border p-2">{user.$id}</td>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.status ? 'Active' : 'Inactive'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="mx-1 px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="mx-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="mx-1 px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserList;