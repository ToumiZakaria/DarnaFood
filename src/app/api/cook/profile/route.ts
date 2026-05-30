import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "COOK") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const body = await req.json();
    const { name, bio, wilaya, commune, address, newAvatarBase64 } = body;

    if (!name || !wilaya || !commune || !address) {
      return NextResponse.json({ error: "Veuillez remplir tous les champs obligatoires" }, { status: 400 });
    }

    // Handle avatar upload if provided
    let newImageUrl: string | undefined = undefined;
    if (newAvatarBase64) {
      const result = await uploadImage(newAvatarBase64, "darnafood/avatars");
      newImageUrl = result.url;
    }

    await prisma.$transaction(async (tx) => {
      // Update User (name and image)
      const userUpdateData: { name: string; image?: string } = { name };
      if (newImageUrl) {
        userUpdateData.image = newImageUrl;
      }
      await tx.user.update({
        where: { id: userId },
        data: userUpdateData,
      });

      // Update or create CookProfile
      await tx.cookProfile.upsert({
        where: { userId },
        update: {
          bio,
          wilaya,
          commune,
          address,
        },
        create: {
          userId,
          bio,
          wilaya,
          commune,
          address,
          isVerified: false,
        }
      });
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
