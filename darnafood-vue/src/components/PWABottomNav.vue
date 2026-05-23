<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useUIStore } from '../stores/ui'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const cart = useCartStore()
const ui = useUIStore()

const tabs = ['home', 'kitchens', 'cart', 'profile']

function navigate(tab) {
  if (tab === 'cart') { ui.openCart(); return }
  if (tab === 'profile') {
    if (!auth.isAuthenticated) router.push({ name: 'login' })
    else if (auth.isCuisinier) router.push({ name: 'dashboard' })
    else router.push({ name: 'myorders' })
    return
  }
  router.push({ name: tab })
}
</script>

<template>
  <nav class="pwa-bottom-nav">
    <button v-for="tab in tabs" :key="tab" class="pwa-tab" :class="{ active: route.name === tab }" @click="navigate(tab)">
      <div class="pwa-tab-wrap">
        <span class="pwa-tab-icon">{{ { home:'🏠', kitchens:'🍽️', cart:'🛒', profile:'👤' }[tab] }}</span>
        <span class="pwa-tab-badge" v-if="tab === 'cart' && cart.count > 0">{{ cart.count > 9 ? '9+' : cart.count }}</span>
      </div>
      <span>{{ { home:'Accueil', kitchens:'Cuisines', cart:'Panier', profile:'Profil' }[tab] }}</span>
    </button>
  </nav>
</template>

<style scoped>
.pwa-bottom-nav { display:none; }
@media(display-mode:standalone) {
  .pwa-bottom-nav { display:flex; position:fixed; bottom:0; left:50%; transform:translateX(-50%); width:100%; max-width:390px; height:62px; background:var(--bg-card); border-top:1px solid var(--border-light); z-index:2000; align-items:stretch; }
  @supports(padding-bottom:env(safe-area-inset-bottom)) { .pwa-bottom-nav { height:calc(62px + env(safe-area-inset-bottom)); padding-bottom:env(safe-area-inset-bottom); } }
}
.pwa-tab { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; flex:1; min-height:48px; cursor:pointer; color:var(--text-muted); font-size:11px; font-weight:600; border:none; background:none; padding:0; position:relative; }
.pwa-tab.active { color:var(--primary-light); }
.pwa-tab.active::before { content:''; position:absolute; top:0; left:20%; right:20%; height:2px; background:var(--primary-light); border-radius:0 0 4px 4px; }
.pwa-tab-icon { font-size:24px; line-height:1; }
.pwa-tab-badge { position:absolute; top:4px; right:-2px; background:#E05555; color:#fff; font-size:9px; font-weight:800; min-width:16px; height:16px; border-radius:8px; display:flex; align-items:center; justify-content:center; padding:0 4px; }
.pwa-tab-wrap { position:relative; display:flex; flex-direction:column; align-items:center; }
</style>
