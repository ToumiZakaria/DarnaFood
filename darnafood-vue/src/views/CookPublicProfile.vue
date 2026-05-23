<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { KITCHENS } from '../data'
import { apiGetCook } from '../api'
import { dzd } from '../utils'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import {
  ArrowLeft, Share2, Heart, Package, DollarSign, Users, ShoppingCart, Clock, MapPin
} from '@lucide/vue'

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
    if (data.success) {
      apiKitchen.value = data.cook || null
    }
  } catch {}
  loading.value = false
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
    const cats = [...new Set(kitchen.value.menu.map(d => d.cat || 'Principal'))]
    return ['Tous', ...cats]
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
    { id: kitchen.value.id + '-' + dish.id, name: dish.name, price: dish.price, emoji: dish.emoji, gradient: dish.gradient || kitchen.value.gradient, qty: 1, kitchenId: kitchen.value.id, kitchenName: kitchen.value.name },
    { id: kitchen.value.id, name: kitchen.value.name }
  )
}
</script>

<template>
  <div v-if="loading" class="cpp-loading"><div class="cpp-spinner"></div></div>
  <div v-else-if="kitchen" class="cpp">
    <!-- Sticky Header -->
    <div class="cpp-header">
      <button class="cpp-header-btn" @click="router.back()"><ArrowLeft :size="20" /></button>
      <span class="cpp-header-title">{{ kitchen.name }}</span>
      <div class="cpp-header-right">
        <button class="cpp-header-btn"><Share2 :size="18" /></button>
        <button class="cpp-header-btn" :class="{ favorited: favorite }" @click="favorite = !favorite"><Heart :size="18" /></button>
      </div>
    </div>

    <!-- Cover -->
    <div class="cpp-cover" :style="{ background: kitchen.gradient }">
      <div class="cpp-cover-emoji">{{ kitchen.emoji }}</div>
    </div>

    <!-- Info Section -->
    <div class="cpp-info">
      <div class="cpp-avatar">{{ kitchen.name.charAt(0) }}</div>
      <div class="cpp-info-top">
        <h1 class="cpp-name">{{ kitchen.name }}</h1>
        <div class="cpp-rating">
          <span class="cpp-stars">★</span>
          <span class="cpp-rating-val">{{ kitchen.rating }}</span>
          <span class="cpp-reviews">({{ kitchen.reviews }} avis)</span>
        </div>
      </div>
      <div class="cpp-tags">
        <span class="cpp-tag">{{ kitchen.cat }}</span>
        <span class="cpp-status" :class="kitchen.open ? 'open' : 'closed'">
          <span class="cpp-status-dot"></span>
          {{ kitchen.open ? 'Ouverte aujourd\'hui' : 'Fermée' }}
        </span>
      </div>
      <div class="cpp-location">
        <MapPin :size="14" />
        {{ kitchen.commune }}, {{ kitchen.wilaya }}
      </div>
      <p class="cpp-desc">{{ kitchen.desc }}</p>
    </div>

    <!-- Stats Bar -->
    <div class="cpp-stats">
      <div class="cpp-stat"><Package :size="18" /><div class="cpp-stat-val">156</div><div class="cpp-stat-label">Commandes</div></div>
      <div class="cpp-stat"><DollarSign :size="18" /><div class="cpp-stat-val">{{ dzd(127000) }}</div><div class="cpp-stat-label">Revenus</div></div>
      <div class="cpp-stat"><Users :size="18" /><div class="cpp-stat-val">89</div><div class="cpp-stat-label">Clients fidèles</div></div>
    </div>

    <!-- Menu Section -->
    <div class="cpp-menu">
      <div class="cpp-menu-head">
        <h2 class="cpp-menu-title">Notre Menu</h2>
        <span class="cpp-menu-count">{{ filteredMenu.length }} plat{{ filteredMenu.length > 1 ? 's' : '' }}</span>
      </div>
      <div class="cpp-cats">
        <button v-for="c in dishCats" :key="c" class="cpp-cat" :class="{ active: activeCat === c }" @click="activeCat = c">{{ c }}</button>
      </div>
      <div class="cpp-dishes">
        <div v-for="dish in filteredMenu" :key="dish.id" class="cpp-dish">
          <div class="cpp-dish-img" :style="dish.photo ? { backgroundImage: 'url('+dish.photo+')', backgroundSize:'cover', backgroundPosition:'center' } : { background: dish.gradient || kitchen.gradient }">
            <div v-if="!dish.photo" class="cpp-dish-emoji">{{ dish.emoji || '🍽️' }}</div>
            <div v-if="dish.portion" class="cpp-dish-badge">{{ dish.portion }}</div>
          </div>
          <div class="cpp-dish-body">
            <div class="cpp-dish-name">{{ dish.name }}</div>
            <div class="cpp-dish-desc">{{ dish.desc || 'Préparation maison avec des ingrédients frais' }}</div>
            <div v-if="dish.ingredients?.length" class="cpp-dish-ingredients">
              <span v-for="(ing, i) in dish.ingredients.slice(0, 3)" :key="i" class="cpp-ing">{{ ing }}</span>
              <span v-if="dish.ingredients.length > 3" class="cpp-ing-more">+{{ dish.ingredients.length - 3 }}</span>
            </div>
            <div class="cpp-dish-bottom">
              <div class="cpp-dish-price">{{ dish.price.toLocaleString('fr-DZ') }} <span class="cpp-currency">DA</span></div>
              <button v-if="kitchen.open" class="cpp-add-btn" @click="addDish(dish)">
                <ShoppingCart :size="14" />
                <span>Ajouter</span>
              </button>
              <span v-else class="cpp-closed-label">Indisponible</span>
            </div>
          </div>
        </div>
        <div v-if="!filteredMenu.length" class="cpp-empty">
          <div class="cpp-empty-icon">🍽️</div>
          <p>Aucun plat dans cette catégorie</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="!loading" class="cpp-not-found">
    <h2>Cuisinier introuvable</h2>
    <p>Ce cuisinier n'existe pas ou a été supprimé.</p>
    <button class="cpp-back-btn" @click="router.push({name:'kitchens'})">← Retour aux cuisines</button>
  </div>
