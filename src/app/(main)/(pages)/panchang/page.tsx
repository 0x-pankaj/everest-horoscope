"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PanchangInfo {
  $id: string;
  date: string;
  tithi: string;
  nakshatra: string;
}

const PanchangList: React.FC = () => {
  const [panchangs, setPanchangs] = useState<PanchangInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPanchangs = async () => {
      try {
        const response = await fetch(`/api/panchang?page=${page}`);
        if (!response.ok) {
          throw new Error('Failed to fetch panchang information');
        }
        const data = await response.json();
        setPanchangs(data.documents);
        setTotalPages(Math.ceil(data.total / 10));
      } catch (err) {
        setError('Error loading panchang information');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPanchangs();
  }, [page]);

  if (loading) {
    return <div className="text-center">Loading panchang information...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Panchang List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {panchangs.map((panchang) => (
          <Link href={`/panchang/${panchang.$id}`} key={panchang.$id}>
            <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-2">
                <FaCalendarAlt className="text-purple-600 mr-2" />
                <h2 className="text-xl font-semibold">{panchang.date}</h2>
              </div>
              <p><strong>Tithi:</strong> {panchang.tithi}</p>
              <p><strong>Nakshatra:</strong> {panchang.nakshatra}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="bg-purple-600 text-white px-4 py-2 rounded-l-lg disabled:bg-gray-300"
        >
          <FaChevronLeft />
        </button>
        <span className="bg-purple-100 text-purple-800 px-4 py-2">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="bg-purple-600 text-white px-4 py-2 rounded-r-lg disabled:bg-gray-300"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default PanchangList;