import React from 'react';
import Image from 'next/image';

const services = [
  { name: 'Service 1', image: '/ourservice.jpg' },
  { name: 'Service 2', image: '/ourservice.jpg' },
  { name: 'Service 3', image: '/ourservice.jpg' },
  { name: 'Service 4', image: '/ourservice.jpg' },
  { name: 'Service 5', image: '/ourservice.jpg' },
  { name: 'Service 6', image: '/ourservice.jpg' },
  { name: 'Service 7', image: '/ourservice.jpg' },
  { name: 'Service 8', image: '/ourservice.jpg' },
];

const OurServices = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Our Services</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {services.map((service, index) => (
          <div key={index} className="group relative overflow-hidden rounded-lg transition-transform duration-300 ease-in-out transform hover:scale-105">
            <Image src={service.image} alt={service.name} width={200} height={200} className="w-full h-auto" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-center font-semibold">{service.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurServices;