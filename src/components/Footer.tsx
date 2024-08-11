import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import Image from 'next/image';
import logo from '@/assets/images/everest-logo.png'; // Ensure you have an image in this path
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between mb-8">
          {/* Logo and Description */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <Image className='hidden md:block ' src={logo} alt="Everest Horoscope Logo" width={150} height={150} />
            <p className="mt-4 text-gray-400">
              Empowering you with cosmic insights and spiritual guidance to help you navigate life journey.
            </p>
          </div>

          {/* Quick Links */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul>
              <li>
                <Link href="/" className="hover:underline text-gray-400">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline text-gray-400">About Us</Link>
              </li>
              <li>
                <Link href="/services" className="hover:underline text-gray-400">Services</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline text-gray-400">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="w-full md:w-1/3">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-400 mb-2">123 Cosmic Lane, Astrology City, AST 456</p>
            <p className="text-gray-400 mb-2">Email: info@everesthoroscope.com</p>
            <p className="text-gray-400">Phone: +977 9800 000 000</p>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center space-x-4">
          <Link href="https://facebook.com" className="text-gray-400 hover:text-white">
            <FaFacebookF className="h-6 w-6" />
          </Link>
          <Link href="https://twitter.com" className="text-gray-400 hover:text-white">
            <FaTwitter className="h-6 w-6" />
          </Link>
          <Link href="https://instagram.com" className="text-gray-400 hover:text-white">
            <FaInstagram className="h-6 w-6" />
          </Link>
          <Link href="https://linkedin.com" className="text-gray-400 hover:text-white">
            <FaLinkedinIn className="h-6 w-6" />
          </Link>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Everest Horoscope. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
