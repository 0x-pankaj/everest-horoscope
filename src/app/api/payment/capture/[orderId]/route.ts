// src/app/api/payment/capture/[orderId]/route.ts
import { NextResponse } from "next/server";
import { database } from "@/appwrite/clientConfig";
import { ID } from "appwrite";
import conf from "@/conf/conf";

export async function POST(
  request: Request,
  { params }: { params: { orderId: string } },
) {
  try {
    const { orderId } = params;

    // Change to live PayPal API URL
    const response = await fetch(
      `https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${process.env.PAYPAL_LIVE_CLIENT_ID}:${process.env.PAYPAL_LIVE_CLIENT_SECRET}`,
          ).toString("base64")}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to capture payment");
    }

    // Record the transaction
    const amount = data.purchase_units[0].payments.captures[0].amount.value;
    const userId = request.headers.get("user-id");

    if (!userId) {
      throw new Error("User ID is required");
    }

    await database.createDocument(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwriteTransactionHistoryCollectionId,
      ID.unique(),
      {
        userId,
        paypalOrderId: orderId,
        amount: parseFloat(amount),
        status: "completed",
        timestamp: new Date().toISOString(),
      },
    );

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Capture payment error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to capture payment" },
      { status: 500 },
    );
  }
}
