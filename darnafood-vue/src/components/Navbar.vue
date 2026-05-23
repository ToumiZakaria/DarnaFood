<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useUIStore } from '../stores/ui'
import { Menu, X, ShoppingCart, LogIn, UserPlus, LogOut, LayoutDashboard, Package, Store, ChevronDown } from '@lucide/vue'

const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()
const ui = useUIStore()
const menuOpen = ref(false)

const initials = computed(() => {
  if (!auth.user) return '?'
  return (auth.user.firstName || auth.user.name || '?').charAt(0).toUpperCase()
})

function go(page) { menuOpen.value = false; router.push({ name: page }) }
function toggleUserMenu() { document.getElementById('user-dropdown')?.classList.toggle('open') }
</script>

<template>
  <nav class="navbar">
    <div class="nav-inner">
      <div class="nav-logo" @click="go('home')">
        <div class="nav-logo-icon">D</div>
        <div class="nav-logo-word">
          <span class="nav-logo-name">DarnaFood</span>
          <span class="nav-logo-ar">دارنا فود</span>
        </div>
      </div>

      <ul class="nav-center">
        <li><a href="#" @click.prevent="go('home')" :class="{ active: $route.name === 'home' }">Accueil</a></li>
        <li><a href="#" @click.prevent="go('kitchens')" :class="{ active: $route.name === 'kitchens' }">Cuisines</a></li>
      </ul>

      <div class="nav-right">
        <button v-if="auth.isClient" class="nav-cart" @click="ui.openCart()">
          <ShoppingCart :size="18" />
          <span class="nav-cart-label">Panier</span>
          <span class="cart-badge" v-if="cart.count > 0">{{ cart.count > 9 ? '9+' : cart.count }}</span>
        </button>

        <div v-if="!auth.isAuthenticated" class="nav-auth">
          <button class="nav-btn ghost" @click="go('login')"><LogIn :size="16" /> Connexion</button>
          <button class="nav-btn primary" @click="go('register')"><UserPlus :size="16" /> Inscription</button>
        </div>

        <div v-else class="nav-user-wrap">
          <button class="nav-user-btn" @click="toggleUserMenu">
            <div class="user-avatar">{{ initials }}</div>
            <span class="user-name">{{ auth.user.firstName || auth.user.name }}</span>
            <ChevronDown :size="14" class="user-chevron" />
          </button>
          <div class="user-dropdown" id="user-dropdown">
            <div class="dropdown-header">
              <div class="dropdown-name">{{ auth.user.firstName }} {{ auth.user.lastName }}</div>
              <div class="dropdown-role">{{ auth.isCuisinier ? 'Cuisinier' : 'Client' }}</div>
            </div>
            <div v-if="auth.isCuisinier" class="dropdown-item" @click="go('dashboard');toggleUserMenu()">
              <LayoutDashboard :size="16" /> Tableau de bord
            </div>
            <div v-if="auth.isClient" class="dropdown-item" @click="go('myorders');toggleUserMenu()">
              <Package :size="16" /> Mes commandes
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-item danger" @click="auth.logout();go('home')">
              <LogOut :size="16" /> Se déconnecter
            </div>
          </div>
        </div>

        <button class="nav-mobile-toggle" @click="menuOpen = !menuOpen">
          <component :is="menuOpen ? X : Menu" :size="22" />
        </button>
      </div>
    </div>

    <div class="mobile-menu" :class="{ open: menuOpen }">
      <a href="#" @click.prevent="go('home')">Accueil</a>
      <a href="#" @click.prevent="go('kitchens')">Cuisines</a>
      <hr />
      <template v-if="!auth.isAuthenticated">
        <a href="#" @click.prevent="go('login')">Connexion</a>
        <a href="#" @click.prevent="go('register')">Inscription</a>
      </template>
      <template v-else>
        <a href="#" @click.prevent="go('myorders')">Mes commandes</a>
        <a href="#" @click.prevent="auth.logout();go('home')">Se déconnecter</a>
      </template>
    </div>
  </nav>
</template>

