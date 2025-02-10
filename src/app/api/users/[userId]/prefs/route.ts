// src/app/api/users/[userId]/prefs/route.ts
import { users } from '@/appwrite/serverConfig';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const prefs = await users.getPrefs(params.userId);
    return NextResponse.json(prefs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user preferences' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    console.log("hitted 2");
    const { updatedPrefs } = await request.json();
    console.log("prefs: ", updatedPrefs);
    const result = await users.updatePrefs(params.userId, updatedPrefs);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user preferences' }, { status: 500 });
  }
}
