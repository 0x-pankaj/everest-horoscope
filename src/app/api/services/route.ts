// src/app/api/services/route.ts
import { database } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';
import { ID } from 'appwrite';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await database.listDocuments(
            conf.appwriteHoroscopeDatabaseId,
            conf.appwriteServicesCollectionId
        );
        return NextResponse.json(response.documents);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}

export async function POST(request: Request) {  
    try {
        const body = await request.json();
        // console.log("service backend body: ", body);
        const response = await database.createDocument(
            conf.appwriteHoroscopeDatabaseId,
            conf.appwriteServicesCollectionId,
            ID.unique(),
            body
        );
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
    }
}
