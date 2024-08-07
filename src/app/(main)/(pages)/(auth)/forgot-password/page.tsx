
"use client"

import { useState, ChangeEvent } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (e: ChangeEvent<HTMLFormElement>) => {
    setEmail(e.target.value);
  };

  const handleSendOtp = () => {
    // Logic to send OTP to the provided email
    console.log('OTP sent to:', email);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendOtp();
          }}
        >
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
