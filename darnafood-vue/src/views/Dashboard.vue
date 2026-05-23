<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { MOCK_DASH_ORDERS } from '../data'
import { dzd } from '../utils'
import DashboardSidebar from '../components/DashboardSidebar.vue'

const router = useRouter()
const auth = useAuthStore()

const sidebarOpen = ref(true)
const activeTab = ref('dashboard')

const user = computed(() => auth.user)

const stats = computed(() => ({
  total: 120,
  today: 8,
  revenue: 144000,
  rating: 4.8,
}))

const orders = ref(MOCK_DASH_ORDERS)
</script>

<template>
  <div class="main-content dash-layout" :class="{ 'sidebar-hidden': !sidebarOpen }">
    <DashboardSidebar :activeTab="activeTab" :sidebarOpen="sidebarOpen" @toggle="sidebarOpen = !sidebarOpen" @navigate="(t) => activeTab = t" />
    <div class="dash-main">
      <div class="dash-topbar">
        <button class="dash-toggle-btn" @click="sidebarOpen = !sidebarOpen">
          {{ sidebarOpen ? '✕' : '☰' }}
        </button>
        <div class="dash-topbar-title">
          👋 Bonjour, {{ user?.firstName || 'Cuisinier' }}
        </div>
      </div>

      <div v-if="activeTab === 'dashboard'">
        <div class="stats-grid">
          <div class="stat-card"><div class="stat-num">{{ stats.total }}</div><div class="stat-label">Commandes totales</div></div>
          <div class="stat-card"><div class="stat-num">{{ stats.today }}</div><div class="stat-label">Aujourd'hui</div></div>
          <div class="stat-card"><div class="stat-num">{{ dzd(stats.revenue) }}</div><div class="stat-label">Revenus</div></div>
          <div class="stat-card"><div class="stat-num">⭐ {{ stats.rating }}</div><div class="stat-label">Note moyenne</div></div>
        </div>

        <h3 class="dash-subtitle">📋 Commandes récentes</h3>
        <div class="orders-table-wrap">
          <table class="orders-table">
            <thead><tr><th>Client</th><th>Plat</th><th>Quantité</th><th>Total</th><th>Statut</th><th>Date</th><th>Action</th></tr></thead>
            <tbody>
              <tr v-for="o in orders" :key="o.id">
                <td>{{ o.client }}</td>
                <td>{{ o.plat }}</td>
                <td>{{ o.qty }}</td>
                <td>{{ dzd(o.total) }}</td>
                <td>
                  <span class="order-status" :class="o.status">{{ { pending: 'En attente', confirmed: 'Confirmée', preparing: 'En préparation', ready: 'Prête', delivered: 'Livrée' }[o.status] || o.status }}</span>
                </td>
                <td class="order-date">{{ o.date }}</td>
                <td>
                  <button v-if="o.status === 'pending'" class="dash-btn-sm accept" @click="o.status = 'confirmed'">✅ Accepter</button>
                  <button v-else-if="o.status === 'confirmed'" class="dash-btn-sm prep" @click="o.status = 'preparing'">👨‍🍳 Préparer</button>
                  <button v-else-if="o.status === 'preparing'" class="dash-btn-sm ready" @click="o.status = 'ready'">📦 Prête</button>
                  <span v-else class="dash-done">✓</span>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="!orders.length" class="no-order-row">Aucune commande pour le moment</div>
        </div>
      </div>

      <div v-else-if="activeTab === 'menu'" class="dash-blank-state">
        <span class="dash-blank-icon">🍽️</span>
        <h3>Gestion du menu</h3>
        <p>Ajoutez, modifiez ou supprimez vos plats.</p>
        <button class="btn-primary">+ Ajouter un plat</button>
      </div>

      <div v-else-if="activeTab === 'profile'" class="dash-profile">
        <h3 class="dash-subtitle">👤 Mon profil</h3>
        <div class="profile-card">
          <div class="pf-row"><span class="pf-label">Nom</span><span>{{ user?.firstName }} {{ user?.lastName }}</span></div>
          <div class="pf-row"><span class="pf-label">Email</span><span>{{ user?.email }}</span></div>
          <div class="pf-row"><span class="pf-label">Téléphone</span><span>{{ user?.phone || 'Non renseigné' }}</span></div>
          <div class="pf-row"><span class="pf-label">Rôle</span><span class="role-badge cuisinier">👨‍🍳 Cuisinier</span></div>
        </div>
      </div>

      <div v-else-if="activeTab === 'settings'" class="dash-blank-state">
        <span class="dash-blank-icon">⚙️</span>
        <h3>Paramètres</h3>
        <p>Gérez vos préférences et votre compte.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-content { min-height:calc(100vh - 68px); }
