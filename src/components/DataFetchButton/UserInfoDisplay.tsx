// src/components/DataFetchButton/UserInfoDisplay.tsx
import { User } from '@/types/user';
import { format } from 'date-fns';

interface UserInfoDisplayProps {
  data: User;
  onClose: () => void;
}

const UserInfoDisplay = ({ data, onClose }: UserInfoDisplayProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-yellow-500">
        User Information
      </h2>

      {/* Basic Information */}
      <div className="bg-purple-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-purple-700 mb-3">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <div className="mt-1 p-2 bg-white rounded-md">{data.name}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 p-2 bg-white rounded-md">{data.email}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <div className="mt-1 p-2 bg-white rounded-md">{data.phone || 'Not provided'}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <div className="mt-1">
              <span className={`px-2 py-1 rounded-full text-sm ${
                data.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {data.status ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences/Birth Information */}
      <div className="bg-yellow-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-700 mb-3">Birth Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.prefs && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <div className="mt-1 p-2 bg-white rounded-md">
                  {data.prefs.dob ? formatDate(data.prefs.dob) : 'Not provided'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Balance</label>
                <div className="mt-1 p-2 bg-white rounded-md">
                  {data.prefs.balance || '0'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Birth City</label>
                <div className="mt-1 p-2 bg-white rounded-md">
                  {data.prefs.birthCity || 'Not provided'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Birth District</label>
                <div className="mt-1 p-2 bg-white rounded-md">
                  {data.prefs.birthDistrict || 'Not provided'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Birth State</label>
                <div className="mt-1 p-2 bg-white rounded-md">
                  {data.prefs.birthState || 'Not provided'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Birth Country</label>
                <div className="mt-1 p-2 bg-white rounded-md">
                  {data.prefs.birthCountry || 'Not provided'}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-700 mb-3">Account Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Created</label>
            <div className="mt-1 p-2 bg-white rounded-md">{formatDate(data.$createdAt)}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Last Updated</label>
            <div className="mt-1 p-2 bg-white rounded-md">{formatDate(data.$updatedAt)}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Last Accessed</label>
            <div className="mt-1 p-2 bg-white rounded-md">{formatDate(data.accessedAt)}</div>
          </div>
        </div>
      </div>

      {/* Verification Status */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Verification Status</h3>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <span className={`h-3 w-3 rounded-full ${
              data.emailVerification ? 'bg-green-500' : 'bg-red-500'
            }`}></span>
            <span className="text-sm text-gray-600">Email {data.emailVerification ? 'Verified' : 'Not Verified'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`h-3 w-3 rounded-full ${
              data.phoneVerification ? 'bg-green-500' : 'bg-red-500'
            }`}></span>
            <span className="text-sm text-gray-600">Phone {data.phoneVerification ? 'Verified' : 'Not Verified'}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full bg-gradient-to-r from-purple-600 to-yellow-500 text-white py-2 px-4 rounded-md hover:from-purple-700 hover:to-yellow-600"
      >
        Close
      </button>
    </div>
  );
};

export default UserInfoDisplay;