<style scoped>
.navbar { position:fixed; top:0; left:0; right:0; z-index:100; height:64px; background:rgba(255,255,255,.95); backdrop-filter:blur(24px); border-bottom:1px solid #E5E7EB; }
.nav-inner { max-width:1200px; margin:0 auto; height:100%; display:flex; align-items:center; padding:0 24px; gap:24px; }
.nav-logo { display:flex; align-items:center; gap:10px; cursor:pointer; flex-shrink:0; }
.nav-logo-icon { width:36px; height:36px; background:linear-gradient(135deg,#E8813A,#D4702A); border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:800; color:#fff; box-shadow:0 3px 10px rgba(232,129,58,.3); }
.nav-logo-word { line-height:1; }
.nav-logo-name { font-size:18px; font-weight:800; color:#1A1A1A; }
.nav-logo-ar { font-family:'Cairo',sans-serif; font-size:10px; color:#9CA3AF; }
.nav-center { display:flex; gap:2px; list-style:none; margin:0; padding:0; }
.nav-center a { padding:8px 16px; border-radius:8px; font-size:14px; font-weight:500; color:#6B7280; text-decoration:none; transition:.2s; }
.nav-center a:hover, .nav-center a.active { color:#1A1A1A; background:#F3F4F6; }
.nav-right { margin-left:auto; display:flex; align-items:center; gap:12px; }
.nav-cart { position:relative; display:flex; align-items:center; gap:6px; background:#F9FAFB; border:1px solid #E5E7EB; color:#374151; padding:8px 16px; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; transition:.2s; }
.nav-cart:hover { border-color:#E8813A; color:#E8813A; background:#FFF8F2; }
.nav-cart-label { font-size:13px; }
.cart-badge { position:absolute; top:-6px; right:-6px; min-width:18px; height:18px; border-radius:9px; background:#EF4444; color:#fff; font-size:10px; font-weight:800; display:flex; align-items:center; justify-content:center; padding:0 4px; }
.nav-auth { display:flex; gap:8px; }
.nav-btn { display:inline-flex; align-items:center; gap:6px; padding:8px 16px; border-radius:10px; font-size:13px; font-weight:600; cursor:pointer; transition:.2s; }
.nav-btn.ghost { background:none; border:1px solid #E5E7EB; color:#6B7280; }
.nav-btn.ghost:hover { border-color:#E8813A; color:#E8813A; }
.nav-btn.primary { background:linear-gradient(135deg,#E8813A,#D4702A); border:none; color:#fff; box-shadow:0 3px 10px rgba(232,129,58,.25); }
.nav-btn.primary:hover { box-shadow:0 5px 16px rgba(232,129,58,.35); transform:translateY(-1px); }
.nav-user-wrap { position:relative; }
.nav-user-btn { display:flex; align-items:center; gap:8px; background:#F9FAFB; border:1px solid #E5E7EB; color:#374151; padding:6px 14px 6px 6px; border-radius:10px; font-size:13px; font-weight:600; cursor:pointer; transition:.2s; }
.nav-user-btn:hover { border-color:#E8813A; }
.user-avatar { width:28px; height:28px; border-radius:50%; background:linear-gradient(135deg,#E8813A,#D4702A); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; color:#fff; }
.user-name { max-width:100px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.user-chevron { color:#9CA3AF; }
.user-dropdown { position:absolute; top:calc(100% + 8px); right:0; z-index:300; background:#fff; border:1px solid #E5E7EB; border-radius:12px; padding:6px; min-width:190px; box-shadow:0 8px 24px rgba(0,0,0,.1); display:none; }
.user-dropdown.open { display:block; animation:dropIn .2s ease both; }
@keyframes dropIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
.dropdown-header { padding:10px 12px 8px; border-bottom:1px solid #F3F4F6; margin-bottom:4px; }
.dropdown-name { font-size:13px; font-weight:700; color:#1A1A1A; }
.dropdown-role { font-size:11px; color:#9CA3AF; }
.dropdown-item { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:8px; font-size:13px; font-weight:500; cursor:pointer; color:#6B7280; transition:.15s; }
.dropdown-item:hover { background:#F9FAFB; color:#1A1A1A; }
.dropdown-item.danger:hover { color:#EF4444; }
.dropdown-divider { height:1px; background:#F3F4F6; margin:4px 0; }
.nav-mobile-toggle { display:none; background:none; border:none; cursor:pointer; color:#6B7280; padding:8px; }
.mobile-menu { display:none; position:fixed; top:64px; left:0; right:0; bottom:0; background:#fff; padding:16px 24px; flex-direction:column; gap:4px; z-index:99; }
.mobile-menu.open { display:flex; }
.mobile-menu a { padding:12px 16px; border-radius:10px; font-size:15px; font-weight:500; color:#374151; text-decoration:none; }
.mobile-menu a:hover { background:#F3F4F6; }
.mobile-menu hr { border:none; border-top:1px solid #F3F4F6; margin:8px 0; }
@media(max-width:768px) { .nav-center, .nav-auth { display:none; } .nav-mobile-toggle { display:flex; } }
</style>