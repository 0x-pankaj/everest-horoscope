// File: app/api/astrologers/route.ts
import { NextResponse } from "next/server";
import { database } from "@/appwrite/clientConfig";
import conf from "@/conf/conf";
import { ID, Query } from "appwrite";

export async function GET() {
  try {
    const response = await database.listDocuments(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwriteAstroCollectionId,
      [Query.orderDesc("$createdAt")],
    );
    return NextResponse.json(response.documents);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch astrologers" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rating, experience, hourlyRate, name, ...astrologer } = body;
    console.log("astro data: ", astrologer);
    const existingAstrologers = await database.listDocuments(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwriteAstroCollectionId,
      [Query.equal("email", astrologer.email)],
    );

    if (existingAstrologers.total > 0) {
      return NextResponse.json(
        { error: "An astrologer with this email already exists" },
        { status: 400 },
      );
    }
    console.log("reached here");
    console.log("rating: ", name);
    const response = await database.createDocument(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwriteAstroCollectionId,
      ID.unique(),
      {
        ...astrologer,
        name,
        rating: Number(rating),
        experience: Number(experience),
        hourlyRate: Number(hourlyRate),
      },
    );
    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to create astrologer: ${error.message} ` },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    // console.log("body: ", body);
    const { $id, $databaseId, $collectionId, ...astrologerData } = body;

    const response = await database.updateDocument(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwriteAstroCollectionId,
      $id,
      astrologerData,
    );
    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to update astrologer: ${error.message}` },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await database.deleteDocument(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwriteAstroCollectionId,
      id,
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete astrologer" },
      { status: 500 },
    );
  }
}
