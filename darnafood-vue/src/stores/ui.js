import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const cartOpen = ref(false)
  const sidebarOpen = ref(true)
  const currentPage = ref('home')
  const activeDashPanel = ref('overview')

  function openCart() { cartOpen.value = true }
  function closeCart() { cartOpen.value = false }
  function toggleCart() { cartOpen.value = !cartOpen.value }

  function toggleSidebar() { sidebarOpen.value = !sidebarOpen.value }

  function setPage(page) { currentPage.value = page }
  function setDashPanel(panel) { activeDashPanel.value = panel }

  return { cartOpen, sidebarOpen, currentPage, activeDashPanel, openCart, closeCart, toggleCart, toggleSidebar, setPage, setDashPanel }
})
