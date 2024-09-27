// src/app/api/users/[userId]/sessions/[sessionId]/route.ts
import { users } from '@/appwrite/serverConfig';
import { NextRequest, NextResponse } from 'next/server';


export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string; sessionId: string } }
) {
  try {
    await users.deleteSession(params.userId, params.sessionId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user session' }, { status: 500 });
  }
}