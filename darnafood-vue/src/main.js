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
  t.className = `toast${type ? ' ' + type : ''}`
  t.textContent = message
  host.appendChild(t)
  setTimeout(() => t.remove(), 3000)
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
