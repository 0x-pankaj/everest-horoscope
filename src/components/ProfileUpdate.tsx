'use client'
import React, { useState, useEffect } from 'react';
import { useAuthStore } from "@/store/Auth"
import { database } from "@/appwrite/clientConfig"
import conf from "@/conf/conf"
import { Query } from 'appwrite';
import Login from './Login';

interface UserProfile {
    name: string;
    email: string;
    phone?: string;
    bio?: string;
    dob:string;
    languages: string[];
}

export default function ProfileComponent() {
    const { user } = useAuthStore();
    const [profile, setProfile] = useState<UserProfile>({
        name: '',
        email: '',
        phone: '',
        bio: '',
        dob: '',
        languages: [],
    });
    const [isEditing, setIsEditing] = useState(false);

    
    useEffect(() => {
        if (user) {
            fetchUserProfile();
        }
    }, [user]);
    if (!user) return
    console.log("user: ", user);

    const fetchUserProfile = async () => {
        try {
            const userEmail = user.email
            const response = await database.listDocuments(
                conf.appwriteHoroscopeDatabaseId,
                conf.appwriteUserCollectionId,
                [Query.equal("email", [userEmail])]
            );
            setProfile(response.documents[0] as unknown as UserProfile);
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await database.updateDocument(  
                conf.appwriteHoroscopeDatabaseId,
                conf.appwriteUserCollectionId,
                user?.$id as string,
                profile
            );
            alert("Profile updated successfully!");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    };

    const ProfileView = () => (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-yellow-800">User Profile</h2>
            <div className="space-y-4">
                <div>
                    <strong className="text-yellow-700">Name:</strong> {profile.name}
                </div>
                <div>
                    <strong className="text-yellow-700">Email:</strong> {profile.email}
                </div>
                <div>
                    <strong className="text-yellow-700">Phone:</strong> {profile.phone || 'Not provided'}
                </div>
                <div>
                    <strong className="text-yellow-700">Bio:</strong> {profile.bio || 'No bio available'}
                </div>
                <div>
                    <strong className="text-yellow-700">Bio:</strong> {profile.dob || 'No DOB available'}
                </div>
                <button 
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                >
                    Update Profile
                </button>
            </div>
        </div>
    );

    const ProfileEditForm = () => (
        <div className="bg-yellow-50 rounded-lg shadow-md p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-yellow-800">Update Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-yellow-700 mb-1">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-yellow-700 mb-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={profile.email}
                        readOnly
                        className="w-full px-3 py-2 border border-yellow-300 rounded-md bg-yellow-100"
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-yellow-700 mb-1">Phone</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={profile.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                </div>
                <div>
                    <label htmlFor="bio" className="block text-yellow-700 mb-1">Bio</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={profile.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    ></textarea>
                </div>
                <div className="flex space-x-4">
                    <button
                        type="submit"
                        className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                    >
                        Save Changes
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-300"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            {isEditing ? <ProfileEditForm /> : <ProfileView />}
        </div>
    );
}