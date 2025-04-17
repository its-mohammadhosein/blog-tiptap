// app/api/upload/image/route.ts
import { Prisma } from "@/app/lib/Prisma";
import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 413 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, and WebP images are allowed" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const ext = path.extname(file.name);
    const filename = `${timestamp}${ext}`;
    
    // This is where we'll store the file
    const filePath = path.join(process.cwd(), "public/uploads", filename);

    try {
      // Using the experimental Node.js filesystem API in Next.js
      const fs = await import("fs/promises");
      
      // Create uploads directory if it doesn't exist
      await fs.mkdir(path.join(process.cwd(), "public/uploads"), {
        recursive: true,
      });

      // Write file to disk
      await fs.writeFile(filePath, buffer);
    } catch (err) {
      console.error("Filesystem error:", err);
      return NextResponse.json(
        { error: "Failed to save file" },
        { status: 500 }
      );
    }

    // Save to database
    const imageRecord = await Prisma.image.create({
      data: {
        fileName: filename,
        filePath: `/uploads/${filename}`,
        fileSize: file.size,
        mimeType: file.type,
      },
    });

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
      imageId: imageRecord.id,
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type,
      },
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}