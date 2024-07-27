
"use client"
import React from 'react';
import AstrologerProfileCard from './AstroCard';


const astrologers = [
  {
    name: "Jane Doe",
    photoUrl: "/images/astrologer1.jpg",
    bio: "Experienced astrologer specializing in Vedic astrology and tarot reading.",
    specialties: ["Vedic Astrology", "Tarot", "Numerology"],
    rating: 4.8,
    experience: 15,
  },
  {
    name: "John Smith",
    photoUrl: "/images/astrologer2.jpg",
    bio: "Expert in Western astrology with a focus on career and relationship guidance.",
    specialties: ["Western Astrology", "Career Guidance", "Relationship Counseling"],
    rating: 4.7,
    experience: 12,
  },
];

const FeaturedAstrologers: React.FC = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Top Astrologers</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {astrologers.map((astrologer, index) => (
            <AstrologerProfileCard
              key={index}
              {...astrologer}
              onChatClick={() => console.log(`Chat with ${astrologer.name}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedAstrologers;