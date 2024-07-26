"use client"
import React from 'react';
import Image from 'next/image';
import teamImage from '@/assets/images/team.jpg';

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">About Us</h2>
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed">
            Welcome to Everest Horoscope! We are a dedicated team of astrologers and spiritual guides committed to helping you navigate the cosmic influences in your life. Our mission is to provide insightful and accurate horoscopes, personalized astrology readings, and spiritual guidance to empower you on your journey.
          </p>
        </div>
        <div className="mb-6">
          <Image
            src={teamImage}
            alt="Our Team"
            className="w-full h-auto rounded-lg shadow-md"
            width={800}
            height={400}
            objectFit="cover"
          />
        </div>
        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
          <p className="text-gray-700 leading-relaxed">
            Our vision is to be your trusted partner in discovering the wisdom of the stars. We believe in the transformative power of astrology and are committed to offering you the highest quality astrological services.
          </p>
        </div>
        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-4">Our Team</h3>
          <p className="text-gray-700 leading-relaxed">
            Our team of experienced astrologers and spiritual advisors are passionate about helping you find clarity and direction. We bring a wealth of knowledge and expertise in various astrological traditions and are dedicated to providing compassionate and insightful readings.
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-semibold mb-4">Our Services</h3>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed">
            <li>Daily, Weekly, and Monthly Horoscopes</li>
            <li>Personalized Astrology Readings</li>
            <li>Love and Compatibility Reports</li>
            <li>Career and Financial Guidance</li>
            <li>Spiritual Counseling</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
