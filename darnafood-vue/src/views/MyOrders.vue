<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { dzd } from '../utils'
import { MOCK_DASH_ORDERS } from '../data'

const router = useRouter()
const auth = useAuthStore()
const activeTab = ref('profile')
const orders = ref(MOCK_DASH_ORDERS.slice(0, 5))

const user = ref({
  firstName: auth.user?.firstName || 'Client',
  lastName: auth.user?.lastName || '',
  email: auth.user?.email || 'client@email.com',
  phone: auth.user?.phone || '05 XX XX XX XX',
  wilaya: auth.user?.wilaya || 'Alger',
  commune: auth.user?.commune || 'Hydra',
})

function switchTab(tab) { activeTab.value = tab }
</script>

<template>
  <div class="page active" style="display:block">

    <nav class="navbar" style="position:static;">
      <div class="nav-logo" @click="router.push({name:'home'})">
        <div class="nav-logo-icon">🍽️</div>
        <div class="nav-logo-wordmark">
          <div class="nav-logo-en">DarnaFood</div>
          <div class="nav-logo-ar">دارنا فود</div>
        </div>
      </div>
      <ul class="nav-links">
        <li><a href="#" @click.prevent="router.push({name:'home'})">Accueil</a></li>
        <li><a href="#" @click.prevent="router.push({name:'kitchens'})">Cuisines</a></li>
      </ul>
      <div class="nav-spacer"></div>
      <button class="nav-cart" @click="router.push({name:'home'})">🏠 Accueil</button>
    </nav>

    <div class="my-orders-page">
      <button class="back-btn" @click="router.push({name:'home'})">← Retour à l'accueil</button>
      <h1 class="dash-title" style="margin-bottom:6px;">Mon espace</h1>
      <p class="dash-subtitle" style="margin-bottom:28px;">Gérez votre profil et vos commandes</p>

      <!-- Tabs -->
      <div style="display:flex;gap:8px;margin-bottom:28px;border-bottom:2px solid var(--border);">
        <button @click="switchTab('profile')"
          style="background:none;border:none;padding:10px 18px;font-size:14px;font-weight:700;cursor:pointer;transition:var(--ease);"
          :style="{ color: activeTab === 'profile' ? 'var(--primary-light)' : 'var(--text-muted)', borderBottom: activeTab === 'profile' ? '2px solid var(--primary-light)' : '2px solid transparent', marginBottom: '-2px' }">
          👤 Mon profil
        </button>
        <button @click="switchTab('orders')"
          style="background:none;border:none;padding:10px 18px;font-size:14px;font-weight:700;cursor:pointer;transition:var(--ease);"
          :style="{ color: activeTab === 'orders' ? 'var(--primary-light)' : 'var(--text-muted)', borderBottom: activeTab === 'orders' ? '2px solid var(--primary-light)' : '2px solid transparent', marginBottom: '-2px' }">
          📦 Mes commandes
        </button>
      </div>

      <!-- Profile -->
      <div v-if="activeTab === 'profile'">
        <div class="form-card">
          <div class="form-row">
            <div class="form-group"><label class="form-label">Prénom</label><input class="form-input" :value="user.firstName" readonly></div>
            <div class="form-group"><label class="form-label">Nom</label><input class="form-input" :value="user.lastName" readonly></div>
          </div>
          <div class="form-group"><label class="form-label">Email</label><input class="form-input" :value="user.email" readonly></div>
          <div class="form-group"><label class="form-label">Téléphone</label><input class="form-input" :value="user.phone" readonly></div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">Wilaya</label><input class="form-input" :value="user.wilaya" readonly></div>
            <div class="form-group"><label class="form-label">Commune</label><input class="form-input" :value="user.commune" readonly></div>
          </div>
        </div>
      </div>

      <!-- Orders -->
      <div v-if="activeTab === 'orders'">
        <div v-if="orders.length">
          <div v-for="o in orders" :key="o.id" class="order-hist-card">
            <div class="order-hist-head">
              <span class="order-hist-id">#{{ o.id }}</span>
              <span class="order-hist-date">{{ o.date }}</span>
            </div>
            <div style="font-size:14px;font-weight:600;margin-bottom:2px;">{{ o.plat }}</div>
            <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">{{ o.client }} · x{{ o.qty }}</div>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:16px;font-weight:800;color:var(--primary-light);">{{ dzd(o.total) }}</span>
              <span class="order-hist-status" :class="{
                'status-livré': o.status === 'livre',
                'status-en-cours': o.status === 'preparation',
                'status-nouveau': o.status === 'nouveau' || o.status === 'pending'
              }">{{ { pending:'En attente', nouveau:'Nouveau', preparation:'En préparation', livre:'Livré', ready:'Prête', delivered:'Livrée' }[o.status] || o.status }}</span>
            </div>
          </div>
        </div>
        <div v-else style="text-align:center;padding:60px 0;color:var(--text-muted);">
          <span style="font-size:64px;display:block;margin-bottom:12px;">📦</span>
          <p style="font-size:16px;margin-bottom:18px;">Aucune commande pour le moment</p>
          <button class="btn-primary" @click="router.push({name:'home'})">🍽️ Commander maintenant</button>
        </div>
      </div>
    </div>
  </div>
</template>