</template>

<style scoped>
.cpp {
  background: #0A0A0A;
  min-height: 100vh;
  padding-bottom: 100px;
}

/* Sticky Header */
.cpp-header {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(10,10,10,.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,.04);
}
.cpp-header-title {
  font-size: 15px;
  font-weight: 700;
  color: #FAFAFA;
}
.cpp-header-right {
  display: flex;
  gap: 6px;
}
.cpp-header-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.08);
  color: #A1A1AA;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all .2s;
}
.cpp-header-btn:hover {
  background: rgba(255,255,255,.1);
  color: #FAFAFA;
}
.cpp-header-btn.favorited {
  color: #EF4444;
  background: rgba(239,68,68,.12);
  border-color: rgba(239,68,68,.25);
}

/* Cover */
.cpp-cover {
  height: 200px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cpp-cover-emoji {
  font-size: 80px;
  opacity: .2;
}

/* Info */
.cpp-info {
  padding: 0 20px;
  margin-top: -32px;
  position: relative;
  z-index: 2;
}
.cpp-avatar {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: #E8813A;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 12px;
  border: 3px solid #0A0A0A;
  box-shadow: 0 4px 20px rgba(0,0,0,.4);
}
.cpp-name {
  font-size: 26px;
  font-weight: 800;
  color: #FAFAFA;
  margin: 0 0 6px;
}
.cpp-rating {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
}
.cpp-stars {
  color: #EAB308;
  font-size: 16px;
}
.cpp-rating-val {
  font-size: 15px;
  font-weight: 700;
  color: #FAFAFA;
}
.cpp-reviews {
  font-size: 13px;
  color: #A1A1AA;
}
.cpp-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}
.cpp-tag {
  background: rgba(232,129,58,.1);
  color: #E8813A;
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 600;
}
.cpp-status {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 600;
}
.cpp-status.open {
  background: rgba(34,197,94,.1);
  color: #22C55E;
}
.cpp-status.closed {
  background: rgba(239,68,68,.1);
  color: #EF4444;
}
.cpp-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}
.cpp-location {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #A1A1AA;
  margin-bottom: 10px;
}
.cpp-desc {
  font-size: 14px;
  color: #A1A1AA;
  line-height: 1.6;
  margin: 0;
}

/* Stats */
.cpp-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 20px;
  padding: 16px;
  background: #141414;
  border: 1px solid #262626;
  border-radius: 14px;
}
.cpp-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #A1A1AA;
}
.cpp-stat-val {
  font-size: 18px;
  font-weight: 800;
  color: #FAFAFA;
  margin-top: 4px;
}
.cpp-stat-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: .5px;
}

