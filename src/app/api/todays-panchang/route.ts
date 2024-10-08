import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';
import { ID, Query } from 'appwrite';

export async function GET(request: NextRequest) {
  try {
    const today = new Date().toISOString().split('T')[0];
    let response = await database.listDocuments(
      conf.appwriteHoroscopeDatabaseId, 
      conf.appwritePanchangDetails,
      [Query.equal("date", [today])]
    );

    if (response.documents.length === 0) {
      // If no panchang for today, get the latest available
      response = await database.listDocuments(
        conf.appwriteHoroscopeDatabaseId,
        conf.appwritePanchangDetails,
        [Query.orderDesc("date"), Query.limit(1)]
      );
    }

    if (response.documents.length > 0) {
      const panchang = response.documents[0];
      // Ensure the date is in YYYY-MM-DD format
      panchang.date = new Date(panchang.date).toISOString().split('T')[0];
      return NextResponse.json(panchang);
    } else {
      return NextResponse.json({ error: 'No panchang information found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching panchang information:', error);
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