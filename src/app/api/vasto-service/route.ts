// src/app/api/vasto-service/route.ts
import { NextRequest, NextResponse } from "next/server";
import { storage, database } from "@/appwrite/clientConfig";
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
      conf.appwriteVastoServiceCollectionId,
      [Query.equal("id", userId)],
    );

    return NextResponse.json(response.documents);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    console.log("formData: ", formData);

    // Upload image first
    const houseMapFile = formData.get("houseMap") as File;
    console.log("houseMapFile: ", houseMapFile);
    let fileId = "";

    try {
      const uploadedFile = await storage.createFile(
        conf.appwriteHoroscopeBucket,
        ID.unique(),
        houseMapFile,
      );
      fileId = uploadedFile.$id;
      console.log("fileId: ", fileId);
    } catch (error) {
      console.error("Error uploading file:", error);
      return NextResponse.json(
        { error: "Failed to upload house map" },
        { status: 500 },
      );
    }

    // Prepare data for database
    const serviceData = {
      id: formData.get("id"),
      name: formData.get("name"),
      email: formData.get("email"),
      location: formData.get("location"),
      direction: formData.get("direction"),
      houseMap: fileId,
      selectedServices: JSON.parse(formData.get("selectedServices") as string),
      message: formData.get("message"),
      // createdAt: new Date().toISOString(),
    };

    console.log("serviceData: ", serviceData);

    try {
      // Create document in database
      console.log("creation hitted");
      const response = await database.createDocument(
        conf.appwriteHoroscopeDatabaseId,
        conf.appwriteVastoServiceCollectionId,
        ID.unique(),
        serviceData,
      );

      console.log("response: ", response);

      return NextResponse.json(
        { message: "Service request submitted successfully" },
        { status: 201 },
      );
    } catch (error) {
      // If database insertion fails, delete the uploaded file
      if (fileId) {
        try {
          await storage.deleteFile(conf.appwriteHoroscopeBucket, fileId);
        } catch (deleteError) {
          console.error("Error deleting file:", deleteError);
        }
      }

      console.error("Error creating document:", error);
      return NextResponse.json(
        { error: "Failed to submit service request" },
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
