import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, twoFactorEnabled: true, twoFactorSecret: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    if (user.twoFactorEnabled) {
      return NextResponse.json({ error: "La vérification en 2 étapes est déjà activée" }, { status: 400 });
    }

    const secret = speakeasy.generateSecret({
      name: `DarnaFood:${user.email}`,
    });

    await prisma.user.update({
      where: { id: session.user.id },
      data: { twoFactorSecret: secret.base32 },
    });

    const qrcode = await QRCode.toDataURL(secret.otpauth_url!);

    return NextResponse.json({
      success: true,
      secret: secret.base32,
      qrcode,
    });
  } catch (error) {
    console.error("2FA setup error:", error);
    return NextResponse.json({ error: "Erreur lors de la configuration 2FA" }, { status: 500 });
  }
}
