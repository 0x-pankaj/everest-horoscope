import React from 'react';
import Image from 'next/image';

const HowItWorks = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">How It Works</h2>
      <div className="hidden md:block">
        <Image src="/step-desktop.jpeg" alt="How It Works - Desktop" width={1200} height={400} layout="responsive" />
      </div>
      <div className="md:hidden">
        <Image src="/step-mobile.jpeg" alt="How It Works - Mobile" width={400} height={600} layout="responsive" />
      </div>
    </div>
  );
};

export default HowItWorks;