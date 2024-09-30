// app/questions/page.tsx
'use client'
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

const QuestionsComponent: React.FC = () => {
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
      console.log('Fetched data:', data); // Debug log
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Common Questions</h2>
      {sections.length === 0 ? (
        <p>No sections available.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sections.map((section) => (
            <div 
              key={section.$id} 
              className="cursor-pointer"
              onClick={() => handleSectionClick(section)}
            >
              <Image 
                src={section.image}
                alt={section.name}
                width={200}
                height={200}
                className="w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow"
              />
              <p className="mt-2 text-center font-semibold">{section.name}</p>
            </div>
          ))}
        </div>
      )}

      {modalOpen && selectedSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">{selectedSection.name}</h2>
            <ul className="list-disc pl-5">
              {selectedSection.questions.map((question, index) => (
                <li 
                  key={index} 
                  className="mb-2 cursor-pointer hover:text-blue-600"
                  onClick={() => handleQuestionClick(question)}
                >
                  {question}
                </li>
              ))}
            </ul>
            <button 
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => setModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionsComponent;