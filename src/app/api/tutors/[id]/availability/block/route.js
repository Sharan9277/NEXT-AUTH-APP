import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import TutorAvailability from "@/models/TutorAvailability";

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { date, action } = await req.json();

    const tutorAvailability = await TutorAvailability.findOne({ tutor_id: params.id });

    if (!tutorAvailability) {
      return NextResponse.json({ message: "Tutor availability not found" }, { status: 404 });
    }

    if (action === "block") {
      // ✅ Block the date
      if (!tutorAvailability.blocked_dates.includes(date)) {
        tutorAvailability.blocked_dates.push(date);
      }
    } else if (action === "unblock") {
      // ✅ Unblock the date
      tutorAvailability.blocked_dates = tutorAvailability.blocked_dates.filter((d) => d !== date);
    }

    await tutorAvailability.save();

    return NextResponse.json({ message: `Date ${action}ed successfully`, blocked_dates: tutorAvailability.blocked_dates }, { status: 200 });
  } catch (error) {
    console.error("Error updating blocked dates:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    const tutorAvailability = await TutorAvailability.findOne({ tutor_id: params.id });

    if (!tutorAvailability) {
      return NextResponse.json({ message: "Tutor availability not found" }, { status: 404 });
    }

    return NextResponse.json(
      { blocked_dates: tutorAvailability.blocked_dates },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching blocked dates:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}