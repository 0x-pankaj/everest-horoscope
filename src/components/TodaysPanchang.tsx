"use client"
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
    return <div className="text-center">Loading panchang information...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!panchangInfo) {
    return <div className="text-center">No panchang information available</div>;
  }

  return (
    <div className="bg-purple-800 text-yellow-100 rounded-lg shadow-md p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FaSun className="text-yellow-300 text-3xl mr-2" />
          <h2 className="text-2xl font-bold">Today's Panchang</h2>
        </div>
        <Link href="/panchang" className="bg-purple-600 text-yellow-100 px-4 py-2 rounded-lg hover:bg-purple-500 transition-colors flex items-center">
          <FaInfoCircle className="mr-2" />
          More Info
        </Link>
      </div>
      <p className="text-sm mb-4">Identify important Tithis with Hindu Panchang</p>
      <div className="bg-purple-700 rounded-lg p-4">
        <p className="text-xl font-semibold mb-2">{panchangInfo.date}</p>
        <div className="grid grid-cols-2 gap-2">
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
  <div>
    <p className="text-yellow-200 font-semibold">{label}:</p>
    <p>{value}</p>
  </div>
);

export default PanchangHome;