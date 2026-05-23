<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useCartStore } from '../../stores/cart'
import { useUIStore } from '../../stores/ui'
import { House, Store, ShoppingCart, User } from '@lucide/vue'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const cart = useCartStore()
const ui = useUIStore()

const tabs = [
  { id: 'app-home', label: 'Accueil', icon: House },
  { id: 'app-kitchens', label: 'Cuisines', icon: Store },
  { id: 'app-cart', label: 'Panier', icon: ShoppingCart },
  { id: 'app-profile', label: 'Profil', icon: User },
]

const activeTab = computed(() => {
  if (route.name === 'app-home') return 'app-home'
  if (route.name === 'app-kitchens') return 'app-kitchens'
  if (route.name === 'app-cart') return 'app-cart'
  if (route.name === 'app-profile') return 'app-profile'
  return null
})

function navigate(tab) {
  if (tab === 'app-cart') { ui.openCart(); return }
  router.push({ name: tab })
}
</script>

<template>
  <nav class="app-tab-bar">
    <button v-for="t in tabs" :key="t.id" class="app-tab" :class="{ active: activeTab === t.id }" @click="navigate(t.id)">
      <div class="app-tab-inner">
        <component :is="t.icon" :size="22" class="app-tab-icon" />
        <span class="app-tab-label">{{ t.label }}</span>
        <span v-if="t.id === 'app-cart' && cart.count > 0" class="app-tab-badge">{{ cart.count > 9 ? '9+' : cart.count }}</span>
      </div>
    </button>
  </nav>
</template>

<style scoped>
.app-tab-bar {
  position:fixed; bottom:0; left:0; right:0; z-index:1000;
  height:60px; background:#141414; border-top:1px solid #262626;
  display:flex; align-items:stretch;
  padding-bottom:env(safe-area-inset-bottom, 0px);
}
.app-tab {
  flex:1; display:flex; align-items:center; justify-content:center;
  background:none; border:none; cursor:pointer; padding:0; position:relative;
  color:#52525B; transition:color .2s;
}
.app-tab.active { color:#E8813A; }
.app-tab.active::before {
  content:''; position:absolute; top:0; left:25%; right:25%; height:2px;
  background:#E8813A; border-radius:0 0 4px 4px;
}
.app-tab-inner {
  display:flex; flex-direction:column; align-items:center; gap:2px; position:relative;
}
.app-tab-icon { display:block; }
.app-tab-label { font-size:10px; font-weight:600; }
.app-tab-badge {
  position:absolute; top:-4px; right:-10px;
  background:#EF4444; color:#fff; font-size:9px; font-weight:800;
  min-width:16px; height:16px; border-radius:8px;
  display:flex; align-items:center; justify-content:center; padding:0 4px;
}
</style>
