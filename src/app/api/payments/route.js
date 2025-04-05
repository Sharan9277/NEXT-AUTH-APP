import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import User from "@/models/User";

export async function GET() {
  try {
    await connectToDatabase();

    const transactions = await Transaction.find({}).sort({ createdAt: -1 }).lean();

    // Extract unique user IDs from transactions
    const userIds = [...new Set(transactions.map(t => t.user_id.toString()))];

    // Fetch related users
    const users = await User.find({ _id: { $in: userIds } }).select("name email").lean();

    const userMap = {};
    users.forEach(user => {
      userMap[user._id.toString()] = user;
    });

    // Enrich transactions with user data
    const enrichedTransactions = transactions.map(transaction => ({
      ...transaction,
      user: userMap[transaction.user_id.toString()] || null,
      amount: parseFloat(transaction.amount) // Convert Decimal128 to float
    }));

    return NextResponse.json({ success: true, data: enrichedTransactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch transactions", error: error.message },
      { status: 500 }
    );
  }
}
