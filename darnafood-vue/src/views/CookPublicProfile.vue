<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { KITCHENS } from '../data'
import { apiGetCook } from '../api'
import { dzd } from '../utils'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { ArrowLeft, Share2, Heart, Star, Clock, MapPin, ShoppingCart, Utensils, ChefHat, MessageSquare } from '@lucide/vue'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()
const auth = useAuthStore()
const favorite = ref(false)
const loading = ref(true)
const apiKitchen = ref(null)

onMounted(async () => {
  const id = route.params.id
  const mock = KITCHENS.find(k => k.id === Number(id) || k.id === id)
  if (mock) { loading.value = false; return }
  try {
    const data = await apiGetCook(id)
    if (data.success) apiKitchen.value = data.cook || null
  } catch {} finally { loading.value = false }
})

const kitchen = computed(() => {
  const id = route.params.id
  return KITCHENS.find(k => k.id === Number(id) || k.id === id) || apiKitchen.value
})

function isFlatMenu(m) { return m?.length && m[0]?.id !== undefined }
const activeCat = ref('Tous')
const dishCats = computed(() => {
  if (!kitchen.value?.menu) return ['Tous']
  if (isFlatMenu(kitchen.value.menu)) {
    return ['Tous', ...new Set(kitchen.value.menu.map(d => d.cat || 'Principal'))]
  }
  return ['Tous', ...kitchen.value.menu.map(g => g.cat || 'Principal')]
})
const filteredMenu = computed(() => {
  if (!kitchen.value?.menu) return []
  if (isFlatMenu(kitchen.value.menu)) {
    if (activeCat.value === 'Tous') return kitchen.value.menu
    return kitchen.value.menu.filter(d => (d.cat || 'Principal') === activeCat.value)
  }
  if (activeCat.value === 'Tous') return kitchen.value.menu.flatMap(g => g.dishes || [])
  const group = kitchen.value.menu.find(g => (g.cat || 'Principal') === activeCat.value)
  return group ? group.dishes : []
})

function addDish(dish) {
  if (!auth.isClient) { router.push({ name: 'login' }); return }
  cart.add(
    { id: kitchen.value.id + '-' + dish.id, name: dish.name, price: dish.price, emoji: dish.emoji || '🍽️', gradient: dish.gradient || kitchen.value.gradient, qty: 1, kitchenId: kitchen.value.id, kitchenName: kitchen.value.name },
    { id: kitchen.value.id, name: kitchen.value.name }
  )
}

// Mock reviews — placeholder
const reviews = computed(() => [
  { name: 'Sofiane B.', rating: 5, text: 'Plats délicieux et livraison rapide. Je recommande vivement !', date: 'Il y a 2 jours' },
  { name: 'Lina M.', rating: 4, text: 'Excellent couscous, comme à la maison. Un peu long sur la livraison.', date: 'Il y a 1 semaine' },
  { name: 'Amine K.', rating: 5, text: 'Les grillades sont incroyables. Je commande régulièrement.', date: 'Il y a 2 semaines' },
])

const avgRating = computed(() => {
  if (!reviews.value.length) return 0
  return (reviews.value.reduce((s, r) => s + r.rating, 0) / reviews.value.length).toFixed(1)
})
</script>

