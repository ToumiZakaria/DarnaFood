<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { dzd } from '../utils'
import { CheckCircle, Package, ArrowLeft, Clock, CreditCard, Truck } from '@lucide/vue'

const router = useRouter()
const route = useRoute()
const cart = useCartStore()

const order = route.state?.order || null
</script>

<template>
  <div class="confirm-page">
    <div class="confirm-card">
      <div class="confirm-icon">
        <CheckCircle :size="56" />
      </div>
      <h1 class="confirm-title">Commande confirmée !</h1>
      <p class="confirm-desc">Votre commande a été transmise à la cuisine. Vous serez notifié dès qu'elle sera prête.</p>

      <div class="confirm-ref">{{ order?.orderId || 'DF-————' }}</div>

      <div class="confirm-grid">
        <div class="confirm-cell">
          <Clock :size="16" />
          <div class="confirm-cell-label">Date</div>
          <div class="confirm-cell-val">{{ order ? new Date(order.createdAt).toLocaleDateString('fr-DZ', { day:'numeric', month:'long', hour:'2-digit', minute:'2-digit' }) : '—' }}</div>
        </div>
        <div class="confirm-cell">
          <CreditCard :size="16" />
          <div class="confirm-cell-label">Paiement</div>
          <div class="confirm-cell-val">À la livraison</div>
        </div>
        <div class="confirm-cell">
          <Truck :size="16" />
          <div class="confirm-cell-label">Livraison</div>
          <div class="confirm-cell-val">{{ order ? dzd(order.deliveryFee) : '200 DA' }}</div>
        </div>
        <div class="confirm-cell">
          <Package :size="16" />
          <div class="confirm-cell-label">Total</div>
          <div class="confirm-cell-val total">{{ order ? dzd(order.total) : dzd(cart.total + 200) }}</div>
        </div>
      </div>

      <div class="confirm-actions">
        <button class="confirm-btn primary" @click="cart.clear();router.push({name:'home'})">
          Retour à l'accueil
        </button>
        <button class="confirm-btn secondary" @click="cart.clear();router.push({name:'myorders'})">
          Mes commandes
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.confirm-page { display:flex; align-items:center; justify-content:center; min-height:100vh; padding:24px; background:#F8F7F4; padding-top:88px; }
.confirm-card { background:#fff; border:1px solid #E5E7EB; border-radius:20px; padding:48px 40px; max-width:500px; width:100%; text-align:center; box-shadow:0 8px 24px rgba(0,0,0,.06); }
.confirm-icon { color:#22C55E; margin-bottom:20px; animation:pop .5s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes pop { from { transform:scale(0); opacity:0; } to { transform:scale(1); opacity:1; } }
.confirm-title { font-size:26px; font-weight:800; color:#1A1A1A; margin:0 0 10px; }
.confirm-desc { font-size:14px; color:#6B7280; line-height:1.6; margin:0 0 24px; }
.confirm-ref { background:#F9FAFB; border:1px solid #E5E7EB; border-radius:10px; padding:12px 20px; font-family:monospace; font-size:18px; letter-spacing:2px; color:#E8813A; font-weight:700; margin-bottom:24px; }
.confirm-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:28px; }
.confirm-cell { background:#F9FAFB; border-radius:10px; padding:14px; text-align:left; display:flex; flex-direction:column; gap:4px; color:#6B7280; }
.confirm-cell-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:#9CA3AF; }
.confirm-cell-val { font-size:14px; font-weight:600; color:#1A1A1A; }
.confirm-cell-val.total { color:#E8813A; font-size:15px; }
.confirm-actions { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
.confirm-btn { padding:12px 28px; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; transition:.2s; }
.confirm-btn.primary { background:linear-gradient(135deg,#E8813A,#D4702A); color:#fff; border:none; box-shadow:0 4px 14px rgba(232,129,58,.25); }
.confirm-btn.primary:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(232,129,58,.35); }
.confirm-btn.secondary { background:#fff; border:1px solid #E5E7EB; color:#6B7280; }
.confirm-btn.secondary:hover { border-color:#E8813A; color:#E8813A; }
@media(max-width:480px) { .confirm-card { padding:32px 24px; } }
</style>