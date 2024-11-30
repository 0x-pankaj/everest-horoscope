// src/components/DataFetchButton/VastoServiceDisplay.tsx

import { VastoServiceData } from ".";

const VastoServiceDisplay = ({ data, onClose }: { data: VastoServiceData[], onClose: () => void }) => {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-yellow-500">
          Vasto Service Submissions
        </h2>
  
        {data.map((service, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <div className="mt-1 p-2 bg-gray-50 rounded-md">{service.name}</div>
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="mt-1 p-2 bg-gray-50 rounded-md">{service.email}</div>
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <div className="mt-1 p-2 bg-gray-50 rounded-md">{service.location}</div>
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700">Direction</label>
                <div className="mt-1 p-2 bg-gray-50 rounded-md">{service.direction}</div>
              </div>
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700">Selected Services</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {service.selectedServices.map((item, i) => (
                  <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md">{service.message}</div>
            </div>
          </div>
        ))}
  
        <button
          onClick={onClose}
          className="mt-6 w-full bg-gradient-to-r from-purple-600 to-yellow-500 text-white py-2 px-4 rounded-md hover:from-purple-700 hover:to-yellow-600"
        >
          Close
        </button>
      </div>
    );
  };

  export default VastoServiceDisplay