<template>
  <div v-if="loading" class="cpp-loading"><div class="cpp-spinner"></div></div>

  <template v-else-if="kitchen">
    <div class="cpp">
      <!-- Sticky Header -->
      <div class="cpp-header">
        <button class="cpp-header-btn" @click="router.back()"><ArrowLeft :size="20" /></button>
        <span class="cpp-header-title">{{ kitchen.name }}</span>
        <div class="cpp-header-right">
          <button class="cpp-header-btn" @click="favorite = !favorite" :class="{ favorited: favorite }"><Heart :size="18" /></button>
        </div>
      </div>

      <!-- Cover -->
      <div class="cpp-cover" :style="{ background: kitchen.gradient || 'linear-gradient(135deg,#E8813A,#D4702A)' }">
        <div class="cpp-cover-emoji">{{ kitchen.emoji || '🍽️' }}</div>
      </div>

      <!-- Info -->
      <div class="cpp-info">
        <div class="cpp-avatar">{{ kitchen.name?.charAt(0) || 'C' }}</div>
        <h1 class="cpp-name">{{ kitchen.name }}</h1>
        <div class="cpp-rating-row">
          <span class="cpp-rating"><Star :size="14" /> {{ kitchen.rating || '—' }}</span>
          <span class="cpp-reviews">({{ kitchen.reviews || 0 }} avis)</span>
          <span class="cpp-dot">·</span>
          <span class="cpp-time"><Clock :size="12" /> {{ kitchen.deliveryTime || 45 }} min</span>
        </div>
        <div class="cpp-tags">
          <span class="cpp-tag"><ChefHat :size="12" /> {{ kitchen.cat || 'Cuisine maison' }}</span>
          <span class="cpp-status" :class="kitchen.open !== false ? 'open' : 'closed'">
            <span class="cpp-status-dot"></span>
            {{ kitchen.open !== false ? 'Ouvert' : 'Fermé' }}
          </span>
        </div>
        <div class="cpp-location"><MapPin :size="14" /> {{ kitchen.commune || 'Alger' }}, {{ kitchen.wilaya || 'Alger' }}</div>
        <p class="cpp-desc">{{ kitchen.desc || kitchen.tagline || 'Cuisine maison préparée avec des ingrédients frais.' }}</p>
      </div>

      <!-- Stats -->
      <div class="cpp-stats">
        <div class="cpp-stat"><div class="cpp-stat-val">156</div><div class="cpp-stat-label">Commandes</div></div>
        <div class="cpp-stat"><div class="cpp-stat-val">{{ dzd(127000) }}</div><div class="cpp-stat-label">Revenus</div></div>
        <div class="cpp-stat"><div class="cpp-stat-val">89</div><div class="cpp-stat-label">Clients</div></div>
      </div>

      <!-- Menu -->
      <div class="cpp-menu">
        <div class="cpp-menu-head">
          <h2 class="cpp-menu-title">Menu</h2>
          <span class="cpp-menu-count">{{ filteredMenu.length }} plat{{ filteredMenu.length > 1 ? 's' : '' }}</span>
        </div>
        <div class="cpp-cats">
          <button v-for="c in dishCats" :key="c" class="cpp-cat" :class="{ active: activeCat === c }" @click="activeCat = c">{{ c }}</button>
        </div>
        <div class="cpp-dishes">
          <div v-for="dish in filteredMenu" :key="dish.id" class="cpp-dish">
            <div class="cpp-dish-img" :style="dish.photo ? { backgroundImage: 'url('+dish.photo+')', backgroundSize:'cover', backgroundPosition:'center' } : { background: dish.gradient || kitchen.gradient || 'linear-gradient(135deg,#FFF8F2,#FEF0E6)' }">
              <div v-if="!dish.photo" class="cpp-dish-emoji">{{ dish.emoji || '🍽️' }}</div>
              <div v-if="dish.portion" class="cpp-dish-badge">{{ dish.portion }}</div>
            </div>
            <div class="cpp-dish-body">
              <div class="cpp-dish-name">{{ dish.name }}</div>
              <div class="cpp-dish-desc">{{ dish.desc || '' }}</div>
              <div v-if="dish.ingredients?.length" class="cpp-dish-ingredients">
                <span v-for="(ing, i) in dish.ingredients.slice(0, 3)" :key="i" class="cpp-ing">{{ ing }}</span>
                <span v-if="dish.ingredients.length > 3" class="cpp-ing-more">+{{ dish.ingredients.length - 3 }}</span>
              </div>
              <div class="cpp-dish-bottom">
                <div class="cpp-dish-price">{{ dish.price.toLocaleString('fr-DZ') }} <span class="cpp-currency">DA</span></div>
                <button v-if="kitchen.open !== false" class="cpp-add-btn" @click="addDish(dish)"><ShoppingCart :size="13" /> Ajouter</button>
                <span v-else class="cpp-closed-label">Indisponible</span>
              </div>
            </div>
          </div>
          <div v-if="!filteredMenu.length" class="cpp-empty">
            <Utensils :size="36" />
            <p>Aucun plat dans cette catégorie</p>
          </div>
        </div>
      </div>

      <!-- Reviews -->
      <div class="cpp-reviews-section">
        <h2 class="cpp-reviews-title"><MessageSquare :size="18" /> Avis clients</h2>
        <div class="cpp-reviews-summary">
          <span class="cpp-reviews-avg"><Star :size="16" /> {{ avgRating }}</span>
          <span class="cpp-reviews-count">{{ reviews.length }} avis</span>
        </div>
        <div class="cpp-reviews-list">
          <div v-for="(r, i) in reviews" :key="i" class="cpp-review">
            <div class="cpp-review-avatar">{{ r.name.charAt(0) }}</div>
            <div class="cpp-review-body">
              <div class="cpp-review-head">
                <span class="cpp-review-name">{{ r.name }}</span>
                <span class="cpp-review-date">{{ r.date }}</span>
              </div>
              <div class="cpp-review-stars">
                <Star :size="12" v-for="s in r.rating" :key="s" class="star-filled" />
                <Star :size="12" v-for="s in (5 - r.rating)" :key="'e'+s" class="star-empty" />
              </div>
              <p class="cpp-review-text">{{ r.text }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Sticky Bottom CTA -->
      <div class="cpp-sticky-cta">
        <div class="cpp-sticky-inner">
          <div class="cpp-sticky-info">
            <span class="cpp-sticky-name">{{ kitchen.name }}</span>
            <span class="cpp-sticky-min">Min. {{ dzd(kitchen.minOrder || 300) }} · Liv. {{ dzd(kitchen.deliveryFee || 0) }}</span>
          </div>
          <button class="cpp-sticky-btn" @click="router.push({name:'checkout'})" :disabled="cart.count === 0">
            <ShoppingCart :size="16" />
            Commander chez {{ kitchen.name?.split(' ')[0] || 'eux' }}
            <span v-if="cart.count > 0" class="cpp-sticky-count">({{ cart.count }})</span>
          </button>
        </div>
      </div>
    </div>
  </template>

  <div v-else-if="!loading" class="cpp-not-found">
    <ChefHat :size="48" />
    <h2>Cuisinier introuvable</h2>
    <p>Ce cuisinier n'existe pas ou a été supprimé.</p>
    <button class="cpp-back-btn" @click="router.push({name:'kitchens'})">Voir les cuisines</button>
  </div>
</template>

<style scoped>
.cpp { background:#F8F7F4; min-height:100vh; padding-bottom:80px; }
.cpp-loading { display:flex; align-items:center; justify-content:center; height:100vh; background:#F8F7F4; }
.cpp-spinner { width:32px; height:32px; border:3px solid #E5E7EB; border-top-color:#E8813A; border-radius:50%; animation:spin .6s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
.cpp-header { position:sticky; top:64px; z-index:50; display:flex; align-items:center; justify-content:space-between; padding:10px 16px; background:rgba(255,255,255,.92); backdrop-filter:blur(12px); border-bottom:1px solid #E5E7EB; }
.cpp-header-title { font-size:15px; font-weight:700; color:#1A1A1A; }
.cpp-header-right { display:flex; gap:6px; }
.cpp-header-btn { width:36px; height:36px; border-radius:50%; background:#F3F4F6; border:1px solid #E5E7EB; color:#6B7280; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:.2s; }
.cpp-header-btn:hover { background:#E5E7EB; color:#1A1A1A; }
.cpp-header-btn.favorited { color:#EF4444; background:#FEF2F2; border-color:#FECACA; }
.cpp-cover { height:200px; position:relative; display:flex; align-items:center; justify-content:center; }
.cpp-cover-emoji { font-size:80px; opacity:.2; }
.cpp-info { padding:0 20px; margin-top:-32px; position:relative; z-index:2; }
.cpp-avatar { width:64px; height:64px; border-radius:16px; background:#E8813A; display:flex; align-items:center; justify-content:center; font-size:28px; font-weight:800; color:#fff; margin-bottom:12px; border:3px solid #F8F7F4; box-shadow:0 4px 20px rgba(232,129,58,.25); }
.cpp-name { font-size:26px; font-weight:800; color:#1A1A1A; margin:0 0 6px; }
.cpp-rating-row { display:flex; align-items:center; gap:6px; margin-bottom:10px; flex-wrap:wrap; }
.cpp-rating { display:flex; align-items:center; gap:4px; font-size:15px; font-weight:700; color:#E8813A; }
.cpp-reviews { font-size:13px; color:#6B7280; }
.cpp-dot { color:#D1D5DB; }
.cpp-time { display:flex; align-items:center; gap:4px; font-size:13px; color:#6B7280; }
.cpp-tags { display:flex; gap:8px; margin-bottom:8px; flex-wrap:wrap; }
.cpp-tag { display:inline-flex; align-items:center; gap:5px; background:#FFF8F2; color:#E8813A; padding:4px 12px; border-radius:99px; font-size:12px; font-weight:600; }
.cpp-status { display:inline-flex; align-items:center; gap:5px; padding:4px 12px; border-radius:99px; font-size:12px; font-weight:600; }
.cpp-status.open { background:#F0FDF4; color:#22C55E; }
.cpp-status.closed { background:#FEF2F2; color:#EF4444; }
.cpp-status-dot { width:6px; height:6px; border-radius:50%; background:currentColor; }
.cpp-location { display:flex; align-items:center; gap:5px; font-size:13px; color:#6B7280; margin-bottom:10px; }
.cpp-desc { font-size:14px; color:#6B7280; line-height:1.6; margin:0; max-width:600px; }
.cpp-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin:20px; padding:16px; background:#fff; border:1px solid #E5E7EB; border-radius:14px; }
.cpp-stat { display:flex; flex-direction:column; align-items:center; gap:4px; color:#6B7280; }
.cpp-stat-val { font-size:18px; font-weight:800; color:#1A1A1A; margin-top:4px; }
.cpp-stat-label { font-size:10px; text-transform:uppercase; letter-spacing:.5px; }
.cpp-menu { padding:24px 20px; }
.cpp-menu-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
.cpp-menu-title { font-size:22px; font-weight:800; color:#1A1A1A; margin:0; }
.cpp-menu-count { font-size:12px; color:#6B7280; font-weight:600; background:#fff; border:1px solid #E5E7EB; padding:4px 14px; border-radius:99px; }
.cpp-cats { display:flex; gap:6px; overflow-x:auto; padding-bottom:20px; -webkit-overflow-scrolling:touch; scrollbar-width:none; }
.cpp-cats::-webkit-scrollbar { display:none; }
.cpp-cat { background:#fff; border:1px solid #E5E7EB; color:#6B7280; padding:8px 18px; border-radius:99px; font-size:12px; font-weight:600; cursor:pointer; white-space:nowrap; transition:.2s; flex-shrink:0; }
.cpp-cat.active { background:#E8813A; border-color:#E8813A; color:#fff; }
.cpp-cat:hover:not(.active) { border-color:#E8813A; color:#E8813A; }
.cpp-dishes { display:grid; grid-template-columns:repeat(2,1fr); gap:14px; }
.cpp-dish { background:#fff; border:1px solid #E5E7EB; border-radius:14px; overflow:hidden; transition:.2s; }
.cpp-dish:hover { border-color:#D1D5DB; transform:translateY(-2px); box-shadow:0 8px 20px rgba(0,0,0,.06); }
.cpp-dish-img { height:110px; display:flex; align-items:center; justify-content:center; position:relative; }
.cpp-dish-emoji { font-size:40px; }
.cpp-dish-badge { position:absolute; top:8px; right:8px; background:rgba(0,0,0,.55); backdrop-filter:blur(4px); color:#fff; font-size:9px; font-weight:700; padding:2px 8px; border-radius:99px; }
.cpp-dish-body { padding:12px 14px 14px; }
.cpp-dish-name { font-size:14px; font-weight:700; color:#1A1A1A; line-height:1.3; }
.cpp-dish-desc { font-size:11px; color:#6B7280; margin-top:4px; line-height:1.5; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.cpp-dish-ingredients { display:flex; flex-wrap:wrap; gap:4px; margin-top:8px; }
.cpp-ing { background:#FFF8F2; color:#E8813A; font-size:9px; font-weight:600; padding:2px 8px; border-radius:99px; }
.cpp-ing-more { font-size:9px; color:#9CA3AF; font-weight:600; padding:2px 6px; }
.cpp-dish-bottom { display:flex; align-items:center; justify-content:space-between; margin-top:10px; padding-top:10px; border-top:1px solid #F3F4F6; }
.cpp-dish-price { font-size:18px; font-weight:800; color:#1A1A1A; }
.cpp-currency { font-size:12px; font-weight:600; color:#9CA3AF; }
.cpp-add-btn { display:inline-flex; align-items:center; gap:5px; background:#E8813A; color:#fff; border:none; padding:7px 14px; border-radius:8px; font-size:11px; font-weight:700; cursor:pointer; transition:.2s; }
.cpp-add-btn:hover { background:#D4702A; transform:scale(1.03); }
.cpp-closed-label { font-size:11px; color:#9CA3AF; font-weight:600; }
.cpp-empty { grid-column:1/-1; text-align:center; padding:50px 20px; color:#9CA3AF; font-size:14px; }
.cpp-empty p { margin:8px 0 0; }

/* Reviews */
.cpp-reviews-section { padding:0 20px 24px; }
.cpp-reviews-title { font-size:20px; font-weight:800; color:#1A1A1A; margin:0 0 12px; display:flex; align-items:center; gap:8px; }
.cpp-reviews-summary { display:flex; align-items:center; gap:10px; margin-bottom:16px; }
.cpp-reviews-avg { display:flex; align-items:center; gap:5px; font-size:18px; font-weight:800; color:#1A1A1A; }
.cpp-reviews-count { font-size:13px; color:#6B7280; }
.cpp-reviews-list { display:flex; flex-direction:column; gap:12px; }
.cpp-review { display:flex; gap:12px; background:#fff; border:1px solid #E5E7EB; border-radius:12px; padding:14px; }
.cpp-review-avatar { width:36px; height:36px; border-radius:50%; background:#E8813A; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:800; color:#fff; flex-shrink:0; }
.cpp-review-body { flex:1; }
.cpp-review-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; }
.cpp-review-name { font-size:13px; font-weight:700; color:#1A1A1A; }
.cpp-review-date { font-size:11px; color:#9CA3AF; }
.cpp-review-stars { display:flex; gap:2px; margin-bottom:6px; }
.star-filled { color:#EAB308; fill:#EAB308; }
.star-empty { color:#D1D5DB; }
.cpp-review-text { font-size:13px; color:#6B7280; line-height:1.5; margin:0; }

/* Sticky CTA */
.cpp-sticky-cta { position:fixed; bottom:0; left:0; right:0; z-index:100; background:#fff; border-top:1px solid #E5E7EB; padding:12px 20px; padding-bottom:calc(12px + env(safe-area-inset-bottom,0)); }
.cpp-sticky-inner { max-width:600px; margin:0 auto; display:flex; align-items:center; gap:12px; }
.cpp-sticky-info { flex:1; min-width:0; }
.cpp-sticky-name { display:block; font-size:14px; font-weight:700; color:#1A1A1A; }
.cpp-sticky-min { font-size:12px; color:#6B7280; }
.cpp-sticky-btn { display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg,#E8813A,#D4702A); color:#fff; border:none; padding:13px 24px; border-radius:12px; font-size:14px; font-weight:700; cursor:pointer; transition:.2s; white-space:nowrap; box-shadow:0 4px 14px rgba(232,129,58,.3); }
.cpp-sticky-btn:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(232,129,58,.4); }
.cpp-sticky-btn:disabled { opacity:.5; cursor:not-allowed; box-shadow:none; transform:none; }
.cpp-sticky-count { background:rgba(255,255,255,.2); padding:1px 8px; border-radius:99px; font-size:12px; }

/* Not found */
.cpp-not-found { text-align:center; padding:120px 20px; background:#F8F7F4; min-height:100vh; }
.cpp-not-found h2 { font-size:24px; color:#1A1A1A; margin:16px 0 8px; }
.cpp-not-found p { color:#6B7280; margin-bottom:24px; }
.cpp-back-btn { background:#E8813A; color:#fff; border:none; padding:10px 24px; border-radius:8px; font-size:14px; font-weight:600; cursor:pointer; }

@media(max-width:480px) { .cpp-dishes { grid-template-columns:1fr; } .cpp-sticky-btn { font-size:13px; padding:11px 18px; } }
</style>