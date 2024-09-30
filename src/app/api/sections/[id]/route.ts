// app/api/sections/[id]/route.ts
import { database } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const response = await database.updateDocument(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwriteQuestionCollectionId,
      params.id,
      body
    );
    return NextResponse.json(response);
  } catch (error) {
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
    return NextResponse.json({ error: 'Failed to delete section' }, { status: 500 });
  }
}