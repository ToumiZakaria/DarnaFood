import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { publicId, transformation } = await request.json();

  if (!publicId) {
    return NextResponse.json({ error: "publicId requis" }, { status: 400 });
  }

  const signedUrl = cloudinary.url(publicId, {
    sign_url: true,
    secure: true,
    transformation,
  });

  return NextResponse.json({ url: signedUrl });
}
