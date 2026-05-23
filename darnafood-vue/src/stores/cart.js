import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const CART_KEY = 'df_cart'

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]') }
  catch { return [] }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export const useCartStore = defineStore('cart', () => {
  const items = ref(loadCart())
  const count = computed(() => items.value.reduce((s, i) => s + i.qty, 0))
  const total = computed(() => items.value.reduce((s, i) => s + i.price * i.qty, 0))

  const kitchenId = computed(() => items.value.length > 0 ? items.value[0].kitchenId : null)

  function add(dish, kitchen) {
    const existing = items.value.find(i => i.id === dish.id)
    if (existing) {
      existing.qty++
    } else {
      items.value.push({
        id: dish.id, name: dish.name, price: dish.price, qty: 1,
        emoji: dish.emoji, gradient: dish.gradient,
        kitchenId: kitchen.id, kitchenName: kitchen.name,
      })
    }
    saveCart(items.value)
  }

  function remove(dishId) {
    const existing = items.value.find(i => i.id === dishId)
    if (existing) {
      if (existing.qty > 1) {
        existing.qty--
      } else {
        items.value = items.value.filter(i => i.id !== dishId)
      }
    }
    saveCart(items.value)
  }

  function clearItem(dishId) {
    items.value = items.value.filter(i => i.id !== dishId)
    saveCart(items.value)
  }

  function clear() {
    items.value = []
    saveCart(items.value)
  }

  return { items, count, total, kitchenId, add, remove, clearItem, clear }
})
