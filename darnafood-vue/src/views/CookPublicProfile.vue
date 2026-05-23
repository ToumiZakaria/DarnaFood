<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { KITCHENS } from '../data'
import { apiGetCooks } from '../api'
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
const apiKitchen = ref(null)

onMounted(async () => {
  const id = route.params.id
  const mock = KITCHENS.find(k => k.id === Number(id) || k.id === id)
  if (mock) return
  try {
    const data = await apiGetCooks()
    if (data.success) {
      apiKitchen.value = data.cooks?.find(c => c.id === id || c._id === id) || null
    }
  } catch {}
})

const kitchen = computed(() => {
  const id = route.params.id
  return KITCHENS.find(k => k.id === Number(id) || k.id === id) || apiKitchen.value
})
const activeCat = ref('Tous')
const dishCats = computed(() => {
  if (!kitchen.value) return ['Tous']
  const cats = ['Tous', ...kitchen.value.menu.map(d => d.cat || 'Principal')]
  return cats
})
const filteredMenu = computed(() => {
  if (!kitchen.value) return []
  if (activeCat.value === 'Tous') {
    return kitchen.value.menu.flatMap(g => g.dishes || [])
  }
  const group = kitchen.value.menu.find(d => (d.cat || 'Principal') === activeCat.value)
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
  <div v-if="kitchen" class="cpp">
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
      <h2 class="cpp-menu-title">Menu</h2>
      <div class="cpp-cats">
        <button v-for="c in dishCats" :key="c" class="cpp-cat" :class="{ active: activeCat === c }" @click="activeCat = c">{{ c }}</button>
      </div>
      <div class="cpp-dishes">
        <div v-for="dish in filteredMenu" :key="dish.id" class="cpp-dish">
          <div class="cpp-dish-icon" :style="{ background: dish.gradient || kitchen.gradient }">{{ dish.emoji }}</div>
          <div class="cpp-dish-body">
            <div class="cpp-dish-name">{{ dish.name }}</div>
            <div class="cpp-dish-desc">{{ dish.desc }}</div>
            <div class="cpp-dish-bottom">
              <span class="cpp-dish-price">{{ dzd(dish.price) }}</span>
              <button v-if="kitchen.open" class="cpp-add-btn" @click="addDish(dish)"><ShoppingCart :size="15" /> Ajouter</button>
              <span v-else class="cpp-closed-label">Fermé</span>
            </div>
          </div>
        </div>
        <div v-if="!filteredMenu.length" class="cpp-empty">
          Aucun plat dans cette catégorie
        </div>
      </div>
    </div>
  </div>
  <div v-else class="cpp-not-found">
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
.cpp-menu {
  padding: 0 20px;
}
.cpp-menu-title {
  font-size: 20px;
  font-weight: 800;
  color: #FAFAFA;
  margin: 0 0 14px;
}
.cpp-cats {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 16px;
  -webkit-overflow-scrolling: touch;
}
.cpp-cat {
  background: #141414;
  border: 1px solid #262626;
  color: #A1A1AA;
  padding: 8px 20px;
  border-radius: 99px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all .2s;
}
.cpp-cat.active,
.cpp-cat:hover {
  border-color: #E8813A;
  background: rgba(232,129,58,.1);
  color: #E8813A;
}

/* Dishes */
.cpp-dishes {
  display: flex;
  flex-direction: column;
}
.cpp-dish {
  display: flex;
  gap: 14px;
  padding: 16px 0;
  border-bottom: 1px solid #1A1A1A;
}
.cpp-dish-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  flex-shrink: 0;
}
.cpp-dish-body {
  flex: 1;
  min-width: 0;
}
.cpp-dish-name {
  font-size: 15px;
  font-weight: 700;
  color: #FAFAFA;
}
.cpp-dish-desc {
  font-size: 12px;
  color: #A1A1AA;
  margin-top: 2px;
  line-height: 1.5;
}
.cpp-dish-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}
.cpp-dish-price {
  font-size: 17px;
  font-weight: 800;
  color: #E8813A;
}
.cpp-add-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #E8813A;
  color: #fff;
  border: none;
  padding: 7px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all .2s;
}
.cpp-add-btn:hover {
  background: #d6732e;
}
.cpp-closed-label {
  font-size: 12px;
  color: #A1A1AA;
  font-weight: 600;
}
.cpp-empty {
  text-align: center;
  padding: 40px 20px;
  color: #A1A1AA;
  font-size: 14px;
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
</style>
