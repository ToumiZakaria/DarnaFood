import { auth } from "@/lib/auth";
import { pusher } from "@/lib/pusher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.formData();
  const socketId = body.get("socket_id") as string;
  const channel = body.get("channel_name") as string;
  const userId = session.user.id;

  // Allow any private channel that includes the user's ID in its name
  if (!channel.includes(userId)) {
    return NextResponse.json({ error: "Invalid channel" }, { status: 403 });
  }

  const authResponse = pusher.authorizeChannel(socketId, channel, {
    user_id: userId,
    user_info: {
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
    },
  });

  return NextResponse.json(authResponse);
}
