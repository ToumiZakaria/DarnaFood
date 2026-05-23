<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { User, ChefHat, ArrowRight, LogOut, Package, Settings } from '@lucide/vue'

const router = useRouter()
const auth = useAuthStore()

const role = ref(null)

function selectRole(r) {
  role.value = r
  if (r === 'cuisinier') router.push({ name: 'register', query: { role: 'cuisinier' } })
  else router.push({ name: 'register', query: { role: 'client' } })
}

function goLogin() { router.push({ name: 'login' }) }
function goDashboard() { router.push({ name: 'dashboard' }) }
function goOrders() { router.push({ name: 'myorders' }) }

function logout() { auth.logout(); role.value = null }
</script>

<template>
  <div class="app-profile">
    <div v-if="!auth.isAuthenticated" class="ap-auth">
      <div class="ap-auth-header">
        <div class="ap-logo">🍽️</div>
        <h1 class="ap-auth-title">Bienvenue sur DarnaFood</h1>
        <p class="ap-auth-sub">Connectez-vous ou créez un compte pour continuer</p>
      </div>

      <div class="ap-role-picker">
        <p class="ap-role-label">Je suis...</p>
        <button class="ap-role-btn" @click="selectRole('client')">
          <User :size="28" class="ap-role-icon" />
          <div class="ap-role-text">
            <span class="ap-role-name">Un client</span>
            <span class="ap-role-desc">Je veux commander des plats</span>
          </div>
          <ArrowRight :size="18" class="ap-role-arrow" />
        </button>
        <button class="ap-role-btn" @click="selectRole('cuisinier')">
          <ChefHat :size="28" class="ap-role-icon chef" />
          <div class="ap-role-text">
            <span class="ap-role-name">Un cuisinier</span>
            <span class="ap-role-desc">Je veux vendre mes plats</span>
          </div>
          <ArrowRight :size="18" class="ap-role-arrow" />
        </button>
      </div>

      <div class="ap-auth-footer">
        <span>Déjà un compte ?</span>
        <button class="ap-link" @click="goLogin">Se connecter</button>
      </div>
    </div>

    <div v-else-if="auth.isCuisinier" class="ap-authed">
      <div class="ap-user-card">
        <div class="ap-avatar">{{ (auth.user?.firstName || 'C').charAt(0) }}</div>
        <div class="ap-user-info">
          <div class="ap-user-name">{{ auth.user?.firstName || 'Chef' }} {{ auth.user?.lastName || '' }}</div>
          <div class="ap-user-role"><ChefHat :size="12" /> Cuisinier</div>
        </div>
      </div>
      <div class="ap-menu">
        <button class="ap-menu-item" @click="goDashboard"><Package :size="18" /> Tableau de bord</button>
        <button class="ap-menu-item" @click="goOrders"><Package :size="18" /> Mes commandes</button>
        <button class="ap-menu-item" @click="goDashboard"><Settings :size="18" /> Paramètres</button>
      </div>
      <button class="ap-logout" @click="logout"><LogOut :size="16" /> Se déconnecter</button>
    </div>

    <div v-else class="ap-authed">
      <div class="ap-user-card">
        <div class="ap-avatar">{{ (auth.user?.firstName || 'U').charAt(0) }}</div>
        <div class="ap-user-info">
          <div class="ap-user-name">{{ auth.user?.firstName || 'Utilisateur' }} {{ auth.user?.lastName || '' }}</div>
          <div class="ap-user-role">Client</div>
        </div>
      </div>
      <div class="ap-menu">
        <button class="ap-menu-item" @click="goOrders"><Package :size="18" /> Mes commandes</button>
      </div>
      <button class="ap-logout" @click="logout"><LogOut :size="16" /> Se déconnecter</button>
    </div>
  </div>
</template>

<style scoped>
.app-profile { padding:24px 16px; min-height:100%; }

/* Auth */
.ap-auth { text-align:center; padding-top:40px; }
.ap-auth-header { margin-bottom:32px; }
.ap-logo { font-size:56px; margin-bottom:12px; }
.ap-auth-title { font-size:24px; font-weight:800; color:#FAFAFA; margin:0 0 8px; }
.ap-auth-sub { font-size:14px; color:#A1A1AA; margin:0; }
.ap-role-label { font-size:13px; font-weight:600; color:#A1A1AA; text-align:left; margin:0 0 12px; }
.ap-role-btn {
  display:flex; align-items:center; gap:14px; width:100%;
  background:#141414; border:1px solid #262626; border-radius:12px;
  padding:16px; margin-bottom:12px; cursor:pointer; text-align:left; transition:all .2s;
}
.ap-role-btn:active { border-color:#E8813A; background:rgba(232,129,58,.06); }
.ap-role-icon { width:44px; height:44px; border-radius:10px; background:rgba(59,130,246,.1); color:#3B82F6; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.ap-role-icon.chef { background:rgba(232,129,58,.1); color:#E8813A; }
.ap-role-text { flex:1; }
.ap-role-name { display:block; font-size:15px; font-weight:700; color:#FAFAFA; margin-bottom:2px; }
.ap-role-desc { display:block; font-size:12px; color:#A1A1AA; }
.ap-role-arrow { color:#52525B; flex-shrink:0; }
.ap-auth-footer { margin-top:24px; font-size:13px; color:#A1A1AA; display:flex; align-items:center; justify-content:center; gap:6px; }
.ap-link { background:none; border:none; color:#E8813A; font-size:13px; font-weight:700; cursor:pointer; }

/* Authed */
.ap-authed { padding-top:16px; }
.ap-user-card { display:flex; align-items:center; gap:14px; padding:16px; background:#141414; border:1px solid #262626; border-radius:12px; margin-bottom:20px; }
.ap-avatar { width:48px; height:48px; border-radius:50%; background:#E8813A; display:flex; align-items:center; justify-content:center; font-size:22px; font-weight:700; color:#fff; flex-shrink:0; }
.ap-user-info { flex:1; }
.ap-user-name { font-size:16px; font-weight:700; color:#FAFAFA; }
.ap-user-role { font-size:12px; color:#E8813A; display:flex; align-items:center; gap:4px; margin-top:2px; }
.ap-menu { display:flex; flex-direction:column; gap:4px; margin-bottom:20px; }
.ap-menu-item { display:flex; align-items:center; gap:12px; padding:14px 16px; background:#141414; border:1px solid #262626; border-radius:10px; color:#FAFAFA; font-size:14px; font-weight:500; cursor:pointer; }
.ap-menu-item:active { background:rgba(255,255,255,.05); }
.ap-logout { display:flex; align-items:center; justify-content:center; gap:8px; width:100%; padding:14px; background:transparent; border:1px solid rgba(239,68,68,.3); border-radius:10px; color:#EF4444; font-size:14px; font-weight:600; cursor:pointer; }
</style>
