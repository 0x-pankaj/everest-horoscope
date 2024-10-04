"use client";

import { useAuthStore } from "@/store/Auth";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

const VerifyAccount = () => {
  const searchParams = useSearchParams();
  const router =  useRouter();
  const auth = useAuthStore();

  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  if (!userId || !secret) {
    return null;
  }

  // if (auth.user?.$id !== userId) {
  //   return <div className="text-center text-red-500 font-bold mt-8">Unauthorized</div>;
  // }

  const updateVerify = async () => {
    try {
      const verify = await auth.verifyAccount(userId, secret);
      if (verify.success) {
        toast.success("Verified successfully");
      }
      router.push("/login");
    } catch (error) {
      console.error("Error while verifying:", error);
      toast.error("Verification failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Account Verification</h2>
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-offset-2 focus:ring-offset-gray-100"
          onClick={updateVerify}
        >
          Click here to Verify
        </button>
      </div>
    </div>
  );
};

export default VerifyAccount;

// import { useRef, useState, useEffect } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { useAuthStore } from '@/store/Auth';

// const VerifyAccount = () => {
//   const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
//   const [message, setMessage] = useState('');
//   const [userId, setUserId] = useState<string | null>(null);
//   const [secret, setSecret] = useState<string | null>(null);
//   const inputRefs = useRef<HTMLInputElement[]>([]);
//   const verifyAccount = useAuthStore((state) => state.verifyAccount);
//   const router = useRouter();

//    const params = useSearchParams();

// console.log("userId: ", params.get("userId"));
  


//   const handleChange = (index: number, value: string) => {
//     if (/^[0-9]?$/.test(value)) {
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);

//       if (value && index < 5) {
//         inputRefs.current[index + 1].focus();
//       }
//     }
//   };

//   const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === 'Backspace' && !otp[index] && index > 0) {
//       inputRefs.current[index - 1].focus();
//     }
//   };

//   const handleVerify = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setMessage('');
    
//     if (!userId || !secret) {
//       setMessage('Invalid verification data. Please request a new verification link.');
//       return;
//     }

//     const result = await verifyAccount(userId, secret);
//     if (result.success) {
//       setMessage('Account verified successfully. You can now log in.');
//       // Redirect to login page after a short delay
//       setTimeout(() => router.push('/login'), 3000);
//     } else {
//       setMessage('Failed to verify account. Please try again or request a new verification link.');
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6 text-center">Verify Account</h2>
//         {message ? (
//           <p className={`text-center ${message.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
//             {message}
//           </p>
//         ) : (
//           <form onSubmit={handleVerify}>
//             <div className="flex justify-center space-x-2 mb-4">
//               {otp.map((digit, index) => (
//                 <input
//                   key={index}
//                   type="text"
//                   value={digit}
//                   onChange={(e) => handleChange(index, e.target.value)}
//                   onKeyDown={(e) => handleKeyDown(index, e)}
//                   maxLength={1}
//                   ref={(el) => {inputRefs.current[index] = el as HTMLInputElement}}
//                   className="w-12 h-12 border border-gray-300 rounded-md text-center text-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               ))}
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//             >
//               Verify Account
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VerifyAccount;