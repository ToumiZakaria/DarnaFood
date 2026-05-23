<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { KITCHENS } from '../../data'
import KitchenCard from '../../components/KitchenCard.vue'
import { Search, ChevronRight } from '@lucide/vue'

const router = useRouter()
const searchQuery = ref('')
const featured = ref([])
const topRated = ref([])
const refreshing = ref(false)

const categories = [
  { id: 'couscous', label: 'Couscous', emoji: '🍛' },
  { id: 'tajines', label: 'Tajines', emoji: '🥘' },
  { id: 'soupes', label: 'Soupes', emoji: '🍲' },
  { id: 'patisserie', label: 'Pâtisserie', emoji: '🍯' },
  { id: 'grillades', label: 'Grillades', emoji: '🥩' },
  { id: 'boissons', label: 'Boissons', emoji: '🧃' },
]

onMounted(() => {
  featured.value = KITCHENS.filter(k => k.featured)
  topRated.value = [...KITCHENS].sort((a, b) => b.rating - a.rating).slice(0, 4)
})

function onSearch() {
  if (searchQuery.value.trim()) router.push({ name: 'app-kitchens', query: { q: searchQuery.value.trim() } })
}

function pullRefresh() {
  refreshing.value = true
  setTimeout(() => { refreshing.value = false }, 1000)
}
</script>

<template>
  <div class="app-home" @touchstart.passive="(e) => { if (window.scrollY === 0) { const start = e.touches[0].clientY; const handler = (ev) => { if (ev.changedTouches[0].clientY - start > 80) { pullRefresh(); document.removeEventListener('touchend', handler) } }; document.addEventListener('touchend', handler, { once: true }) } }">
    <div v-if="refreshing" class="pull-indicator">⟳</div>

    <div class="ah-search">
      <div class="ah-search-bar">
        <Search :size="18" class="ah-search-icon" />
        <input v-model="searchQuery" class="ah-search-input" placeholder="Rechercher un plat, une cuisine..." @keydown.enter="onSearch">
      </div>
    </div>

    <section class="ah-section">
      <div class="ah-cats">
        <button v-for="c in categories" :key="c.id" class="ah-cat-chip" @click="router.push({ name: 'app-kitchens', query: { cat: c.id } })">
          <span class="ah-cat-emoji">{{ c.emoji }}</span>
          <span class="ah-cat-label">{{ c.label }}</span>
        </button>
      </div>
    </section>

    <section class="ah-section">
      <div class="ah-heading">
        <h2 class="ah-title">À proximité</h2>
        <button class="ah-see-all" @click="router.push({ name: 'app-kitchens' })">Voir tout <ChevronRight :size="14" /></button>
      </div>
      <div v-if="featured.length" class="ah-scroll">
        <KitchenCard v-for="k in featured" :key="k.id" :kitchen="k" class="ah-card" />
      </div>
    </section>

    <section class="ah-section">
      <div class="ah-heading">
        <h2 class="ah-title">Les mieux notés</h2>
        <button class="ah-see-all" @click="router.push({ name: 'app-kitchens' })">Voir tout <ChevronRight :size="14" /></button>
      </div>
      <div v-if="topRated.length" class="ah-scroll">
        <KitchenCard v-for="k in topRated" :key="k.id" :kitchen="k" class="ah-card" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.app-home { padding:16px 16px 24px; }

.pull-indicator { text-align:center; font-size:24px; color:#E8813A; padding:8px 0; animation:spin .6s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }

/* Search */
.ah-search { margin-bottom:20px; }
.ah-search-bar {
  display:flex; align-items:center; gap:10px;
  background:#141414; border:1px solid #262626; border-radius:12px;
  padding:12px 16px;
}
.ah-search-icon { color:#A1A1AA; flex-shrink:0; }
.ah-search-input {
  flex:1; background:none; border:none; outline:none;
  color:#FAFAFA; font-size:15px;
}
.ah-search-input::placeholder { color:#52525B; }

/* Categories */
.ah-section { margin-bottom:24px; }
.ah-cats { display:flex; gap:10px; overflow-x:auto; padding-bottom:4px; }
.ah-cat-chip {
  display:flex; flex-direction:column; align-items:center; gap:6px;
  background:#141414; border:1px solid #262626; border-radius:12px;
  padding:12px 16px; min-width:72px; cursor:pointer; transition:all .2s;
}
.ah-cat-chip:hover, .ah-cat-chip:active { border-color:#E8813A; background:rgba(232,129,58,.06); }
.ah-cat-emoji { font-size:24px; }
.ah-cat-label { font-size:11px; font-weight:600; color:#A1A1AA; white-space:nowrap; }

/* Sections */
.ah-heading { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
.ah-title { font-size:18px; font-weight:800; color:#FAFAFA; margin:0; }
.ah-see-all { display:inline-flex; align-items:center; gap:2px; background:none; border:none; color:#E8813A; font-size:12px; font-weight:600; cursor:pointer; }
.ah-scroll { display:flex; gap:14px; overflow-x:auto; padding-bottom:4px; }
.ah-card { flex-shrink:0; width:260px; }
</style>
