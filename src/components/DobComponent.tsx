'use client'
import React, { useState, useEffect } from 'react';
import { account } from '@/appwrite/clientConfig';
import { useAuthStore } from '@/store/Auth';

const DobComponent: React.FC = () => {
    const { user, updateUser } = useAuthStore();
    const [showModal, setShowModal] = useState(false);
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [time, setTime] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [district, setDistrict] = useState('');
    const [city, setCity] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            checkDOBAndBirthPlace();
        }
    }, [user]);

    const checkDOBAndBirthPlace = async () => {
        try {
            if (!user?.prefs?.dob || !user?.prefs?.birthCountry) {
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error checking DOB and BirthPlace:', error);
        }
    };

    const validateFields = () => {
        const missingFields = [];
        if (!year) missingFields.push('Year');
        if (!month) missingFields.push('Month');
        if (!day) missingFields.push('Day');
        if (!time) missingFields.push('Time');
        if (!country) missingFields.push('Country');
        if (!state) missingFields.push('State');
        if (!district) missingFields.push('District');
        if (!city) missingFields.push('City');
        return missingFields;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const missingFields = validateFields();
        if (missingFields.length > 0) {
            setError(`Missing fields: ${missingFields.join(', ')}`);
            return;
        }

        const dob = `${year}-${month}-${day} ${time}`;
        try {
            await account.updatePrefs({
                dob,
                birthCountry: country,
                birthState: state,
                birthDistrict: district,
                birthCity: city
            });
            setShowModal(false);
            
            // Fetch updated user data
            const updatedUser = await account.get();
            console.log("updated user");
            updateUser(updatedUser);
        } catch (error) {
            console.error('Error updating DOB and BirthPlace:', error);
            setError('Failed to update information. Please try again.');
        }
    };

    if (!user) return null;

    return (
        <div className="p-4">            
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Set Your Date and Place of Birth</h2>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="number"
                                placeholder="Year"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="number"
                                placeholder="Month"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="number"
                                placeholder="Day"
                                value={day}
                                onChange={(e) => setDay(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="Country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="State"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="District"
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="City"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                            <button 
                                type="submit" 
                                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                            >
                                Save
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DobComponent;