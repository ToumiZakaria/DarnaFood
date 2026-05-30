# DarnaFood — Chat Rebuild Plan (3h)

## Prisma (20min)
- Simplifier `Message` → `ChatMessage` lié directement à `Order` (pas de Conversation model séparé)
- Garder `senderId` nullable pour messages système
- Ajouter `ChatMessageType` enum (TEXT / IMAGE / SYSTEM)

## API Routes (30min)
1. `GET/POST /api/orders/[id]/chat` — messages + Pusher triggers (order-{id} + user-{recipientId})
2. `POST /api/orders/[id]/typing` — broadcast typing status via Pusher
3. `GET /api/chat/unread` — count unread messages

## Frontend

### ChatDrawer (45min)
- Drawer modal (pas de page séparée) — depuis une carte commande ou détail commande
- Messages en temps réel via Pusher
- Sound notification (tab pas focus) → `/sounds/notification.mp3`
- Typing indicator → "X écrit..." avec bounce dots
- Image click → full screen overlay
- Browser Notification API (quand tab caché)
- Read receipts (✓ / ✓✓)
- Date separators
- Auto-scroll
- Input avec upload image + Enter pour envoyer

### NavbarChatIcon (20min)
- Icône MessageCircle avec badge unread temps réel via Pusher (user-{id} channel)
- Son notification sur nouveau message
- Lien vers /dashboard/orders

### ContactButton (10min)
- Réutilisable, ouvre ChatDrawer
- "Contacter le client" (côté cook) / "Contacter le cuisinier" (côté client)

### MobileMenu (5min)
- Ajouter lien "Messages" avec icône MessageCircle

## Intégration (15min)
- Auto-create message système à la création de commande
- ContactButton sur cartes commande cook + détails commande client
- NavbarChatIcon dans la navbar
- Messages dans le menu mobile

## Améliorations supplémentaires (20min)
- Messages système automatiques (statut change)
- Réponses rapides prédéfinies

## Son (5min)
- `public/sounds/notification.mp3` — court pop/ding 1-2s
- Fallback Web Audio API beep

## Files modifiés
| Fichier | Action |
|---------|--------|
| `prisma/schema.prisma` | Simplifier en ChatMessage |
| `src/app/api/orders/[id]/chat/route.ts` | Créer |
| `src/app/api/orders/[id]/typing/route.ts` | Créer |
| `src/app/api/chat/unread/route.ts` | Créer |
| `src/components/chat/ChatDrawer.tsx` | Créer |
| `src/components/chat/ContactButton.tsx` | Créer |
| `src/components/layout/NavbarChatIcon.tsx` | Créer |
| `src/components/layout/Navbar.tsx` | Ajouter NavbarChatIcon |
| `src/components/layout/MobileMenu.tsx` | Ajouter Messages |
| Cartes commande cook/client | Ajouter ContactButton |
| Détail commande | Ajouter ContactButton |
| `public/sounds/notification.mp3` | Créer |
