import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import AstroCardForHome from './AstroCardForHome';

interface Astrologer {
  id: string;
  name: string;
  photoUrl: string;
  speciality: string;
  experience: number;
}

interface AstroCarouselProps {
  astrologers: Astrologer[];
}

const AstroCarousel: React.FC<AstroCarouselProps> = ({ astrologers }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);

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
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold">Our Astrologers</h2>
        <div className="space-x-2">
          <button
            onClick={prevSlide}
            disabled={startIndex === 0}
            className="p-2 bg-gray-200 rounded-full disabled:opacity-50"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={nextSlide}
            disabled={startIndex + cardsToShow >= astrologers.length}
            className="p-2 bg-gray-200 rounded-full disabled:opacity-50"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
      <div className="flex space-x-4 overflow-hidden">
        {astrologers.slice(startIndex, startIndex + cardsToShow).map((astro) => (
          <div key={astro.id} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3">
            <AstroCardForHome
              id={astro.id}
              name={astro.name}
              photoUrl={astro.photoUrl}
              speciality={astro.speciality}
              experience={astro.experience}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AstroCarousel;