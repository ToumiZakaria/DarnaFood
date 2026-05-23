<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const props = defineProps({
  activeTab: String,
  sidebarOpen: Boolean,
})
const emit = defineEmits(['toggle', 'navigate'])
const router = useRouter()
const auth = useAuthStore()

const initials = computed(() => {
  if (!auth.user) return '?'
  return (auth.user.firstName || auth.user.name || '?').charAt(0).toUpperCase()
})
const tabs = [
  { id: 'dashboard', label: '📊 Tableau de bord' },
  { id: 'menu', label: '🍽️ Menu' },
  { id: 'profile', label: '👤 Profil' },
  { id: 'settings', label: '⚙️ Paramètres' },
]

function logout() {
  auth.logout()
  router.push({ name: 'home' })
}
</script>

<template>
  <aside class="dash-sidebar" :class="{ open: sidebarOpen }">
    <div class="ds-header">
      <div class="ds-logo" @click="emit('navigate', 'dashboard')">
        <div class="ds-logo-icon">🍽️</div>
        <div class="ds-logo-text">DarnaFood</div>
      </div>
    </div>

    <div class="ds-profile-row">
      <div class="ds-avatar">{{ initials }}</div>
      <div class="ds-user-info">
        <div class="ds-user-name">{{ auth.user?.firstName || 'Cuisinier' }} {{ auth.user?.lastName || '' }}</div>
        <div class="ds-user-role">👨‍🍳 Cuisinier</div>
      </div>
    </div>

    <nav class="ds-nav">
      <button v-for="tab in tabs" :key="tab.id" class="ds-nav-item" :class="{ active: activeTab === tab.id }" @click="emit('navigate', tab.id)">
        {{ tab.label }}
      </button>
    </nav>

    <div class="ds-footer">
      <button class="ds-nav-item" @click="router.push({ name: 'home' })">🏠 Accueil</button>
      <button class="ds-nav-item danger" @click="logout">🚪 Déconnexion</button>
    </div>
  </aside>
</template>

<style scoped>
.dash-sidebar { width:260px; min-width:260px; background:var(--bg-card); border-right:1px solid var(--border); height:calc(100vh - 68px); position:sticky; top:68px; display:flex; flex-direction:column; transition:var(--ease-slow); }
.sidebar-hidden .dash-sidebar { width:0; min-width:0; overflow:hidden; border-right-color:transparent; }
.ds-header { padding:20px 18px 16px; border-bottom:1px solid var(--border); }
.ds-logo { display:flex; align-items:center; gap:10px; cursor:pointer; }
.ds-logo-icon { width:34px; height:34px; background:linear-gradient(135deg,var(--primary-light),var(--primary-dark)); border-radius:var(--r-sm); display:flex; align-items:center; justify-content:center; font-size:18px; }
.ds-logo-text { font-size:18px; font-weight:800; background:linear-gradient(135deg,var(--primary-light),var(--primary)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.ds-profile-row { display:flex; align-items:center; gap:12px; padding:18px 18px; border-bottom:1px solid var(--border); }
.ds-avatar { width:40px; height:40px; border-radius:50%; background:linear-gradient(135deg,var(--primary-light),var(--primary-dark)); display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:700; color:#fff; flex-shrink:0; }
.ds-user-info { flex:1; overflow:hidden; }
.ds-user-name { font-size:13px; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ds-user-role { font-size:11px; color:var(--primary-light); }
.ds-nav { flex:1; padding:10px 10px; display:flex; flex-direction:column; gap:2px; overflow-y:auto; }
.ds-nav-item { display:flex; align-items:center; gap:10px; padding:11px 14px; border-radius:var(--r-sm); font-size:13px; font-weight:600; color:var(--text-muted); background:none; border:none; cursor:pointer; width:100%; text-align:left; }
.ds-nav-item:hover { background:var(--bg-elevated); color:var(--text); }
.ds-nav-item.active { background:var(--primary-glow); color:var(--primary-light); }
.ds-nav-item.danger:hover { color:var(--danger); background:rgba(200,60,60,.08); }
.ds-footer { padding:10px; border-top:1px solid var(--border); display:flex; flex-direction:column; gap:2px; }
</style>
