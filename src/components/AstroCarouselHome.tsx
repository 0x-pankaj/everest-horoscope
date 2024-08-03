"use client"

import React from 'react';
import AstroCarousel from '@/components/AstroCarousel';

const HomePage: React.FC = () => {
  const astrologers = [
    {
      id: '1',
      name: 'John Doe',
      photoUrl: 'https://cloud.appwrite.io/v1/storage/buckets/66998177000d52ac33b4/files/66addb0600375d7af3df/view?project=6696bcc3003c30b6b228&mode=admin',
      speciality: 'Vedic Astrology',
      experience: 10,
    },
    {
      id: '2',
      name: 'Halia',
      photoUrl: 'https://cloud.appwrite.io/v1/storage/buckets/66998177000d52ac33b4/files/66addcf6002c746aeed2/view?project=6696bcc3003c30b6b228&mode=admin',
      speciality: 'Tarot Reading',
      experience: 8,
    },
    {
      id: '3',
      name: 'Alice Johnson',
      photoUrl: 'https://cloud.appwrite.io/v1/storage/buckets/66998177000d52ac33b4/files/66addd8c000b8ae8c31a/view?project=6696bcc3003c30b6b228&mode=admin',
      speciality: 'Numerology',
      experience: 12,
    },
    {
      id: '4',
      name: 'Zaniah',
      photoUrl: 'https://cloud.appwrite.io/v1/storage/buckets/66998177000d52ac33b4/files/66addded002efc6d48fa/view?project=6696bcc3003c30b6b228&mode=admin    ',
      speciality: 'Palmistry',
      experience: 15,
    },
    // ... add more astrologers if needed
  ];

  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Welcome to AstroConnect</h1>
        <AstroCarousel astrologers={astrologers} />
        {/* Add other sections of your home page here */}
      </div>
    </div>
  );
};

export default HomePage;