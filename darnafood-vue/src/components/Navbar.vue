<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useUIStore } from '../stores/ui'

const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()
const ui = useUIStore()

const initials = computed(() => {
  if (!auth.user) return '?'
  return (auth.user.firstName || auth.user.name || '?').charAt(0).toUpperCase()
})

function go(page) {
  router.push({ name: page })
}

function toggleUserMenu() {
  document.getElementById('user-dropdown')?.classList.toggle('open')
}
</script>

<template>
  <nav class="navbar">
    <div class="nav-logo" @click="go('home')">
      <div class="nav-logo-icon">🍽️</div>
      <div class="nav-logo-wordmark">
        <div class="nav-logo-en">DarnaFood</div>
        <div class="nav-logo-ar">دارنا فود</div>
      </div>
    </div>
    <ul class="nav-links">
      <li><a href="#" @click.prevent="go('home')" class="active">Accueil</a></li>
      <li><a href="#" @click.prevent="go('kitchens')">Cuisines</a></li>
    </ul>
    <div class="nav-spacer"></div>
    <div v-if="!auth.isAuthenticated" style="display:flex;gap:8px;">
      <button class="btn-ghost" style="padding:8px 16px;font-size:13px;" @click="go('login')">Se connecter</button>
      <button class="btn-primary" style="padding:8px 16px;font-size:13px;" @click="go('register')">S'inscrire</button>
    </div>
    <div v-else class="nav-user-wrap">
      <button class="nav-user-btn" @click="toggleUserMenu">
        <div class="nav-user-avatar">{{ initials }}</div>
        <span>{{ auth.user.firstName || auth.user.name }}</span>
        <span style="font-size:10px;color:var(--text-muted)">▾</span>
      </button>
      <div class="user-dropdown" id="user-dropdown">
        <div style="padding:10px 12px 8px;border-bottom:1px solid var(--border);margin-bottom:4px;">
          <div style="font-size:13px;font-weight:700;">{{ auth.user.firstName }} {{ auth.user.lastName }}</div>
          <div v-if="auth.isCuisinier" class="role-badge cuisinier">👨‍🍳 Cuisinier</div>
          <div v-else class="role-badge client">🛒 Client</div>
        </div>
        <div v-if="auth.isCuisinier" class="user-drop-item" @click="go('dashboard');toggleUserMenu()">📊 Tableau de bord</div>
        <div v-if="auth.isClient" class="user-drop-item" @click="go('myorders');toggleUserMenu()">📦 Mes commandes</div>
        <div class="user-drop-sep"></div>
        <div class="user-drop-item danger" @click="auth.logout();go('home')">🚪 Se déconnecter</div>
      </div>
    </div>
    <button v-if="auth.isClient" class="nav-cart" @click="ui.openCart()">
      🛒 Panier
      <span class="cart-badge" :class="{ visible: cart.count > 0 }">{{ cart.count }}</span>
    </button>
  </nav>
</template>

<style scoped>
.navbar { position:fixed; top:0; left:0; right:0; z-index:100; height:68px; display:flex; align-items:center; padding:0 32px; gap:28px; background:rgba(12,11,9,.88); backdrop-filter:blur(24px); border-bottom:1px solid var(--border); }
.nav-logo { display:flex; align-items:center; gap:10px; cursor:pointer; flex-shrink:0; }
.nav-logo-icon { width:40px; height:40px; background:linear-gradient(135deg,var(--primary-light),var(--primary-dark)); border-radius:var(--r-sm); display:flex; align-items:center; justify-content:center; font-size:22px; box-shadow:0 4px 14px rgba(232,144,26,.35); }
.nav-logo-wordmark { line-height:1; }
.nav-logo-en { font-size:20px; font-weight:800; background:linear-gradient(135deg,var(--primary-light),var(--primary)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.nav-logo-ar { font-family:'Cairo',sans-serif; font-size:11px; color:var(--text-muted); }
.nav-links { display:flex; gap:2px; list-style:none; }
.nav-links a { padding:8px 15px; border-radius:var(--r-sm); font-size:14px; font-weight:500; color:var(--text-muted); text-decoration:none; }
.nav-links a:hover, .nav-links a.active { color:var(--text); background:var(--bg-elevated); }
.nav-spacer { flex:1; }
.nav-cart { position:relative; display:flex; align-items:center; gap:8px; background:var(--bg-elevated); border:1px solid var(--border-light); color:var(--text); padding:9px 18px; border-radius:var(--r-sm); font-size:14px; font-weight:600; cursor:pointer; }
.nav-cart:hover { border-color:var(--primary); background:var(--primary-glow); color:var(--primary-light); }
.cart-badge { position:absolute; top:-8px; right:-8px; width:20px; height:20px; border-radius:50%; background:var(--primary); color:#fff; font-size:11px; font-weight:700; display:none; align-items:center; justify-content:center; }
.cart-badge.visible { display:flex; }
.nav-user-wrap { position:relative; }
.nav-user-btn { display:flex; align-items:center; gap:8px; background:var(--bg-elevated); border:1px solid var(--border-light); color:var(--text); padding:7px 14px; border-radius:var(--r-sm); font-size:13px; font-weight:600; cursor:pointer; }
.nav-user-btn:hover { border-color:var(--primary); }
.nav-user-avatar { width:26px; height:26px; border-radius:50%; background:linear-gradient(135deg,var(--primary-light),var(--primary-dark)); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; color:#fff; }
.user-dropdown { position:absolute; top:calc(100% + 8px); right:0; z-index:300; background:var(--bg-elevated); border:1px solid var(--border-light); border-radius:var(--r); padding:6px; min-width:180px; box-shadow:var(--shadow-lg); display:none; }
.user-dropdown.open { display:block; }
.user-drop-item { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:var(--r-sm); font-size:13px; font-weight:500; cursor:pointer; color:var(--text-muted); }
.user-drop-item:hover { background:var(--bg-card); color:var(--text); }
.user-drop-item.danger:hover { color:var(--danger); }
.user-drop-sep { height:1px; background:var(--border); margin:4px 0; }
.role-badge { display:inline-flex; align-items:center; gap:4px; font-size:10px; font-weight:700; padding:2px 8px; border-radius:99px; }
.role-badge.client { background:rgba(45,140,100,.15); color:var(--accent-light); }
.role-badge.cuisinier { background:var(--primary-glow); color:var(--primary-light); }
</style>
