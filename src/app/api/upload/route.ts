import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!checkRateLimit(`upload:${session.user.id}`)) {
      return NextResponse.json({ error: "Trop de requêtes. Réessayez plus tard." }, { status: 429 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const resourceType = (formData.get("resourceType") as string) || "dish";
    const entityId = formData.get("entityId") as string;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Format non supporté. Utilisez JPG, PNG ou WEBP." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Fichier trop volumineux. Maximum 5MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `darnafood/${resourceType}`,
            resource_type: "image",
            transformation: [{ quality: "auto", fetch_format: "auto" }],
            eager: [
              { width: 400, height: 300, crop: "fill" },
              { width: 800, height: 600, crop: "fill" },
              { width: 1200, height: 800, crop: "fill" },
            ],
            eager_async: true,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    const uploadResult = result as any;

    const image = await prisma.image.create({
      data: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        thumbnail: uploadResult.eager?.[0]?.secure_url,
        medium: uploadResult.eager?.[1]?.secure_url,
        large: uploadResult.eager?.[2]?.secure_url,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        size: uploadResult.bytes,
        resourceType,
        senderId: session.user.id,
        ...(resourceType === "dish" && entityId ? { dishId: entityId } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      image: {
        id: image.id,
        url: image.url,
        thumbnail: image.thumbnail,
        medium: image.medium,
        large: image.large,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "L'upload a échoué. Réessayez." }, { status: 500 });
  }
}
