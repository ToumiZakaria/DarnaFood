<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { apiGetOrders } from '../api'
import { dzd, toast } from '../utils'
import { User, Package, ChevronLeft, ShoppingBag, Clock, MapPin, Phone, Mail, Star, FileText } from '@lucide/vue'

const router = useRouter()
const auth = useAuthStore()
const activeTab = ref('profile')
const orders = ref([])
const loading = ref(true)

const profile = ref({
  firstName: auth.user?.firstName || '',
  lastName: auth.user?.lastName || '',
  email: auth.user?.email || '',
  phone: auth.user?.phone || '',
  wilaya: auth.user?.wilaya || '',
  commune: auth.user?.commune || '',
})

const statusLabels = { pending: 'En attente', nouveau: 'Nouveau', preparing: 'En préparation', ready: 'Prête', delivered: 'Livrée', cancelled: 'Annulée' }
const statusColors = { pending: '#6B7280', nouveau: '#E8813A', preparing: '#EAB308', ready: '#22C55E', delivered: '#22C55E', cancelled: '#EF4444' }

function statusClass(s) {
  if (s === 'delivered' || s === 'ready') return 'delivered'
  if (s === 'preparing' || s === 'nouveau') return 'preparing'
  if (s === 'pending') return 'pending'
  return 'pending'
}

onMounted(async () => {
  try {
    const data = await apiGetOrders()
    if (data.success) orders.value = data.orders || []
  } catch { toast('Erreur lors du chargement des commandes', 'error')
  } finally { loading.value = false }
})
</script>

