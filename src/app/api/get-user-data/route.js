// app/api/get-user-data/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Tutor from '@/models/Tutor';

export async function POST(request) {
  try {
    // Parse request JSON
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // Connect to the database via Mongoose
    await connectToDatabase();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Find associated tutor profile using user._id
    const tutor = await Tutor.findOne({ user_id: user._id });

    // Return user and tutor data
    return NextResponse.json({
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        verified: user.verified || false,
      },
      tutor: tutor || null
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ message: "Failed to fetch user data", error: error.message }, { status: 500 });
  }
}
