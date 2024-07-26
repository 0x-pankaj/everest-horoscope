"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface CarouselProps {
  images: string[]; // Array of image URLs
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="relative w-full h-full">
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ height: 'calc(100% - 5rem)' }} // Adjust height to exclude navbar
        >
          <Image
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            layout="fill"
            objectFit="cover"
            className="w-full h-full"
          />
        </div>

        {/* Prev Button */}
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <FaChevronLeft className="text-gray-800" size={24} />
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <FaChevronRight className="text-gray-800" size={24} />
        </button>
      </div>
    </div>
  );
};

export default Carousel;
