import { Prisma } from "@/app/lib/Prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
export async function POST(req: NextRequest) {
//   const data = await req.json();
//   console.log(data);

 
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }
  const find = await Prisma.user.findFirst({
    where: {
      email,
    },
  });
  if (find) {
    return NextResponse.json(
      {
        message: "User Exists",
      },
      { status: 400 }
    );
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const Create = await Prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
    },
  });
  if (Create) {
    return NextResponse.json({
      message: "user Succesfully Created",
    });
  }
  return NextResponse.json(
    {
      message: "UnConfirmed",
    },
    { status: 400 }
  );
}