<template>
  <div class="profile-page">
    <div class="profile-inner">
      <button class="back-btn" @click="router.push({name:'home'})"><ChevronLeft :size="18" /> Retour</button>
      <h1 class="profile-title">Mon espace</h1>

      <div class="profile-tabs">
        <button class="profile-tab" :class="{ active: activeTab === 'profile' }" @click="activeTab = 'profile'">
          <User :size="16" /> Mon profil
        </button>
        <button class="profile-tab" :class="{ active: activeTab === 'orders' }" @click="activeTab = 'orders'">
          <Package :size="16" /> Mes commandes
          <span v-if="orders.length" class="tab-badge">{{ orders.length }}</span>
        </button>
      </div>

      <!-- Profile -->
      <div v-if="activeTab === 'profile'" class="profile-content">
        <div class="profile-avatar-section">
          <div class="profile-avatar">{{ (profile.firstName || profile.email || 'C').charAt(0).toUpperCase() }}</div>
          <div>
            <div class="profile-name">{{ profile.firstName }} {{ profile.lastName }}</div>
            <div class="profile-role">Client</div>
          </div>
        </div>

        <div class="profile-card">
          <div class="profile-card-row">
            <span class="profile-card-icon"><Mail :size="15" /></span>
            <div>
              <div class="profile-card-label">Email</div>
              <div class="profile-card-val">{{ profile.email || '—' }}</div>
            </div>
          </div>
          <div class="profile-card-row">
            <span class="profile-card-icon"><Phone :size="15" /></span>
            <div>
              <div class="profile-card-label">Téléphone</div>
              <div class="profile-card-val">{{ profile.phone || '—' }}</div>
            </div>
          </div>
          <div class="profile-card-row">
            <span class="profile-card-icon"><MapPin :size="15" /></span>
            <div>
              <div class="profile-card-label">Adresse</div>
              <div class="profile-card-val">{{ profile.commune ? profile.commune + ', ' : '' }}{{ profile.wilaya || '—' }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Orders -->
      <div v-if="activeTab === 'orders'" class="profile-content">
        <div v-if="loading" class="orders-loading"><div class="spinner"></div></div>

        <div v-else-if="orders.length" class="orders-list">
          <div v-for="o in orders" :key="o._id" class="order-card">
            <div class="order-head">
              <span class="order-ref">#{{ o.orderId }}</span>
              <span class="order-date">{{ new Date(o.createdAt).toLocaleDateString('fr-DZ', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' }) }}</span>
            </div>
            <div class="order-items">
              <span v-for="(item, idx) in o.items" :key="idx" class="order-item">
                {{ item.emoji || '' }} {{ item.name }} x{{ item.qty }}<span v-if="idx < o.items.length - 1">, </span>
              </span>
            </div>
            <div class="order-footer">
              <span class="order-total">{{ dzd(o.total) }}</span>
              <span class="order-status" :class="statusClass(o.status)" :style="{ background: statusColors[o.status] + '15', color: statusColors[o.status] }">
                {{ statusLabels[o.status] || o.status }}
              </span>
            </div>
          </div>
        </div>

        <div v-else class="orders-empty">
          <ShoppingBag :size="48" class="empty-icon" />
          <h3>Aucune commande</h3>
          <p>Vous n'avez pas encore passé de commande.</p>
          <button class="order-now-btn" @click="router.push({name:'home'})">Découvrir les cuisines</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page { min-height:100vh; padding-top:64px; background:#F8F7F4; }
.profile-inner { max-width:680px; margin:0 auto; padding:32px 24px 80px; }
.back-btn { display:inline-flex; align-items:center; gap:6px; background:none; border:none; color:#6B7280; font-size:13px; font-weight:500; cursor:pointer; margin-bottom:16px; transition:.15s; }
.back-btn:hover { color:#E8813A; }
.profile-title { font-size:26px; font-weight:800; color:#1A1A1A; margin:0 0 24px; }
.profile-tabs { display:flex; gap:4px; margin-bottom:24px; background:#fff; border:1px solid #E5E7EB; border-radius:12px; padding:4px; }
.profile-tab { flex:1; display:flex; align-items:center; justify-content:center; gap:6px; padding:10px 16px; border-radius:10px; font-size:14px; font-weight:600; color:#6B7280; cursor:pointer; transition:.15s; border:none; background:none; }
.profile-tab.active { background:#E8813A; color:#fff; }
.tab-badge { background:rgba(255,255,255,.2); padding:1px 7px; border-radius:99px; font-size:11px; }
.profile-content { animation:fadeIn .25s ease both; }
@keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
.profile-avatar-section { display:flex; align-items:center; gap:16px; margin-bottom:20px; }
.profile-avatar { width:56px; height:56px; border-radius:14px; background:linear-gradient(135deg,#E8813A,#D4702A); display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:800; color:#fff; }
.profile-name { font-size:18px; font-weight:700; color:#1A1A1A; }
.profile-role { font-size:13px; color:#6B7280; }
.profile-card { background:#fff; border:1px solid #E5E7EB; border-radius:14px; padding:18px 20px; display:flex; flex-direction:column; gap:16px; }
.profile-card-row { display:flex; align-items:center; gap:12px; }
.profile-card-icon { width:36px; height:36px; border-radius:10px; background:#F3F4F6; display:flex; align-items:center; justify-content:center; color:#6B7280; flex-shrink:0; }
.profile-card-label { font-size:11px; color:#9CA3AF; }
.profile-card-val { font-size:14px; font-weight:600; color:#1A1A1A; }
.orders-loading { display:flex; justify-content:center; padding:60px 0; }
.spinner { width:28px; height:28px; border:3px solid #E5E7EB; border-top-color:#E8813A; border-radius:50%; animation:spin .6s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
.orders-list { display:flex; flex-direction:column; gap:12px; }
.order-card { background:#fff; border:1px solid #E5E7EB; border-radius:12px; padding:18px 20px; transition:.15s; }
.order-card:hover { border-color:#D1D5DB; }
.order-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
.order-ref { font-family:monospace; font-size:14px; font-weight:700; color:#E8813A; }
.order-date { font-size:12px; color:#9CA3AF; }
.order-items { font-size:13px; color:#6B7280; line-height:1.5; margin-bottom:12px; }
.order-item { white-space:nowrap; }
.order-footer { display:flex; justify-content:space-between; align-items:center; padding-top:12px; border-top:1px solid #F3F4F6; }
.order-total { font-size:18px; font-weight:800; color:#1A1A1A; }
.order-status { padding:4px 12px; border-radius:99px; font-size:11px; font-weight:700; }
.orders-empty { text-align:center; padding:80px 0; }
.empty-icon { color:#D1D5DB; margin-bottom:16px; }
.orders-empty h3 { font-size:18px; color:#1A1A1A; margin:0 0 4px; }
.orders-empty p { font-size:14px; color:#6B7280; margin:0 0 20px; }
.order-now-btn { background:linear-gradient(135deg,#E8813A,#D4702A); color:#fff; border:none; padding:12px 28px; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; box-shadow:0 4px 14px rgba(232,129,58,.25); }
</style>