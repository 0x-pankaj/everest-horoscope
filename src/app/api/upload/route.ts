// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { ID } from 'appwrite';
import { storage } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  try {
    const result = await storage.createFile(
      conf.appwriteHoroscopeBucket,
      ID.unique(),
      file
    );
    console.log("file: ",result.$id);
    //getting url of stored file
    const storage_url = await storage.getFile(conf.appwriteHoroscopeBucket, result.$id)
    console.log("storage_url: ", storage_url)

    return NextResponse.json({ fileId: result.$id, file_url: storage_url });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}