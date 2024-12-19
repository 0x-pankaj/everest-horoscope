// src/app/api/auspicious-service/route.ts
import { NextRequest, NextResponse } from "next/server";
import { database } from "@/appwrite/clientConfig";
import { ID } from "appwrite";
import conf from "@/conf/conf";
import { Query } from "appwrite";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const userId = params.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "UserId is required" },
        { status: 400 },
      );
    }

    const response = await database.listDocuments(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwriteAuspiciousServiceCollectionId,
      [Query.equal("id", userId)],
    );

    console.log("auspicious data: ", response.documents);

    return NextResponse.json(response.documents);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch auspicious services" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Prepare data for database
    const serviceData = {
      id: data.id,
      category: data.category,
      startDate: data.startDate,
      endDate: data.endDate,
      direction: data.direction,
      auspiciousPurpose: data.auspiciousPurpose,
    };

    try {
      const response = await database.createDocument(
        conf.appwriteHoroscopeDatabaseId,
        conf.appwriteAuspiciousServiceCollectionId,
        ID.unique(),
        serviceData,
      );

      return NextResponse.json(
        { message: "Auspicious service request submitted successfully" },
        { status: 201 },
      );
    } catch (error) {
      console.error("Error creating document:", error);
      return NextResponse.json(
        { error: "Failed to submit auspicious service request" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
