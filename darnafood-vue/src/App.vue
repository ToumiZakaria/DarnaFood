<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import PWABottomNav from './components/PWABottomNav.vue'
import CartDrawer from './components/CartDrawer.vue'
import Toast from './components/Toast.vue'

const route = useRoute()
const noLayout = computed(() => ['login', 'register', 'welcome', 'dashboard', 'myorders'].includes(route.name))
</script>

<template>
  <div class="min-h-screen bg-[#0C0B09]">
    <Navbar v-if="!noLayout" />
    <router-view />
    <Footer v-if="!noLayout" />
    <PWABottomNav v-if="!noLayout" />
    <CartDrawer />
    <div id="toast-host" class="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none" />
    <Teleport to="body">
      <Toast />
    </Teleport>
  </div>
</template>
