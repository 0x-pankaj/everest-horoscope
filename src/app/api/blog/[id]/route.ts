// app/api/blog/[id]/route.ts
import { NextResponse } from 'next/server';
import { database } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const response = await database.getDocument(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwriteBlogCollectionId,
      params.id
    );
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
      const body = await request.json();
      const response = await database.updateDocument(
        conf.appwriteHoroscopeDatabaseId,
        conf.appwriteBlogCollectionId,
        params.id,
        body
      );
      return NextResponse.json(response);
    } catch (error) {
      return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
    }
  }
  
  export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
      await database.deleteDocument(
        conf.appwriteHoroscopeDatabaseId,
        conf.appwriteBlogCollectionId,
        params.id
      );
      return NextResponse.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
    }
  }