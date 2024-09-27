// app/api/todays-panchang/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';
import { ID, Query } from 'appwrite';

export async function GET(request: NextRequest) {
  try {
    const date = new Date().toISOString().split('T')[0];
    const response = await database.listDocuments(
      conf.appwriteHoroscopeDatabaseId, 
      conf.appwritePanchangDetails,
      [ Query.equal("date", [date])]
    );
    console.log("response panchgnag: ", response)
    if (response.documents.length > 0) {
      const panchang = response.documents[0];
      // Convert Appwrite DateTime to ISO string for easier handling on the client side
      panchang.date = new Date(panchang.date).toISOString();
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
        date
      }
    );

    return NextResponse.json(newPanchang, { status: 201 });
  } catch (error) {
    console.error('Error adding panchang information:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}