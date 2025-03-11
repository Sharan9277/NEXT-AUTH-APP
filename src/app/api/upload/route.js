import { NextResponse } from "next/server";
import { getGridFSBucket } from "@/lib/mongodb";
import multer from "multer";
import { Readable } from "stream";

// ✅ Configure Multer for Memory Storage (No Local Storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const readableStream = Readable.from(Buffer.from(buffer));

    // ✅ Upload to GridFS
    const bucket = await getGridFSBucket();
    const uploadStream = bucket.openUploadStream(file.name, { contentType: file.type });

    readableStream.pipe(uploadStream);

    return new Promise((resolve, reject) => {
      uploadStream.on("finish", () => {
        console.log("File uploaded to GridFS:", uploadStream.id);
        resolve(NextResponse.json({ fileId: uploadStream.id }, { status: 200 }));
      });

      uploadStream.on("error", (err) => {
        console.error("GridFS Upload Error:", err);
        reject(NextResponse.json({ message: "File upload failed", error: err.message }, { status: 500 }));
      });
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json({ message: "File upload failed", error: error.message }, { status: 500 });
  }
}
