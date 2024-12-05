import { NextResponse } from 'next/server';
import { database } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';
import { ID, Query } from 'appwrite';

  export async function GET() {
    try {

      console.log("database: ", conf.appwriteHoroscopeDatabaseId)
      console.log("collectionId: ", conf.appwriteTranslatorCollectionId)
      const response = await database.listDocuments(
        conf.appwriteHoroscopeDatabaseId,
        conf.appwriteTranslatorCollectionId,
        [Query.orderDesc('$createdAt')]
      );
      console.log("response: ", response)
      return NextResponse.json(response.documents);
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch astrologers' }, { status: 500 });
    }
  }

export async function POST(request: Request) {   
  try {
    const body = await request.json();
    const response = await database.createDocument(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwriteTranslatorCollectionId,
      ID.unique(),
      {
        name: body.name,
        userId: body.userId,
        language: body.language
      }
    );
    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: `Failed to create translator: ${error.message}` }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { $id, ...translatorData } = body;
    
    const response = await database.updateDocument(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwriteTranslatorCollectionId,
      $id,
      translatorData
    );
    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: `Failed to update translator: ${error.message}` }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await database.deleteDocument(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwriteTranslatorCollectionId,
      id
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete translator' }, { status: 500 });
  }
}