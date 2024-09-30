import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const document = await database.getDocument(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwritePanchangDetails,
      id
    );

    // Ensure consistent date format
    document.date = new Date(document.date).toISOString().split('T')[0];

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error fetching panchang detail:', error);
    return NextResponse.json({ error: 'Panchang not found' }, { status: 404 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const body = await request.json();
    const { date, ...updateData } = body;

    const updatedPanchang = await database.updateDocument(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwritePanchangDetails,
      id,
      {
        ...updateData,
        date: new Date(date).toISOString().split('T')[0] // Ensure consistent date format
      }
    );

    return NextResponse.json(updatedPanchang);
  } catch (error) {
    console.error('Error updating panchang information:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    await database.deleteDocument(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwritePanchangDetails,
      id
    );

    return NextResponse.json({ message: 'Panchang deleted successfully' });
  } catch (error) {
    console.error('Error deleting panchang:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}