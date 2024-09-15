import React, { useState, useEffect } from 'react';
import { FaUser, FaTrash, FaPlus, FaEdit, FaLock, FaUnlock } from 'react-icons/fa';
import { database } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';
import { ID, Query } from 'appwrite';
import { useAuthStore } from '@/store/Auth';

interface User {
  $id: string;
  name: string;
  email: string;
  photoUrl: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  createdAt: string;
  lastLogin: string;
}

const initialUserState: Omit<User, '$id' | 'createdAt' | 'lastLogin'> = {
  name: '',
  email: '',
  photoUrl: '',
  role: 'user',
  isVerified: false,
};

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<Omit<User, '$id' | 'createdAt' | 'lastLogin'>>(initialUserState);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const {user} = useAuthStore();

    console.log("user: ", user)
    console.log("user pref: ", user?.prefs)

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await database.listDocuments(
                conf.appwriteHoroscopeDatabaseId,
                conf.appwriteTeamMemberCollectionId,
                [Query.orderDesc('$createdAt')]
            );
            setUsers(response.documents as unknown as User[]);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log("handle submit")
            // if (isEditing) {
            //     await database.updateDocument(
            //         conf.appwriteHoroscopeDatabaseId,
            //         currentUser.email,
            //         currentUser
            //     );
            // } else {
            //     await database.createDocument(
            //         conf.appwriteUsersDatabaseId,
            //         conf.appwriteUsersCollectionId,
            //         ID.unique(),
            //         {
            //             ...currentUser,
            //             createdAt: new Date().toISOString(),
            //             lastLogin: new Date().toISOString(),
            //         }
            //     );
            // }
            // setIsModalOpen(false);
            // setCurrentUser(initialUserState);
            // setIsEditing(false);
            // fetchUsers();
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    const deleteUser = async (id: string) => {
        try {
            console.log("deleted user")
            // await database.deleteDocument(
            //     conf.appwriteUsersDatabaseId,
            //     conf.appwriteUsersCollectionId,
            //     id
            // );
            // fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const editUser = (user: User) => {
        setCurrentUser(user);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const toggleUserVerification = async (user: User) => {
        try {
            console.log("togle verified")
            // await database.updateDocument(
            //     conf.appwriteUsersDatabaseId,
            //     conf.a,
            //     user.$id,
            //     { isVerified: !user.isVerified }
            // );
            // fetchUsers();
        } catch (error) {
            console.error('Error toggling user verification:', error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">User Management</h1>
            
            <div className="mb-4 text-right">
                <button
                    onClick={() => {
                        setCurrentUser(initialUserState);
                        setIsEditing(false);
                        setIsModalOpen(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                >
                    <FaPlus className="mr-2" />
                    Add New User
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user) => (
                    <div key={user.$id} className="bg-white shadow-lg rounded-lg p-6">
                        <div className="flex items-center mb-4">
                            <img src={user.photoUrl} alt={user.name} className="w-16 h-16 rounded-full mr-4" />
                            <div>
                                <h2 className="text-xl font-semibold">{user.name}</h2>
                                <p className="text-gray-600">{user.email}</p>
                            </div>
                        </div>
                        <p className="text-gray-700 mb-2">Role: {user.role}</p>
                        <p className="text-gray-700 mb-2">Verified: {user.isVerified ? 'Yes' : 'No'}</p>
                        <p className="text-gray-700 mb-2">Created: {new Date(user.createdAt).toLocaleDateString()}</p>
                        <p className="text-gray-700 mb-4">Last Login: {new Date(user.lastLogin).toLocaleDateString()}</p>
                        <div className="flex justify-between">
                            <button
                                onClick={() => editUser(user)}
                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                            >
                                <FaEdit className="mr-2" />
                                Edit
                            </button>
                            <button
                                onClick={() => toggleUserVerification(user)}
                                className={`${user.isVerified ? 'bg-red-500 hover:bg-red-700' : 'bg-green-500 hover:bg-green-700'} text-white font-bold py-2 px-4 rounded inline-flex items-center`}
                            >
                                {user.isVerified ? <FaLock className="mr-2" /> : <FaUnlock className="mr-2" />}
                                {user.isVerified ? 'Unverify' : 'Verify'}
                            </button>
                            <button
                                onClick={() => deleteUser(user.$id)}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                            >
                                <FaTrash className="mr-2" />
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <h3 className="text-lg font-semibold mb-4">{isEditing ? 'Edit User' : 'Add New User'}</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={currentUser.name}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-4 border rounded"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={currentUser.email}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-4 border rounded"
                                required
                            />
                            <input
                                type="text"
                                name="photoUrl"
                                placeholder="Photo URL"
                                value={currentUser.photoUrl}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-4 border rounded"
                            />
                            <select
                                name="role"
                                value={currentUser.role}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-4 border rounded"
                                required
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                            <div className="mb-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isVerified"
                                        checked={currentUser.isVerified}
                                        onChange={(e) => setCurrentUser(prev => ({ ...prev, isVerified: e.target.checked }))}
                                        className="form-checkbox h-5 w-5 text-blue-600"
                                    />
                                    <span className="ml-2 text-gray-700">Is Verified</span>
                                </label>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    {isEditing ? 'Update' : 'Add'} User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}