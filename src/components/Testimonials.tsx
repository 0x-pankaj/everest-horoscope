"use client"
import React, { useState, useEffect } from 'react';

interface Testimonial {
  id: number;
  text: string;
  author: string;
}

const testimonials: Testimonial[] = [
  { id: 1, text: "This product changed our business!", author: "John Doe, CEO" },
  { id: 2, text: "Incredible results in just weeks!", author: "Jane Smith, CTO" },
  { id: 3, text: "The best decision we've made!", author: "Bob Johnson, Founder" },
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 bg-yellow-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-yellow-800">What Our Clients Say</h2>
        <div className="relative h-64">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`absolute w-full transition-opacity duration-500 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <blockquote className="text-xl italic text-center mb-4 text-yellow-700">"{testimonial.text}"</blockquote>
              <div className="block text-center text-yellow-600">- {testimonial.author} </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full mx-1 ${
                index === currentIndex ? 'bg-yellow-500' : 'bg-yellow-300'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;