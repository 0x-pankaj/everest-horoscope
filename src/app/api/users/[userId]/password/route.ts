// src/app/api/users/[userId]/password/route.ts
import { users } from '@/appwrite/serverConfig';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { password } = await request.json();
    await users.updatePassword(params.userId, password);
    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
  }
}