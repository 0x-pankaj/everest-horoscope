import { users } from "@/appwrite/serverConfig";
import axios from "axios";
import { NextRequest } from "next/server";

// API route code
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    const { userId } = params;
    const response = await users.get(userId);
    // Return a proper Response object with JSON
    return Response.json(response);
  } catch (error) {
    console.error("Error in getUser route: ", error);
    // Return error as proper Response object
    return Response.json({ error: "Failed to get user" }, { status: 500 });
  }
}
