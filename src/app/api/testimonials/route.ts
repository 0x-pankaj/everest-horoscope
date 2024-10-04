import { NextRequest, NextResponse } from 'next/server';
import { Query } from 'appwrite';
import { database } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';

export async function GET() {
  try {
    const testimonials = await database.listDocuments(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwriteTestimonialCollectionId,
      [Query.orderDesc('$createdAt')]
    );
    return NextResponse.json(testimonials.documents);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text, author } = await request.json();
    const testimonial = await database.createDocument(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwriteTestimonialCollectionId,
      'unique()',
      { text, author }
    );
    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await database.deleteDocument(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwriteTestimonialCollectionId,
      id
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}