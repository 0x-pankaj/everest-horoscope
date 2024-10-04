"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaSpinner, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useChatStore } from '@/store/chatStore';

interface Section {
  $id: string;
  name: string;
  image: string;
  questions: string[];
}

const QuestionsComponent: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const addQuestion = useChatStore((state) => state.addQuestion);

  const sectionsToShow = {
    mobile: 2,
    desktop: 8
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/sections');
      const data = await response.json();
      if (Array.isArray(data)) {
        setSections(data);
      } else if (data.documents && Array.isArray(data.documents)) {
        setSections(data.documents);
      } else {
        throw new Error('Received data is not in the expected format');
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      setError('Failed to load sections. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  const handleQuestionClick = (question: string) => {
    addQuestion(question);
    router.push('/chat');
  };

  const handleSectionClick = (section: Section) => {
    setSelectedSection(section);
    setModalOpen(true);
  };

  const nextSections = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + sectionsToShow.mobile < sections.length) ? prevIndex + sectionsToShow.mobile : prevIndex
    );
  };

  const prevSections = () => {
    setCurrentIndex((prevIndex) => (prevIndex - sectionsToShow.mobile >= 0 ? prevIndex - sectionsToShow.mobile : prevIndex));
  };

  const visibleSections = sections.slice(currentIndex, currentIndex + sectionsToShow.desktop);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gradient-to-r from-blue-100 to-purple-100  p-2 md:p-6">
      <div className="max-w-6xl mx-auto bg-gradient-to-r from-purple-300 to-yellow-200  rounded-lg shadow-md p-3 md:p-6">
        <h2 className="text-xl md:text-3xl font-bold mb-3 md:mb-6 text-center text-indigo-700">Common Questions</h2>
        {sections.length === 0 ? (
          <p className="text-center text-gray-600">No sections available.</p>
        ) : (
          <>
            <div className="flex justify-between items-center mb-3 md:mb-4">
              {
                sections.length > 9 ? (
                  <button 
                onClick={prevSections} 
                disabled={currentIndex === 0}
                className="bg-indigo-500 text-white px-2 py-1 md:px-4 md:py-2 rounded-full disabled:opacity-50 transition-colors duration-300"
              >
                <FaChevronLeft />
              </button>
                ) : null
              }
              {/* <span className="text-sm md:text-base text-indigo-600">
                {currentIndex + 1}-{Math.min(currentIndex + sectionsToShow.desktop, sections.length)} of {sections.length}
              </span> */}
              {
                sections.length > 8 ? (
                  <button 
                onClick={nextSections} 
                disabled={currentIndex + sectionsToShow.mobile >= sections.length}
                className="bg-indigo-500 text-white px-2 py-1 md:px-4 md:py-2 rounded-full disabled:opacity-50 transition-colors duration-300"
              >
                <FaChevronRight />
              </button>
                ) : null
              }
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
              {visibleSections.map((section, index) => (
                <div 
                  key={section.$id} 
                  className={`cursor-pointer transform hover:scale-105 transition-transform duration-300 ${index >= sectionsToShow.mobile ? 'hidden md:block' : ''}`}
                  onClick={() => handleSectionClick(section)}
                >
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <Image 
                      src={section.image || '/astro_logo_f.png'}
                      alt={section.name || "default name"}
                      width={300}
                      height={200}
                      className="w-full h-24 md:h-48 object-cover"
                    />
                    <div className="p-2 md:p-4">
                      <p className="text-center font-semibold text-indigo-600 text-xs md:text-base">{section.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-4 md:mt-6">
              <Link href="/all-questions" className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors duration-300 text-sm md:text-base">
                View All Sections
              </Link>
            </div>
          </>
        )}

        {modalOpen && selectedSection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-lg p-4 md:p-6 max-w-md w-full">
              <h2 className="text-lg md:text-2xl font-bold mb-4 text-indigo-700">{selectedSection.name}</h2>
              <ul className="list-disc pl-5">
                {selectedSection.questions.map((question, index) => (
                  <li 
                    key={index} 
                    className="mb-2 cursor-pointer hover:text-indigo-600 transition-colors duration-300 text-xs md:text-base"
                    onClick={() => handleQuestionClick(question)}
                  >
                    {question}
                  </li>
                ))}
              </ul>
              <button 
                className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition-colors duration-300 text-sm md:text-base"
                onClick={() => setModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionsComponent;




