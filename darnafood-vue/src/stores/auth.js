import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAuthUser, setAuthUser, getToken, setToken, getAccounts, saveAccounts } from '../utils'
import { apiLogin, apiRegister } from '../api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(getAuthUser())
  const token = ref(getToken())
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const isCuisinier = computed(() => user.value?.role === 'cuisinier')
  const isClient = computed(() => user.value?.role === 'client')

  async function login(email, password) {
    const data = await apiLogin(email, password)
    if (data.success) {
      user.value = data.user
      token.value = data.token
      setAuthUser(data.user)
      setToken(data.token)
    }
    return data
  }

  async function register(form) {
    const data = await apiRegister(form)
    if (data.success) {
      user.value = data.user
      token.value = data.token
      setAuthUser(data.user)
      setToken(data.token)
    }
    return data
  }

  function setUser(u) {
    user.value = u
    setAuthUser(u)
  }

  function setUserToken(t, u) {
    user.value = u
    token.value = t
    setAuthUser(u)
    setToken(t)
  }

  function logout() {
    user.value = null
    token.value = null
    setAuthUser(null)
    setToken(null)
  }

  function updateLocalProfile(updates) {
    if (!user.value) return
    const accounts = getAccounts()
    const idx = accounts.findIndex(a => a.email === user.value.email)
    if (idx >= 0) {
      Object.assign(accounts[idx], updates)
      saveAccounts(accounts)
      Object.assign(user.value, updates)
      setAuthUser(user.value)
    }
  }

  return { user, token, isAuthenticated, isCuisinier, isClient, login, register, logout, setUser, setUserToken, updateLocalProfile }
})
