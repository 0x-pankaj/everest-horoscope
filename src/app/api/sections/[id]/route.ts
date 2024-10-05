import { database } from "@/appwrite/clientConfig";
import conf from "@/conf/conf";
import { NextResponse } from "next/server";

// app/api/sections/[id]/route.ts
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { name, image, questions, category } = body;
    const filteredBody = { name, image, questions, category };

    const response = await database.updateDocument(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwriteQuestionCollectionId,
      params.id,
      filteredBody
    );
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating section:", error);
    return NextResponse.json({ error: 'Failed to update section' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await database.deleteDocument(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwriteQuestionCollectionId,
      params.id
    );
    return NextResponse.json({ message: 'Section deleted successfully' });
  } catch (error) {
    console.error("Error deleting section:", error);
    return NextResponse.json({ error: 'Failed to delete section' }, { status: 500 });
  }
}