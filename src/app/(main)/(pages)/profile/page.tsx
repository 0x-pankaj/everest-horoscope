"use client"

// types/user.ts



interface BaseUser {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  userType: UserType;
}

export interface SimpleUser extends BaseUser {
  userType: 'simple' | 'premium';
}

export interface AstroUser extends BaseUser {
  userType: 'astro';
  bio: string;
  experience: string;
  // hourlyRate: number;
  specialties: string[];
}

export interface AdminUser extends BaseUser {
  userType: 'admin';
}

export type User = SimpleUser | AstroUser | AdminUser;


// pages/profile.tsx

import { useState, useEffect } from 'react';
import { UserType } from '../../../../../types';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch user data from API
    // For now, we'll use mock data
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      photoUrl: 'https://example.com/photo.jpg',
      userType: 'astro',
      bio: 'Experienced astrologer',
      experience: '5 years',
      // hourlyRate: 50,
      specialties: ['Tarot', 'Numerology'],
    };
    setUser(mockUser);
  }, []);

  const handleUpdate = (updatedUser: User) => {
    // Update user data in the backend
    // For now, we'll just update the local state
    setUser(updatedUser);
    setIsEditing(false);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      {isEditing ? (
        <UpdateForm user={user} onUpdate={handleUpdate} onCancel={() => setIsEditing(false)} />
      ) : (
        <>
          <UserDetails user={user} />
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        </>
      )}
    </div>
  );
};

export default ProfilePage;

// components/UserDetails.tsx


interface Props {
  user: User;
}

const UserDetails: React.FC<Props> = ({ user }) => {
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <img src={user.photoUrl} alt={user.name} className="w-32 h-32 rounded-full mx-auto mb-4" />
      <h2 className="text-xl font-bold mb-2">{user.name}</h2>
      <p className="text-gray-600 mb-2">{user.email}</p>
      <p className="text-gray-600 mb-2">User Type: {user.userType}</p>
      {user.userType === 'astro' && (
        <>
          <p className="text-gray-600 mb-2">Bio: {user.bio}</p>
          <p className="text-gray-600 mb-2">Experience: {user.experience}</p>
          <p className="text-gray-600 mb-2">Hourly Rate: ${user.hourlyRate}</p>
          <p className="text-gray-600 mb-2">Specialties: {user.specialties.join(', ')}</p>
        </>
      )}
    </div>
  );
};


// components/UpdateForm.tsx

interface Props {
  user: User;
  onUpdate: (updatedUser: User) => void;
  onCancel: () => void;
}

const UpdateForm: React.FC<Props> = ({ user, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData as User);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      {formData.userType === 'astro' && (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
              Bio
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="bio"
              name="bio"
              value={(formData as any).bio}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="experience">
              Experience
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="experience"
              type="text"
              name="experience"
              value={(formData as any).experience}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hourlyRate">
              Hourly Rate
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="hourlyRate"
              type="number"
              name="hourlyRate"
              value={(formData as any).hourlyRate}
              onChange={handleChange}
            />
          </div>
        </>
      )}
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Update
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

