<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppTabBar from '../components/app/AppTabBar.vue'

const router = useRouter()
const route = useRoute()
const transitionName = ref('slide-right')

const tabOrder = ['app-home', 'app-kitchens', 'app-cart', 'app-profile']
const transitionRoutes = ['app-home', 'app-kitchens', 'app-cart', 'app-profile']

watch(() => route.name, (to, from) => {
  if (!from) { transitionName.value = 'fade'; return }
  const fromIdx = tabOrder.indexOf(from)
  const toIdx = tabOrder.indexOf(to)
  if (fromIdx >= 0 && toIdx >= 0) {
    transitionName.value = toIdx > fromIdx ? 'slide-left' : 'slide-right'
  } else {
    transitionName.value = 'fade'
  }
})

const isTabRoute = computed(() => tabOrder.includes(route.name))

// Touch swipe support
const touchX = ref(null)
const minSwipe = 60

function onTouchStart(e) { touchX.value = e.touches[0].clientX }
function onTouchEnd(e) {
  if (!touchX.value) return
  const dx = e.changedTouches[0].clientX - touchX.value
  touchX.value = null
  if (Math.abs(dx) < minSwipe) return
  const cur = tabOrder.indexOf(route.name)
  if (cur < 0) return
  if (dx < 0 && cur < tabOrder.length - 1) router.push({ name: tabOrder[cur + 1] })
  else if (dx > 0 && cur > 0) router.push({ name: tabOrder[cur - 1] })
}
</script>

<template>
  <div class="app-shell" :class="{ 'has-tab-bar': isTabRoute }" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
    <router-view v-slot="{ Component }">
      <transition :name="transitionName" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <AppTabBar v-if="isTabRoute" />
  </div>
</template>

<style scoped>
.app-shell {
  min-height:100vh; background:#0A0A0A; color:#FAFAFA;
  position:relative; overflow:hidden;
}
.app-shell.has-tab-bar { padding-bottom:calc(60px + env(safe-area-inset-bottom, 0px)); }

/* Tab transitions */
.slide-left-enter-active, .slide-left-leave-active,
.slide-right-enter-active, .slide-right-leave-active {
  transition:transform .25s ease, opacity .2s ease;
  position:absolute; width:100%;
}
.slide-left-enter-from { transform:translateX(30%); opacity:0; }
.slide-left-leave-to { transform:translateX(-30%); opacity:0; }
.slide-right-enter-from { transform:translateX(-30%); opacity:0; }
.slide-right-leave-to { transform:translateX(30%); opacity:0; }

/* Fade transitions */
.fade-enter-active, .fade-leave-active { transition:opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity:0; }
</style>
