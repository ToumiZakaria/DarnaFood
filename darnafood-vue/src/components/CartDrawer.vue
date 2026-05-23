<script setup>
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useUIStore } from '../stores/ui'
import { dzd } from '../utils'
import { ShoppingCart, X, Trash2, Minus, Plus, ArrowRight } from '@lucide/vue'

const router = useRouter()
const cart = useCartStore()
const ui = useUIStore()

function goCheckout() {
  ui.closeCart()
  router.push({ name: 'checkout' })
}
</script>

<template>
  <Teleport to="body">
    <div class="cart-overlay" :class="{ open: ui.cartOpen }" @click="ui.closeCart()"></div>
    <div class="cart-drawer" :class="{ open: ui.cartOpen }">
      <div class="drawer-head">
        <div class="drawer-head-title">
          <ShoppingCart :size="20" />
          Panier
          <span v-if="cart.count > 0" class="drawer-count">{{ cart.count }}</span>
        </div>
        <button class="close-btn" @click="ui.closeCart()"><X :size="18" /></button>
      </div>

      <div class="drawer-body">
        <div v-if="cart.items.length === 0" class="empty-cart">
          <ShoppingCart :size="48" class="empty-icon" />
          <p>Votre panier est vide.<br />Ajoutez des plats pour commencer.</p>
        </div>
        <div v-else class="cart-items">
          <div v-for="item in cart.items" :key="item.id" class="d-item">
            <div class="d-item-img" :style="{ background: item.gradient || 'linear-gradient(135deg,#FFF8F2,#FEF0E6)' }">
              <span class="d-item-emoji">{{ item.emoji || '🍽️' }}</span>
            </div>
            <div class="d-item-info">
              <div class="d-item-name">{{ item.name }}</div>
              <div class="d-item-kitchen">{{ item.kitchenName }}</div>
              <div class="d-item-row">
                <button class="qty-btn" @click="cart.remove(item.id)"><Minus :size="12" /></button>
                <span class="qty-num">{{ item.qty }}</span>
                <button class="qty-btn" @click="cart.add(item, { id: item.kitchenId, name: item.kitchenName })"><Plus :size="12" /></button>
                <span class="d-item-price">{{ dzd(item.price * item.qty) }}</span>
              </div>
            </div>
            <button class="d-item-remove" @click="cart.clearItem(item.id)"><Trash2 :size="14" /></button>
          </div>
        </div>
      </div>

      <div v-if="cart.items.length > 0" class="drawer-footer">
        <div class="drawer-total-row">
          <span>Sous-total</span>
          <span class="drawer-total-amt">{{ dzd(cart.total) }}</span>
        </div>
        <div class="drawer-total-row">
          <span>Livraison</span>
          <span class="drawer-total-amt">200 DA</span>
        </div>
        <div class="drawer-divider"></div>
        <div class="drawer-total-row final">
          <span>Total</span>
          <span class="drawer-total-amt final-amt">{{ dzd(cart.total + 200) }}</span>
        </div>
        <button class="checkout-btn" @click="goCheckout">
          Commander maintenant
          <ArrowRight :size="18" />
        </button>
        <button class="continue-btn" @click="ui.closeCart()">Continuer mes achats</button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.cart-overlay { position:fixed; inset:0; z-index:200; background:rgba(0,0,0,.5); backdrop-filter:blur(4px); opacity:0; pointer-events:none; transition:.3s; }
.cart-overlay.open { opacity:1; pointer-events:all; }
.cart-drawer { position:fixed; top:0; right:0; bottom:0; z-index:201; width:420px; max-width:100vw; background:#fff; display:flex; flex-direction:column; transform:translateX(100%); transition:.3s cubic-bezier(.4,0,.2,1); }
.cart-drawer.open { transform:translateX(0); }
.drawer-head { display:flex; align-items:center; justify-content:space-between; padding:20px 24px; border-bottom:1px solid #F3F4F6; }
.drawer-head-title { display:flex; align-items:center; gap:8px; font-size:18px; font-weight:700; color:#1A1A1A; }
.drawer-count { background:#E8813A; color:#fff; font-size:12px; font-weight:700; min-width:20px; height:20px; border-radius:10px; display:flex; align-items:center; justify-content:center; padding:0 5px; }
.close-btn { width:34px; height:34px; border-radius:8px; background:#F3F4F6; border:1px solid #E5E7EB; color:#6B7280; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:.2s; }
.close-btn:hover { background:#E5E7EB; color:#1A1A1A; }
.drawer-body { flex:1; overflow-y:auto; padding:20px 24px; }
.drawer-footer { padding:20px 24px; border-top:1px solid #F3F4F6; background:#FAFAFA; }
.cart-items { display:flex; flex-direction:column; gap:4px; }
.d-item { display:flex; gap:12px; align-items:flex-start; padding:14px 0; border-bottom:1px solid #F3F4F6; }
.d-item-img { width:52px; height:52px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.d-item-emoji { font-size:24px; }
.d-item-info { flex:1; min-width:0; }
.d-item-name { font-size:14px; font-weight:700; color:#1A1A1A; }
.d-item-kitchen { font-size:11px; color:#6B7280; margin-top:1px; }
.d-item-row { display:flex; align-items:center; gap:8px; margin-top:8px; }
.qty-btn { width:24px; height:24px; border-radius:6px; background:#F3F4F6; border:1px solid #E5E7EB; color:#374151; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:.15s; }
.qty-btn:hover { background:#E5E7EB; border-color:#D1D5DB; }
.qty-num { font-size:14px; font-weight:700; color:#1A1A1A; min-width:18px; text-align:center; }
.d-item-price { margin-left:auto; font-size:14px; font-weight:700; color:#E8813A; }
.d-item-remove { background:none; border:none; color:#D1D5DB; cursor:pointer; padding:4px; transition:.15s; margin-top:2px; }
.d-item-remove:hover { color:#EF4444; }
.drawer-total-row { display:flex; justify-content:space-between; align-items:center; padding:4px 0; font-size:14px; color:#6B7280; }
.drawer-total-row.final { font-size:16px; font-weight:800; color:#1A1A1A; padding:8px 0; }
.drawer-total-amt { font-weight:600; color:#374151; }
.drawer-total-amt.final-amt { color:#E8813A; font-size:18px; }
.drawer-divider { height:1px; background:#E5E7EB; margin:8px 0; }
.checkout-btn { display:flex; align-items:center; justify-content:center; gap:8px; width:100%; background:linear-gradient(135deg,#E8813A,#D4702A); color:#fff; border:none; padding:14px; border-radius:12px; font-size:15px; font-weight:700; cursor:pointer; transition:.2s; margin-top:12px; box-shadow:0 4px 14px rgba(232,129,58,.25); }
.checkout-btn:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(232,129,58,.35); }
.continue-btn { display:block; width:100%; text-align:center; background:none; border:none; color:#6B7280; font-size:13px; font-weight:600; cursor:pointer; padding:12px; margin-top:4px; }
.continue-btn:hover { color:#E8813A; }
.empty-cart { text-align:center; padding:80px 0; }
.empty-icon { color:#D1D5DB; margin-bottom:16px; }
.empty-cart p { font-size:14px; color:#6B7280; line-height:1.6; margin:0; }
</style>