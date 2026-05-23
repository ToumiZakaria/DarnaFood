<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { MOCK_DASH_ORDERS } from '../data'
import { dzd } from '../utils'

const router = useRouter()
const auth = useAuthStore()

const sidebarHidden = ref(false)
const activePanel = ref('overview')
const kitchenOpen = ref(true)
const orders = ref(MOCK_DASH_ORDERS)

const user = computed(() => auth.user)
const initials = computed(() => {
  const name = user.value?.firstName || user.value?.name || 'Chef'
  return name.charAt(0).toUpperCase()
})

function toggleSidebar() { sidebarHidden.value = !sidebarHidden.value }
function showPanel(p) { activePanel.value = p }
function logout() { auth.logout(); router.push({ name: 'home' }) }
function toggleKitchenStatus() { kitchenOpen.value = !kitchenOpen.value }
</script>

<template>
  <div class="page active" style="display:block">
    <div class="dashboard-layout" :class="{ 'sidebar-hidden': sidebarHidden }">
      <!-- Sidebar -->
      <aside class="dash-sidebar" :class="{ hidden: sidebarHidden }">
        <div class="dash-profile">
          <div class="dash-avatar">{{ initials }}</div>
          <div class="dash-profile-info">
            <div class="dash-profile-name">{{ user?.firstName || user?.name || 'Chef' }}</div>
            <div class="dash-profile-role">👨‍🍳 Cuisinier</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;padding:0 8px;margin-bottom:8px;">
          <span class="dash-sidebar-title" style="margin:0;flex:1;">Navigation</span>
          <button class="dash-toggle" @click="toggleSidebar">☰</button>
        </div>
        <div class="dash-nav-item" :class="{ active: activePanel === 'overview' }" @click="showPanel('overview')"><span class="dash-nav-icon">📊</span> Vue d'ensemble</div>
        <div class="dash-nav-item" :class="{ active: activePanel === 'orders' }" @click="showPanel('orders')"><span class="dash-nav-icon">📦</span> Commandes</div>
        <div class="dash-nav-item" :class="{ active: activePanel === 'menu' }" @click="showPanel('menu')"><span class="dash-nav-icon">🍽️</span> Mon Menu</div>
        <div class="dash-nav-item" :class="{ active: activePanel === 'settings' }" @click="showPanel('settings')"><span class="dash-nav-icon">⚙️</span> Paramètres</div>
        <div style="flex:1;"></div>
        <div class="dash-nav-item danger" @click="logout" style="color:var(--danger);margin-top:8px;"><span class="dash-nav-icon">🚪</span> Déconnexion</div>
      </aside>

      <!-- Main -->
      <main class="dash-main">
        <!-- Overview -->
        <div class="dash-panel" :class="{ active: activePanel === 'overview' }">
          <div class="dash-header">
            <h1 class="dash-title">Bonjour, <span>{{ user?.firstName || user?.name || 'Chef' }}</span> ! 👋</h1>
            <p class="dash-subtitle">Voici le résumé de votre activité aujourd'hui</p>
          </div>
          <div class="toggle-wrap">
            <div class="toggle-label">
              <strong>Statut de ma cuisine</strong>
              <span>{{ kitchenOpen ? 'Votre cuisine est actuellement ouverte aux commandes' : 'Votre cuisine est actuellement fermée' }}</span>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" :checked="kitchenOpen" @change="toggleKitchenStatus">
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="stats-row">
            <div class="stat-card"><span class="stat-card-icon">📦</span><div class="stat-card-val">8</div><div class="stat-card-label">Commandes aujourd'hui</div><div class="stat-card-delta">+2 cette semaine</div></div>
            <div class="stat-card"><span class="stat-card-icon">💵</span><div class="stat-card-val">4 500 DA</div><div class="stat-card-label">Revenus du jour</div><div class="stat-card-delta">+12% vs hier</div></div>
            <div class="stat-card"><span class="stat-card-icon">⭐</span><div class="stat-card-val">4.9</div><div class="stat-card-label">Note moyenne</div><div class="stat-card-delta">237 avis</div></div>
            <div class="stat-card"><span class="stat-card-icon">👥</span><div class="stat-card-val">18</div><div class="stat-card-label">Clients fidèles</div><div class="stat-card-delta">+3 ce mois</div></div>
          </div>
          <h3 style="font-size:17px;font-weight:700;margin-bottom:14px;">Commandes récentes</h3>
          <div class="orders-list">
            <div v-for="o in orders.slice(0,5)" :key="o.id" class="order-row">
              <span class="order-id-tag">#{{ o.id }}</span>
              <div><div class="order-info-name">{{ o.client }}</div><div class="order-info-items">{{ o.plat }} ×{{ o.qty }}</div></div>
              <span class="order-amount">{{ dzd(o.total) }}</span>
              <select class="order-status-select" :class="o.status" v-model="o.status">
                <option value="nouveau">Nouveau</option>
                <option value="preparation">En préparation</option>
                <option value="livre">Livré</option>
              </select>
            </div>
            <div v-if="!orders.length" style="text-align:center;padding:20px;color:var(--text-muted);">Aucune commande pour le moment</div>
          </div>
        </div>

        <!-- Orders -->
        <div class="dash-panel" :class="{ active: activePanel === 'orders' }">
          <div class="dash-header">
            <h1 class="dash-title">📦 Commandes</h1>
            <p class="dash-subtitle">Gérez les commandes en temps réel</p>
          </div>
          <div class="orders-list">
            <div v-for="o in orders" :key="o.id" class="order-row">
              <span class="order-id-tag">#{{ o.id }}</span>
              <div><div class="order-info-name">{{ o.client }}</div><div class="order-info-items">{{ o.plat }} ×{{ o.qty }}</div></div>
              <span class="order-amount">{{ dzd(o.total) }}</span>
              <select class="order-status-select" :class="o.status" v-model="o.status">
                <option value="nouveau">Nouveau</option>
                <option value="preparation">En préparation</option>
                <option value="livre">Livré</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Menu -->
        <div class="dash-panel" :class="{ active: activePanel === 'menu' }">
          <div class="dash-header">
            <h1 class="dash-title">🍽️ Mon Menu</h1>
            <p class="dash-subtitle">Gérez vos plats disponibles à la commande</p>
          </div>
          <button class="btn-primary" style="margin-bottom:20px;width:100%;justify-content:center;">➕ Ajouter un plat</button>
          <div style="text-align:center;padding:40px;color:var(--text-muted);font-size:14px;">Aucun plat pour le moment. Ajoutez votre premier plat !</div>
        </div>

        <!-- Settings -->
        <div class="dash-panel" :class="{ active: activePanel === 'settings' }">
          <div class="dash-header">
            <h1 class="dash-title">⚙️ Paramètres</h1>
            <p class="dash-subtitle">Informations de votre cuisine</p>
          </div>
          <div class="form-card">
            <div class="form-group"><label class="form-label">Nom de la cuisine</label><input class="form-input" :value="user?.name || ''" readonly></div>
            <div class="form-group"><label class="form-label">Email</label><input class="form-input" :value="user?.email || ''" readonly></div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
