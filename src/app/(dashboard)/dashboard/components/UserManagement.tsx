
import React, { useState, useEffect } from 'react';
import { FaUsers, FaUserPlus, FaSearch } from 'react-icons/fa';
import UserList from './UserList';
import UserDetails from './UserDetails';
import CreateUserModal from './CreateUserModal';
import { User, UserFilters as UserFiltersType } from '@/types/user';
import { fetchUsers, fetchUserByEmail, createUser } from '@/lib/api/users';
// import UserFilters from './UserFilter';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchEmail, setSearchEmail] = useState('');
  // const [filters, setFilters] = useState<UserFiltersType>({});

  /*
  const loadUsers = async () => {
    const { users, total } = await fetchUsers(currentPage, 30, filters);
    setUsers(users);
    setTotalPages(Math.ceil(total / 30));
  };
*/
const loadUsers = async () => {
  const {users, total} = await fetchUsers();
  setUsers(users);
  setSelectedUser(null)
}

  useEffect(() => {
    loadUsers();
  // }, [currentPage, filters]);
}, [currentPage]);

  const handleUserClick = (user: User) => {
    setSelectedUser(null);
    setTimeout(()=> setSelectedUser(user), 0)
  };

  const handleCreateUser = async (userData: Partial<User>) => {
    await createUser(userData);
    loadUsers();
    setIsCreateModalOpen(false);
  };

  const handleSearchUser = async () => {
    if (searchEmail) {
      const user = await fetchUserByEmail(searchEmail);
      console.log("searchedUser: ", user);
      if (user) {
        setSelectedUser(user);
      } else {
        alert('User not found');
      }
    }
  };

  const handleFilterChange = (newFilters: UserFiltersType) => {
    // setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <div className="p-4 bg-yellow-50">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <div className="mb-4 flex space-x-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
          onClick={() => loadUsers()}
        >
          <FaUsers className="mr-2" /> List Users
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
          onClick={() => setIsCreateModalOpen(true)}
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
          />
          <button
            className="bg-gray-300 px-4 py-2 rounded-r flex items-center"
            onClick={handleSearchUser}
          >
            <FaSearch />
          </button>
        </div>
      </div>
      {/* <UserFilters filters={filters} onFilterChange={handleFilterChange} /> */}
      {selectedUser ? (
        <UserDetails key={selectedUser.$id} user={selectedUser} onClose={() => setSelectedUser(null)} onUpdate={loadUsers} />
      ) : (
        <UserList
          users={users}
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