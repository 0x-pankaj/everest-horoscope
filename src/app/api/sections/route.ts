// app/api/sections/route.ts
import { NextResponse } from 'next/server';
import { ID } from 'appwrite';
import { database } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';

export async function GET() {
  try {
    const response = await database.listDocuments(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwriteQuestionCollectionId
    );
    return NextResponse.json(response.documents);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await database.createDocument(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwriteQuestionCollectionId,
      ID.unique(),
      {
        name: body.name,
        image: body.image,
        questions: body.questions,
        category: body.category  // Add category field
      }
    );
    return NextResponse.json(response);
  } catch (error) {
    console.log("Error in API route: ", error);
    return NextResponse.json({ error: 'Failed to create section' }, { status: 500 });
  }
}

