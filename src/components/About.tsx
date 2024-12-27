import React from "react";
import { Star, Users, Award, Heart, Coffee, BookOpen } from "lucide-react";

const AboutPage = () => {
  const astrologyData = [
    {
      planet: "Sun",
      familial: "Father",
      political: "King",
      personal: "Soul, power",
      bodyPart: "Bone",
      color: "Red",
      direction: "East",
      place: "Place of god",
      taste: "Spicy",
      metal: "Copper",
    },
    {
      planet: "Moon",
      familial: "Mother",
      political: "Queen",
      personal: "Mind, thinking",
      bodyPart: "Eyes",
      color: "White",
      direction: "North west",
      place: "Place of water",
      taste: "Salty",
      metal: "Diamond",
    },
    {
      planet: "Mars",
      familial: "Brother",
      political: "Army",
      personal: "Courage, bravery",
      bodyPart: "Blood",
      color: "Pink",
      direction: "South",
      place: "Place of fire",
      taste: "Bitter",
      metal: "Gold",
    },
    {
      planet: "Mercury",
      familial: "Children",
      political: "Prince princess",
      personal: "Speech, cleaver",
      bodyPart: "Skin",
      color: "Green",
      direction: "North",
      place: "Place of athletic",
      taste: "Mix",
      metal: "Gold",
    },
    {
      planet: "Jupiter",
      familial: "Guardians",
      political: "Advisor",
      personal: "Knowledge, wisdom",
      bodyPart: "Muscle",
      color: "Yellow",
      direction: "North east",
      place: "Place of store",
      taste: "Sugar",
      metal: "Silver",
    },
    {
      planet: "Venus",
      familial: "Sister",
      political: "Minister",
      personal: "Happiness, love",
      bodyPart: "Sperm ova",
      color: "Gray",
      direction: "South east",
      place: "Place for relief rest",
      taste: "Acidic",
      metal: "Pearl",
    },
    {
      planet: "Saturn",
      familial: "Worker",
      political: "Bureaucrat",
      personal: "Agony, suffer",
      bodyPart: "Nerve",
      color: "Black",
      direction: "West",
      place: "Barren place",
      taste: "Bitter",
      metal: "Pearl",
    },
    {
      planet: "Rahu",
      familial: "Out family member",
      political: "Diplomatist",
      personal: "Matter of Upheaval",
      bodyPart: "Blood",
      color: "Brown",
      direction: "South west",
      place: "Place for animal",
      taste: "Acidic",
      metal: "Iron",
    },
    {
      planet: "Ketu",
      familial: "Person to create Quarrel",
      political: "Matter of interfere",
      personal: "Enlightenment, salvation",
      bodyPart: "Nerve",
      color: "Blue",
      direction: "Center",
      place: "Place for salvation",
      taste: "Sugar",
      metal: "Glass",
    },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Discover Your Path with</span>
                  <span className="block text-indigo-600">Everest Astro</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                  Guiding you through life's journey with ancient wisdom and
                  modern understanding
                </p>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Astrology Chart Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-3xl font-extrabold text-indigo-600">
              Understanding Astrology's Influence
            </h2>
          </div>

          <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Planet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Familial
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Political
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Personal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Body Part
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Color
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Direction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Place
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taste
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metal
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {astrologyData.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.planet}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.familial}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.political}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.personal}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.bodyPart}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.color}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.direction}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.place}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.taste}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.metal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-extrabold text-indigo-600">
              Our Mission
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              To provide authentic astrological guidance that empowers
              individuals to make informed decisions and lead more fulfilling
              lives.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Feature 1 */}
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                      <Star className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900">
                      Expert Guidance
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Professional astrologers with years of experience and deep
                      knowledge.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900">
                      Personalized Approach
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Tailored readings and solutions for your unique life
                      situation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900">
                      Trusted Results
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Proven track record of accurate predictions and satisfied
                      clients.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900">
                      Client Care
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Dedicated support and guidance throughout your journey.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gradient-to-r from-purple-100 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-indigo-600">
              Our Expert Team
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Experienced astrologers dedicated to providing you with accurate
              guidance.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Team Member 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="p-6">
                <div className="text-center">
                  <div className="h-32 w-32 rounded-full bg-indigo-200 mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Dr. Rajesh Sharma
                  </h3>
                  <p className="text-indigo-600">Senior Astrologer</p>
                  <p className="mt-4 text-gray-500">
                    20+ years of experience in Vedic astrology and horoscope
                    analysis.
                  </p>
                </div>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="p-6">
                <div className="text-center">
                  <div className="h-32 w-32 rounded-full bg-indigo-200 mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Maya Joshi
                  </h3>
                  <p className="text-indigo-600">Relationship Specialist</p>
                  <p className="mt-4 text-gray-500">
                    Expert in relationship astrology and marriage compatibility.
                  </p>
                </div>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="p-6">
                <div className="text-center">
                  <div className="h-32 w-32 rounded-full bg-indigo-200 mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Arun Pandey
                  </h3>
                  <p className="text-indigo-600">
                    Career & Business Specialist
                  </p>
                  <p className="mt-4 text-gray-500">
                    Specialized in career guidance and business astrology.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-indigo-600">
              Our Services
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Comprehensive astrological services tailored to your needs
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {/* Service 1 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md">
              <div className="flex items-center">
                <BookOpen className="h-6 w-6 text-indigo-500" />
                <h3 className="ml-3 text-lg font-medium text-gray-900">
                  Birth Chart Analysis
                </h3>
              </div>
              <p className="mt-4 text-gray-500">
                Detailed analysis of your birth chart to understand your life
                path, strengths, and challenges.
              </p>
            </div>

            {/* Service 2 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md">
              <div className="flex items-center">
                <Coffee className="h-6 w-6 text-indigo-500" />
                <h3 className="ml-3 text-lg font-medium text-gray-900">
                  Career Guidance
                </h3>
              </div>
              <p className="mt-4 text-gray-500">
                Astrological insights to help you make better career decisions
                and achieve professional success.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to discover your path?</span>
            <span className="block">Start your journey with us today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Get personalized astrological guidance from our expert team.
          </p>
          <a
            href="/contact"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
