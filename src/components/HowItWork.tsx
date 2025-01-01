import { User, HelpCircle, Mail, ThumbsUp, Star } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <User className="w-8 h-8" />,
      title: "Step 1",
      description: "Register to Everest Astro",
    },
    {
      icon: <HelpCircle className="w-8 h-8" />,
      title: "Step 2",
      description: "Select your Question",
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Step 3",
      description: "Chat with astrologer",
    },
    {
      icon: <ThumbsUp className="w-8 h-8" />,
      title: "Step 4",
      description: "Rate and Recommend",
    },
  ];

  return (
    <div className="w-full min-h-[400px] bg-[#000014] relative p-8 overflow-hidden">
      {/* Starry background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] bg-[length:20px_20px] opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <h2 className="text-3xl font-bold text-white text-center mb-16">
          How It Works
        </h2>

        {/* Desktop version */}
        <div className="hidden md:flex justify-between items-center relative">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white transform -translate-y-1/2"></div>

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative z-10 flex flex-col items-center"
            >
              {/* Circle with icon */}
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-4">
                <div className="text-black">{step.icon}</div>
              </div>

              {/* Step information */}
              <div className="text-center">
                <p className="text-gray-300 mb-2">{step.title}</p>
                <p className="text-white font-medium w-32">
                  {step.description}
                </p>
              </div>

              {/* Stars for the last step */}
              {index === steps.length - 1 && (
                <div className="flex mt-2">
                  {[...Array(3)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile version */}
        <div className="md:hidden space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              {/* Circle with icon */}
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mr-4 flex-shrink-0">
                <div className="text-black">{step.icon}</div>
              </div>

              {/* Step information */}
              <div>
                <p className="text-gray-300 mb-1">{step.title}</p>
                <p className="text-white font-medium">{step.description}</p>

                {/* Stars for the last step */}
                {index === steps.length - 1 && (
                  <div className="flex mt-2">
                    {[...Array(3)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
