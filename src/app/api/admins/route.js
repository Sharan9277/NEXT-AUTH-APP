<<<<<<< HEAD
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

// ✅ GET all admins with user details
export async function GET() {
  try {
    await connectToDatabase();
    const admins = await Admin.find({}).populate("user_id", "email role");
    return NextResponse.json(admins, { status: 200 });
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json({ message: "Error fetching admins", error: error.message }, { status: 500 });
  }
}

// ✅ POST - Create a new admin
export async function POST(req) {
  try {
    await connectToDatabase();
    const { name, email, password, role, permissions } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword, role: "admin" });

    const newAdmin = await Admin.create({
      user_id: newUser._id,
      admin_id: uuidv4(),
      name,
      role,
      permissions: permissions || {}
    });

    return NextResponse.json({ user: newUser, admin: newAdmin }, { status: 201 });
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json({ message: "Error creating admin", error: error.message }, { status: 500 });
  }
}

// ✅ PUT - Update admin details
export async function PUT(req) {
  try {
    await connectToDatabase();
    const { admin_id, name, email, password, role, permissions } = await req.json();

    const admin = await Admin.findOne({ admin_id });
    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    const user = await User.findById(admin.user_id);
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    await user.save();

    admin.name = name || admin.name;
    admin.role = role || admin.role;
    admin.permissions = permissions || admin.permissions;
    await admin.save();

    return NextResponse.json({ user, admin }, { status: 200 });
  } catch (error) {
    console.error("Error updating admin:", error);
    return NextResponse.json({ message: "Error updating admin", error: error.message }, { status: 500 });
  }
}

// ✅ DELETE - Remove admin and linked user
export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { admin_id } = await req.json();

    const admin = await Admin.findOne({ admin_id });
    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    await User.findByIdAndDelete(admin.user_id);
    await Admin.deleteOne({ admin_id });

    return NextResponse.json({ message: "Admin deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting admin:", error);
    return NextResponse.json({ message: "Error deleting admin", error: error.message }, { status: 500 });
  }
}
=======
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

// ✅ GET all admins with user details
export async function GET() {
  try {
    await connectToDatabase();
    const admins = await Admin.find({}).populate("user_id", "email role");
    return NextResponse.json(admins, { status: 200 });
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json({ message: "Error fetching admins", error: error.message }, { status: 500 });
  }
}

// ✅ POST - Create a new admin
export async function POST(req) {
  try {
    await connectToDatabase();
    const { name, email, password, role, permissions } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword, role: "admin" });

    const newAdmin = await Admin.create({
      user_id: newUser._id,
      admin_id: uuidv4(),
      name,
      role,
      permissions: permissions || {}
    });

    return NextResponse.json({ user: newUser, admin: newAdmin }, { status: 201 });
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json({ message: "Error creating admin", error: error.message }, { status: 500 });
  }
}

// ✅ PUT - Update admin details
export async function PUT(req) {
  try {
    await connectToDatabase();
    const { admin_id, name, email, password, role, permissions } = await req.json();

    const admin = await Admin.findOne({ admin_id });
    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    const user = await User.findById(admin.user_id);
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    await user.save();

    admin.name = name || admin.name;
    admin.role = role || admin.role;
    admin.permissions = permissions || admin.permissions;
    await admin.save();

    return NextResponse.json({ user, admin }, { status: 200 });
  } catch (error) {
    console.error("Error updating admin:", error);
    return NextResponse.json({ message: "Error updating admin", error: error.message }, { status: 500 });
  }
}

// ✅ DELETE - Remove admin and linked user
export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { admin_id } = await req.json();

    const admin = await Admin.findOne({ admin_id });
    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    await User.findByIdAndDelete(admin.user_id);
    await Admin.deleteOne({ admin_id });

    return NextResponse.json({ message: "Admin deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting admin:", error);
    return NextResponse.json({ message: "Error deleting admin", error: error.message }, { status: 500 });
  }
}
>>>>>>> cb89aba52d9d13195af83e2a55240e0dda87d495
