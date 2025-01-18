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

    const response = await fetch(
      // `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
      `https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${process.env.PAYPAL_LIVE_CLIENT_ID}:${process.env.PAYPAL_LIVE_CLIENT_SECRET}`,
            // `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
          ).toString("base64")}`,
        },
      },
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    // Record the transaction
    const amount = data.purchase_units[0].payments.captures[0].amount.value;
    const userId = request.headers.get("user-id");
    console.log("userid after payment done: ", userId);

    if (userId) {
      await database.createDocument(
        conf.appwriteHoroscopeDatabaseId,
        conf.appwriteTransactionHistoryCollectionId,
        ID.unique(),
        {
          userId,
          paypalOrderId: orderId,
          amount: parseFloat(amount),
          status: "completed",
          // timestamp: new Date().toISOString()
        },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Capture payment error:", error);
    return NextResponse.json(
      { error: "Failed to capture payment" },
      { status: 500 },
    );
  }
}
