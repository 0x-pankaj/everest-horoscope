import React, { useState, useEffect } from 'react';
import { FaUser, FaTrash, FaPlus, FaEdit } from 'react-icons/fa';
import { database } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';
import { ID, Query } from 'appwrite';

interface Astrologer {
  $id: string;
  user_id: string;
  name: string;
  photoUrl: string;
  bio: string;
  specialties: string[];
  rating: number;
  experience: number;
  hourlyRate: number;
  isOnline: boolean;
  language?: string[];
}

const initialAstrologerState: Omit<Astrologer, '$id'> = {
  user_id: '',
  name: '',
  photoUrl: '',
  bio: '',
  specialties: [],
  rating: 0,
  experience: 0,
  hourlyRate: 0,
  isOnline: false,
  language: [],
};

export default function AstroManagement() {
    const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
    const [currentAstrologer, setCurrentAstrologer] = useState<Omit<Astrologer, '$id'>>(initialAstrologerState);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchAstrologers();
    }, []);

    const fetchAstrologers = async () => {
        try {
            const response = await database.listDocuments(
                conf.appwriteHoroscopeDatabaseId,
                conf.appwriteAstroCollectionId,
                [Query.orderDesc('$createdAt')]
            );
            setAstrologers(response.documents as unknown as Astrologer[]);
        } catch (error) {
            console.error('Error fetching astrologers:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCurrentAstrologer(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'specialties' | 'language') => {
        const values = e.target.value.split(',').map(item => item.trim());
        setCurrentAstrologer(prev => ({ ...prev, [field]: values }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await database.updateDocument(
                    conf.appwriteHoroscopeDatabaseId,
                    conf.appwriteAstroCollectionId,
                    currentAstrologer.user_id,
                    currentAstrologer
                );
            } else {
                await database.createDocument(
                    conf.appwriteHoroscopeDatabaseId,
                    conf.appwriteAstroCollectionId,
                    ID.unique(),
                    currentAstrologer
                );
            }
            setIsModalOpen(false);
            setCurrentAstrologer(initialAstrologerState);
            setIsEditing(false);
            fetchAstrologers();
        } catch (error) {
            console.error('Error saving astrologer:', error);
        }
    };

    const deleteAstrologer = async (id: string) => {
        try {
            await database.deleteDocument(
                conf.appwriteHoroscopeDatabaseId,
                conf.appwriteAstroCollectionId,
                id
            );
            fetchAstrologers();
        } catch (error) {
            console.error('Error deleting astrologer:', error);
        }
    };

    const editAstrologer = (astro: Astrologer) => {
        setCurrentAstrologer(astro);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Astrologer Management</h1>
            
            <div className="mb-4 text-right">
                <button
                    onClick={() => {
                        setCurrentAstrologer(initialAstrologerState);
                        setIsEditing(false);
                        setIsModalOpen(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                >
                    <FaPlus className="mr-2" />
                    Add New Astrologer
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {astrologers.map((astro) => (
                    <div key={astro.$id} className="bg-white shadow-lg rounded-lg p-6">
                        <div className="flex items-center mb-4">
                            <img src={astro.photoUrl} alt={astro.name} className="w-16 h-16 rounded-full mr-4" />
                            <div>
                                <h2 className="text-xl font-semibold">{astro.name}</h2>
                                <p className="text-gray-600">ID: {astro.user_id}</p>
                            </div>
                        </div>
                        <p className="text-gray-700 mb-2">{astro.bio}</p>
                        <p className="text-gray-700 mb-2">Specialties: {astro.specialties.join(', ')}</p>
                        <p className="text-gray-700 mb-2">Rating: {astro.rating}</p>
                        <p className="text-gray-700 mb-2">Experience: {astro.experience} years</p>
                        <p className="text-gray-700 mb-2">Hourly Rate: ${astro.hourlyRate}</p>
                        <p className="text-gray-700 mb-2">Status: {astro.isOnline ? 'Online' : 'Offline'}</p>
                        {astro.language && <p className="text-gray-700 mb-4">Languages: {astro.language.join(', ')}</p>}
                        <div className="flex justify-between">
                            <button
                                onClick={() => editAstrologer(astro)}
                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                            >
                                <FaEdit className="mr-2" />
                                Edit
                            </button>
                            <button
                                onClick={() => deleteAstrologer(astro.$id)}
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
                        <h3 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Astrologer' : 'Add New Astrologer'}</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="user_id"
                                placeholder="User ID"
                                value={currentAstrologer.user_id}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-4 border rounded"
                                required
                            />
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={currentAstrologer.name}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-4 border rounded"
                                required
                            />
                            <input
                                type="text"
                                name="photoUrl"
                                placeholder="Photo URL"
                                value={currentAstrologer.photoUrl}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-4 border rounded"
                                required
                            />
                            <textarea
                                name="bio"
                                placeholder="Bio"
                                value={currentAstrologer.bio}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-4 border rounded"
                                required
                            />
                            <input
                                type="text"
                                name="specialties"
                                placeholder="Specialties (comma-separated)"
                                value={currentAstrologer.specialties.join(', ')}
                                onChange={(e) => handleArrayInputChange(e, 'specialties')}
                                className="w-full p-2 mb-4 border rounded"
                                required
                            />
                            <input
                                type="number"
                                name="rating"
                                placeholder="Rating"
                                value={currentAstrologer.rating}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-4 border rounded"
                                required
                                min="0"
                                max="5"
                                step="0.1"
                            />
                            <input
                                type="number"
                                name="experience"
                                placeholder="Experience (years)"
                                value={currentAstrologer.experience}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-4 border rounded"
                                required
                                min="0"
                            />
                            <input
                                type="number"
                                name="hourlyRate"
                                placeholder="Hourly Rate"
                                value={currentAstrologer.hourlyRate}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-4 border rounded"
                                required
                                min="0"
                            />
                            <div className="mb-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isOnline"
                                        checked={currentAstrologer.isOnline}
                                        onChange={(e) => setCurrentAstrologer(prev => ({ ...prev, isOnline: e.target.checked }))}
                                        className="form-checkbox h-5 w-5 text-blue-600"
                                    />
                                    <span className="ml-2 text-gray-700">Is Online</span>
                                </label>
                            </div>
                            <input
                                type="text"
                                name="language"
                                placeholder="Languages (comma-separated)"
                                value={currentAstrologer.language?.join(', ') || ''}
                                onChange={(e) => handleArrayInputChange(e, 'language')}
                                className="w-full p-2 mb-4 border rounded"
                            />
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
                                    {isEditing ? 'Update' : 'Add'} Astrologer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}