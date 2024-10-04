'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { Maximize } from 'lucide-react';

const HowItWorks = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [imageLoadError, setImageLoadError] = useState(false);

  // Replace these with your actual image URLs from Appwrite
  const desktopImageUrl = "/step-desktop.jpeg";
  const mobileImageUrl = "/step-mobile.jpeg";

  const openModal = (imageSrc: string) => {
    setCurrentImage(imageSrc);
    setIsOpen(true);
  };

  const handleImageError = () => {
    setImageLoadError(true);
  };

  return (
    <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">How It Works</h2>
      <div className="relative group cursor-pointer">
        {imageLoadError ? (
          <div className="flex items-center justify-center h-64 bg-gray-200 rounded-lg">
            <p className="text-gray-500">Image failed to load</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block" onClick={() => openModal(desktopImageUrl)}>
              <Image 
                src={desktopImageUrl} 
                alt="How It Works - Desktop" 
                width={1200} 
                height={400} 
                layout="responsive" 
                className="rounded-lg transition-all duration-300 group-hover:opacity-90"
                onError={handleImageError}
              />
            </div>
            <div className="md:hidden" onClick={() => openModal(mobileImageUrl)}>
              <Image 
                src={mobileImageUrl} 
                alt="How It Works - Mobile" 
                width={400} 
                height={600} 
                layout="responsive" 
                className="rounded-lg transition-all duration-300 group-hover:opacity-90"
                onError={handleImageError}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Maximize className="text-white w-12 h-12" />
            </div>
          </>
        )}
      </div>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsOpen(false)}>
          <div className="max-w-[90vw] max-h-[90vh] relative">
            <Image 
              src={currentImage} 
              alt="Enlarged view" 
              layout="responsive" 
              width={1200} 
              height={800} 
              className="rounded-lg"
              onError={handleImageError}
            />
            <button 
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HowItWorks;