.dash-layout { display:flex; }
.dash-main { flex:1; padding:28px 32px; min-height:calc(100vh - 68px); margin-left:0; }
.dash-topbar { display:flex; align-items:center; gap:16px; margin-bottom:28px; }
.dash-toggle-btn { width:36px; height:36px; border-radius:var(--r-sm); background:var(--bg-elevated); border:1px solid var(--border); color:var(--text-muted); font-size:16px; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; }
.dash-toggle-btn:hover { color:var(--text); border-color:var(--primary); }
.dash-topbar-title { font-size:20px; font-weight:700; }
.stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:32px; }
.stat-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--r); padding:24px 20px; }
.stat-num { font-size:28px; font-weight:800; color:var(--primary-light); margin-bottom:4px; }
.stat-label { font-size:13px; color:var(--text-muted); }
.dash-subtitle { font-size:18px; font-weight:700; margin-bottom:16px; }
.orders-table-wrap { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--r); overflow-x:auto; }
.orders-table { width:100%; border-collapse:collapse; }
.orders-table th { padding:14px 16px; font-size:12px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.5px; text-align:left; border-bottom:1px solid var(--border); }
.orders-table td { padding:14px 16px; font-size:13px; border-bottom:1px solid var(--border); }
.orders-table tr:last-child td { border-bottom:none; }
.order-status { padding:3px 10px; border-radius:99px; font-size:11px; font-weight:700; }
.order-status.pending { background:rgba(232,144,26,.15); color:var(--primary-light); }
.order-status.confirmed { background:rgba(45,140,100,.12); color:var(--accent-light); }
.order-status.preparing { background:rgba(60,130,200,.12); color:#5BA8E0; }
.order-status.ready { background:rgba(140,100,220,.12); color:#A878E8; }
.order-status.delivered { background:var(--bg-elevated); color:var(--text-muted); }
.order-date { font-size:11px; color:var(--text-muted); white-space:nowrap; }
.dash-btn-sm { padding:5px 12px; border-radius:var(--r-sm); font-size:11px; font-weight:700; cursor:pointer; border:none; }
.dash-btn-sm.accept { background:rgba(45,140,100,.15); color:var(--accent-light); }
.dash-btn-sm.prep { background:rgba(60,130,200,.12); color:#5BA8E0; }
.dash-btn-sm.ready { background:rgba(140,100,220,.12); color:#A878E8; }
.dash-done { color:var(--accent); font-weight:700; font-size:16px; }
.no-order-row { padding:40px; text-align:center; color:var(--text-muted); }
.dash-blank-state { text-align:center; padding:80px 20px; }
.dash-blank-icon { font-size:64px; display:block; margin-bottom:12px; }
.dash-blank-state h3 { font-size:20px; font-weight:700; margin-bottom:6px; }
.dash-blank-state p { color:var(--text-muted); margin-bottom:18px; }
.dash-profile { max-width:500px; }
.profile-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--r); padding:24px; }
.pf-row { display:flex; justify-content:space-between; padding:12px 0; border-bottom:1px solid var(--border); font-size:14px; }
.pf-row:last-child { border-bottom:none; }
.pf-label { color:var(--text-muted); font-weight:600; }
.role-badge { display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:700; padding:3px 10px; border-radius:99px; background:var(--primary-glow); color:var(--primary-light); }
</style>
