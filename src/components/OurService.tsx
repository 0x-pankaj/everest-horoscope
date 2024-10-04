'use client'

import React, { useState, useEffect } from 'react';
import Image from "next/legacy/image";
import { FaSpinner, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const servicesPerPage = {
    mobile: 2,
    desktop: 8
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/services');
      const data = await response.json();
      // console.log("service data: ", data);
      
      if (Array.isArray(data)) {
        setServices(data);
      } else if (data.documents && Array.isArray(data.documents)) {
        setServices(data.documents);
      } else {
        throw new Error('Received data is not in the expected format');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (service: Service) => {
    setSelectedService(service);
  };

  const closeModal = () => {
    setSelectedService(null);
  };

  const nextServices = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + servicesPerPage.mobile < services.length) ? prevIndex + servicesPerPage.mobile : prevIndex
    );
  };

  const prevServices = () => {
    setCurrentIndex((prevIndex) => (prevIndex - servicesPerPage.mobile >= 0 ? prevIndex - servicesPerPage.mobile : prevIndex));
  };

  const visibleServices = services.slice(currentIndex, currentIndex + servicesPerPage.desktop);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-yellow-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-2 md:p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-3 md:p-6">
        <h2 className="text-xl md:text-3xl font-bold mb-3 md:mb-6 text-center text-yellow-800">Our Services</h2>
        {services.length === 0 ? (
          <p className="text-center text-gray-600">No services available at the moment.</p>
        ) : (
          <>
            <div className="flex justify-between items-center mb-3 md:mb-4">
            {
              services.length > 8 ? (
                <button 
                onClick={prevServices} 
                disabled={currentIndex === 0}
                className="bg-yellow-500 text-white px-2 py-1 md:px-4 md:py-2 rounded-full disabled:opacity-50 transition-colors duration-300"
              >
                <FaChevronLeft />
              </button>
              ) : null
            }
              <span className="text-sm md:text-base text-yellow-600">
                {currentIndex + 1}-{Math.min(currentIndex + servicesPerPage.mobile, services.length)} of {services.length}
              </span>
              {
                services.length > 8 ? (
                  <button 
                onClick={nextServices} 
                disabled={currentIndex + servicesPerPage.mobile >= services.length}
                className="bg-yellow-500 text-white px-2 py-1 md:px-4 md:py-2 rounded-full disabled:opacity-50 transition-colors duration-300"
              >
                <FaChevronRight />
              </button>
                ) : null
              }
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-4">
              {visibleServices.map((service, index) => (
                <div
                  key={service.$id || index}
                  className={`group relative overflow-hidden rounded-lg transition-transform duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${index >= servicesPerPage.mobile ? 'hidden md:block' : ''}`}
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
                    <p className="text-yellow-100 text-center font-semibold px-2 text-xs md:text-sm">{service.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 md:p-6 max-w-md w-full">
        <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 text-yellow-800">{service.name}</h2>
        <div className="relative w-full h-40 md:h-56 mb-4">
          <Image
            src={service.image || '/astro_logo_f.png'}
            alt={service.name}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        <p className="mb-4 text-sm md:text-base">{service.description}</p>
        <button
          onClick={onClose}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors text-sm md:text-base"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OurServices;