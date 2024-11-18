"use client";

import { useState } from "react";
import PayPalButton from "@/components/PayPalButton";
import { useAuthStore } from "@/store/Auth";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";

export default function CreditsPage() {
  const [customAmount, setCustomAmount] = useState<string>("");
  const user = useAuthStore((state) => state.user);
  const currentBalance = user?.prefs?.balance ?? 0;

  const handleSuccess = () => {
    toast.success("Payment completed successfully!");
  };

  const handleError = (error: string) => {
    toast.error(error);
  };

  const validateCustomAmount = (value: string) => {
    const numValue = parseFloat(value);
    return !isNaN(numValue) && numValue > 0 && numValue <= 1000; // Add maximum limit if needed
  };

  return (
    <div className="container mx-auto p-4">
      {/* Current Balance Card */}
      <Card className="bg-white p-6 mb-8 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-700">Current Balance</h2>
            <p className="text-3xl font-bold text-primary mt-2">
              ${currentBalance.toFixed(2)}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Available for use in the platform
          </div>
        </div>
      </Card>

      <h1 className="text-2xl font-bold mb-6">Purchase Credits</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Preset amounts */}
        {[10, 25, 50].map((amount) => (
          <div key={amount} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-2">${amount} Credits</h3>
            <p className="text-gray-600 mb-4">Add ${amount} to your account</p>
            
            <PayPalButton
              amount={amount}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </div>
        ))}

        {/* Custom amount card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-2">Custom Amount</h3>
          <div className="mb-4">
            <div className="relative mt-2 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="block w-full rounded-md border-0 py-2 pl-7 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                placeholder="Enter amount"
                min="1"
                max="1000"
                step="0.01"
              />
            </div>
          </div>
          
          {customAmount && !validateCustomAmount(customAmount) && (
            <p className="text-red-500 text-sm mb-2">
              Please enter a valid amount between $1 and $1000
            </p>
          )}
          
          {validateCustomAmount(customAmount) && (
            <PayPalButton
              amount={parseFloat(customAmount)}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          )}
        </div>
      </div>

      {/* Terms and conditions or additional information */}
      <div className="mt-8 text-sm text-gray-500">
        <p>
          * Credits will be added to your account immediately after successful payment.
          For any issues with payments, please contact support.
        </p>
      </div>
    </div>
  );
}