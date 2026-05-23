import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => {
    regs.forEach(reg => reg.unregister())
  })
}

window.showToast = (message, type = 'success') => {
  const host = document.getElementById('toast-host')
  if (!host) return
  const t = document.createElement('div')
  t.className = `toast${type ? ' ' + type : ''}`
  t.textContent = message
  host.appendChild(t)
  setTimeout(() => t.remove(), 3000)
}

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
