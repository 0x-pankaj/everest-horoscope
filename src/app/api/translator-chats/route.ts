import { NextResponse } from "next/server";
import { database } from "@/appwrite/clientConfig";
import conf from "@/conf/conf";
import { Query } from "appwrite";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { translated_by } = body;

    const response = await database.listDocuments(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwriteMessageCollectionId,
      [
        // Query.equal("translated_by", translated_by),
        Query.isNotNull("original_body"),
        Query.orderDesc("$createdAt"),
      ],
    );
    // console.log("response: ", response);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}
