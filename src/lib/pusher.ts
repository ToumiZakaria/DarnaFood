// Pusher server-side
import PusherServer from "pusher";

export const pusher = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

// Channel naming conventions
export const channels = {
  cook: (cookId: string) => `private-cook-${cookId}`,
  customer: (customerId: string) => `private-customer-${customerId}`,
  user: (userId: string) => `private-user-${userId}`,
  order: (orderId: string) => `order-${orderId}`,
};

// Event types
export const events = {
  NEW_ORDER: "new-order",
  ORDER_CONFIRMED: "order-confirmed",
  ORDER_PREPARING: "order-preparing",
  ORDER_DELIVERING: "order-delivering",
  ORDER_COMPLETED: "order-completed",
  ORDER_CANCELLED: "order-cancelled",
  NEW_MESSAGE: "new-message",
  NEW_CHAT_MESSAGE: "new-chat-message",
};

// Client-side
import PusherClient from "pusher-js";

function createPusherClient() {
  if (typeof window === "undefined") return null;
  return new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    authEndpoint: "/api/pusher/auth",
    authTransport: "ajax",
  });
}

export const pusherClient = createPusherClient();
