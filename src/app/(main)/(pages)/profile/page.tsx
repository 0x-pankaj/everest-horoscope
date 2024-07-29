"use client"

import { useAuthStore } from '@/store/Auth';
import React, { useState, useEffect } from 'react';
import { FaCamera, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';

const Profile: React.FC = () => {
  const { user, updateUser, updateProfilePicture } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  useEffect(() => {
    setEditedUser(user);
  }, [user]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditedUser(user);
  };

  const handleSave = async () => {
    await updateUser(editedUser);
    setEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await updateProfilePicture(file);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <div className="relative h-48 w-full md:w-48">
              <img
                className="h-full w-full object-cover md:h-full md:w-48"
                src={user.profilePicture || '/default-avatar.png'}
                alt={user.name}
              />
              <label htmlFor="profile-picture" className="absolute bottom-2 right-2 bg-white rounded-full p-2 cursor-pointer">
                <FaCamera className="text-gray-600" />
                <input
                  type="file"
                  id="profile-picture"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                />
              </label>
            </div>
          </div>
          <div className="p-8 w-full">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">User Profile</div>
            <form>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editing ? editedUser.name : user.name}
                    onChange={handleChange}
                    readOnly={!editing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editing ? editedUser.email : user.email}
                    onChange={handleChange}
                    readOnly={!editing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editing ? editedUser.phone : user.phone}
                    onChange={handleChange}
                    readOnly={!editing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end space-x-4">
                {!editing ? (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                  >
                    <FaEdit className="mr-2" /> Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                    >
                      <FaTimes className="mr-2" /> Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                    >
                      <FaCheck className="mr-2" /> Save Changes
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;