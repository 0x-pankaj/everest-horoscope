'use client'

import React, { useState, useEffect } from 'react';

interface Testimonial {
  $id: string;
  text: string;
  author: string;
}

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials');
        if (!response.ok) {
          throw new Error('Failed to fetch testimonials');
        }
        const data = await response.json();
        setTestimonials(data);
        setIsLoading(false);
      } catch (err) {
        setError('Error loading testimonials');
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (isLoading) return <div className="text-center py-8">Loading testimonials...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <section className="py-12 px-4 bg-gradient-to-r from-yellow-100 to-yellow-200">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-yellow-800">What Our Clients Say</h2>
        <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.$id}
              className={`absolute w-full transform transition-all duration-700 ${
                index === currentIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
              }`}
            >
              <blockquote className="text-lg md:text-xl lg:text-2xl italic text-center mb-4 text-yellow-700 px-4 md:px-8 lg:px-16">
                "{testimonial.text}"
              </blockquote>
              <div className="text-center font-medium text-yellow-600 text-sm md:text-base">- {testimonial.author}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-4 h-4 rounded-full border-2 ${
                index === currentIndex ? 'bg-yellow-600 border-yellow-800' : 'bg-yellow-300 border-yellow-500'
              } transition duration-300 ease-in-out`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
