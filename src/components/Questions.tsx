'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/store/chatStore';

type Category = 'Personality & Life' | 'Luck & Fortune' | 'Money & Income' | 'Love & Marriage';

const questionsData: Record<Category, string[]> = {
  'Personality & Life': [
    "How would you describe my personality traits?",
    "Can I realistically achieve my life goals?",
    "Will I maintain stability in my daily life?",
    "How satisfied can I expect to be with my life?",
    "Is there potential for unexpected recognition or honor?",
    "Are there any major changes on the horizon in my life?"
  ],
  'Luck & Fortune': [  
    "Does luck seem to be on my side?",
    "When might I encounter the best opportunities for financial success?",
    "What actions can I take to improve my destiny?",
    "When is it likely I'll fulfill my ultimate destiny?",
    "Which numbers and colors are considered lucky for me?"
  ],
  'Money & Income': [
    "What income level can I expect?",
    "What are the most profitable options for earning money?",
    "Is it wise to invest my savings?",
    "Why do I struggle to save money?",
    "Can I recover lost funds?"
  ],
  'Love & Marriage': [
    "When might I find my ideal life partner?",
    "Can you describe the characteristics of my future partner?",
    "What path is best for marriage?",
    "Is there potential for a new relationship this year?",
    "Can I expect satisfaction in my marriage?"
  ]
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
        <button 
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

const QuestionsComponent: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | ''>('');
  const router = useRouter();
  const addQuestion = useChatStore((state) => state.addQuestion);

  const handleQuestionClick = (question: string) => {
    addQuestion(question);
    router.push('/chat');
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Common Questions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(Object.keys(questionsData) as Category[]).map((category) => (
          <div 
            key={category} 
            className="cursor-pointer"
            onClick={() => handleCategoryClick(category)}
          >
            <img 
              // src={`/api/placeholder/200/200?text=${encodeURIComponent(category)}`} 
              src='/pooja.png'
              alt={category}
              className="w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow"
            />
            <p className="mt-2 text-center font-semibold">{category}</p>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedCategory}
      >
        <ul className="list-disc pl-5">
          {selectedCategory && questionsData[selectedCategory]?.map((question, index) => (
            <li 
              key={index} 
              className="mb-2 cursor-pointer hover:text-blue-600"
              onClick={() => handleQuestionClick(question)}
            >
              {question}
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
};

export default QuestionsComponent;