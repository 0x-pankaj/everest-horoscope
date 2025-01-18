"use client";

import React, { useState, useEffect } from "react";
import {
  TbZodiacAquarius,
  TbZodiacAries,
  TbZodiacCancer,
  TbZodiacCapricorn,
  TbZodiacGemini,
  TbZodiacLeo,
  TbZodiacLibra,
  TbZodiacPisces,
  TbZodiacSagittarius,
  TbZodiacScorpio,
  TbZodiacTaurus,
  TbZodiacVirgo,
} from "react-icons/tb";

interface ZodiacSign {
  name: string;
  icon: React.ReactElement;
}

interface Horoscope {
  zodiac: string;
  prediction: string;
  date: string;
}

const zodiacSigns: ZodiacSign[] = [
  { name: "Aries", icon: <TbZodiacAries /> },
  { name: "Taurus", icon: <TbZodiacTaurus /> },
  { name: "Gemini", icon: <TbZodiacGemini /> },
  { name: "Cancer", icon: <TbZodiacCancer /> },
  { name: "Leo", icon: <TbZodiacLeo /> },
  { name: "Virgo", icon: <TbZodiacVirgo /> },
  { name: "Libra", icon: <TbZodiacLibra /> },
  { name: "Scorpio", icon: <TbZodiacScorpio /> },
  { name: "Sagittarius", icon: <TbZodiacSagittarius /> },
  { name: "Capricorn", icon: <TbZodiacCapricorn /> },
  { name: "Aquarius", icon: <TbZodiacAquarius /> },
  { name: "Pisces", icon: <TbZodiacPisces /> },
];

const ZodiacHoroscope: React.FC = () => {
  const [selectedZodiac, setSelectedZodiac] = useState<string | null>(null);
  const [horoscope, setHoroscope] = useState<Horoscope | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("today");

  useEffect(() => {
    if (selectedZodiac) {
      fetchHoroscope(selectedZodiac, selectedDate);
    }
  }, [selectedZodiac, selectedDate]);

  const fetchHoroscope = async (zodiac: string, date: string) => {
    try {
      const response = await fetch(
        `/api/horoscopes?zodiac=${zodiac}&date=${date}`,
      );
      if (response.ok) {
        const data = await response.json();
        setHoroscope(data);
      } else {
        console.error("Error fetching horoscope:", await response.text());
        setHoroscope(null);
      }
    } catch (error) {
      console.error("Error fetching horoscope:", error);
      setHoroscope(null);
    }
  };

  const getFormattedDate = (dateString: string) => {
    const date = new Date();
    if (dateString === "yesterday") {
      date.setDate(date.getDate() - 1);
    } else if (dateString === "tomorrow") {
      date.setDate(date.getDate() + 1);
    }
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-yellow-50">
      <h2 className="text-2xl font-bold mb-6 text-center text-yellow-800">
        Know What Your Zodiac Sign Says About You
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-8">
        {zodiacSigns.map((sign) => (
          <button
            key={sign.name}
            onClick={() => setSelectedZodiac(sign.name)}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              selectedZodiac === sign.name
                ? "bg-yellow-200"
                : "hover:bg-yellow-100"
            }`}
          >
            <div className="text-4xl text-yellow-600">{sign.icon}</div>
            <span className="mt-2 text-sm text-yellow-700">{sign.name}</span>
          </button>
        ))}
      </div>
      <div className="mb-4">
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="yesterday">Yesterday</option>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
        </select>
      </div>
      {horoscope ? (
        <div className="bg-white shadow-lg rounded-lg p-6 border-2 border-yellow-300">
          <h3 className="text-xl font-semibold mb-4 text-yellow-800">
            {selectedZodiac} Horoscope
          </h3>
          <p className="mb-2 text-yellow-600">
            Date: {getFormattedDate(selectedDate)}
          </p>
          <p className="text-yellow-700">{horoscope.prediction}</p>
        </div>
      ) : (
        selectedZodiac && (
          <p className="text-yellow-700">
            No horoscope available for the selected date.
          </p>
        )
      )}
    </div>
  );
};

export default ZodiacHoroscope;
