import { Prisma } from "@/app/lib/Prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  
  const rawPage = parseInt(searchParams.get("page") || "1", 10);
  const rawPageSize = parseInt(searchParams.get("page_size") || "10", 10);

  const pageSize = Math.min(Math.max(rawPageSize, 1), 40); // limit page_size between 1 and 40

  const total = await Prisma.image.count();
  const totalPages = Math.max(Math.ceil(total / pageSize), 1);

  const page = Math.min(Math.max(rawPage, 1), totalPages); // Clamp to valid page range
  const skip = (page - 1) * pageSize;

  try {
    const result = await Prisma.image.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" }, // optional
    });

    return NextResponse.json({
      page,
      page_size: pageSize,
      total,
      result,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error fetching images" }, { status: 500 });
  }
}
