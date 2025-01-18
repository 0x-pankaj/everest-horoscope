// src/components/PayPalButton.tsx
"use client";

import { useState } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useAuthStore } from "@/store/Auth";
import { FaPaypal } from "react-icons/fa";
import axios from "axios";

const PayPalButtonWrapper = ({
  amount,
  onSuccess,
  onError,
}: {
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const { user, updateBalance } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleError = (errorMessage: string) => {
    console.error(errorMessage);
    onError?.(errorMessage);
  };

  if (isPending) {
    return (
      <div className="h-12 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <PayPalButtons
      style={{
        layout: "vertical",
        color: "blue",
        shape: "rect",
        label: "pay",
      }}
      forceReRender={[amount]}
      createOrder={async () => {
        try {
          const response = await axios.post("/api/payment/create", {
            amount: amount,
          });

          if (!response.data.id) {
            throw new Error("Failed to create order");
          }

          return response.data.id;
        } catch (err: any) {
          handleError(err.response?.data?.error || "Failed to create order");
          throw err;
        }
      }}
      onApprove={async (data) => {
        try {
          setLoading(true);

          if (!user?.$id) {
            throw new Error("User not authenticated");
          }

          const response = await axios.post(
            `/api/payment/capture/${data.orderID}`,
            {},
            {
              headers: {
                "user-id": user.$id,
              },
            },
          );

          if (
            response.data.status === "COMPLETED" ||
            response.data.status === "completed"
          ) {
            try {
              const result = await updateBalance(amount, "ADD");
              if (result.success) {
                console.log(
                  `Successfully added balance. New balance: ${result.newBalance}`,
                );
                onSuccess?.();
              } else {
                throw new Error(result.error || "Failed to update balance");
              }
            } catch (error: any) {
              handleError(error.message || "Failed to update balance");
            }
          } else {
            throw new Error("Payment not completed");
          }
        } catch (err: any) {
          handleError(err.message || "Payment capture failed");
        } finally {
          setLoading(false);
        }
      }}
      onError={(err) => {
        console.error("PayPal Error:", err);
        handleError("PayPal encountered an error");
      }}
      onCancel={() => {
        handleError("Payment cancelled");
      }}
    />
  );
};

export default function PayPalButton({
  amount,
  onSuccess,
  onError,
  className = "",
}: {
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}) {
  const [error, setError] = useState<string | null>(null);

  // Use live client ID
  const paypalInitialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_LIVE_CLIENT_ID!,
    currency: "USD",
    intent: "capture",
    dataClientId: process.env.NEXT_PUBLIC_PAYPAL_LIVE_CLIENT_ID!,
  };

  if (!process.env.NEXT_PUBLIC_PAYPAL_LIVE_CLIENT_ID) {
    console.error("PayPal client ID not configured");
    return null;
  }

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {error && (
        <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="relative">
        <PayPalScriptProvider options={paypalInitialOptions}>
          <PayPalButtonWrapper
            amount={amount}
            onSuccess={onSuccess}
            onError={(err) => {
              setError(err);
              onError?.(err);
            }}
          />
        </PayPalScriptProvider>

        <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
          <FaPaypal className="mr-2" />
          <span>Secure payment powered by PayPal</span>
        </div>
      </div>
    </div>
  );
}
