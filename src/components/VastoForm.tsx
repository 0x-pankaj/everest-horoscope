// src/components/VastoForm.tsx
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/Auth';


export interface VastoFormData {   
    id: string;
    name: string;
    email: string;
    location: string;
    direction: string;
    houseMap: string; // This will store the Appwrite file ID
    selectedServices: string[];
    message: string;
    startDate: string;   
    endDate: string;        
    auspiciousPurpose: string; 
  }
  

const VastoForm = () => {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  console.log("user from form: ", user);
  const [formData, setFormData] = useState<Omit<VastoFormData, 'houseMap'> & { houseMap: File | null }>({
    id: '',
    name: '',
    email: '',
    location: '',
    direction: '',
    houseMap: null,
    selectedServices: [],
    message: '',
    startDate: '',
    endDate: '',
    auspiciousPurpose: ''
    
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const availableServices = [
    'Bed Room',
    'Hall',
    'Toilet',
    'Flat',
    'Kitchen',
    'Worshiping Places',
    'Children Room',
    'Living Room',
    'Dining Room',
    'Study Room',
    'Guest Room',
    'Basement'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, houseMap: e.target.files[0] });
      setError(null);
    }
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => {
      const services = prev.selectedServices.includes(service)
        ? prev.selectedServices.filter(s => s !== service)
        : [...prev.selectedServices, service];
      return { ...prev, selectedServices: services };
    });
    setError(null);
  };

  // Inside the handleSubmit function, replace the FormData creation part with this:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);

  if (!formData.houseMap) {
    setError('Please upload a house map');
    setIsLoading(false);
    return;
  }

  if (formData.selectedServices.length === 0) {
    setError('Please select at least one service');
    setIsLoading(false);
    return;
  }

  try {
    const submitFormData = new FormData();
    
    // Handle each field separately with proper typing
    submitFormData.append('id', user?.$id || '');
    submitFormData.append('name', formData.name);
    submitFormData.append('email', formData.email);
    submitFormData.append('location', formData.location);
    submitFormData.append('direction', formData.direction);
    submitFormData.append('message', formData.message);
    submitFormData.append('startDate', formData.startDate);
    submitFormData.append('endDate', formData.endDate);
    submitFormData.append('auspiciousPurpose', formData.auspiciousPurpose);
    
    // Handle the file
    if (formData.houseMap) {
      submitFormData.append('houseMap', formData.houseMap);
    }
    
    // Handle the services array
    submitFormData.append('selectedServices', JSON.stringify(formData.selectedServices));

    const response = await axios.post('/api/vasto-service', submitFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Reset form on success
    setFormData({
      id: '',
      name: '',
      email: '',
      location: '',
      direction: '',
      houseMap: null,
      selectedServices: [],
      message: '',
      startDate: '',
      endDate: '',
      auspiciousPurpose: ''
    });

    // You might want to show a success message or redirect
    // console.log('Success:', response.data);
    toast.success('Form submitted successfully!');
    router.push('/chat');
    
  } catch (error) {
    console.error('Error submitting form:', error);
    setError('Failed to submit form. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

return (
  <div className="min-h-screen flex items-center justify-center p-6">
    <div className="w-full max-w-5xl bg-gradient-to-br from-purple-500 via-purple-400 to-yellow-300 p-1 rounded-lg shadow-xl">
      <div className="bg-white rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-yellow-500">
          Submit Vastu Service
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Row - Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          {/* Second Row - Location and Direction */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Choose Direction</label>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['East', 'West', 'North', 'South'].map((direction) => (
                  <label key={direction} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="direction"
                      value={direction}
                      onChange={handleInputChange}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">{direction}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Third Row - House Map and Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">House Map</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label className="relative cursor-pointer rounded-md font-medium text-purple-600 hover:text-purple-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        name="houseMap"
                        onChange={handleFileChange}
                        className="sr-only"
                        accept="image/*"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Services</label>
              <button
                type="button"
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="mt-1 relative w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              >
                <span className="block truncate">
                  {formData.selectedServices.length > 0 
                    ? `${formData.selectedServices.length} services selected`
                    : 'Select services'}
                </span>
              </button>

              {isServicesOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {availableServices.map((service) => (
                    <div
                      key={service}
                      className="flex items-center px-4 py-2 hover:bg-purple-50 cursor-pointer"
                      onClick={() => handleServiceToggle(service)}
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedServices.includes(service)}
                        onChange={() => handleServiceToggle(service)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label className="ml-3 block text-sm text-gray-700">
                        {service}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Fourth Row - Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Your Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

{/* New Date Fields */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div>
    <label className="block text-sm font-medium text-gray-700">Start Date</label>
    <input
      type="date"
      name="startDate"
      value={formData.startDate}
      onChange={handleInputChange}
      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
      required
    />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">End Date</label>
    <input
      type="date"
      name="endDate"
      value={formData.endDate}
      onChange={handleInputChange}
      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
      required
    />
  </div>
</div>

{/* Auspicious Purpose Field */}
<div>
  <label className="block text-sm font-medium text-gray-700">Auspicious Purpose</label>
  <input
    type="text"
    name="auspiciousPurpose"
    value={formData.auspiciousPurpose}
    onChange={handleInputChange}
    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
    required
  />
</div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-yellow-500 text-white py-2 px-4 rounded-md hover:from-purple-700 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  </div>
);

}

export default VastoForm;