<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { KITCHENS, CATS } from '../data'
import { apiGetCooks } from '../api'
import { dzd } from '../utils'
import { Search, Star, Clock, MapPin, ChevronDown, SlidersHorizontal } from '@lucide/vue'

const route = useRoute()
const router = useRouter()
const search = ref(route.query.q || '')
const activeCat = ref(route.query.cat || null)
const sortBy = ref('')
const realCooks = ref([])
const showCount = ref(12)
const loading = ref(true)

const catLabels = {}
CATS.forEach(c => { catLabels[c.name] = c.name })

onMounted(async () => {
  try {
    const data = await apiGetCooks()
    if (data.success) realCooks.value = data.cooks || []
  } catch {} finally { loading.value = false }
})

const allKitchens = computed(() => [...KITCHENS, ...realCooks.value])

const filtered = computed(() => {
  let list = [...allKitchens.value]
  if (activeCat.value) {
    list = list.filter(k => k.cat === activeCat.value || k.cat?.name === activeCat.value || k.cat?.id === activeCat.value)
  }
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(k => k.name?.toLowerCase().includes(q) || k.tagline?.toLowerCase().includes(q) || k.wilaya?.toLowerCase().includes(q) || k.commune?.toLowerCase().includes(q))
  }
  if (sortBy.value === 'rating') list.sort((a,b) => (b.rating||0) - (a.rating||0))
  else if (sortBy.value === 'delivery') list.sort((a,b) => (a.deliveryTime||99) - (b.deliveryTime||99))
  else if (sortBy.value === 'min') list.sort((a,b) => (a.minOrder||999) - (b.minOrder||999))
  return list
})

const displayed = computed(() => filtered.value.slice(0, showCount.value))
const hasMore = computed(() => filtered.value.length > showCount.value)

function loadMore() { showCount.value += 12 }

const filterChips = ['Tous', 'Ouvert', ...CATS.map(c => c.name)]
</script>

