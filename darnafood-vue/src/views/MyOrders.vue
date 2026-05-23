<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { dzd } from '../utils'
import { MOCK_DASH_ORDERS } from '../data'

const router = useRouter()
const auth = useAuthStore()

const orders = ref(MOCK_DASH_ORDERS.slice(0, 5))

const statusLabels = { pending: 'En attente', confirmed: 'Confirmée', preparing: 'En préparation', ready: 'Prête', delivered: 'Livrée' }
</script>

<template>
  <div class="main-content page-myorders">
    <div class="mo-header">
      <h1 class="mo-title">📦 Mes commandes</h1>
      <p class="mo-subtitle">Historique de vos commandes</p>
    </div>

    <div v-if="orders.length" class="mo-list">
      <div v-for="o in orders" :key="o.id" class="mo-card">
        <div class="mo-card-header">
          <span class="mo-card-ref">{{ o.plat }}</span>
          <span class="order-status" :class="o.status">{{ statusLabels[o.status] || o.status }}</span>
        </div>
        <div class="mo-card-body">
          <div class="mo-detail"><span>Cuisinier</span><span>{{ o.client }}</span></div>
          <div class="mo-detail"><span>Quantité</span><span>{{ o.qty }}</span></div>
          <div class="mo-detail"><span>Total</span><span class="mo-price">{{ dzd(o.total) }}</span></div>
          <div class="mo-detail"><span>Date</span><span class="mo-date">{{ o.date }}</span></div>
        </div>
        <div v-if="o.status === 'ready'" class="mo-card-actions">
          <button class="btn-primary" style="padding:10px 24px;font-size:13px;">✅ Marquer comme reçue</button>
        </div>
      </div>
    </div>
    <div v-else class="mo-empty">
      <span class="mo-empty-icon">📦</span>
      <p>Aucune commande pour le moment</p>
      <button class="btn-primary" @click="router.push({name:'home'})">🍽️ Commander maintenant</button>
    </div>
  </div>
</template>

<style scoped>
.main-content { min-height:calc(100vh - 68px); padding:40px 28px; max-width:720px; margin:0 auto; }
.mo-title { font-size:28px; font-weight:800; margin-bottom:4px; }
.mo-subtitle { font-size:14px; color:var(--text-muted); margin-bottom:28px; }
.mo-list { display:flex; flex-direction:column; gap:16px; }
.mo-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--r); overflow:hidden; }
.mo-card-header { display:flex; justify-content:space-between; align-items:center; padding:16px 20px; border-bottom:1px solid var(--border); }
.mo-card-ref { font-size:15px; font-weight:700; }
.order-status { padding:4px 12px; border-radius:99px; font-size:11px; font-weight:700; }
.order-status.pending { background:rgba(232,144,26,.15); color:var(--primary-light); }
.order-status.confirmed { background:rgba(45,140,100,.12); color:var(--accent-light); }
.order-status.preparing { background:rgba(60,130,200,.12); color:#5BA8E0; }
.order-status.ready { background:rgba(140,100,220,.12); color:#A878E8; }
.order-status.delivered { background:var(--bg-elevated); color:var(--text-muted); }
.mo-card-body { padding:16px 20px; }
.mo-detail { display:flex; justify-content:space-between; font-size:13px; padding:5px 0; }
.mo-detail span:first-child { color:var(--text-muted); }
.mo-price { font-weight:700; color:var(--primary-light); }
.mo-date { font-size:12px; color:var(--text-muted); }
.mo-card-actions { padding:12px 20px; border-top:1px solid var(--border); }
.mo-empty { text-align:center; padding:80px 0; }
.mo-empty-icon { font-size:64px; display:block; margin-bottom:12px; }
.mo-empty p { font-size:16px; color:var(--text-muted); margin-bottom:18px; }
</style>
