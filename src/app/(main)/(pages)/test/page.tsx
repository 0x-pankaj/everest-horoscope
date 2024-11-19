"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/Auth";
import toast from "react-hot-toast";

export default function TestPage() {
  const [amount, setAmount] = useState<string>("");
  const user = useAuthStore((state) => state.user);
  const updateBalance = useAuthStore((state) => state.updateBalance);
  const currentBalance = user?.prefs?.balance ?? 0;

  // For testing: Let's display all preferences to verify they're preserved
  const allPreferences = user?.prefs ? (
    <pre className="text-sm bg-gray-100 p-4 rounded-lg overflow-auto">
      {JSON.stringify(user.prefs, null, 2)}
    </pre>
  ) : null;

  const handleUpdateBalance = async (operation: 'ADD' | 'SUBTRACT') => {
    if (!amount || isNaN(parseFloat(amount))) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      // Log previous state
      console.log('Previous state:', {
        balance: currentBalance,
        allPrefs: user?.prefs
      });

      const result = await updateBalance(parseFloat(amount), operation);
      
      if (result.success) {
        // Log new state
        console.log('New state:', {
          balance: result.newBalance,
          allPrefs: user?.prefs
        });

        toast.success(`Balance ${operation === 'ADD' ? 'added' : 'deducted'} successfully! New balance: $${result.newBalance}`);
        setAmount("");
      } else {
        toast.error(result.error || "Operation failed");
      }
    } catch (error) {
      console.error('Update balance error:', error);
      toast.error('Failed to update balance');
    }
  };

  // For testing: Add a mock preference if none exist
  useEffect(() => {
    if (user?.prefs && Object.keys(user.prefs).length === 0) {
      console.log('Adding test preferences...');
      const account = useAuthStore.getState().updateUser({
        ...user,
        prefs: {
          balance: 0,
          theme: 'light',
          language: 'en',
          testPref: 'test-value'
        }
      });
    }
  }, [user]);

  return (
    <div className="container mx-auto p-4">
      {/* Balance Display */}
      <div className="bg-white p-6 mb-8 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-2">Current Balance</h2>
        <p className="text-3xl font-bold text-green-600">${Number(currentBalance).toFixed(2)}</p>
      </div>

      {/* Balance Update Controls */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Test Amount</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full rounded-md border border-gray-300 pl-7 pr-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter amount"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => handleUpdateBalance('ADD')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Add Balance
          </button>
          <button 
            onClick={() => handleUpdateBalance('SUBTRACT')}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Subtract Balance
          </button>
        </div>
      </div>

      {/* Preferences Display */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">All User Preferences (for testing)</h2>
        {allPreferences}
      </div>

      {/* Debug Info */}
      <div className="mt-8 text-sm text-gray-500">
        <p>Open the browser console to see detailed state changes during operations.</p>
      </div>
    </div>
  );
}