import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { name, phone, newAvatarBase64 } = body;

    if (!name) {
      return NextResponse.json({ error: "Veuillez remplir le nom" }, { status: 400 });
    }

    // Handle avatar upload if provided
    let newImageUrl: string | undefined = undefined;
    if (newAvatarBase64) {
      const result = await uploadImage(newAvatarBase64, "darnafood/avatars");
      newImageUrl = result.url;
    }

    // Update User (name, phone, and image)
    const userUpdateData: { name: string; phone?: string; image?: string } = { name, phone };
    if (newImageUrl) {
      userUpdateData.image = newImageUrl;
    }

    await prisma.user.update({
      where: { id: userId },
      data: userUpdateData,
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil de l'utilisateur:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
