import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone, role, wilaya, commune, address, bio } = body;

    // ── Validation ──────────────────────────────────────────────
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nom, email et mot de passe sont requis." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères." },
        { status: 400 }
      );
    }

    if (role === "COOK" && (!wilaya || !commune || !address)) {
      return NextResponse.json(
        { error: "Wilaya, commune et adresse sont requis pour les cuisiniers." },
        { status: 400 }
      );
    }

    // ── Check duplicate email ────────────────────────────────────
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Un compte avec cet email existe déjà." },
        { status: 409 }
      );
    }

    // ── Hash password ────────────────────────────────────────────
    const passwordHash = await bcrypt.hash(password, 12);

    // ── Create User ──────────────────────────────────────────────
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        phone: phone || null,
        role: role === "COOK" ? "COOK" : "CUSTOMER",
      },
    });

    // ── Create CookProfile if role = COOK ────────────────────────
    if (role === "COOK") {
      await prisma.cookProfile.create({
        data: {
          userId: user.id,
          wilaya,
          commune,
          address,
          bio: bio || null,
        },
      });
    }

    return NextResponse.json(
      { message: "Compte créé avec succès.", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
