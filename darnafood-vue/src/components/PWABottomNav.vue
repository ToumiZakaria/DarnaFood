<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useUIStore } from '../stores/ui'
import { House, Store, ShoppingCart, User } from '@lucide/vue'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const cart = useCartStore()
const ui = useUIStore()

const tabs = [
  { id: 'home', label: 'Accueil', icon: House },
  { id: 'kitchens', label: 'Cuisines', icon: Store },
  { id: 'cart', label: 'Panier', icon: ShoppingCart },
  { id: 'profile', label: 'Profil', icon: User },
]

const activeTab = computed(() => {
  const name = route.name
  if (name === 'home' || name === 'kitchens' || name === 'cart' || name === 'profile' || name === 'myorders') return name
  return null
})

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
  <nav class="mobile-bottom-nav">
    <button v-for="t in tabs" :key="t.id" class="mb-tab" :class="{ active: activeTab === t.id }" @click="navigate(t.id)">
      <div class="mb-tab-inner">
        <component :is="t.icon" :size="22" class="mb-tab-icon" />
        <span class="mb-tab-label">{{ t.label }}</span>
        <span v-if="t.id === 'cart' && cart.count > 0" class="mb-tab-badge">{{ cart.count > 9 ? '9+' : cart.count }}</span>
      </div>
    </button>
  </nav>
</template>

<style scoped>
.mobile-bottom-nav {
  display:none;
  position:fixed; bottom:0; left:0; right:0; z-index:1000;
  height:60px; background:#141414; border-top:1px solid #262626;
  align-items:stretch;
  padding-bottom:env(safe-area-inset-bottom, 0px);
}
.mb-tab {
  flex:1; display:flex; align-items:center; justify-content:center;
  background:none; border:none; cursor:pointer; padding:0; position:relative;
  color:#52525B;
}
.mb-tab.active { color:#E8813A; }
.mb-tab.active::before {
  content:''; position:absolute; top:0; left:25%; right:25%; height:2px;
  background:#E8813A; border-radius:0 0 4px 4px;
}
.mb-tab-inner {
  display:flex; flex-direction:column; align-items:center; gap:2px; position:relative;
}
.mb-tab-icon { display:block; }
.mb-tab-label { font-size:10px; font-weight:600; }
.mb-tab-badge {
  position:absolute; top:-4px; right:-10px;
  background:#EF4444; color:#fff; font-size:9px; font-weight:800;
  min-width:16px; height:16px; border-radius:8px;
  display:flex; align-items:center; justify-content:center; padding:0 4px;
}
@media(max-width:768px) { .mobile-bottom-nav { display:flex; } }
</style>
