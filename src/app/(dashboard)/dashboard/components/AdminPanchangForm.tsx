'use client'
import React, { useState } from 'react';
import { FaCalendarPlus } from 'react-icons/fa';

interface PanchangFormData {
  date: string;
  tithi: string;
  nakshatra: string;
  yoga: string;
  firstKarana: string;
  secondKarana: string;
  vaar: string;
  rahuKalam: string;
}

const AdminPanchangForm: React.FC = () => {
  const [formData, setFormData] = useState<PanchangFormData>({
    date: '',
    tithi: '',
    nakshatra: '',
    yoga: '',
    firstKarana: '',
    secondKarana: '',
    vaar: '',
    rahuKalam: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/todays-panchang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Panchang information added successfully!');
        setFormData({
          date: '',
          tithi: '',
          nakshatra: '',
          yoga: '',
          firstKarana: '',
          secondKarana: '',
          vaar: '',
          rahuKalam: '',
        });
      } else {
        throw new Error('Failed to add panchang information');
      }
    } catch (error) {
      alert('Error adding panchang information');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <FaCalendarPlus className="mr-2" />
        Add Today's Panchang
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key}>
            <label htmlFor={key} className="block text-sm font-medium text-gray-700">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            <input
              type={key === 'date' ? 'date' : 'text'}
              id={key}
              name={key}
              value={value}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          Add Panchang Information
        </button>
      </form>
    </div>
  );
};

export default AdminPanchangForm;