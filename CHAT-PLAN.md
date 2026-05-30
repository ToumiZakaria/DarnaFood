# Chat + Notifications — Plan Simplifié (~3h30)

## Phase 1: Prisma & Types (30min)
- [ ] `prisma/schema.prisma` — ajouter `senderRole` (CUSTOMER/COOK/SYSTEM) sur Message, `lastSeenAt` sur User, `isRead` + `readAt` sur Message
- [ ] `prisma db push` + restart dev server
- [ ] `src/types/chat.ts` — nouveaux types

## Phase 2: Services & Hooks (45min)
- [ ] `src/lib/chatTransport.ts` — interface abstraite + implémentation Pusher
- [ ] `src/hooks/useChatRealtime.ts` — abonnements Pusher centralisés (messages, typing, new-chat-message)
- [ ] `src/hooks/useTypingIndicator.ts` — typing avec debounce 2s
- [ ] `src/hooks/useHeartbeat.ts` — ping `/api/auth?action=heartbeat` toutes les 60s
- [ ] `public/sounds/notification.mp3` — fichier son court

## Phase 3: API Routes (45min)
- [ ] `src/app/api/conversations/[id]/read/route.ts` — POST mark as read
- [ ] `src/app/api/conversations/[id]/messages/typing/route.ts` — POST typing
- [ ] `src/app/api/auth?action=heartbeat` — POST met à jour lastSeenAt
- [ ] Modifier `conversations/[id]/messages/route.ts` — senderRole + read tracking
- [ ] Modifier `conversations/create/route.ts` — senderRole

## Phase 4: UI Components (1h)
- [ ] `src/components/chat/ImageLightbox.tsx` — modal plein écran avec overlay
- [ ] `ChatWindow.tsx` — refacto : read receipts (✓✓), typing indicator listener, image lightbox
- [ ] `ConversationList.tsx` — presence dot (vert/gris), real-time unread badge via Pusher
- [ ] `Navbar.tsx` — badge chat temps réel + notification sound
- [ ] Menu mobile overlay — ajouter icône MessageCircle

## Phase 5: Final (30min)
- [ ] Ajuster `Message` seed/create pour inclure `senderRole`
- [ ] Vérifier build + lint
- [ ] Test : message → read → typing → presence → son → badge

## Changements fichier par fichier

### Modifiés
- `prisma/schema.prisma` — senderRole (Message), lastSeenAt (User)
- `src/lib/pusher.ts` — wrapper chatTransport
- `src/app/api/conversations/[id]/messages/route.ts` — senderRole, read
- `src/app/api/conversations/create/route.ts` — senderRole
- `src/app/api/auth/route.ts` — action=heartbeat
- `src/components/chat/ChatWindow.tsx` — read receipts, typing, lightbox
- `src/components/chat/ConversationList.tsx` — presence, real-time badge
- `src/components/layout/Navbar.tsx` — badge temps réel, son
- Menu mobile overlay (layout ou composant mobile)

### Créés
- `src/types/chat.ts`
- `src/lib/chatTransport.ts`
- `src/hooks/useChatRealtime.ts`
- `src/hooks/useTypingIndicator.ts`
- `src/hooks/useHeartbeat.ts`
- `src/components/chat/ImageLightbox.tsx`
- `src/app/api/conversations/[id]/read/route.ts`
- `src/app/api/conversations/[id]/messages/typing/route.ts`
- `public/sounds/notification.mp3`

### Supprimés
- Rien (remplacement sur place)
