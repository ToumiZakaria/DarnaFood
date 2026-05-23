<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { MOCK_DASH_ORDERS } from '../../data'
import { dzd } from '../../utils'
import {
  ShoppingBag, TrendingUp, Star, Users, Clock, ArrowUpRight, ChevronRight
} from '@lucide/vue'

const auth = useAuthStore()
const kitchenOpen = ref(true)
const orders = ref(MOCK_DASH_ORDERS)

const stats = ref({
  orders: { value: 4, delta: '+2', label: 'Commandes aujourd\'hui' },
  revenue: { value: 9630, delta: '+12%', label: 'Revenus du jour' },
  rating: { value: '-', delta: '237 avis', label: 'Note moyenne' },
  loyal: { value: 18, delta: '+3', label: 'Clients fidèles' },
})

const weekRevenue = ref([1200, 1800, 900, 2400, 1600, 2100, 9630])
const weekDays = ref(['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'])
const maxRev = computed(() => Math.max(...weekRevenue.value))

const reviews = ref([
  { name: 'Karim M.', dish: 'Couscous Royal', rating: 5, text: 'Meilleur couscous d\'Alger !', time: 'Il y a 2h' },
  { name: 'Sarah B.', dish: 'Harira', rating: 4, text: 'Délicieuse, comme à la maison.', time: 'Il y a 5h' },
  { name: 'Amine Z.', dish: 'Tagine Zitoune', rating: 5, text: 'Parfait, livraison rapide.', time: 'Hier' },
])

const popular = ref([
  { name: 'Couscous Royal', orders: 42, revenue: 50400 },
  { name: 'Harira', orders: 38, revenue: 15200 },
  { name: 'Tagine Zitoune', orders: 29, revenue: 34800 },
])
const totalMonthOrders = 50
const monthProgress = ref(42)
</script>

