// src/app/api/users/[userId]/route.ts
import { users } from '@/appwrite/serverConfig';
import { NextRequest, NextResponse } from 'next/server';;

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const user = await users.get(params.userId);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {

  

    const { name, email, phone, status, emailVerification, phoneVerification, labels } = await request.json();
    console.log("paramsId: ", params.userId)
    console.log("name: ", name)
    let result;
     result = await users.get(params.userId)
    if (name) result = await users.updateName(params.userId, name);
    if (email) result = await users.updateEmail(params.userId, email);
    if (phone) result = await users.updatePhone(params.userId, phone);
    if (status !== undefined) result = await users.updateStatus(params.userId, status);
    if (emailVerification !== undefined) result = await users.updateEmailVerification(params.userId, emailVerification);
    if (phoneVerification !== undefined) result = await users.updatePhoneVerification(params.userId, phoneVerification);
    if (labels) result = await users.updateLabels(params.userId, labels);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await users.delete(params.userId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}