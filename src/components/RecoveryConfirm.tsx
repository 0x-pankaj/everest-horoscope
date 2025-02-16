"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { account } from "@/appwrite/clientConfig";
import toast from "react-hot-toast";

const RecoveryConfirm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!userId || !secret) {
      setError("Invalid recovery link");
      return;
    }

    try {
      await account.updateRecovery(userId, secret, password);
      toast.success("Password updated successfully");
      router.push("/login");
    } catch (error: any) {
      setError(error.message || "Failed to update password");
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className={`mx-auto w-full max-w-lg bg-gray-200/50 rounded-xl p-10`}>
        <h2 className="text-center text-2xl font-bold leading-tight text-black mb-6">
          Reset Your Password
        </h2>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-8">
          <div className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="text-base font-medium text-gray-900"
              >
                New Password
              </label>
              <div className="mt-2">
                <input
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  id="password"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="text-base font-medium text-gray-900"
              >
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  id="confirmPassword"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-md bg-primary px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-primary/80"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecoveryConfirm; 