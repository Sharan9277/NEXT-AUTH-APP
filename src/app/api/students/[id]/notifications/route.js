import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Student from "@/models/Student";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const student = await Student.findOne({ user_id: params.id });

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({
      email_notifications: student.email_notifications ?? true,
      push_notifications: student.push_notifications ?? false,
      lesson_reminders: student.lesson_reminders ?? true,
      promotional_emails: student.promotional_emails ?? false,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching notification settings:", error);
    return NextResponse.json({ message: "Error fetching notification settings", error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { email_notifications, push_notifications, lesson_reminders, promotional_emails } = await req.json();

    const student = await Student.findOne({ user_id: params.id });

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    student.email_notifications = email_notifications;
    student.push_notifications = push_notifications;
    student.lesson_reminders = lesson_reminders;
    student.promotional_emails = promotional_emails;

    await student.save();

    return NextResponse.json({ message: "Notification settings updated successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error updating notification settings:", error);
    return NextResponse.json({ message: "Error updating notification settings", error: error.message }, { status: 500 });
  }
}
