import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import Image from "next/legacy/image";
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-purple-900 to-gray-900 text-yellow-200 py-12">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="flex flex-wrap justify-between mb-12">
          {/* Logo and Description */}
          <div className="w-full md:w-1/3 mb-10 md:mb-0">
            <div className="flex flex-col items-center md:items-start">
              <Image
                className="hidden md:block mb-4"
                src="/astro_logo_f.png"
                alt="Everest Horoscope Logo"
                width={150}
                height={150}
              />
              <p className="text-center md:text-left text-gray-300 max-w-xs">
                Empowering you with cosmic insights and spiritual guidance to help you navigate your life journey.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="w-full md:w-1/3 mb-10 md:mb-0">
            <h3 className="text-xl font-semibold mb-6 text-center md:text-left text-yellow-400">Quick Links</h3>
            <ul className="space-y-4 text-center md:text-left">
              <li>
                <Link href="/" className="hover:text-yellow-400 transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-yellow-400 transition-colors duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-yellow-400 transition-colors duration-300">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-yellow-400 transition-colors duration-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="w-full md:w-1/3">
            <h3 className="text-xl font-semibold mb-6 text-center md:text-left text-yellow-400">Contact Us</h3>
            <div className="text-center md:text-left space-y-2">
              <p className="text-gray-300">123 Cosmic Lane, Astrology City, AST 456</p>
              <p className="text-gray-300">Email: info@everesthoroscope.com</p>
              <p className="text-gray-300">Phone: +977 9800 000 000</p>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center md:justify-between items-center space-x-6 md:space-x-0 mb-8">
          <div className="flex space-x-4">
            <Link href="https://facebook.com" className="text-yellow-300 hover:text-yellow-500 transition-colors duration-300">
              <FaFacebookF className="h-6 w-6" />
            </Link>
            <Link href="https://twitter.com" className="text-yellow-300 hover:text-yellow-500 transition-colors duration-300">
              <FaTwitter className="h-6 w-6" />
            </Link>
            <Link href="https://instagram.com" className="text-yellow-300 hover:text-yellow-500 transition-colors duration-300">
              <FaInstagram className="h-6 w-6" />
            </Link>
            <Link href="https://linkedin.com" className="text-yellow-300 hover:text-yellow-500 transition-colors duration-300">
              <FaLinkedinIn className="h-6 w-6" />
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-400 border-t border-gray-700 pt-4">
          <p>&copy; {new Date().getFullYear()} Everest Horoscope. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
