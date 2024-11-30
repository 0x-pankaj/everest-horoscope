// src/components/DataFetchButton/index.tsx
import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import UserInfoDisplay from './UserInfoDisplay';
import VastoServiceDisplay from './VastoServiceDisplay';
import axios from 'axios';
import { User } from '@/types/user';

export type FeatureType = 'userInfo' | 'vastoService' | null;

// export interface UserData {
//   $id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   // Add other user fields you need
// }

export interface VastoServiceData {
  name: string;
  email: string;
  location: string;
  direction: string;
  houseMap: string;
  selectedServices: string[];
  message: string;
}

const DataFetchButton = ({userId}: {userId: string}) => {
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<FeatureType>(null);
  const [userData, setUserData] = useState<User| null>(null);
  const [vastoData, setVastoData] = useState<VastoServiceData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const fetchUserInfo = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<User>(`/api/users/${userId}`);
      console.log("response: ",response.data);
      setUserData(response.data);
      handleFeatureSelect('userInfo');
    } catch (error) {
      setError('Failed to fetch user information');
      console.error('Error fetching user info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVastoServices = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/vasto-service?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch vasto services');
      const data = await response.json();
      setVastoData(data);
      handleFeatureSelect('vastoService');
    } catch (error) {
      setError('Failed to fetch vasto service data');
      console.error('Error fetching vasto services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeatureSelect = (feature: FeatureType) => {
    setSelectedFeature(feature);
    setIsMainModalOpen(false);
  };

  return (
    <>
      {/* Main Button */}
      <Button 
        onClick={() => setIsMainModalOpen(true)}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-700 hover:to-yellow-600 text-white rounded-full p-4 shadow-lg"
      >
        <span className="text-lg">View Data</span>
      </Button>

      {/* Feature Selection Modal */}
      {isMainModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMainModalOpen(false)} />
          <div className="relative bg-white rounded-lg w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-center">
                <span className="bg-gradient-to-r from-purple-600 to-yellow-500 bg-clip-text text-transparent">
                  Select Data to View
                </span>
              </h2>

              <div className="space-y-4">
                <button
                  onClick={() => fetchUserInfo(userId)}
                  className="w-full p-4 text-left rounded-lg border border-gray-200 hover:bg-purple-50 transition-colors"
                >
                  <h3 className="font-medium text-gray-800">User Information</h3>
                  <p className="text-sm text-gray-500 mt-1">View user profile details</p>
                </button>

                <button
                  onClick={() => fetchVastoServices(userId)}
                  className="w-full p-4 text-left rounded-lg border border-gray-200 hover:bg-purple-50 transition-colors"
                >
                  <h3 className="font-medium text-gray-800">Vasto Service</h3>
                  <p className="text-sm text-gray-500 mt-1">View vasto service submissions</p>
                </button>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMainModalOpen(false)}
              className="w-full p-3 text-center text-white font-medium bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-700 hover:to-yellow-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Vasto Service Display Modal */}
      {selectedFeature === 'vastoService' && vastoData && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedFeature(null)} />
          <div className="relative bg-white rounded-lg w-full max-w-4xl mx-4 overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-center">
                <span className="bg-gradient-to-r from-purple-600 to-yellow-500 bg-clip-text text-transparent">
                  Vasto Service Submissions
                </span>
              </h2>
              <VastoServiceDisplay data={vastoData} onClose={() => setSelectedFeature(null)} />
            </div>
            <button
              onClick={() => setSelectedFeature(null)}
              className="w-full p-3 text-center text-white font-medium bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-700 hover:to-yellow-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* User Info Display Modal */}
      {selectedFeature === 'userInfo' && userData && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedFeature(null)} />
          <div className="relative bg-white rounded-lg w-full max-w-2xl mx-4 overflow-hidden">
            <div className="p-6">
              <UserInfoDisplay data={userData} onClose={() => setSelectedFeature(null)} />
            </div>
            <button
              onClick={() => setSelectedFeature(null)}
              className="w-full p-3 text-center text-white font-medium bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-700 hover:to-yellow-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DataFetchButton;