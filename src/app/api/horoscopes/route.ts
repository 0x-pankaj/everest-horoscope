// app/api/horoscopes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';
import { Query } from 'appwrite';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const zodiac = searchParams.get('zodiac');
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  if (!zodiac) {
    return NextResponse.json({ error: 'Zodiac sign is required' }, { status: 400 });
  }

  try {
    const response = await database.listDocuments(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwriteZodiacCollectionId,
      [
        Query.equal("zodiac", [zodiac]),
        Query.equal("date", [date])
      ]
    );

    if (response.documents.length > 0) {
      return NextResponse.json(response.documents[0]);
    } else {
      return NextResponse.json({ error: 'Horoscope not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching horoscope:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { zodiac, prediction, date, astrologerId } = body;

  if (!zodiac || !prediction || !date || !astrologerId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const response = await database.createDocument(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwriteZodiacCollectionId,
      'unique()',
      {
        zodiac,
        prediction,
        date,
        astrologerId
      }
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating horoscope:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}