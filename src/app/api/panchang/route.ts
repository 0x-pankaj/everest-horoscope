import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';
import { ID, Query } from 'appwrite';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 10;

  try {
    const response = await database.listDocuments(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwritePanchangDetails,
      [
        Query.orderDesc('date'),
        Query.limit(limit),
        Query.offset((page - 1) * limit)
      ]
    );

    // Ensure consistent date format for all documents
    const documents = response.documents.map(doc => ({
      ...doc,
      date: new Date(doc.date).toISOString().split('T')[0]
    }));

    return NextResponse.json({
      documents,
      total: response.total,
      page,
      pageSize: limit
    });
  } catch (error) {
    console.error('Error fetching panchang list:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, ...otherData } = body;

    if (!date || Object.keys(otherData).length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const newPanchang = await database.createDocument(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwritePanchangDetails,
      ID.unique(),
      {
        ...otherData,
        date: new Date(date).toISOString().split('T')[0] // Ensure consistent date format
      }
    );

    return NextResponse.json(newPanchang, { status: 201 });
  } catch (error) {
    console.error('Error adding panchang information:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}