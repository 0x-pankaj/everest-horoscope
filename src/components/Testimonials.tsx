"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaQuoteLeft,
  FaQuoteRight,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

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
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("/api/testimonials");
        if (!response.ok) {
          throw new Error("Failed to fetch testimonials");
        }
        const data = await response.json();
        setTestimonials(data);
        setIsLoading(false);
      } catch (err) {
        setError("Error loading testimonials");
        setIsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length, isAutoPlay]);

  const nextTestimonial = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setIsAutoPlay(false);
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + testimonials.length) % testimonials.length,
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500 bg-red-50 px-6 py-4 rounded-lg shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-yellow-800 relative">
          <span className="relative inline-block">
            What Our Clients Say
            <div className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"></div>
          </span>
        </h2>

        <div className="relative mx-auto max-w-4xl">
          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 z-10 bg-white/80 hover:bg-white text-yellow-600 p-2 rounded-full shadow-lg transition-all hover:scale-110"
            aria-label="Previous testimonial"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 z-10 bg-white/80 hover:bg-white text-yellow-600 p-2 rounded-full shadow-lg transition-all hover:scale-110"
            aria-label="Next testimonial"
          >
            <FaChevronRight className="w-5 h-5" />
          </button>

          {/* Testimonials Container */}
          <div className="relative h-[300px] md:h-[250px] overflow-hidden bg-white/40 backdrop-blur-sm rounded-2xl shadow-xl px-8 md:px-16 py-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 py-10"
              >
                <FaQuoteLeft className="text-yellow-400/30 absolute top-6 left-6 w-8 h-8 md:w-12 md:h-12" />
                <blockquote className="text-lg md:text-xl text-center mb-6 text-gray-700 relative z-10">
                  {testimonials[currentIndex].text}
                </blockquote>
                <div className="text-center">
                  <span className="font-medium text-yellow-800 text-sm md:text-base bg-yellow-100/50 px-4 py-1 rounded-full">
                    {testimonials[currentIndex].author}
                  </span>
                </div>
                <FaQuoteRight className="text-yellow-400/30 absolute bottom-6 right-6 w-8 h-8 md:w-12 md:h-12" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlay(false);
                  setCurrentIndex(index);
                }}
                className={`transition-all duration-300 ease-in-out transform hover:scale-110
                  ${
                    index === currentIndex
                      ? "w-8 bg-yellow-500"
                      : "w-2 bg-yellow-200"
                  }
                  h-2 rounded-full`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
