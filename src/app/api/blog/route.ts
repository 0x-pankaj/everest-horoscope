// app/api/blog/route.ts
import { NextResponse } from 'next/server';
import { database } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';
import { ID, Query } from 'appwrite';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    const response = await database.listDocuments(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwriteBlogCollectionId,
      [
        Query.orderDesc('$createdAt'),
        Query.limit(limit),
        Query.offset((page - 1) * limit)
      ]
    );
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await database.createDocument(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwriteBlogCollectionId,
      ID.unique(),
      body
    );
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}
