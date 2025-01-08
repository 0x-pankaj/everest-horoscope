// app/auth-callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/Auth";
import toast from "react-hot-toast";

export default function AuthCallback() {
  const router = useRouter();
  const authStore = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      const result = await authStore.handleOAuthCallback();

      if (result.success) {
        toast.success("Successfully logged in!");
        router.push("/");
      } else {
        toast.error("Login failed");
        router.push("/login");
      }
    };

    handleCallback();
  }, [authStore, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Processing login...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
}
