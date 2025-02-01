"use client";
import React, { useEffect } from "react";
import { database } from "@/appwrite/clientConfig";
import conf from "@/conf/conf";
import { Query, AppwriteException } from "appwrite";
import { Star, Users, Award, Heart, Coffee, BookOpen } from "lucide-react";

interface Astrologer {
  $id: string;
  user_id: string;
  name: string;
  photoUrl: string;
  rating: number;
  experience: number;
  hourlyRate: number;
  language: string[];
  isOnline: boolean;
}

const AboutPage = () => {
  const [astrologers, setAstrologers] = React.useState<Astrologer[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        const response = await database.listDocuments(
          conf.appwriteHoroscopeDatabaseId,
          conf.appwriteAstroCollectionId,
          [Query.equal("isOnline", true)],
        );
        setAstrologers(response.documents as unknown as Astrologer[]);
      } catch (err) {
        setError(
          err instanceof AppwriteException
            ? `${err.message} (Code: ${err.code})`
            : "Failed to fetch astrologers",
        );
      } finally {
        setIsLoading(false);
      }
    };

    //chekcing

    fetchAstrologers();
  }, []);

  // console.log("astrologers: ", astrologers);

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

            {astrologers.map((astrologer, index) => {
              return (
                <div
                  key={astrologer.$id}
                  className="bg-white rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300"
                >
                  <div className="p-6">
                    <div className="text-center">
                      <div>
                        <img
                          src={astrologer.photoUrl || "/default-avatar.png"}
                          alt={astrologer.name}
                          className="w-16 h-16 rounded-full object-cover mx-auto"
                        />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {astrologer.name}
                      </h3>
                      <p className="text-indigo-600">Senior Astrologer</p>
                      <p className="mt-4 text-gray-500">
                        {astrologer.experience}+ years of experience in Vedic
                        astrology and horoscope analysis.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
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
