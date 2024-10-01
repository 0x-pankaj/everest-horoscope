'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Service {
  $id?: string;
  name: string;
  image: string;
  description: string;
}

const OurServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      console.log("service data: ", data);
      
      // Check if data is an array
      if (Array.isArray(data)) {
        setServices(data);
      } else if (data.documents && Array.isArray(data.documents)) {
        // If the API returns an object with a 'documents' array
        setServices(data.documents);
      } else {
        // If the data is not in the expected format
        throw new Error('Received data is not in the expected format');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services. Please try again later.');
    }
  };

  const openModal = (service: Service) => {
    setSelectedService(service);
  };

  const closeModal = () => {
    setSelectedService(null);
  };
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-yellow-100 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-yellow-800">Our Services</h2>
      {services.length === 0 ? (
        <p>No services available at the moment.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {services.map((service, index) => (
            <div
              key={service.$id || index}
              className="group relative overflow-hidden rounded-lg transition-transform duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={() => openModal(service)}
            >
              <div className="relative w-full pt-[100%]">
                <Image
                  src={service.image || '/astro_logo_f.png'}
                  alt={service.name || "default name"}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <div className="absolute inset-0 bg-yellow-800 bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-yellow-100 text-center font-semibold px-2">{service.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal
        isOpen={selectedService !== null}
        onClose={closeModal}
        service={selectedService}
      />
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, service }) => {
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-yellow-50 p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">{service.name}</h2>
        <p className="mb-4">{service.description}</p>
        <button
          onClick={onClose}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OurServices;