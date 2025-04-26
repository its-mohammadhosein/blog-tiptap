import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  // console.log(token);
  // return NextResponse.next()

  // // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Only allow admin or writer
  const allowedRoles = ["admin", "writer"];

  if (!allowedRoles.includes(token.role)) {
    return NextResponse.redirect(new URL("/", req.url)); // Or redirect to a "no-access" page
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/preview/:path*",
    "/createpost",
    "/usecontrol/:path*",
  ],
};
