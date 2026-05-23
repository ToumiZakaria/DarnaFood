<script setup>
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useUIStore } from '../stores/ui'
import { dzd } from '../utils'

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
        <span class="drawer-head-title">🛒 Votre Panier</span>
        <button class="close-btn" @click="ui.closeCart()">✕</button>
      </div>
      <div class="drawer-body">
        <div v-if="cart.items.length === 0" class="empty-cart">
          <span class="ei">🍽️</span>
          <p>Votre panier est vide.<br>Ajoutez des plats pour commencer.</p>
        </div>
        <div v-else>
          <div v-for="item in cart.items" :key="item.id" class="d-item">
            <div class="d-item-icon" :style="{ background: item.gradient }">{{ item.emoji }}</div>
            <div class="d-item-info">
              <div class="d-item-name">{{ item.name }}</div>
              <div class="d-item-kitchen">{{ item.kitchenName }}</div>
              <div class="d-item-ctrl">
                <button class="qty-btn" @click="cart.remove(item.id)">−</button>
                <span class="qty-num">{{ item.qty }}</span>
                <button class="qty-btn" @click="cart.add(item, { id: item.kitchenId, name: item.kitchenName })">+</button>
              </div>
            </div>
            <div class="d-item-price">{{ dzd(item.price * item.qty) }}</div>
          </div>
        </div>
      </div>
      <div v-if="cart.items.length > 0" class="drawer-footer">
        <div class="total-row"><span>Total</span><span class="amt">{{ dzd(cart.total) }}</span></div>
        <div class="divider"></div>
        <button class="btn-primary btn-block" @click="goCheckout">✅ Commander</button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.cart-overlay { position:fixed; inset:0; z-index:200; background:rgba(0,0,0,.65); backdrop-filter:blur(6px); opacity:0; pointer-events:none; transition:var(--ease-slow); }
.cart-overlay.open { opacity:1; pointer-events:all; }
.cart-drawer { position:fixed; top:0; right:0; bottom:0; z-index:201; width:410px; max-width:100vw; background:var(--bg-card); border-left:1px solid var(--border); display:flex; flex-direction:column; transform:translateX(100%); transition:var(--ease-slow); }
.cart-drawer.open { transform:translateX(0); }
.drawer-head { display:flex; align-items:center; justify-content:space-between; padding:22px 24px; border-bottom:1px solid var(--border); }
.drawer-head-title { font-size:19px; font-weight:700; }
.close-btn { width:34px; height:34px; border-radius:var(--r-sm); background:var(--bg-elevated); border:1px solid var(--border); color:var(--text-muted); font-size:16px; display:flex; align-items:center; justify-content:center; cursor:pointer; }
.close-btn:hover { color:var(--text); background:var(--border); }
.drawer-body { flex:1; overflow-y:auto; padding:22px 24px; }
.drawer-footer { padding:20px 24px; border-top:1px solid var(--border); }
.d-item { display:flex; gap:12px; align-items:center; padding:14px 0; border-bottom:1px solid var(--border); }
.d-item-icon { width:48px; height:48px; border-radius:var(--r-sm); display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0; }
.d-item-info { flex:1; }
.d-item-name { font-size:14px; font-weight:600; }
.d-item-kitchen { font-size:11px; color:var(--text-muted); margin-top:1px; }
.d-item-ctrl { display:flex; align-items:center; gap:8px; margin-top:7px; }
.qty-btn { width:24px; height:24px; border-radius:50%; background:var(--bg-elevated); border:1px solid var(--border); color:var(--text); font-size:15px; display:flex; align-items:center; justify-content:center; cursor:pointer; }
.qty-btn:hover { background:var(--primary-glow); border-color:var(--primary); }
.qty-num { font-size:13px; font-weight:700; min-width:18px; text-align:center; }
.d-item-price { font-size:14px; font-weight:700; color:var(--primary-light); }
.total-row { display:flex; justify-content:space-between; font-size:15px; font-weight:700; color:var(--text); }
.total-row .amt { color:var(--primary-light); }
.divider { height:1px; background:var(--border); margin:14px 0; }
.btn-block { width:100%; justify-content:center; padding:15px; font-size:15px; }
.empty-cart { text-align:center; padding:60px 0; color:var(--text-muted); }
.empty-cart .ei { font-size:60px; display:block; margin-bottom:14px; }
.empty-cart p { font-size:14px; line-height:1.6; }
</style>
