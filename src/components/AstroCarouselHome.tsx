"use client"

import React from 'react';
import AstroCarousel from '@/components/AstroCarousel';

const HomePage: React.FC = () => {
  const astrologers = [
    {
      id: '1',
      name: 'John Doe',
      photoUrl: '/images/john-doe.jpg',
      speciality: 'Vedic Astrology',
      experience: 10,
    },
    {
      id: '2',
      name: 'Jane Smith',
      photoUrl: '/images/jane-smith.jpg',
      speciality: 'Tarot Reading',
      experience: 8,
    },
    {
      id: '3',
      name: 'Alice Johnson',
      photoUrl: '/images/alice-johnson.jpg',
      speciality: 'Numerology',
      experience: 12,
    },
    {
      id: '4',
      name: 'Bob Williams',
      photoUrl: '/images/bob-williams.jpg',
      speciality: 'Palmistry',
      experience: 15,
    },
    // ... add more astrologers if needed
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Welcome to AstroConnect</h1>
        <AstroCarousel astrologers={astrologers} />
        {/* Add other sections of your home page here */}
      </div>
    </div>
  );
};

export default HomePage;