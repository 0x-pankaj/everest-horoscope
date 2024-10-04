"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaSpinner } from 'react-icons/fa';
import { useChatStore } from '@/store/chatStore';

interface Section {
  $id: string;
  name: string;
  image: string;
  questions: string[];
}

const AllQuestionsPage: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const router = useRouter();
  const addQuestion = useChatStore((state) => state.addQuestion);

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
    <div className="bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-4xl font-bold mb-8 text-center text-indigo-800">All Sections</h1>
        {sections.length === 0 ? (
          <p className="text-center text-gray-600">No sections available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sections.map((section) => (
              <div 
                key={section.$id} 
                className="cursor-pointer transform hover:scale-105 transition-transform duration-300"
                onClick={() => handleSectionClick(section)}
              >
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <Image 
                    src={section.image || '/astro_logo_f.png'}
                    alt={section.name || "default name"}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-center font-semibold text-indigo-600">{section.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {modalOpen && selectedSection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4 text-indigo-700">{selectedSection.name}</h2>
              <ul className="list-disc pl-5">
                {selectedSection.questions.map((question, index) => (
                  <li 
                    key={index} 
                    className="mb-2 cursor-pointer hover:text-indigo-600 transition-colors duration-300"
                    onClick={() => handleQuestionClick(question)}
                  >
                    {question}
                  </li>
                ))}
              </ul>
              <button 
                className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition-colors duration-300"
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

export default AllQuestionsPage;