'use client'
import React, { useEffect, useState } from 'react';
import { FaSun, FaInfoCircle } from 'react-icons/fa';
import Link from 'next/link';

interface PanchangInfo {
  $id: string;
  date: string;
  tithi: string;
  nakshatra: string;
  yoga: string;
  firstKarana: string;
  secondKarana: string;
  vaar: string;
  rahuKalam: string;
}

const PanchangHome: React.FC = () => {
  const [panchangInfo, setPanchangInfo] = useState<PanchangInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPanchangInfo = async () => {
      try {
        const response = await fetch('/api/todays-panchang');
        if (!response.ok) {
          throw new Error('Failed to fetch panchang information');
        }
        const data: PanchangInfo = await response.json();
        setPanchangInfo(data);
      } catch (err) {
        setError('Error loading panchang information');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPanchangInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center text-lg text-yellow-200">Loading panchang information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (!panchangInfo) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center text-yellow-200">No panchang information available</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-700 to-purple-900 text-yellow-100 rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FaSun className="text-yellow-300 text-4xl" />
          <h2 className="text-3xl font-bold">Today's Panchang</h2>
        </div>
        <Link
          href="/panchang"
          className="bg-purple-600 text-yellow-100 px-4 py-2 rounded-lg hover:bg-purple-500 transition-all flex items-center"
        >
          <FaInfoCircle className="mr-2" />
          More Info
        </Link>
      </div>
      <p className="text-lg mb-6 text-center">
        Identify important Tithis with Hindu Panchang
      </p>
      <div className="bg-purple-800 bg-opacity-50 rounded-lg p-6">
        <p className="text-2xl font-semibold mb-4 text-center">{panchangInfo.date}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InfoItem label="Tithi" value={panchangInfo.tithi} />
          <InfoItem label="Nakshatra" value={panchangInfo.nakshatra} />
          <InfoItem label="Yoga" value={panchangInfo.yoga} />
          <InfoItem label="First Karana" value={panchangInfo.firstKarana} />
          <InfoItem label="Second Karana" value={panchangInfo.secondKarana} />
          <InfoItem label="Vaar" value={panchangInfo.vaar} />
          <InfoItem label="Rahu Kalam" value={panchangInfo.rahuKalam} />
        </div>
      </div>
    </div>
  );
};

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="p-4 bg-purple-700 rounded-lg shadow-inner">
    <p className="text-yellow-300 font-semibold mb-1">{label}:</p>
    <p className="text-yellow-100">{value}</p>
  </div>
);

export default PanchangHome;
