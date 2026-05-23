<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { KITCHENS, CATS } from '../data'
import { apiGetCooks } from '../api'
import { dzd } from '../utils'
import { Search, Star, Clock, ChevronRight, TrendingUp, MapPin, ChefHat, Flame, Cake, Soup, Sandwich, Utensils } from '@lucide/vue'

const router = useRouter()
const auth = useAuthStore()
const search = ref('')
const realCooks = ref([])
const trendingDishes = ref([])

const catIcons = { 'Couscous': ChefHat, 'Tagine': Utensils, 'Grillades': Flame, 'Pâtisseries': Cake, 'Soupes': Soup, 'Sandwich': Sandwich, 'Salades': Utensils, 'Kabyle': Utensils }

onMounted(async () => {
  try {
    const data = await apiGetCooks()
    if (data.success && data.cooks?.length) {
      realCooks.value = data.cooks
    }
  } catch {}
  const allDishes = []
  KITCHENS.forEach(k => {
    if (k.menu) {
      k.menu.forEach(g => {
        if (g.dishes) g.dishes.forEach(d => allDishes.push({ ...d, kitchenName: k.name, kitchenId: k.id, kitchenGradient: k.gradient }))
      })
    }
  })
  trendingDishes.value = allDishes.slice(0, 8)
})

const allCooks = computed(() => [...KITCHENS, ...realCooks.value])
const popularCooks = computed(() => [...allCooks.value].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 6))

function doSearch() {
  if (search.value.trim()) router.push({ name: 'kitchens', query: { q: search.value.trim() } })
}
</script>

<template>
  <div class="home">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <p class="hero-greeting">Bonjour{{ auth.isAuthenticated ? ', ' + (auth.user?.firstName || auth.user?.name) : '' }} !</p>
        <h1 class="hero-title">Des repas faits maison,<br />livrés chez <span>vous</span></h1>
        <p class="hero-sub">Découvrez les cuisines maison près de chez vous. Des plats authentiques préparés avec amour.</p>
        <div class="hero-search">
          <Search :size="18" class="hero-search-icon" />
          <input v-model="search" type="text" placeholder="Rechercher une cuisine, un plat..." @keyup.enter="doSearch" />
          <button class="hero-search-btn" @click="doSearch">Rechercher</button>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="section">
      <div class="section-head">
        <h2 class="section-title">Catégories</h2>
        <button class="section-link" @click="router.push({name:'kitchens'})">Voir tout <ChevronRight :size="14" /></button>
      </div>
      <div class="cats-scroll">
        <button v-for="c in CATS" :key="c.name" class="cat-chip" @click="router.push({name:'kitchens', query:{cat:c.name}})">
          <div class="cat-icon">
            <component :is="catIcons[c.name] || Utensils" :size="22" />
          </div>
          <span class="cat-label">{{ c.name }}</span>
        </button>
      </div>
    </section>

    <!-- Popular kitchens -->
    <section class="section">
      <div class="section-head">
        <h2 class="section-title"><Star :size="20" class="section-head-icon" /> Cuisines populaires</h2>
        <button class="section-link" @click="router.push({name:'kitchens'})">Voir tout <ChevronRight :size="14" /></button>
      </div>
      <div class="kitchen-grid">
        <div v-for="k in popularCooks" :key="k.id" class="k-card" @click="router.push({name:'cook-public-profile', params:{id:k.id}})">
          <div class="k-cover" :style="{ background: k.gradient || 'linear-gradient(135deg,#E8813A,#D4702A)' }">
            <div class="k-cover-emoji">{{ k.emoji || '🍽️' }}</div>
            <span class="k-status" :class="k.open !== false ? 'open' : 'closed'">{{ k.open !== false ? 'Ouvert' : 'Fermé' }}</span>
          </div>
          <div class="k-body">
            <h3 class="k-name">{{ k.name }}</h3>
            <p class="k-tag">{{ k.tagline || k.desc?.slice(0,60) }}</p>
            <div class="k-meta">
              <span class="k-meta-item"><Star :size="13" /> {{ k.rating || '—' }}</span>
              <span class="k-meta-item"><Clock :size="13" /> {{ k.deliveryTime || 45 }} min</span>
              <span class="k-meta-item"><MapPin :size="13" /> {{ k.wilaya || 'Alger' }}</span>
            </div>
            <div class="k-footer">
              <span class="k-min">Min. {{ dzd(k.minOrder || 300) }}</span>
              <button class="k-btn">Menu</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trending dishes -->
    <section class="section" v-if="trendingDishes.length">
      <div class="section-head">
        <h2 class="section-title"><TrendingUp :size="20" class="section-head-icon" /> Plats en vogue</h2>
      </div>
      <div class="dish-scroll">
        <div v-for="d in trendingDishes" :key="d.id" class="dish-card" @click="router.push({name:'cook-public-profile', params:{id:d.kitchenId}})">
          <div class="dish-img" :style="{ background: d.gradient || d.kitchenGradient || 'linear-gradient(135deg,#E8813A,#D4702A)' }">
            <span class="dish-emoji">{{ d.emoji || '🍽️' }}</span>
          </div>
          <div class="dish-info">
            <h4 class="dish-name">{{ d.name }}</h4>
            <p class="dish-kitchen">{{ d.kitchenName }}</p>
            <div class="dish-price-row">
              <span class="dish-price">{{ dzd(d.price) }}</span>
              <button class="dish-btn">+</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section cta-section">
      <div class="cta-card">
        <h2>Vous cuisinez ? Rejoignez-nous !</h2>
        <p>Transformez votre passion en revenus. Créez votre cuisine virtuelle et commencez à recevoir des commandes.</p>
        <button class="cta-btn" @click="router.push({name:'register'})">Devenir cuisinier</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home { min-height:100vh; padding-top:64px; }
