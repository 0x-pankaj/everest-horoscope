import { NextResponse } from 'next/server';
import { database } from '@/appwrite/serverConfig';
import conf from '@/conf/conf';
import { ID, Query } from 'appwrite';

  export async function GET() {
    try {

      console.log("database: ", conf.appwriteHoroscopeDatabaseId)
      console.log("collectionId: ", conf.appwriteTranslatorCollectionId)
      console.log("database: ", conf.appwriteHoroscopeDatabaseId)
      console.log("collectionId: ", conf.appwriteTranslatorCollectionId)
      const response = await database.listDocuments(
        conf.appwriteHoroscopeDatabaseId,
        conf.appwriteTranslatorCollectionId,
      );
      console.log("Translator: ", response.documents[0]);
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
    // console.log("body: ", body);
    const { $id,name, user_id, languages } = body;
    // console.log("data: ", $id);
    
    const response = await database.updateDocument(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwriteTranslatorCollectionId,
      $id,
      {
        name,
        user_id,
        languages
      }
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