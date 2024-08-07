"use client"

import { useRef, useState } from 'react';

const VerifyAccount = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (index: number, value: string) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to the next input box
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    // Logic to verify the OTP
    console.log('OTP entered:', otp.join(''));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify Account</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
        >
          <div className="flex justify-center space-x-2 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength={1}
                ref={(el) => (inputRefs.current[index] = el as HTMLInputElement)}
                className="w-12 h-12 border border-gray-300 rounded-md text-center text-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Verify Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyAccount;
