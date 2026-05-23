<script setup>
import { ref, computed } from 'vue'
import { KITCHENS, CATS } from '../data'
import KitchenCard from '../components/KitchenCard.vue'

const search = ref('')
const activeCat = ref(null)
const sortBy = ref('')

const filtered = computed(() => {
  let list = [...KITCHENS]
  if (activeCat.value) list = list.filter(k => k.catId === activeCat.value)
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(k => k.name.toLowerCase().includes(q) || k.tagline.toLowerCase().includes(q) || k.wilaya.toLowerCase().includes(q))
  }
  if (sortBy.value === 'rating') list.sort((a,b) => b.rating - a.rating)
  else if (sortBy.value === 'delivery') list.sort((a,b) => a.deliveryTime - b.deliveryTime)
  else if (sortBy.value === 'min') list.sort((a,b) => a.minOrder - b.minOrder)
  return list
})
</script>

<template>
  <div class="main-content page-kitchens">
    <section class="section">
      <div class="section-heading">
        <h1 class="section-title">Toutes les cuisines</h1>
        <span class="results-count">{{ filtered.length }} cuisine{{ filtered.length > 1 ? 's' : '' }}</span>
      </div>

      <div class="search-sort-row">
        <div class="search-wrap">
          <span class="search-icon">🔍</span>
          <input v-model="search" type="text" class="search-input" placeholder="Rechercher une cuisine...">
        </div>
        <select v-model="sortBy" class="sort-select">
          <option value="">Trier par</option>
          <option value="rating">Note</option>
          <option value="delivery">Livraison rapide</option>
          <option value="min">Min. commande</option>
        </select>
      </div>

      <div class="cats-scroll">
        <button v-for="c in CATS" :key="c.id" class="cat-chip" :class="{ active: activeCat === c.id }" @click="activeCat = activeCat === c.id ? null : c.id">
          <span>{{ c.emoji }}</span>{{ c.label }}
        </button>
      </div>

      <div v-if="filtered.length" class="k-grid">
        <KitchenCard v-for="k in filtered" :key="k.id" :kitchen="k" />
      </div>
      <div v-else class="no-results">
        <span class="nr-icon">😕</span>
        <p>Aucune cuisine trouvée</p>
        <button class="btn-ghost-sm" @click="search='';activeCat=null">Réinitialiser les filtres</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.main-content { min-height:calc(100vh - 68px); }
.section { padding:60px 28px; max-width:1180px; margin:0 auto; }
.section-heading { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; }
.section-title { font-size:24px; font-weight:800; }
.results-count { font-size:13px; color:var(--text-muted); }
.search-sort-row { display:flex; gap:12px; margin-bottom:18px; }
.search-wrap { flex:1; position:relative; }
.search-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); font-size:16px; }
.search-input { width:100%; background:var(--bg-card); border:1px solid var(--border); color:var(--text); padding:12px 14px 12px 42px; border-radius:var(--r); font-size:14px; outline:none; }
.search-input:focus { border-color:var(--primary); }
.sort-select { background:var(--bg-card); border:1px solid var(--border); color:var(--text); padding:12px 16px; border-radius:var(--r); font-size:13px; cursor:pointer; outline:none; }
.cats-scroll { display:flex; gap:10px; overflow-x:auto; padding-bottom:14px; margin-bottom:16px; }
.cat-chip { display:flex; align-items:center; gap:8px; background:var(--bg-card); border:1px solid var(--border); color:var(--text-muted); padding:10px 20px; border-radius:99px; font-size:14px; font-weight:600; cursor:pointer; white-space:nowrap; }
.cat-chip.active, .cat-chip:hover { border-color:var(--primary); background:var(--primary-glow); color:var(--primary-light); }
.k-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:24px; }
.no-results { text-align:center; padding:80px 0; }
.nr-icon { font-size:64px; display:block; margin-bottom:12px; }
.no-results p { font-size:16px; color:var(--text-muted); margin-bottom:12px; }
</style>