<template>
  <div class="overview">
    <div class="ov-header">
      <div>
        <h1 class="ov-title">Bonjour, {{ auth.user?.firstName || 'Chef' }} !</h1>
        <p class="ov-date">{{ new Date().toLocaleDateString('fr-DZ', { weekday:'long', year:'numeric', month:'long', day:'numeric' }) }}</p>
      </div>
    </div>

    <div class="kpi-row">
      <div class="kpi-card" v-for="(s, i) in stats" :key="i">
        <div class="kpi-icon" :class="i">
          <ShoppingBag v-if="i==='orders'" :size="20" />
          <TrendingUp v-else-if="i==='revenue'" :size="20" />
          <Star v-else-if="i==='rating'" :size="20" />
          <Users v-else :size="20" />
        </div>
        <div class="kpi-body">
          <div class="kpi-val">{{ i==='revenue' ? dzd(s.value) : s.value }}</div>
          <div class="kpi-label">{{ s.label }}</div>
        </div>
        <div class="kpi-delta" :class="{ up: i!=='rating' }">
          <ArrowUpRight :size="12" />
          {{ s.delta }}
        </div>
      </div>
    </div>

    <div class="chart-row">
      <div class="chart-card">
        <div class="card-head"><h3>Revenus — 7 derniers jours</h3></div>
        <div class="chart-area">
          <svg viewBox="0 0 800 200" class="rev-chart" preserveAspectRatio="none">
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#E8813A" stop-opacity=".3" />
                <stop offset="100%" stop-color="#E8813A" stop-opacity="0" />
              </linearGradient>
            </defs>
            <polyline :points="weekRevenue.map((v,i)=>`${(i/(weekRevenue.length-1))*780},${200-(v/maxRev)*180}`).join(' ')" fill="none" stroke="#E8813A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            <path :d="`M0,200 L${weekRevenue.map((v,i)=>`${(i/(weekRevenue.length-1))*780},${200-(v/maxRev)*180}`).join(' ')} L780,200 Z`" fill="url(#revGrad)" />
            <g v-for="(v,i) in weekRevenue" :key="i">
              <circle :cx="(i/(weekRevenue.length-1))*780" :cy="200-(v/maxRev)*180" r="4" fill="#E8813A" stroke="#0A0A0A" stroke-width="2" />
            </g>
          </svg>
          <div class="chart-labels">
            <span v-for="(day,i) in weekDays" :key="i">{{ day }}</span>
          </div>
        </div>
      </div>
      <div class="reviews-card">
        <div class="card-head"><h3>Avis récents</h3></div>
        <div class="rv-list">
          <div v-for="r in reviews" :key="r.name" class="rv-item">
            <div class="rv-avatar">{{ r.name.charAt(0) }}</div>
            <div class="rv-body">
              <div class="rv-top">
                <span class="rv-name">{{ r.name }}</span>
                <span class="rv-time">{{ r.time }}</span>
              </div>
              <div class="rv-stars">
                <span v-for="s in r.rating" :key="s" style="color:#EAB308;">★</span>
                <span v-for="s in 5-r.rating" :key="'e'+s" style="color:#262626;">★</span>
              </div>
              <div class="rv-dish">{{ r.dish }}</div>
              <div class="rv-text">{{ r.text }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="full-card">
      <div class="card-head">
        <h3>Commandes en cours</h3>
        <button class="btn-link">Voir toutes <ChevronRight :size="14" /></button>
      </div>
      <table class="data-table">
        <thead>
          <tr><th>ID</th><th>Client</th><th>Plats</th><th>Total</th><th>Statut</th><th>Action</th></tr>
        </thead>
        <tbody>
          <tr v-for="o in orders.slice(0,5)" :key="o.id">
            <td class="cell-id">{{ o.id }}</td>
            <td>{{ o.client }}</td>
            <td>{{ o.items }}</td>
            <td class="cell-price">{{ dzd(o.total) }}</td>
            <td><span class="status-pill" :class="o.status">{{ { pending:'Nouveau', confirmed:'Confirmée', preparing:'En préparation', ready:'Prête', delivered:'Livrée' }[o.status] || o.status }}</span></td>
            <td>
              <select class="status-select" v-model="o.status">
                <option value="pending">Nouveau</option>
                <option value="confirmed">Confirmée</option>
                <option value="preparing">En préparation</option>
                <option value="ready">Prête</option>
                <option value="delivered">Livrée</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="bottom-row">
      <div class="half-card">
        <div class="card-head"><h3>Plats populaires</h3></div>
        <div class="pop-list">
          <div v-for="(p,i) in popular" :key="p.name" class="pop-item">
            <div class="pop-rank">#{{ i+1 }}</div>
            <div class="pop-body">
              <div class="pop-name">{{ p.name }}</div>
              <div class="pop-meta">{{ p.orders }} commandes · {{ dzd(p.revenue) }}</div>
            </div>
            <div class="pop-bar-wrap">
              <div class="pop-bar" :style="{ width: (p.orders/totalMonthOrders*100)+'%' }"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="half-card">
        <div class="card-head"><h3>Performance du mois</h3></div>
        <div class="perf-ring-wrap">
          <svg viewBox="0 0 120 120" class="perf-ring">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#262626" stroke-width="10" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="#22C55E" stroke-width="10" stroke-linecap="round"
              :stroke-dasharray="2*Math.PI*50" :stroke-dashoffset="2*Math.PI*50*(1-monthProgress/50)"
              transform="rotate(-90,60,60)" />
          </svg>
          <div class="perf-ring-text">
            <div class="perf-val">{{ monthProgress }}/50</div>
            <div class="perf-label">Objectif</div>
          </div>
        </div>
        <div class="perf-stats">
          <div class="perf-stat"><span>Taux de complétion</span><span>{{ Math.round(monthProgress/50*100) }}%</span></div>
          <div class="perf-stat"><span>Jours restants</span><span>{{ 30 - new Date().getDate() }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overview { max-width:1200px; }
.ov-header { margin-bottom:24px; }
.ov-title { font-size:24px; font-weight:800; color:#FAFAFA; margin:0 0 4px; }
.ov-date { font-size:13px; color:#A1A1AA; margin:0; }

/* KPI */
.kpi-row { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:20px; }
.kpi-card { background:#141414; border:1px solid #262626; border-radius:12px; padding:18px 20px; display:flex; align-items:center; gap:14px; position:relative; }
.kpi-icon { width:40px; height:40px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.kpi-icon.orders { background:rgba(59,130,246,.12); color:#3B82F6; }
.kpi-icon.revenue { background:rgba(34,197,94,.12); color:#22C55E; }
.kpi-icon.rating { background:rgba(234,179,8,.12); color:#EAB308; }
.kpi-icon.loyal { background:rgba(232,129,58,.12); color:#E8813A; }
.kpi-body { flex:1; }
.kpi-val { font-size:22px; font-weight:800; color:#FAFAFA; }
.kpi-label { font-size:11px; color:#A1A1AA; margin-top:1px; }
.kpi-delta { font-size:11px; font-weight:600; color:#A1A1AA; display:flex; align-items:center; gap:3px; }
.kpi-delta.up { color:#22C55E; }

/* Chart row */
.chart-row { display:grid; grid-template-columns:2fr 1fr; gap:14px; margin-bottom:20px; }
.chart-card, .reviews-card { background:#141414; border:1px solid #262626; border-radius:12px; padding:20px; }
.card-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
.card-head h3 { font-size:15px; font-weight:700; color:#FAFAFA; margin:0; }
.chart-area { }
.rev-chart { width:100%; height:180px; }
.chart-labels { display:flex; justify-content:space-between; margin-top:6px; }
.chart-labels span { font-size:10px; color:#A1A1AA; }

/* Reviews */
.rv-list { display:flex; flex-direction:column; gap:12px; }
.rv-item { display:flex; gap:10px; }
.rv-avatar { width:32px; height:32px; border-radius:50%; background:rgba(232,129,58,.15); color:#E8813A; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0; }
.rv-body { flex:1; }
.rv-top { display:flex; justify-content:space-between; }
.rv-name { font-size:12px; font-weight:600; color:#FAFAFA; }
.rv-time { font-size:10px; color:#A1A1AA; }
.rv-stars { margin:2px 0; }
.rv-dish { font-size:11px; color:#E8813A; }
.rv-text { font-size:11px; color:#A1A1AA; margin-top:2px; }

/* Table */
.full-card { background:#141414; border:1px solid #262626; border-radius:12px; padding:20px; margin-bottom:20px; }
.btn-link { display:inline-flex; align-items:center; gap:4px; background:none; border:none; color:#E8813A; font-size:12px; font-weight:600; cursor:pointer; }
.data-table { width:100%; border-collapse:collapse; }
.data-table th { text-align:left; font-size:11px; font-weight:700; color:#A1A1AA; text-transform:uppercase; letter-spacing:.5px; padding:10px 12px; border-bottom:1px solid #262626; }
.data-table td { padding:12px; font-size:13px; color:#FAFAFA; border-bottom:1px solid #262626; }
.data-table tr:last-child td { border-bottom:none; }
.cell-id { font-family:monospace; font-size:12px; color:#E8813A; font-weight:600; }
.cell-price { font-weight:700; color:#22C55E; }
.status-pill { display:inline-block; padding:3px 10px; border-radius:999px; font-size:11px; font-weight:600; }
.status-pill.pending { background:rgba(234,179,8,.12); color:#EAB308; }
.status-pill.confirmed { background:rgba(59,130,246,.12); color:#3B82F6; }
.status-pill.preparing { background:rgba(59,130,246,.12); color:#3B82F6; }
.status-pill.ready { background:rgba(34,197,94,.12); color:#22C55E; }
.status-pill.delivered { background:rgba(255,255,255,.05); color:#A1A1AA; }
.status-select { background:rgba(255,255,255,.05); border:1px solid #262626; color:#FAFAFA; padding:4px 8px; border-radius:6px; font-size:11px; cursor:pointer; outline:none; }

/* Bottom row */
.bottom-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.half-card { background:#141414; border:1px solid #262626; border-radius:12px; padding:20px; }

/* Popular */
.pop-list { display:flex; flex-direction:column; gap:10px; }
.pop-item { display:flex; align-items:center; gap:12px; }
.pop-rank { width:24px; height:24px; border-radius:50%; background:rgba(232,129,58,.12); color:#E8813A; font-size:11px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.pop-body { flex:1; }
.pop-name { font-size:13px; font-weight:600; color:#FAFAFA; }
.pop-meta { font-size:11px; color:#A1A1AA; }
.pop-bar-wrap { width:80px; height:4px; background:#262626; border-radius:2px; }
.pop-bar { height:100%; background:#E8813A; border-radius:2px; }

/* Performance ring */
.perf-ring-wrap { position:relative; width:120px; height:120px; margin:0 auto 16px; }
.perf-ring { width:120px; height:120px; }
.perf-ring-text { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); text-align:center; }
.perf-val { font-size:22px; font-weight:800; color:#22C55E; }
.perf-label { font-size:10px; color:#A1A1AA; }
.perf-stats { display:flex; flex-direction:column; gap:8px; }
.perf-stat { display:flex; justify-content:space-between; font-size:12px; color:#A1A1AA; }
.perf-stat span:last-child { color:#FAFAFA; font-weight:600; }
</style>
