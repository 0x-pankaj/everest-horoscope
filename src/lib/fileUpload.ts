// utils/fileUpload.ts
import { storage } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';
import { ID } from 'appwrite';

interface UploadResult {
  fileId: string;
  fileUrl: string;
}

export async function uploadFile(file: File): Promise<UploadResult> {
  try {
    const result = await storage.createFile(
      conf.appwriteHoroscopeBucket,
      ID.unique(),
      file
    );

    const fileUrl = storage.getFileView(
      conf.appwriteHoroscopeBucket,
      result.$id
    );

    return {
      fileId: result.$id,
      fileUrl: fileUrl.href
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}