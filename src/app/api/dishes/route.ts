import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "COOK") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const cookId = session.user.id as string;
    const body = await req.json();
    const { name, categoryId, description, price, prepTime, newImages, isAvailable } = body;

    if (!name || !categoryId || !description || price === undefined || prepTime === undefined) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    // Upload images to Cloudinary
    const uploadedImages = [];
    if (newImages && newImages.length > 0) {
      for (const base64Img of newImages) {
        const result = await uploadImage(base64Img);
        uploadedImages.push({ url: result.url });
      }
    }

    // Create Dish in DB
    const dish = await prisma.dish.create({
      data: {
        cookId,
        categoryId,
        name,
        description,
        price,
        prepTime,
        isAvailable,
        images: {
          create: uploadedImages.map((img, idx) => ({
            url: img.url,
            isPrimary: idx === 0 // First image is primary
          }))
        }
      }
    });

    return NextResponse.json({ success: true, dishId: dish.id }, { status: 201 });
  } catch (error) {
    console.error("Erreur création plat:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
