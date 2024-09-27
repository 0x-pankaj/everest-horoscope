// src/pages/dashboard/user-management.tsx
import React from 'react';
import UserManagement from './UserManagement';

const UserManagementPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">User Management Dashboard</h1>
      <UserManagement />
    </div>
  );
};
export default UserManagementPage;