/* Menu */
.cpp-menu { padding: 24px 20px; }
.cpp-menu-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px;
}
.cpp-menu-title {
  font-size: 22px; font-weight: 800; color: #FAFAFA; margin: 0;
}
.cpp-menu-count {
  font-size: 12px; color: #A1A1AA; font-weight: 600;
  background: #141414; border: 1px solid #262626;
  padding: 4px 14px; border-radius: 99px;
}
.cpp-cats {
  display: flex; gap: 6px; overflow-x: auto;
  padding-bottom: 20px; -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.cpp-cats::-webkit-scrollbar { display: none; }
.cpp-cat {
  background: transparent; border: 1px solid #262626;
  color: #A1A1AA; padding: 8px 18px; border-radius: 99px;
  font-size: 12px; font-weight: 600; cursor: pointer;
  white-space: nowrap; transition: all .25s; flex-shrink: 0;
}
.cpp-cat.active {
  background: #E8813A; border-color: #E8813A; color: #fff;
}
.cpp-cat:hover:not(.active) { border-color: #E8813A; color: #FAFAFA; }

/* Dish Grid */
.cpp-dishes {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;
}
.cpp-dish {
  background: #141414; border: 1px solid #262626;
  border-radius: 14px; overflow: hidden;
  transition: all .25s;
}
.cpp-dish:hover { border-color: #333; transform: translateY(-2px); }
.cpp-dish-img {
  height: 110px; display: flex; align-items: center;
  justify-content: center; position: relative;
}
.cpp-dish-emoji { font-size: 40px; }
.cpp-dish-badge {
  position: absolute; top: 8px; right: 8px;
  background: rgba(0,0,0,.55); backdrop-filter: blur(4px);
  color: #FAFAFA; font-size: 9px; font-weight: 700;
  padding: 2px 8px; border-radius: 99px;
}
.cpp-dish-body { padding: 12px 14px 14px; }
.cpp-dish-name {
  font-size: 14px; font-weight: 700; color: #FAFAFA;
  line-height: 1.3;
}
.cpp-dish-desc {
  font-size: 11px; color: #A1A1AA; margin-top: 4px;
  line-height: 1.5; display: -webkit-box;
  -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.cpp-dish-ingredients {
  display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px;
}
.cpp-ing {
  background: rgba(232,129,58,.08); color: #E8813A;
  font-size: 9px; font-weight: 600; padding: 2px 8px;
  border-radius: 99px;
}
.cpp-ing-more {
  font-size: 9px; color: #A1A1AA; font-weight: 600;
  padding: 2px 6px;
}
.cpp-dish-bottom {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 10px; padding-top: 10px;
  border-top: 1px solid rgba(255,255,255,.04);
}
.cpp-dish-price {
  font-size: 18px; font-weight: 800; color: #FAFAFA;
}
.cpp-currency {
  font-size: 12px; font-weight: 600; color: #A1A1AA;
}
.cpp-add-btn {
  display: inline-flex; align-items: center; gap: 5px;
  background: #E8813A; color: #fff; border: none;
  padding: 7px 14px; border-radius: 8px;
  font-size: 11px; font-weight: 700; cursor: pointer;
  transition: all .2s;
}
.cpp-add-btn:hover { background: #d6732e; transform: scale(1.03); }
.cpp-add-btn:active { transform: scale(.97); }
.cpp-closed-label {
  font-size: 11px; color: #52525B; font-weight: 600;
}
.cpp-empty {
  grid-column: 1 / -1; text-align: center;
  padding: 50px 20px; color: #A1A1AA; font-size: 14px;
}
.cpp-empty-icon { font-size: 40px; margin-bottom: 8px; }
.cpp-empty p { margin: 0; }

@media (max-width: 480px) {
  .cpp-dishes { grid-template-columns: 1fr; }
}

/* Not found */
.cpp-not-found {
  text-align: center;
  padding: 120px 20px;
}
.cpp-not-found h2 {
  font-size: 24px;
  color: #FAFAFA;
  margin-bottom: 8px;
}
.cpp-not-found p {
  color: #A1A1AA;
  margin-bottom: 24px;
}
.cpp-back-btn {
  background: #E8813A;
  color: #fff;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.cpp-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #0A0A0A;
}
.cpp-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #262626;
  border-top-color: #E8813A;
  border-radius: 50%;
  animation: spin .6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg) } }
</style>
