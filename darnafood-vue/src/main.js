import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// PWA class detection
if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
  document.body.classList.add('pwa')
}

// Global toast helper
window.showToast = (message, type = 'success') => {
  const host = document.getElementById('toast-host')
  if (!host) return
  const t = document.createElement('div')
  t.className = `toast toast-${type}`
  t.textContent = message
  host.appendChild(t)
  setTimeout(() => { t.classList.add('show') }, 10)
  setTimeout(() => {
    t.classList.remove('show')
    setTimeout(() => t.remove(), 400)
  }, 2800)
}

// Service worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
