<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { dzd } from '../utils'

const router = useRouter()
const cart = useCartStore()
const orderRef = ref('')
const orderDate = ref('')

onMounted(() => {
  orderRef.value = 'DF-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()
  orderDate.value = new Date().toLocaleDateString('fr-DZ', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
})
</script>

<template>
  <div class="main-content page-confirm">
    <div class="confirm-card">
      <div class="confirm-icon">✅</div>
      <h1 class="confirm-title">Commande confirmée !</h1>
      <p class="confirm-ref">Réf. <strong>{{ orderRef }}</strong></p>
      <p class="confirm-date">{{ orderDate }}</p>
      <div class="confirm-info">
        <p>Votre commande a été transmise à la cuisine. Vous recevrez une notification dès qu'elle sera prête.</p>
      </div>
      <div v-if="cart.items.length" class="confirm-summary">
        <div v-for="item in cart.items" :key="item.id" class="ci-row">
          <span>{{ item.emoji }} <b>{{ item.name }}</b> x{{ item.qty }}</span>
          <span>{{ dzd(item.price * item.qty) }}</span>
        </div>
        <div class="ci-total">
          <span>Total</span>
          <span>{{ dzd(cart.total + 200) }}</span>
        </div>
      </div>
      <div class="confirm-actions">
        <button class="btn-primary btn-lg" @click="cart.clear();router.push({name:'home'})">🏠 Retour à l'accueil</button>
        <button class="btn-outline btn-lg" @click="cart.clear();router.push({name:'myorders'})">📦 Mes commandes</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-content { min-height:calc(100vh - 68px); display:flex; align-items:center; justify-content:center; padding:40px 20px; }
.confirm-card { text-align:center; max-width:480px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--r-lg); padding:48px 36px; box-shadow:var(--shadow-lg); }
.confirm-icon { font-size:64px; margin-bottom:8px; }
.confirm-title { font-size:28px; font-weight:800; margin-bottom:4px; }
.confirm-ref { font-size:14px; color:var(--text-muted); margin-bottom:2px; }
.confirm-date { font-size:12px; color:var(--text-muted); margin-bottom:20px; }
.confirm-info { background:var(--bg-elevated); border:1px solid var(--border-light); border-radius:var(--r); padding:14px 18px; margin-bottom:24px; }
.confirm-info p { font-size:14px; color:var(--text-muted); line-height:1.6; margin:0; }
.confirm-summary { margin-bottom:24px; }
.ci-row { display:flex; justify-content:space-between; font-size:13px; padding:6px 0; border-bottom:1px solid var(--border); }
.ci-row b { color:var(--text); }
.ci-total { display:flex; justify-content:space-between; font-size:16px; font-weight:800; padding:10px 0; }
.ci-total span:last-child { color:var(--primary-light); }
.confirm-actions { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
</style>
