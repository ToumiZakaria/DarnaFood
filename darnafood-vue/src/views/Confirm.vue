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
  orderDate.value = new Date().toLocaleDateString('fr-DZ', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' })
})
</script>

<template>
  <div class="page active" style="display:block">
    <div class="confirm-page">
      <div class="confirm-card">
        <div class="success-circle">✅</div>
        <h1 class="conf-title">Commande confirmée !</h1>
        <p class="conf-desc">Votre commande a été transmise à la cuisine. Vous recevrez une notification dès qu'elle sera prête.</p>
        <div class="order-id-box">{{ orderRef }}</div>
        <div class="conf-grid">
          <div class="conf-cell"><div class="conf-cell-label">Date</div><div class="conf-cell-val">{{ orderDate }}</div></div>
          <div class="conf-cell"><div class="conf-cell-label">Paiement</div><div class="conf-cell-val">À la livraison</div></div>
          <div class="conf-cell"><div class="conf-cell-label">Livraison</div><div class="conf-cell-val">200 DA</div></div>
          <div class="conf-cell"><div class="conf-cell-label">Total</div><div class="conf-cell-val" style="color:var(--primary-light);">{{ dzd(cart.total + 200) }}</div></div>
        </div>
        <div class="conf-actions">
          <button class="btn-primary" @click="cart.clear();router.push({name:'home'})">🏠 Retour à l'accueil</button>
          <button class="btn-ghost" @click="cart.clear();router.push({name:'myorders'})">📦 Mes commandes</button>
        </div>
      </div>
    </div>
  </div>
</template>
