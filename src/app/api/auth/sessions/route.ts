import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const sessions = await prisma.userSession.findMany({
      where: { userId: session.user.id },
      orderBy: { lastActiveAt: "desc" },
      select: {
        id: true,
        device: true,
        browser: true,
        os: true,
        ip: true,
        lastActiveAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Sessions error:", error);
    return NextResponse.json({ error: "Erreur lors du chargement des sessions" }, { status: 500 });
  }
}
