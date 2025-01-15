// Features.tsx

"use client";

import { motion, AnimatePresence } from "framer-motion";

const Features = () => {
  const features = [
    {
      title: "Know about your life from Nepal's top and verified astrologer.",
      icon: "✨",
    },
    {
      title: "Save time, live call to everest astro from anywhere.",
      icon: "🌍",
    },
    {
      title:
        "Affordable and transparent fee. Ask all of your questions without time limit on single payment.",
      icon: "💰",
    },
    {
      title:
        "Private and safe - all calls are encrypted and are private and safe.",
      icon: "🔒",
    },
  ];

  return (
    <section className="py-16 px-2 bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">
          Features of Everest Astro
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-xl hover:bg-white/20 transition-colors"
            >
              <div className="flex items-start space-x-4">
                <span className="text-2xl">{feature.icon}</span>
                <p className="text-white text-lg">{feature.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Features;