<template>
  <div class="kitchens-page">
    <div class="page-inner">
      <div class="page-head">
        <h1 class="page-title">Cuisines</h1>
        <p class="page-subtitle">{{ filtered.length }} cuisine{{ filtered.length > 1 ? 's' : '' }} disponibles</p>
      </div>

      <!-- Search -->
      <div class="search-bar">
        <Search :size="18" class="search-bar-icon" />
        <input v-model="search" type="text" placeholder="Rechercher par nom, wilaya..." class="search-bar-input" />
      </div>

      <!-- Filters -->
      <div class="filters-row">
        <div class="filter-chips">
          <button v-for="f in filterChips" :key="f" class="filter-chip"
            :class="{ active: (f === 'Tous' && !activeCat) || (f === 'Ouvert' && activeCat === '__open__') || (f !== 'Tous' && f !== 'Ouvert' && activeCat === f) }"
            @click="activeCat = (f === 'Tous' ? null : f === 'Ouvert' ? '__open__' : f)">
            {{ f === 'Ouvert' ? '🟢 ' : '' }}{{ f }}
          </button>
        </div>
        <div class="sort-wrap">
          <SlidersHorizontal :size="16" />
          <select v-model="sortBy" class="sort-select">
            <option value="">Trier</option>
            <option value="rating">Mieux notés</option>
            <option value="delivery">Livraison rapide</option>
            <option value="min">Min. commande</option>
          </select>
        </div>
      </div>

      <!-- Results -->
      <div v-if="displayed.length" class="kitchen-list">
        <div v-for="k in displayed" :key="k.id" class="kitchen-card" @click="router.push({name:'cook-public-profile', params:{id:k.id}})">
          <div class="kc-cover" :style="{ background: k.gradient || 'linear-gradient(135deg,#E8813A,#D4702A)' }">
            <div class="kc-emoji">{{ k.emoji || '🍽️' }}</div>
            <span class="kc-status-dot" :class="k.open !== false ? 'open' : 'closed'"></span>
          </div>
          <div class="kc-body">
            <div class="kc-top">
              <h3 class="kc-name">{{ k.name }}</h3>
              <span class="kc-rating"><Star :size="12" /> {{ k.rating || '—' }}</span>
            </div>
            <p class="kc-tag">{{ k.tagline || k.desc?.slice(0,80) }}</p>
            <div class="kc-meta">
              <span><Clock :size="12" /> {{ k.deliveryTime || 45 }} min</span>
              <span><MapPin :size="12" /> {{ k.wilaya || 'Alger' }}</span>
              <span>Min. {{ dzd(k.minOrder || 300) }}</span>
            </div>
            <div class="kc-footer">
              <span class="kc-delivery">Liv. {{ dzd(k.deliveryFee || 0) }}</span>
              <button class="kc-btn">Voir le menu</button>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="!loading" class="empty-state">
        <Search :size="48" class="empty-icon" />
        <h3>Aucune cuisine trouvée</h3>
        <p>Essayez de modifier vos filtres ou votre recherche.</p>
        <button class="empty-btn" @click="search='';activeCat=null">Réinitialiser</button>
      </div>

      <div v-if="hasMore" class="load-more-wrap">
        <button class="load-more-btn" @click="loadMore">
          Charger plus ({{ filtered.length - showCount }})
          <ChevronDown :size="16" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kitchens-page { min-height:100vh; padding-top:64px; background:#F8F7F4; }
.page-inner { max-width:900px; margin:0 auto; padding:32px 24px 80px; }
.page-head { margin-bottom:24px; }
.page-title { font-size:28px; font-weight:800; color:#1A1A1A; margin:0 0 4px; }
.page-subtitle { font-size:14px; color:#6B7280; margin:0; }
.search-bar { display:flex; align-items:center; background:#fff; border:1px solid #E5E7EB; border-radius:12px; padding:4px 14px; margin-bottom:20px; box-shadow:0 2px 8px rgba(0,0,0,.04); }
.search-bar-icon { color:#9CA3AF; flex-shrink:0; }
.search-bar-input { flex:1; border:none; outline:none; padding:12px 12px; font-size:15px; color:#1A1A1A; background:transparent; }
.filters-row { display:flex; gap:12px; align-items:center; margin-bottom:24px; }
.filter-chips { display:flex; gap:8px; overflow-x:auto; flex:1; padding-bottom:4px; }
.filter-chip { padding:7px 16px; border-radius:99px; font-size:13px; font-weight:600; cursor:pointer; white-space:nowrap; border:1px solid #E5E7EB; background:#fff; color:#6B7280; transition:.2s; flex-shrink:0; }
.filter-chip:hover, .filter-chip.active { border-color:#E8813A; color:#E8813A; background:#FFF8F2; }
.sort-wrap { display:flex; align-items:center; gap:6px; background:#fff; border:1px solid #E5E7EB; border-radius:10px; padding:4px 12px; flex-shrink:0; color:#6B7280; }
.sort-select { border:none; outline:none; padding:8px 0; font-size:13px; font-weight:600; color:#374151; background:transparent; cursor:pointer; }
.kitchen-list { display:flex; flex-direction:column; gap:16px; }
.kitchen-card { display:flex; background:#fff; border:1px solid #E5E7EB; border-radius:16px; overflow:hidden; cursor:pointer; transition:.2s; }
.kitchen-card:hover { box-shadow:0 8px 24px rgba(0,0,0,.08); transform:translateY(-2px); }
.kc-cover { width:200px; min-height:180px; flex-shrink:0; position:relative; display:flex; align-items:center; justify-content:center; }
.kc-emoji { font-size:52px; opacity:.35; }
.kc-status-dot { position:absolute; top:12px; left:12px; width:10px; height:10px; border-radius:50%; border:2px solid #fff; }
.kc-status-dot.open { background:#22C55E; }
.kc-status-dot.closed { background:#9CA3AF; }
.kc-body { flex:1; padding:20px 22px; display:flex; flex-direction:column; }
.kc-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px; }
.kc-name { font-size:18px; font-weight:700; color:#1A1A1A; margin:0; }
.kc-rating { display:flex; align-items:center; gap:4px; font-size:13px; font-weight:600; color:#E8813A; flex-shrink:0; }
.kc-tag { font-size:13px; color:#6B7280; margin:0 0 12px; line-height:1.5; }
.kc-meta { display:flex; gap:16px; flex-wrap:wrap; font-size:12px; color:#6B7280; margin-bottom:14px; }
.kc-meta span { display:flex; align-items:center; gap:4px; }
.kc-footer { display:flex; align-items:center; justify-content:space-between; margin-top:auto; border-top:1px solid #F3F4F6; padding-top:14px; }
.kc-delivery { font-size:13px; color:#6B7280; }
.kc-btn { background:#E8813A; color:#fff; border:none; padding:8px 20px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; transition:.2s; }
.kc-btn:hover { background:#D4702A; }
.empty-state { text-align:center; padding:80px 0; }
.empty-icon { color:#D1D5DB; margin-bottom:16px; }
.empty-state h3 { font-size:18px; color:#1A1A1A; margin:0 0 6px; }
.empty-state p { font-size:14px; color:#6B7280; margin:0 0 20px; }
.empty-btn { background:none; border:1px solid #E5E7EB; color:#6B7280; padding:10px 24px; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; }
.empty-btn:hover { border-color:#E8813A; color:#E8813A; }
.load-more-wrap { text-align:center; padding:32px 0; }
.load-more-btn { display:inline-flex; align-items:center; gap:6px; background:#fff; border:1px solid #E5E7EB; color:#6B7280; padding:12px 28px; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; transition:.2s; }
.load-more-btn:hover { border-color:#E8813A; color:#E8813A; }
@media(max-width:768px) { .kc-cover { width:120px; min-height:140px; } .kc-emoji { font-size:36px; } .kc-body { padding:14px 16px; } }
@media(max-width:480px) { .kitchen-card { flex-direction:column; } .kc-cover { width:100%; height:120px; } }
</style>