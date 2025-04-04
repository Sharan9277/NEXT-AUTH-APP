import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Subscription from "@/models/Subscription";
import Tutor from "@/models/Tutor";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    
    const { id } = params; // Student ID

    // Find all active subscriptions for the student
    const subscriptions = await Subscription.find({ student_id: id, status: "active" })
    
    console.log("Subscriptions found:", subscriptions);

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ message: "No active subscriptions found." }, { status: 200 });
    }

    return NextResponse.json(subscriptions.map(sub => ({
      subscription_id: sub._id,
      tutor: {
        _id: sub.tutor_id._id,
        name: sub.tutor_id.name,
        profile_image: sub.tutor_id.profile_image,
      },
      lessons_per_week: sub.lessons_per_week,
      renewal_date: sub.renewal_date,
      status: sub.status
    })), { status: 200 });

  } catch (error) {
    // console.error("Error fetching subscriptions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
