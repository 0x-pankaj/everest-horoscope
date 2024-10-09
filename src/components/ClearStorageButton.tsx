import React from 'react';
import { useAuthStore } from '@/store/Auth';
import { useRouter } from 'next/navigation';

const ClearStorageButton = () => {
    const router = useRouter();
    const logout = useAuthStore(state => state.logout);

    const handleClearStorage = () => {
        if (window.confirm('Are you sure you want to clear all local storage? This will log you out.')) {
            // Clear all local storage
            localStorage.clear();

            // Call the logout function to ensure the auth state is reset
            logout();

            // Optionally, refresh the page or redirect to home
            router.push('/');

            alert('Local storage has been cleared. You have been logged out.');
        }
    };

    return (
        <button 
            onClick={handleClearStorage}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
            Clear Local Storage and Logout
        </button>
    );
};

export default ClearStorageButton;