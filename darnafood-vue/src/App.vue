<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import PWABottomNav from './components/PWABottomNav.vue'
import CartDrawer from './components/CartDrawer.vue'
import Toast from './components/Toast.vue'

const route = useRoute()
const noLayout = computed(() => ['welcome'].includes(route.name))
const isApp = computed(() => route.path.startsWith('/app'))
</script>

<template>
  <div class="min-h-screen" :class="isApp ? 'bg-[#0A0A0A]' : 'bg-[#0C0B09]'">
    <template v-if="isApp">
      <router-view />
    </template>
    <template v-else>
      <Navbar v-if="!noLayout" />
      <router-view />
      <Footer v-if="!noLayout" />
      <PWABottomNav v-if="!noLayout" />
    </template>
    <CartDrawer />
    <div id="toast-host" class="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none" />
    <Teleport to="body">
      <Toast />
    </Teleport>
  </div>
</template>
