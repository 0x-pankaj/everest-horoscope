'use client'
// app/dashboard/user-management/[userId]/page.tsx
import React, { useState, useEffect } from 'react';
import { User } from '@/types/user';
// import UserDetails from '../UserDetails';
import UserDetails from '../../components/UserDetails';
import { fetchUserById } from '@/lib/api/users';
import { useRouter } from 'next/navigation';

interface UserDetailPageProps {
  params: {
    userId: string;
  };
}

const UserDetailPage: React.FC<UserDetailPageProps> = ({ params }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchUserById(params.userId);
        setUser(userData);
      } catch (error) {
        console.error('Error loading user:', error);
        router.push('/dashboard/user-management');
      }
    };

    loadUser();
  }, [params.userId]);

  const handleClose = () => {
    router.push('/dashboard/user-management');
  };

  const handleUpdate = async () => {
    const userData = await fetchUserById(params.userId);
    setUser(userData);
  };

  if (!user) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4 bg-yellow-50">
      <UserDetails 
        user={user} 
        onClose={handleClose}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default UserDetailPage;