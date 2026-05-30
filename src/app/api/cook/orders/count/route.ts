import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const cook = await prisma.cookProfile.findUnique({ where: { userId: session.user.id } });
  if (!cook) {
    return NextResponse.json({ error: "Not a cook" }, { status: 403 });
  }

  const where: Record<string, unknown> = { cookId: cook.id };
  if (status) where.status = status;

  const count = await prisma.order.count({ where: where as any });
  return NextResponse.json({ count });
}
