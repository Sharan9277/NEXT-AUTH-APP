// middleware.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { connectToDatabase } from '@/lib/mongodb';
import Student from '@/models/Student';

export async function middleware(req) {
  const token = await getToken({ req });
  const url = req.nextUrl.clone();

  // If no token, redirect to login
  if (!token) {
    url.pathname = '/login/student';
    return NextResponse.redirect(url);
  }

  // Connect to the database and check verification status
  await connectToDatabase();
  const student = await Student.findOne({ user_id: token.sub });

  // If student is found and not verified, redirect to verification page
  if (student && !student.isVerified) {
    url.pathname = '/verify-email';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
