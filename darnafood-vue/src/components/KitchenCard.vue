<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { dzd } from '../utils'

const props = defineProps({ kitchen: Object })
const router = useRouter()
const route = useRoute()

const detailRouteName = computed(() => route.path.startsWith('/app') ? 'app-kitchen-detail' : 'kitchen-detail')

function openDetail() {
  router.push({ name: detailRouteName.value, params: { id: props.kitchen.id } })
}
</script>

<template>
  <div class="k-card" @click="openDetail">
    <div class="k-cover" :style="{ background: kitchen.gradient }">
      <div class="k-cover-emoji">{{ kitchen.emoji }}</div>
      <div class="k-cover-row">
        <span class="k-status" :class="kitchen.open ? 'open' : 'closed'">{{ kitchen.open ? 'Ouvert' : 'Fermé' }}</span>
        <span class="k-cat-tag">{{ kitchen.cat }}</span>
      </div>
    </div>
    <div class="k-body">
      <div class="k-name">{{ kitchen.name }}</div>
      <div class="k-tag">{{ kitchen.tagline }}</div>
      <div class="k-meta">
        <span class="k-meta-item">⭐ {{ kitchen.rating }}</span>
        <span class="k-meta-item">📍 {{ kitchen.wilaya }}</span>
        <span class="k-meta-item">🕐 {{ kitchen.deliveryTime }} min</span>
      </div>
    </div>
    <div class="k-footer">
      <span class="k-footer-info">Min. <b>{{ dzd(kitchen.minOrder) }}</b> · Liv. <b>{{ dzd(kitchen.deliveryFee) }}</b></span>
      <button class="btn-sm" @click.stop="openDetail">Voir le menu</button>
    </div>
  </div>
</template>

<style scoped>
.k-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--r-lg); overflow:hidden; cursor:pointer; }
.k-card:hover { transform:translateY(-5px); border-color:var(--border-light); box-shadow:var(--shadow-lg); }
.k-cover { height:175px; position:relative; display:flex; align-items:flex-end; padding:14px; }
.k-cover-emoji { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:68px; opacity:.75; }
.k-cover-row { position:relative; z-index:1; display:flex; justify-content:space-between; width:100%; align-items:center; }
.k-status { padding:4px 11px; border-radius:99px; font-size:11px; font-weight:700; backdrop-filter:blur(10px); }
.k-status.open { background:rgba(45,140,100,.85); color:#fff; }
.k-status.closed { background:rgba(60,50,40,.85); color:var(--text-muted); }
.k-cat-tag { background:rgba(12,11,9,.65); border:1px solid rgba(232,144,26,.3); color:var(--primary-light); padding:4px 10px; border-radius:99px; font-size:11px; font-weight:700; backdrop-filter:blur(8px); }
.k-body { padding:18px; }
.k-name { font-size:17px; font-weight:700; margin-bottom:3px; }
.k-tag { font-size:12px; color:var(--text-muted); margin-bottom:12px; }
.k-meta { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
.k-meta-item { display:flex; align-items:center; gap:4px; font-size:12px; color:var(--text-muted); }
.k-footer { display:flex; align-items:center; justify-content:space-between; padding:12px 18px; border-top:1px solid var(--border); }
.k-footer-info { font-size:12px; color:var(--text-muted); }
.k-footer-info b { color:var(--text); }
.btn-sm { background:linear-gradient(135deg,var(--primary-light),var(--primary-dark)); color:#fff; padding:7px 15px; border-radius:var(--r-sm); font-size:12px; font-weight:700; border:none; cursor:pointer; }
.btn-sm:hover { box-shadow:0 4px 14px rgba(232,144,26,.4); transform:translateY(-1px); }
</style>
