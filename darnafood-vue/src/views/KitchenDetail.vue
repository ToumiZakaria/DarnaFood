<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { KITCHENS, DISH_PHOTOS } from '../data'
import { dzd } from '../utils'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()
const auth = useAuthStore()

const kitchen = computed(() => KITCHENS.find(k => k.id === route.params.id))
const activeCat = ref('Tout')
const dishCats = computed(() => {
  if (!kitchen.value) return []
  const cats = ['Tout', ...new Set(kitchen.value.menu.map(d => d.cat || 'Principal'))]
  return cats
})
const filteredMenu = computed(() => {
  if (!kitchen.value) return []
  if (activeCat.value === 'Tout') return kitchen.value.menu
  return kitchen.value.menu.filter(d => (d.cat || 'Principal') === activeCat.value)
})

function addDish(dish) {
  if (!auth.isClient) { router.push({ name: 'login' }); return }
  cart.add(
    { id: kitchen.value.id + '-' + dish.id, name: dish.name, price: dish.price, emoji: dish.emoji, gradient: dish.gradient || kitchen.value.gradient, qty: 1, kitchenId: kitchen.value.id, kitchenName: kitchen.value.name, cat: dish.cat || 'Principal' },
    { id: kitchen.value.id, name: kitchen.value.name }
  )
}
</script>

<template>
  <div v-if="kitchen" class="main-content page-kitchen-detail">
    <div class="kd-cover" :style="{ background: kitchen.gradient }">
      <div class="kd-cover-emoji">{{ kitchen.emoji }}</div>
      <div class="kd-cover-overlay">
        <button class="back-btn" @click="router.push({name:'kitchens'})">← Retour</button>
        <div class="kd-info">
          <div class="kd-name">{{ kitchen.name }}</div>
          <div class="kd-tag">{{ kitchen.tagline }}</div>
          <div class="kd-meta">
            <span>⭐ {{ kitchen.rating }}</span>
            <span>📍 {{ kitchen.wilaya }}</span>
            <span>🕐 {{ kitchen.deliveryTime }} min</span>
            <span class="kd-status" :class="kitchen.open ? 'open' : 'closed'">{{ kitchen.open ? 'Ouvert' : 'Fermé' }}</span>
          </div>
          <div class="kd-delivery">
            <span>Min. {{ dzd(kitchen.minOrder) }}</span>
            <span>·</span>
            <span>Liv. {{ dzd(kitchen.deliveryFee) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="kd-body">
      <div class="kd-cats-strip">
        <button v-for="c in dishCats" :key="c" class="kd-cat-chip" :class="{ active: activeCat === c }" @click="activeCat = c">{{ c }}</button>
      </div>

      <div v-for="dish in filteredMenu" :key="dish.id" class="dish-card">
        <div class="dish-icon" :style="{ background: dish.gradient || kitchen.gradient }">{{ dish.emoji }}</div>
        <div class="dish-info">
          <div class="dish-name">{{ dish.name }}</div>
          <div class="dish-desc">{{ dish.desc }}</div>
          <div class="dish-price-row">
            <span class="dish-price">{{ dzd(dish.price) }}</span>
            <button v-if="kitchen.open" class="btn-add" @click="addDish(dish)">+ Ajouter</button>
            <span v-else class="closed-label">Fermé</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="not-found">
    <h2>Cuisine introuvable</h2>
    <button class="btn-primary" @click="router.push({name:'kitchens'})">← Retour aux cuisines</button>
  </div>
</template>

<style scoped>
.kd-cover { min-height:200px; position:relative; display:flex; align-items:flex-end; padding:16px; }
.kd-cover-emoji { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:90px; opacity:.25; }
.kd-cover-overlay { position:relative; z-index:1; width:100%; }
.back-btn { background:rgba(12,11,9,.6); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,.1); color:#fff; padding:8px 16px; border-radius:var(--r-sm); font-size:13px; font-weight:600; cursor:pointer; margin-bottom:12px; }
.kd-info { color:#fff; }
.kd-name { font-size:28px; font-weight:800; }
.kd-tag { font-size:14px; opacity:.75; margin-bottom:10px; }
.kd-meta { display:flex; gap:14px; font-size:13px; opacity:.85; }
.kd-status { padding:2px 8px; border-radius:99px; font-size:11px; font-weight:700; }
.kd-status.open { background:rgba(45,140,100,.7); }
.kd-status.closed { background:rgba(100,80,60,.6); }
.kd-delivery { display:flex; gap:6px; font-size:13px; opacity:.7; margin-top:6px; }
.kd-body { padding:24px 28px; max-width:900px; margin:0 auto; }
.kd-cats-strip { display:flex; gap:8px; overflow-x:auto; padding-bottom:16px; }
.kd-cat-chip { background:var(--bg-card); border:1px solid var(--border); color:var(--text-muted); padding:8px 18px; border-radius:99px; font-size:13px; font-weight:600; cursor:pointer; white-space:nowrap; }
.kd-cat-chip.active, .kd-cat-chip:hover { border-color:var(--primary); background:var(--primary-glow); color:var(--primary-light); }
.dish-card { display:flex; gap:14px; padding:18px 0; border-bottom:1px solid var(--border); }
.dish-icon { width:56px; height:56px; border-radius:var(--r); display:flex; align-items:center; justify-content:center; font-size:28px; flex-shrink:0; }
.dish-info { flex:1; }
.dish-name { font-size:16px; font-weight:700; }
.dish-desc { font-size:13px; color:var(--text-muted); margin-top:2px; line-height:1.5; }
.dish-price-row { display:flex; align-items:center; justify-content:space-between; margin-top:8px; }
.dish-price { font-size:17px; font-weight:800; color:var(--primary-light); }
.btn-add { background:linear-gradient(135deg,var(--primary-light),var(--primary-dark)); color:#fff; border:none; padding:7px 16px; border-radius:var(--r-sm); font-size:12px; font-weight:700; cursor:pointer; }
.btn-add:hover { box-shadow:0 4px 14px rgba(232,144,26,.35); }
.closed-label { font-size:12px; color:var(--text-muted); font-weight:600; }
.not-found { text-align:center; padding:120px 20px; }
.not-found h2 { font-size:24px; margin-bottom:16px; color:var(--text-muted); }
</style>
