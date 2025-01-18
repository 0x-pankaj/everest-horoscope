// QuestionsComponent.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/legacy/image";
import Link from "next/link";
import { FaSpinner } from "react-icons/fa";
import { useChatStore } from "@/store/chatStore";
import { INITIAL_QUESTION_COST } from "@/store/Auth";
import { useAuthStore } from "@/store/Auth";
import toast from "react-hot-toast";
import VastoForm, { AuspiciousDataForm } from "./VastoForm";

interface Section {
  $id: string;
  name: string;
  image: string;
  questions: string[];
  category: string;
}

const QuestionsComponent: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isModalTrue, setIsModalTrue] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  const [showAuspiciousForm, setShowAuspiciousForm] = useState(false);

  const router = useRouter();
  const addQuestion = useChatStore((state) => state.addQuestion);
  const { user, checkAndDeductBalance, trackQuestion } = useAuthStore();

  useEffect(() => {
    fetchSections();
  }, []);

  const handleShowAuspiciousForm = () => {
    setModalOpen(false); // Close the modal
    setShowAuspiciousForm(true); // Show the form
  };

  const fetchSections = async () => {
    try {
      const response = await fetch("/api/sections");
      const data = await response.json();
      if (Array.isArray(data)) {
        setSections(data);
      } else {
        throw new Error("Received data is not in the expected format");
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      setError("Failed to load sections. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // const handleQuestionClick = (question: string) => {
  //   addQuestion(question);
  //   router.push('/chat');
  // };

  // const handleQuestionClick = async (question: string) => {
  //   if (!user) {
  //     toast.error("Please login to ask questions");
  //     router.push('/login');
  //     return;
  //   }

  //   // Show confirmation dialog
  //   if (!confirm(`This question will cost $${INITIAL_QUESTION_COST}. Do you want to continue?`)) {
  //     return;
  //   }

  //   try {
  //     // checking question count and showing user that they have only 3, 2, 1 free questions left on basic of question count
  //     const questionCount = user.prefs.questionsAsked || 0;
  //     switch (questionCount) {
  //     }
  //     // Check and deduct balance
  //     const balanceCheck = await checkAndDeductBalance(INITIAL_QUESTION_COST);

  //     if (!balanceCheck.success) {
  //       if(balanceCheck.error){
  //         toast.error(balanceCheck.error);
  //       }
  //       if (balanceCheck.error?.includes("Insufficient balance")) {
  //         router.push('/credit');
  //       }
  //       return;
  //     }

  //     // Track question count
  //     const trackResult = await trackQuestion();
  //     if (!trackResult.success) {
  //       toast.error("Failed to process question");
  //       return;
  //     }

  //     // Add question to chat and navigate
  //     addQuestion(question);
  //     router.push('/chat');

  //   } catch (error) {
  //     console.error("Error processing question:", error);
  //     toast.error("Failed to process question");
  //   }
  // };

  const handleQuestionClick = async (question: string) => {
    if (!user) {
      toast.error("Please login to ask questions");
      router.push("/login");
      return;
    }

    const questionCount = Number(user.prefs.questionsAsked || 0);
    const questionsRemaining = 3 - questionCount;

    let confirmMessage = "";

    if (questionCount < 3) {
      // Show number of free questions remaining
      if (questionsRemaining === 1) {
        confirmMessage = `This is your last free question! You have ${questionsRemaining} free question remaining. Would you like to continue?`;
      } else {
        confirmMessage = `You have ${questionsRemaining} free questions remaining. Would you like to continue?`;
      }
    } else {
      // Show cost for paid questions
      confirmMessage = `This question will cost $${INITIAL_QUESTION_COST}. Do you want to continue?`;
    }

    // Show custom toast notification instead of basic confirm
    const shouldProceed = await new Promise<boolean>((resolve) => {
      toast.custom(
        (t) => (
          <div
            className={`${t.visible ? "animate-enter" : "animate-leave"} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex flex-col justify-center it`}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {confirmMessage}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-t border-gray-200">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(true);
                }}
                className="flex-1 px-4 py-3 text-sm font-medium text-indigo-600 border-r border-gray-200 hover:text-indigo-500 focus:outline-none"
              >
                Continue
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(false);
                }}
                className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        ),
        {
          duration: 5000,
        },
      );
    });

    if (!shouldProceed) {
      return;
    }

    try {
      // Check and deduct balance
      const balanceCheck = await checkAndDeductBalance(INITIAL_QUESTION_COST);

      if (!balanceCheck.success) {
        if (balanceCheck.error) {
          toast.error(balanceCheck.error);
        }
        if (balanceCheck.error?.includes("Insufficient balance")) {
          router.push("/credit");
        }
        return;
      }

      // Track question count
      const trackResult = await trackQuestion();
      if (!trackResult.success) {
        toast.error("Failed to process question");
        return;
      }

      // If successful, show a success message with remaining free questions
      if (questionCount < 2) {
        // Show remaining free questions only if there are any left after this question
        toast.success(
          `Question submitted! You have ${questionsRemaining - 1} free questions remaining.`,
        );
      } else if (questionCount === 2) {
        toast.success("Question submitted! This was your last free question.");
      } else {
        toast.success("Question submitted successfully!");
      }

      // Add question to chat and navigate
      addQuestion(question);
      router.push("/chat");
    } catch (error) {
      console.error("Error processing question:", error);
      toast.error("Failed to process question");
    }
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

  // Group sections by category
  const groupedSections = sections.reduce(
    (acc, section) => {
      if (!acc[section.category]) {
        acc[section.category] = [];
      }
      acc[section.category].push(section);
      return acc;
    },
    {} as Record<string, Section[]>,
  );

  return (
    <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-2 overflow-y-scroll md:p-6">
      <div className="max-w-6xl mx-auto bg-gradient-to-r from-purple-300 to-yellow-200 rounded-lg shadow-md p-3 md:p-6">
        <h2 className="text-xl md:text-3xl font-bold mb-3 md:mb-6 text-center text-indigo-700">
          Frequently Asked Question
        </h2>
        {sections.length === 0 ? (
          <p className="text-center text-gray-600">No sections available.</p>
        ) : (
          <>
            {Object.entries(groupedSections).map(
              ([category, categorySections]) => (
                <div key={category} className="mb-8">
                  <h3 className="text-lg md:text-2xl font-semibold mb-4 text-indigo-600">
                    {category}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
                    {categorySections.map((section) => (
                      <div
                        key={section.$id}
                        className="cursor-pointer transform hover:scale-105 transition-transform duration-300"
                        onClick={() => handleSectionClick(section)}
                      >
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                          <Image
                            src={section.image || "/astro_logo_f.png"}
                            alt={section.name || "default name"}
                            width={300}
                            height={200}
                            className="w-full h-24 md:h-48 object-cover"
                          />
                          <div className="p-2 md:p-4">
                            <p className="text-center font-semibold text-indigo-600 text-xs md:text-base">
                              {section.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
            <div className="text-center mt-4 md:mt-6">
              <Link
                href="/all-questions"
                className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors duration-300 text-sm md:text-base"
              >
                View All Sections
              </Link>
            </div>
          </>
        )}

        {modalOpen && selectedSection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start p-4 z-50 overflow-y-auto">
            <div className="relative bg-white rounded-lg p-4 md:p-6 max-w-md w-full my-8 mx-auto">
              <div className="max-h-[80vh] overflow-y-auto">
                <h2 className="text-lg md:text-2xl font-bold mb-4 text-indigo-700 sticky top-0">
                  {selectedSection.name}
                </h2>
                <p className="text-sm text-gray-600 mb-2">
                  Category: {selectedSection.category}
                </p>
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
                <div className="flex justify-between mt-4 sticky bottom-0">
                  <button
                    className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition-colors duration-300 text-sm md:text-base"
                    onClick={() => setModalOpen(false)}
                  >
                    Close
                  </button>
                  {selectedSection.category === "Auspicious day" && (
                    <button
                      className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition-colors duration-300 text-sm md:text-base"
                      onClick={handleShowAuspiciousForm}
                    >
                      Find Auspicious Day
                    </button>
                  )}
                  <button
                    className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition-colors duration-300 text-sm md:text-base"
                    onClick={() => router.push("/chat")}
                  >
                    Ask Question
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* <VastoForm /> */}
      {showAuspiciousForm && (
        <AuspiciousDataForm
          category={selectedSection?.category || "business"}
          onClose={() => setShowAuspiciousForm(false)}
        />
      )}
    </div>
  );
};

export default QuestionsComponent;
