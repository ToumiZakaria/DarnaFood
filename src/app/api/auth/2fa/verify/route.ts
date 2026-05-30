import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import speakeasy from "speakeasy";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Code requis" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { twoFactorSecret: true, twoFactorEnabled: true },
    });

    if (!user?.twoFactorSecret) {
      return NextResponse.json({ error: "Configurez d'abord la 2FA" }, { status: 400 });
    }

    if (user.twoFactorEnabled) {
      return NextResponse.json({ error: "La 2FA est déjà activée" }, { status: 400 });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
      window: 1,
    });

    if (!verified) {
      return NextResponse.json({ error: "Code invalide. Réessayez." }, { status: 400 });
    }

    const backupCodes = Array.from({ length: 8 }, () =>
      crypto.randomBytes(4).toString("hex").toUpperCase().slice(0, 8)
    );

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorEnabled: true,
        twoFactorBackupCodes: JSON.stringify(backupCodes),
      },
    });

    return NextResponse.json({
      success: true,
      backupCodes,
    });
  } catch (error) {
    console.error("2FA verify error:", error);
    return NextResponse.json({ error: "Erreur lors de la vérification 2FA" }, { status: 500 });
  }
}
