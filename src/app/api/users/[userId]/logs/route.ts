// src/app/api/users/[userId]/logs/route.ts
import { users } from '@/appwrite/serverConfig';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const logs = await users.listLogs(params.userId);
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user logs' }, { status: 500 });
  }
}