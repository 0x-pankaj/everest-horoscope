// FAQ.tsx
"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

const faqs: FAQItem[] = [
  {
    question: "Is there any time limit to the chat?",
    answer:
      "No, there is no time limit. You can talk to our Jyotish as much as you want to consult for one single Kundali consultation.",
  },
  {
    question: "Are the chats private and secure?",
    answer:
      "Yes. The chats are end to end encrypted between you and the Jyotish. So, it is private and secure.",
  },
  {
    question: "Is ticket refundable?",
    answer: (
      <div>
        <p className="mb-4">
          No, the ticket is not refundable. If you have any queries you can
          contact us at following details:
        </p>
        <div className="space-y-2">
          <p>
            Email:{" "}
            <a
              href="mailto:jyotish@hamropatro.com"
              className="text-blue-600 hover:underline"
            >
              astroeverest@gmail.com
            </a>
          </p>
          <p>
            Phone (Nepal):{" "}
            <a
              href="tel:+9779761662499"
              className="text-blue-600 hover:underline"
            >
              +977 9761662499
            </a>
          </p>
        </div>
      </div>
    ),
  },
  {
    question: "Can I just do a  chat without call?",
    answer:
      "Yes, you will see an option to disable the video once the chat begins.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center relative">
          <span className="relative inline-block">
            Frequently asked questions
            <div className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
          </span>
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6 flex justify-between items-center bg-white"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaChevronDown className="w-5 h-5 text-purple-500" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-6 pt-0 text-gray-600 bg-gray-50">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
