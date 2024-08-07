"use client"

import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import AstroCardForHome from './AstroCardForHome';
import { Client, Databases, Query } from 'appwrite';
import { database } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';

interface Astrologer {
  $id: string;
  name: string;
  photoUrl: string;
  specialties: string[];
  experience: number;
}

const AstroCarousel: React.FC = () => {
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);

  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        const response = await database.listDocuments(
          conf.appwriteHoroscopeDatabaseId,
          conf.appwriteAstroCollectionId,
          [
            Query.select(['$id', 'name', 'photoUrl', 'specialties', 'experience']),
            Query.limit(100) // Adjust as needed
          ]
        );
        console.log("astro: ", response);
        setAstrologers(response.documents as unknown as Astrologer[]);
      } catch (error) {
        console.error('Error fetching astrologers:', error);
      }
    };

    fetchAstrologers();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsToShow(1);
      } else if (window.innerWidth < 1024) {
        setCardsToShow(2);
      } else {
        setCardsToShow(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setStartIndex((prevIndex) =>
      prevIndex + cardsToShow < astrologers.length ? prevIndex + cardsToShow : prevIndex
    );
  };

  const prevSlide = () => {
    setStartIndex((prevIndex) => (prevIndex > 0 ? prevIndex - cardsToShow : prevIndex));
  };

  return (
    <div className="py-12 relative">
      <div className='container mx-auto px-4'>

      <h2 className="text-xl md:text-2xl font-bold mb-4">Our Astrologers</h2>
      <div className="relative">
        <button
          onClick={prevSlide}
          disabled={startIndex === 0}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md disabled:opacity-50"
          >
          <FaChevronLeft />
        </button>
        <button
          onClick={nextSlide}
          disabled={startIndex + cardsToShow >= astrologers.length}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md disabled:opacity-50"
          >
          <FaChevronRight />
        </button>
        <div className="flex space-x-4 overflow-hidden">
          {astrologers.slice(startIndex, startIndex + cardsToShow).map((astro) => (
            <div key={astro.$id} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3">
              <AstroCardForHome
                id={astro.$id}
                name={astro.name}
                photoUrl={astro.photoUrl}
                speciality={astro.specialties.join(', ')}
                experience={astro.experience}
                />
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

export default AstroCarousel;


/*
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
      </div>
    </div>
  );
};

export default HomePage;

*/