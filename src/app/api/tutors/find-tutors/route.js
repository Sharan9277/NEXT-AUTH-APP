import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Tutor from "@/models/Tutor";
import TutorAvailability from "@/models/TutorAvailability";
import Review from "@/models/Review"; // ✅ Add this at the top
import User from "@/models/User";
import mongoose from "mongoose";


export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    // Extract filters
    const availability = searchParams.get("availability");
    const subject = searchParams.get("subject");
    const minRate = searchParams.get("minRate");
    const maxRate = searchParams.get("maxRate");
    const country = searchParams.get("country");
    const specialties = searchParams.getAll("specialties"); // Fixed key
    const languages = searchParams.getAll("languages"); // Fixed key
    const sortBy = searchParams.get("sortBy");
    const search = searchParams.get("search");

    let query = {};

    // ✅ 1️⃣ Availability Filter (Unchanged)
    if (availability) {
      const availableTutors = await TutorAvailability.find({
        "availability": { $elemMatch: { day: availability } }
      }).select("tutor_id");

      if (!availableTutors.length) {
        console.log("No tutors found for", availability);
        return NextResponse.json([], { status: 200 });
      }

      const tutorUserIds = availableTutors.map((t) => new mongoose.Types.ObjectId(t.tutor_id));
      query.user_id = { $in: tutorUserIds };
    }

    // ✅ 2️⃣ Subject Filter (Fixed Field Name)
    if (subject) {
      query.subject_expertise = subject; // Corrected field name
    }

    // ✅ 3️⃣ Hourly Rate Filter (Already Fixed, Left Unchanged)
    if (minRate || maxRate) {
      query.hourly_rate = {};
      if (minRate) query.hourly_rate.$gte = parseFloat(minRate);
      if (maxRate) query.hourly_rate.$lte = parseFloat(maxRate);
    }

    // ✅ 4️⃣ Country Filter
    if (country) {
      query.country = country;
    }

    // ✅ 5️⃣ Specialties Filter (Fixed Field Name + Ensures Tutor Has **All** Selected Specialties)
    if (specialties.length) {
      query.specialties = { $all: specialties };
    }

    // ✅ 6️⃣ Languages Spoken Filter (Fixed Field Name + Ensures Tutor Speaks **All** Selected Languages)
    if (languages.length) {
      query.languages_spoken = { $all: languages };
    }

    // ✅ 7️⃣ Search Filter (Matches **Name** or **Bio**)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } }, // Case-insensitive search in name
        { bio: { $regex: search, $options: "i" } }   // Case-insensitive search in bio
      ];
    }

    // 🔍 Fetch Tutors
    let tutors = await Tutor.find(query).populate("user_id", "email role");

    // ✅ 8️⃣ Sort By Filter (Fixed Field Name for Sorting)
    if (sortBy) {
      let sortOptions = {};
      if (sortBy === "price_asc") sortOptions.hourly_rate = 1;
      if (sortBy === "price_desc") sortOptions.hourly_rate = -1;
      if (sortBy === "name") sortOptions.name = 1;
      tutors = await Tutor.find(query).populate("user_id", "email role").sort(sortOptions);
    }

    const tutorUserIds = tutors.map(tutor => tutor.user_id._id);

// 📊 Step 2: Aggregate reviews by tutor_id (which is user_id in Tutor)
const reviewStats = await Review.aggregate([
  {
    $match: {
      tutor_id: { $in: tutorUserIds }
    }
  },
  {
    $group: {
      _id: "$tutor_id",
      averageRating: { $avg: "$overall_rating" },
      totalReviews: { $sum: 1 }
    }
  }
]);

// 🗺 Step 3: Convert stats to a lookup map
const reviewMap = {};
reviewStats.forEach((stat) => {
  reviewMap[stat._id.toString()] = {
    averageRating: stat.averageRating || 0,
    totalReviews: stat.totalReviews || 0
  };
});

// 🧩 Step 4: Attach the data to each tutor
tutors = tutors.map((tutor) => {
  const stats = reviewMap[tutor.user_id._id.toString()] || {
    averageRating: 0,
    totalReviews: 0
  };
  return {
    ...tutor.toObject(),
    averageRating: stats.averageRating,
    totalReviews: stats.totalReviews
  };
});

    return NextResponse.json(tutors, { status: 200 });

  } catch (error) {
    console.error("Error fetching tutors:", error);
    return NextResponse.json({ message: "Error fetching tutors", error: error.message }, { status: 500 });
  }
}
