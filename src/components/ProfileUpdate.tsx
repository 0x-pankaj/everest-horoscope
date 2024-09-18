// components/ProfileUpdate.tsx
"use client"

import React, { useState, useEffect } from 'react';
import { useAuthStore } from "@/store/Auth"
import { database } from "@/appwrite/clientConfig"
import conf from "@/conf/conf"

interface UserProfile {
    name: string;
    email: string;
    phone?: string;
    bio?: string;
    languages: string[];
}

export default function ProfileUpdate() {
    const { user } = useAuthStore();
    const [profile, setProfile] = useState<UserProfile>({
        name: '',
        email: '',
        phone: '',
        bio: '',
        languages: [],
    });

    useEffect(() => {
        if (user) {
            fetchUserProfile();
        }
    }, [user]);

    const fetchUserProfile = async () => {
        try {
            const response = await database.getDocument(
                conf.appwriteHoroscopeDatabaseId,
                conf.appwriteUserCollectionId,
                user?.$id as string
            );
            setProfile(response as unknown as UserProfile);
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
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-yellow-50 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-yellow-800">Update Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-yellow-700">Name</label>
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
                    <label htmlFor="email" className="block text-yellow-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        readOnly
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-yellow-700">Phone</label>
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
                    <label htmlFor="bio" className="block text-yellow-700">Bio</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={profile.bio}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        rows={4}
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors"
                >
                    Update Profile
                </button>
            </form>
        </div>
    );
}