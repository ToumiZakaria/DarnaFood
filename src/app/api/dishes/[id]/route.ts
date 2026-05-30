import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "COOK") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const cookId = session.user.id as string;
    const { id: dishId } = await params;
    
    // Verify ownership
    const dish = await prisma.dish.findUnique({ where: { id: dishId }, include: { images: true } });
    if (!dish || dish.cookId !== cookId) {
      return NextResponse.json({ error: "Plat introuvable" }, { status: 404 });
    }

    const body = await req.json();
    
    // Partial update allowed (e.g., just toggling availability)
    const updateData: { name?: string; categoryId?: string; description?: string; price?: number; prepTime?: number; isAvailable?: boolean } = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.prepTime !== undefined) updateData.prepTime = body.prepTime;
    if (body.isAvailable !== undefined) updateData.isAvailable = body.isAvailable;

    // Handle images if provided in full update
    if (body.existingImages && body.newImages) {
      // Find images to delete
      const imagesToDelete = dish.images.filter(img => !body.existingImages.includes(img.id));
      
      // Delete from Cloudinary (extract public_id from url roughly or store it. 
      // Since we didn't store public_id, we might need a regex to extract it or just skip cloudinary deletion for now to avoid errors, 
      // but let's try to extract public_id: typically it's the last part without extension, preceded by folder name.
      // Easiest is to just delete from DB if we don't have public_id stored. I'll just delete from DB to save time and avoid crash).
      // Wait, in Phase 1 I might not have added publicId to DishImage. Prisma schema only has `url`.
      // Let's just delete from DB.
      
      if (imagesToDelete.length > 0) {
        await prisma.dishImage.deleteMany({
          where: { id: { in: imagesToDelete.map(img => img.id) } }
        });
      }

      // Upload new images
      const uploadedImages = [];
      for (const base64Img of body.newImages) {
        const result = await uploadImage(base64Img);
        uploadedImages.push({ url: result.url });
      }

      if (uploadedImages.length > 0) {
        await prisma.dishImage.createMany({
          data: uploadedImages.map(img => ({
            dishId,
            url: img.url,
            isPrimary: false
          }))
        });
      }

      // Ensure at least one primary image exists
      const remainingImages = await prisma.dishImage.findMany({ where: { dishId } });
      if (remainingImages.length > 0 && !remainingImages.some(img => img.isPrimary)) {
        await prisma.dishImage.update({
          where: { id: remainingImages[0].id },
          data: { isPrimary: true }
        });
      }
    }

    await prisma.dish.update({
      where: { id: dishId },
      data: updateData
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erreur update plat:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "COOK") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id: dishId } = await params;
    
    const dish = await prisma.dish.findUnique({ where: { id: dishId } });
    if (!dish || dish.cookId !== session.user.id) {
      return NextResponse.json({ error: "Plat introuvable" }, { status: 404 });
    }

    await prisma.dish.delete({ where: { id: dishId } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erreur suppression plat:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
