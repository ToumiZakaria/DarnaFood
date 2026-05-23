<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed, Settings, ChevronLeft, LogOut, Home
} from '@lucide/vue'
import OverviewPanel from '../components/dashboard/OverviewPanel.vue'
import OrdersPanel from '../components/dashboard/OrdersPanel.vue'
import MenuPanel from '../components/dashboard/MenuPanel.vue'
import SettingsPanel from '../components/dashboard/SettingsPanel.vue'

const router = useRouter()
const auth = useAuthStore()
const sidebarOpen = ref(true)
const activeTab = ref('overview')

const tabs = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
  { id: 'orders', label: 'Commandes', icon: ShoppingBag },
  { id: 'menu', label: 'Mon Menu', icon: UtensilsCrossed },
  { id: 'settings', label: 'Paramètres', icon: Settings },
]

function logout() {
  auth.logout()
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="dash-root">
    <aside class="dash-sidebar" :class="{ collapsed: !sidebarOpen }">
      <div class="ds-logo">
        <div class="ds-logo-icon">🍽️</div>
        <span v-if="sidebarOpen" class="ds-logo-text">DarnaFood</span>
      </div>
      <div class="ds-profile">
        <div class="ds-avatar">{{ (auth.user?.firstName || 'C').charAt(0) }}</div>
        <div v-if="sidebarOpen" class="ds-user">
          <div class="ds-name">{{ auth.user?.firstName || 'Chef' }} {{ auth.user?.lastName || '' }}</div>
          <div class="ds-role">Cuisinier</div>
        </div>
      </div>
      <div class="ds-nav">
        <button v-for="tab in tabs" :key="tab.id" class="ds-nav-item" :class="{ active: activeTab === tab.id }" @click="activeTab = tab.id">
          <component :is="tab.icon" :size="18" />
          <span v-if="sidebarOpen">{{ tab.label }}</span>
        </button>
      </div>
      <div class="ds-footer">
        <button class="ds-nav-item" @click="router.push({ name: 'home' })">
          <Home :size="18" /><span v-if="sidebarOpen">Accueil</span>
        </button>
        <button class="ds-nav-item danger" @click="logout">
          <LogOut :size="18" /><span v-if="sidebarOpen">Déconnexion</span>
        </button>
      </div>
      <button class="ds-collapse" @click="sidebarOpen = !sidebarOpen">
        <ChevronLeft :size="16" :class="{ rotated: !sidebarOpen }" />
      </button>
    </aside>
    <main class="ds-main">
      <OverviewPanel v-if="activeTab === 'overview'" />
      <OrdersPanel v-if="activeTab === 'orders'" />
      <MenuPanel v-if="activeTab === 'menu'" />
      <SettingsPanel v-if="activeTab === 'settings'" />
    </main>
  </div>
</template>

<style scoped>
.dash-root { display:flex; min-height:100vh; background:#0A0A0A; }
.dash-sidebar {
  width:240px; min-width:240px; background:#141414; border-right:1px solid #262626;
  display:flex; flex-direction:column; padding:20px 12px; position:sticky; top:0; height:100vh;
  transition:width .25s,min-width .25s;
}
.dash-sidebar.collapsed { width:60px; min-width:60px; }
.ds-logo { display:flex; align-items:center; gap:10px; padding:0 8px 20px; border-bottom:1px solid #262626; margin-bottom:16px; }
.ds-logo-icon { width:36px; height:36px; background:#E8813A; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
.ds-logo-text { font-size:18px; font-weight:800; color:#FAFAFA; }
.ds-profile { display:flex; align-items:center; gap:10px; padding:0 8px 16px; border-bottom:1px solid #262626; margin-bottom:12px; }
.ds-avatar { width:40px; height:40px; border-radius:50%; background:#E8813A; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:700; color:#fff; flex-shrink:0; }
.ds-user { overflow:hidden; }
.ds-name { font-size:13px; font-weight:700; color:#FAFAFA; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ds-role { font-size:11px; color:#E8813A; }
.ds-nav { flex:1; display:flex; flex-direction:column; gap:2px; padding:4px 0; }
.ds-nav-item {
  display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:8px;
  font-size:13px; font-weight:500; color:#A1A1AA; cursor:pointer; border:none; background:none; width:100%; text-align:left; transition:all .2s;
}
.ds-nav-item:hover { background:rgba(255,255,255,.05); color:#FAFAFA; }
.ds-nav-item.active { background:rgba(232,129,58,.12); color:#E8813A; }
.ds-nav-item.danger:hover { color:#EF4444; background:rgba(239,68,68,.08); }
.ds-footer { border-top:1px solid #262626; padding-top:8px; margin-top:8px; display:flex; flex-direction:column; gap:2px; }
.ds-collapse {
  position:absolute; bottom:20px; right:-12px; width:24px; height:24px; border-radius:50%;
  background:#141414; border:1px solid #262626; color:#A1A1AA; display:flex; align-items:center; justify-content:center; cursor:pointer;
}
.ds-collapse:hover { border-color:#E8813A; color:#E8813A; }
.ds-collapse .rotated { transform:rotate(180deg); }
.ds-main { flex:1; padding:32px; overflow-y:auto; background:#0A0A0A; }
</style>
