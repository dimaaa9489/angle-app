import { NextResponse } from "next/server";

import { getAdminEmailsStatus, getUserFromRequest, isAdminEmail } from "@/lib/admin-auth";

export async function GET(request: Request) {
  const user = await getUserFromRequest(request);
  const status = getAdminEmailsStatus();

  if (!user?.email) {
    return NextResponse.json({
      isAdmin: false,
      email: null,
      configured: status.configured,
      adminCount: status.count,
    });
  }

  return NextResponse.json({
    isAdmin: isAdminEmail(user.email),
    email: user.email,
    configured: status.configured,
    adminCount: status.count,
  });
}
