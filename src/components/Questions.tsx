'use client'
import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/store/chatStore';


const questionsData = {
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

const QuestionsComponent: React.FC = () => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const router = useRouter();
  const addQuestion = useChatStore((state) => state.addQuestion);

  const handleQuestionClick = (question: string) => {
    addQuestion(question);
    router.push('/chat');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Common Questions</h2>
      {Object.entries(questionsData).map(([category, questions]) => (
        <div key={category} className="mb-4">
          <button
            className="flex justify-between items-center w-full text-left font-semibold p-2 bg-gray-100 rounded"
            onClick={() => setOpenCategory(openCategory === category ? null : category)}
          >
            {category}
            {openCategory === category ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {openCategory === category && (
            <ul className="mt-2 pl-5 list-disc">
              {questions.map((question, index) => (
                <li 
                  key={index} 
                  className="mb-2 cursor-pointer hover:text-blue-600"
                  onClick={() => handleQuestionClick(question)}
                >
                  {question}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuestionsComponent;