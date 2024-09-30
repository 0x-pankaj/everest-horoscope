'use client'
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaCalendarAlt } from 'react-icons/fa';

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

const PanchangDetail: React.FC = () => {
  const [panchang, setPanchang] = useState<PanchangInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchPanchang = async () => {
      if (!id) return;
      try {
        const response = await fetch(`/api/panchang/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch panchang information');
        }
        const data: PanchangInfo = await response.json();
        setPanchang(data);
      } catch (err) {
        setError('Error loading panchang information');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPanchang();
  }, [id]);

  if (loading) {
    return <div className="text-center">Loading panchang information...</div>;
  }

  if (error || !panchang) {
    return <div className="text-center text-red-500">{error || 'Panchang not found'}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center mb-4">
          <FaCalendarAlt className="text-purple-600 text-3xl mr-3" />
          <h1 className="text-3xl font-bold">Panchang Details</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem label="Date" value={panchang.date} />
          <InfoItem label="Tithi" value={panchang.tithi} />
          <InfoItem label="Nakshatra" value={panchang.nakshatra} />
          <InfoItem label="Yoga" value={panchang.yoga} />
          <InfoItem label="First Karana" value={panchang.firstKarana} />
          <InfoItem label="Second Karana" value={panchang.secondKarana} />
          <InfoItem label="Vaar" value={panchang.vaar} />
          <InfoItem label="Rahu Kalam" value={panchang.rahuKalam} />
        </div>
      </div>
    </div>
  );
};

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="border-b border-gray-200 py-2">
    <p className="text-gray-600 font-semibold">{label}:</p>
    <p className="text-gray-800">{value}</p>
  </div>
);

export default PanchangDetail;