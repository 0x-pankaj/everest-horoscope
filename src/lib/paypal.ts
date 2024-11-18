// // src/lib/paypal.ts
// import { 
//   PayPalHttpClient,
//   Environment,
//   OrdersCreateRequest,
//   OrdersCaptureRequest
// } from "@paypal/checkout-server-sdk";

// export const getPayPalClient = () => {
//   const clientId = process.env.PAYPAL_CLIENT_ID!;
//   const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
  
//   const environment = process.env.NODE_ENV === 'production'
//     ? new Environment.Live(clientId, clientSecret)
//     : new Environment.Sandbox(clientId, clientSecret);
  
//   return new PayPalHttpClient(environment);
// };

// export const createPayPalOrder = async (amount: string) => {
//   const client = getPayPalClient();
  
//   const request = new OrdersCreateRequest();
//   request.prefer("return=representation");
//   request.requestBody({
//     intent: "CAPTURE",
//     purchase_units: [{
//       amount: {
//         currency_code: "USD",
//         value: amount
//       }
//     }]
//   });

//   try {
//     const response = await client.execute(request);
//     return response.result;
//   } catch (error) {
//     console.error("PayPal order creation error:", error);
//     throw error;
//   }
// };

// export const capturePayPalOrder = async (orderId: string) => {
//   const client = getPayPalClient();
  
//   const request = new OrdersCaptureRequest(orderId);
//   request.prefer("return=representation");

//   try {
//     const response = await client.execute(request);
//     return response.result;
//   } catch (error) {
//     console.error("PayPal capture error:", error);
//     throw error;
//   }
// };