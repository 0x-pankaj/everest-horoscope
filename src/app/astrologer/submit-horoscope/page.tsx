// app/astrologer/submit-horoscope/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const SubmitHoroscope: React.FC = () => {
  const [zodiac, setZodiac] = useState('');
  const [prediction, setPrediction] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/horoscopes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zodiac,
          prediction,
          date,
          astrologerId: 'your-astrologer-id', // Replace with actual astrologer ID
        }),
      });

      if (response.ok) {
        alert('Horoscope submitted successfully!');
        setZodiac('');
        setPrediction('');
        setDate(new Date().toISOString().split('T')[0]);
        router.refresh();
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error submitting horoscope:', error);
      alert('An error occurred while submitting the horoscope.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-yellow-50">
      <h1 className="text-2xl font-bold mb-6 text-yellow-800">Submit Daily Horoscope</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="zodiac" className="block mb-2 text-yellow-700">Zodiac Sign:</label>
          <select
            id="zodiac"
            value={zodiac}
            onChange={(e) => setZodiac(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a zodiac sign</option>
            {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map((sign) => (
              <option key={sign} value={sign}>{sign}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date" className="block mb-2 text-yellow-700">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="prediction" className="block mb-2 text-yellow-700">Prediction:</label>
          <textarea
            id="prediction"
            value={prediction}
            onChange={(e) => setPrediction(e.target.value)}
            className="w-full p-2 border rounded"
            rows={5}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:bg-yellow-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Horoscope'}
        </button>
      </form>
    </div>
  );
};

export default SubmitHoroscope;