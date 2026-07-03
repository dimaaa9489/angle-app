import { NextResponse } from "next/server";

import { getAdminEmails, getUserFromRequest, isAdminEmail } from "@/lib/admin-auth";

export async function GET(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user?.email) {
    return NextResponse.json({
      isAdmin: false,
      email: null,
      configured: getAdminEmails().length > 0,
    });
  }

  return NextResponse.json({
    isAdmin: isAdminEmail(user.email),
    email: user.email,
    configured: getAdminEmails().length > 0,
  });
}
