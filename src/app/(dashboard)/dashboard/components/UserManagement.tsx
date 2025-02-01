// app/dashboard/user-management/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { FaUsers, FaUserPlus, FaSearch } from 'react-icons/fa';
import UserList from './UserList';
import CreateUserModal from './CreateUserModal';
import { User } from '@/types/user';
import { fetchUserByEmail, createUser } from '@/lib/api/users';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const USERS_PER_PAGE = 20;

interface UsersResponse {
  documents: User[];
  total: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchEmail, setSearchEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fetchUsers = async (page: number) => {
    const response = await axios.get<UsersResponse>(`/api/users`, {
      params: {
        page,
        limit: USERS_PER_PAGE
      }
    });
    return response.data;
  };

  const loadUsers = async (page: number = currentPage) => {
    try {
      setIsLoading(true);
      const data = await fetchUsers(page);
      setUsers(data.documents);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(currentPage);
  }, [currentPage]);

  const handleUserClick = (user: User) => {
    router.push(`/dashboard/user-management/${user.$id}`);
  };

  const handleCreateUser = async (userData: Partial<User>) => {
    await createUser(userData);
    // Reset to first page and reload to show the newly created user
    setCurrentPage(1);
    loadUsers(1);
    setIsCreateModalOpen(false);
  };

  const handleSearchUser = async () => {
    if (searchEmail) {
      try {
        setIsLoading(true);
        const response = await axios.get<UsersResponse>('/api/users', {
          params: { email: searchEmail }
        });
        
        if (response.data.documents && response.data.documents.length > 0) {
          router.push(`/dashboard/user-management/${response.data.documents[0].$id}`);
        } else {
          alert('User not found');
        }
      } catch (error) {
        console.error('Error searching user:', error);
        alert('Error searching user');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="p-4 bg-yellow-50">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <div className="mb-4 flex space-x-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
          onClick={() => loadUsers(1)}
          disabled={isLoading}
        >
          <FaUsers className="mr-2" /> List Users
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
          onClick={() => setIsCreateModalOpen(true)}
          disabled={isLoading}
        >
          <FaUserPlus className="mr-2" /> Create User
        </button>
        <div className="flex">
          <input
            type="email"
            placeholder="Search by email"
            className="border rounded-l px-2 py-1"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            disabled={isLoading}
          />
          <button
            className="bg-gray-300 px-4 py-2 rounded-r flex items-center"
            onClick={handleSearchUser}
            disabled={isLoading}
          >
            <FaSearch />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="text-lg">Loading...</div>
        </div>
      ) : (
        <UserList
          users={users || []}
          onUserClick={handleUserClick}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateUser={handleCreateUser}
      />
    </div>
  );
};

export default UserManagement;