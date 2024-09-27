// src/app/api/users/route.ts
import { users } from '@/appwrite/serverConfig';
import { Query } from 'node-appwrite';
import { NextRequest, NextResponse } from 'next/server';
import { ID } from 'node-appwrite';

/*
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '30';
  const filters = Object.fromEntries(searchParams.entries());
  delete filters.page;
  delete filters.limit;

  try {
    const result = await users.list(
      Object.entries(filters).map(([key, value]) => `${key}=${value}`)
    );
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
*/

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    console.log("search: ", searchParams.get("email"))
    const email = searchParams.get("email")
    let result;
    if (!email){
      result = await users.list();
    } else {
      result = await users.list([Query.equal("email",[email])])
    }
    console.log("result: ", result);
    return NextResponse.json(result);
  } catch (error) {
    console.log("Error while fetching users: ", error)
    return NextResponse.json({error: "failed to fetch users"}, {status: 500})
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone } = await request.json();
    const result = await users.create(ID.unique(), email, phone, password, name);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}