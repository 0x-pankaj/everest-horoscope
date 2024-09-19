'use client'
import React, { useState } from 'react';
import Image from 'next/image';

interface Service {
  name: string;
  image: string;
  description: string;
}

const services: Service[] = [
  { name: 'Kundali Prediction', image: '/kundaliprediction.png', description: "Unlock your life's potential with accurate Kundali predictions, offering deep insights into your future, career, relationships, and more." },
  { name: 'Kundali Matching', image: '/kundalimatching.png', description: "Ensure a harmonious and compatible partnership with precise Kundali matching services for marriage and relationship success." },
  { name: 'Vastu Sastra', image: '/vastu.png', description: "Enhance your living and working spaces with expert Vastu Sastra consultations, bringing balance, prosperity, and positivity to your surroundings." },
  { name: 'Planets', image: '/Planets.png', description: "Understand the influence of planetary movements on your life with personalized astrological analysis and guidance." },
  { name: 'Pooja / Hom', image: '/pooja.png', description: "Experience spiritual purification and divine blessings with expertly conducted Pooja and Hom rituals tailored to your needs." },
  { name: 'Horoscope', image: '/horoscope.png', description: "Receive detailed and personalized horoscope readings to navigate life's challenges and opportunities with confidence." }
];

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

const OurServices: React.FC = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const openModal = (service: Service) => {
    setSelectedService(service);
  };

  const closeModal = () => {
    setSelectedService(null);
  };

  return (
    <div className="bg-yellow-100 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-yellow-800">Our Services</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {services.map((service, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-lg transition-transform duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            onClick={() => openModal(service)}
          >
            <div className="relative w-full pt-[100%]">
              <Image
                src={service.image}
                alt={service.name}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="absolute inset-0 bg-yellow-800 bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-yellow-100 text-center font-semibold px-2">{service.name}</p>
            </div>
          </div>
        ))}
      </div>
      <Modal
        isOpen={selectedService !== null}
        onClose={closeModal}
        service={selectedService}
      />
    </div>
  );
};

export default OurServices;