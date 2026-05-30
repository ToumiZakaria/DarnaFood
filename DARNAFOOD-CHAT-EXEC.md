# DarnaFood Chat — Execution Plan

## Step 1: Read current state
- Read `prisma/schema.prisma` → comprendre modèle Message actuel
- Read `src/lib/pusher.ts` → events actuels
- Read `src/components/chat/ChatWindow.tsx` → ce qu'on va remplacer par ChatDrawer
- Read `src/components/chat/ConversationList.tsx` → à adapter
- Read `src/app/api/conversations/*` → routes à migrer vers `/api/orders/[id]/chat`
- Read `src/components/layout/Navbar.tsx` → où ajouter NavbarChatIcon
- Read mobile menu → où ajouter Messages
- Read cartes commande cook et client → où ajouter ContactButton
- Read détails commande page → où ajouter ContactButton

## Step 2: Prisma schema
- Modifier `prisma/schema.prisma` : simplifier Message → ChatMessage (lié à Order, pas Conversation)
- Run `prisma db push`
- Restart dev server

## Step 3: API routes
- Créer `src/app/api/orders/[id]/chat/route.ts` — GET messages + POST send
- Créer `src/app/api/orders/[id]/typing/route.ts` — POST typing
- Créer `src/app/api/chat/unread/route.ts` — GET count

## Step 4: Backfill pusher.ts
- Vérifier que `pusherServer` et `pusherClient` sont bien exportés
- Ajouter si besoin les events `order-{id}` et `user-{id}` channels

## Step 5: Sound file
- Créer `public/sounds/notification.mp3` ou fallback Web Audio API

## Step 6: ChatDrawer component
- Écrire `src/components/chat/ChatDrawer.tsx`
- Tous les features : messages temps réel, typing, sound, image viewer, browser notif, read receipts

## Step 7: ContactButton
- Écrire `src/components/chat/ContactButton.tsx`

## Step 8: NavbarChatIcon
- Écrire `src/components/layout/NavbarChatIcon.tsx`
- Intégrer dans Navbar

## Step 9: Integration
- Ajouter ContactButton aux cartes commande côté cook et client
- Ajouter ContactButton au détail commande
- Ajouter Messages dans le menu mobile
- Auto-create system message dans création commande

## Step 10: Cleanup
- Supprimer anciens fichiers : `ConversationList.tsx`, `ChatWindow.tsx`, `OrderChatButton.tsx`
- Supprimer anciennes routes API `conversations/` (sauf si utilisées ailleurs)
- Nettoyer pusher.ts des events conversation si plus utilisés
- Vérifier build + lint
- Test complet