.hero { position:relative; padding:80px 24px 60px; text-align:center; overflow:hidden; background:linear-gradient(180deg,#FFF8F2 0%,#F8F7F4 100%); }
.hero-bg { position:absolute; top:-200px; left:50%; transform:translateX(-50%); width:600px; height:600px; border-radius:50%; background:radial-gradient(circle,rgba(232,129,58,.08) 0%,transparent 70%); pointer-events:none; }
.hero-content { position:relative; max-width:640px; margin:0 auto; }
.hero-greeting { font-size:14px; font-weight:600; color:#E8813A; margin-bottom:12px; letter-spacing:1.5px; text-transform:uppercase; }
.hero-title { font-size:44px; font-weight:900; line-height:1.1; color:#1A1A1A; margin-bottom:16px; }
.hero-title span { background:linear-gradient(135deg,#E8813A,#D4702A); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.hero-sub { font-size:16px; color:#6B7280; margin-bottom:28px; max-width:460px; margin-left:auto; margin-right:auto; line-height:1.6; }
.hero-search { display:flex; align-items:center; max-width:500px; margin:0 auto; background:#fff; border:1px solid #E5E7EB; border-radius:12px; padding:4px; box-shadow:0 4px 12px rgba(0,0,0,.06); }
.hero-search-icon { margin-left:14px; color:#9CA3AF; flex-shrink:0; }
.hero-search input { flex:1; border:none; outline:none; padding:12px 14px; font-size:15px; color:#1A1A1A; background:transparent; }
.hero-search input::placeholder { color:#9CA3AF; }
.hero-search-btn { background:#E8813A; color:#fff; border:none; padding:10px 22px; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; transition:.2s; }
.hero-search-btn:hover { background:#D4702A; }
.section { padding:48px 24px; max-width:1200px; margin:0 auto; }
.section-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; }
.section-title { font-size:22px; font-weight:800; color:#1A1A1A; display:flex; align-items:center; gap:8px; }
.section-head-icon { color:#E8813A; }
.section-link { display:inline-flex; align-items:center; gap:4px; background:none; border:none; color:#E8813A; font-size:14px; font-weight:600; cursor:pointer; }
.section-link:hover { color:#D4702A; }
.cats-scroll { display:flex; gap:10px; overflow-x:auto; padding-bottom:8px; -webkit-overflow-scrolling:touch; }
.cat-chip { display:flex; flex-direction:column; align-items:center; gap:6px; background:#fff; border:1px solid #E5E7EB; border-radius:14px; padding:16px 20px; cursor:pointer; transition:.2s; flex-shrink:0; min-width:80px; }
.cat-chip:hover { border-color:#E8813A; box-shadow:0 4px 12px rgba(232,129,58,.12); }
.cat-icon { width:44px; height:44px; border-radius:12px; background:linear-gradient(135deg,#FFF8F2,#FEF0E6); display:flex; align-items:center; justify-content:center; color:#E8813A; }
.cat-label { font-size:12px; font-weight:600; color:#374151; white-space:nowrap; }
.kitchen-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:20px; }
.k-card { background:#fff; border:1px solid #E5E7EB; border-radius:16px; overflow:hidden; cursor:pointer; transition:.25s; }
.k-card:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(0,0,0,.1); border-color:#D1D5DB; }
.k-cover { height:160px; position:relative; display:flex; align-items:flex-end; padding:14px; }
.k-cover-emoji { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:56px; opacity:.3; }
.k-status { position:relative; z-index:1; padding:3px 10px; border-radius:99px; font-size:11px; font-weight:700; backdrop-filter:blur(8px); }
.k-status.open { background:rgba(34,197,94,.85); color:#fff; }
.k-status.closed { background:rgba(156,163,175,.8); color:#fff; }
.k-body { padding:16px 18px; }
.k-name { font-size:17px; font-weight:700; color:#1A1A1A; margin:0 0 3px; }
.k-tag { font-size:12px; color:#6B7280; margin:0 0 12px; line-height:1.4; }
.k-meta { display:flex; gap:14px; flex-wrap:wrap; margin-bottom:14px; }
.k-meta-item { display:flex; align-items:center; gap:4px; font-size:12px; color:#6B7280; }
.k-footer { display:flex; align-items:center; justify-content:space-between; border-top:1px solid #F3F4F6; padding-top:12px; }
.k-min { font-size:12px; color:#6B7280; }
.k-btn { background:#E8813A; color:#fff; border:none; padding:7px 18px; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer; transition:.2s; }
.k-btn:hover { background:#D4702A; }
.dish-scroll { display:flex; gap:16px; overflow-x:auto; padding-bottom:8px; -webkit-overflow-scrolling:touch; }
.dish-card { min-width:200px; background:#fff; border:1px solid #E5E7EB; border-radius:14px; overflow:hidden; cursor:pointer; transition:.2s; flex-shrink:0; }
.dish-card:hover { transform:translateY(-3px); box-shadow:0 8px 20px rgba(0,0,0,.08); }
.dish-img { height:130px; display:flex; align-items:center; justify-content:center; }
.dish-emoji { font-size:42px; opacity:.6; }
.dish-info { padding:12px 14px; }
.dish-name { font-size:14px; font-weight:700; color:#1A1A1A; margin:0 0 2px; }
.dish-kitchen { font-size:11px; color:#6B7280; margin:0 0 8px; }
.dish-price-row { display:flex; align-items:center; justify-content:space-between; }
.dish-price { font-size:16px; font-weight:800; color:#E8813A; }
.dish-btn { width:28px; height:28px; border-radius:8px; background:linear-gradient(135deg,#E8813A,#D4702A); color:#fff; border:none; font-size:18px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; line-height:1; }
.dish-btn:hover { box-shadow:0 3px 10px rgba(232,129,58,.3); }
.cta-section { padding-bottom:64px; }
.cta-card { background:linear-gradient(135deg,#FFF8F2,#FEF0E6); border:1px solid #FDE0CC; border-radius:20px; padding:56px 40px; text-align:center; }
.cta-card h2 { font-size:28px; font-weight:800; color:#1A1A1A; margin:0 0 12px; }
.cta-card p { font-size:15px; color:#6B7280; max-width:480px; margin:0 auto 24px; line-height:1.7; }
.cta-btn { background:linear-gradient(135deg,#E8813A,#D4702A); color:#fff; border:none; padding:14px 32px; border-radius:12px; font-size:15px; font-weight:700; cursor:pointer; transition:.2s; box-shadow:0 4px 14px rgba(232,129,58,.3); }
.cta-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(232,129,58,.4); }
@media(max-width:768px) { .hero-title { font-size:32px; } .kitchen-grid { grid-template-columns:1fr; } }
</style>