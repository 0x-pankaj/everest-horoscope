// src/app/api/payment/create/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();
    if (!amount || isNaN(Number(amount))) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Change to live PayPal API URL
    const response = await fetch(
      "https://api-m.paypal.com/v2/checkout/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${process.env.PAYPAL_LIVE_CLIENT_ID}:${process.env.PAYPAL_LIVE_CLIENT_SECRET}`,
          ).toString("base64")}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: amount.toString(),
              },
            },
          ],
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to create payment");
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Create payment error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payment" },
      { status: 500 },
    );
  }
}
