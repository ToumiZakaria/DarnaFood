<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { dzd } from '../utils'
import { WILAYAS, COMMUNES } from '../data'

const router = useRouter()
const cart = useCartStore()
const auth = useAuthStore()

const form = ref({
  wilaya: '',
  commune: '',
  address: '',
  phone: '',
  notes: '',
})
const communeList = computed(() => {
  if (!form.value.wilaya) return []
  return COMMUNES[form.value.wilaya] || []
})
const totalWithDelivery = computed(() => cart.total + 200)

function placeOrder() {
  if (!form.value.wilaya || !form.value.commune || !form.value.address || !form.value.phone) {
    window.showToast('Veuillez remplir tous les champs obligatoires', 'error')
    return
  }
  router.push({ name: 'confirm' })
}
</script>

<template>
  <div class="main-content page-checkout">
    <div class="checkout-layout">
      <div class="co-form">
        <h1 class="co-title">Finaliser la commande</h1>
        <div class="co-subtitle">📍 Adresse de livraison</div>
        <div class="field-row">
          <div class="field-wrap half">
            <label>Wilaya <span class="req">*</span></label>
            <select v-model="form.wilaya" class="field-input">
              <option value="">Sélectionner</option>
              <option v-for="w in WILAYAS" :key="w" :value="w">{{ w }}</option>
            </select>
          </div>
          <div class="field-wrap half">
            <label>Commune <span class="req">*</span></label>
            <select v-model="form.commune" class="field-input" :disabled="!form.wilaya">
              <option value="">Sélectionner</option>
              <option v-for="c in communeList" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
        </div>
        <div class="field-wrap">
          <label>Adresse complète <span class="req">*</span></label>
          <input v-model="form.address" class="field-input" placeholder="Rue, numéro, bâtiment...">
        </div>
        <div class="field-row">
          <div class="field-wrap half">
            <label>Téléphone <span class="req">*</span></label>
            <input v-model="form.phone" class="field-input" placeholder="05 XX XX XX XX" type="tel">
          </div>
          <div class="field-wrap half">
            <label>Notes</label>
            <input v-model="form.notes" class="field-input" placeholder="Code, étage, instructions...">
          </div>
        </div>
      </div>
      <div class="co-summary">
        <div class="co-summary-card">
          <h3 class="co-rs-title">Récapitulatif</h3>
          <div v-for="item in cart.items" :key="item.id" class="ri-row">
            <div class="ri-icon-wrap" :style="{ background: item.gradient }">{{ item.emoji }}</div>
            <div class="ri-info">
              <div class="ri-name">{{ item.name }} <span class="ri-qty">x{{ item.qty }}</span></div>
              <div class="ri-kitchen">{{ item.kitchenName }}</div>
            </div>
            <div class="ri-price">{{ dzd(item.price * item.qty) }}</div>
          </div>
          <div class="divider"></div>
          <div class="ts-row"><span>Sous-total</span><span>{{ dzd(cart.total) }}</span></div>
          <div class="ts-row"><span>Livraison</span><span>{{ dzd(200) }}</span></div>
          <div class="ts-row total"><span>Total</span><span>{{ dzd(totalWithDelivery) }}</span></div>
          <button class="btn-primary btn-block" style="margin-top:18px;justify-content:center;padding:14px;" @click="placeOrder">✅ Confirmer la commande</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-content { min-height:calc(100vh - 68px); }
.checkout-layout { display:grid; grid-template-columns:1fr 380px; gap:32px; max-width:1100px; margin:0 auto; padding:40px 28px; }
.co-form { }
.co-title { font-size:26px; font-weight:800; margin-bottom:4px; }
.co-subtitle { font-size:14px; color:var(--text-muted); margin-bottom:18px; margin-top:20px; font-weight:600; }
.field-row { display:flex; gap:14px; }
.field-wrap { margin-bottom:16px; }
.field-wrap.half { flex:1; }
.field-wrap label { display:block; font-size:12px; font-weight:700; color:var(--text-muted); margin-bottom:6px; text-transform:uppercase; letter-spacing:.5px; }
.req { color:var(--danger); }
.field-input { width:100%; background:var(--bg-card); border:1px solid var(--border); color:var(--text); padding:12px 14px; border-radius:var(--r-sm); font-size:14px; outline:none; }
.field-input:focus { border-color:var(--primary); }
.field-input:disabled { opacity:.4; cursor:not-allowed; }
.co-summary-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--r); padding:24px; position:sticky; top:100px; }
.co-rs-title { font-size:16px; font-weight:700; margin-bottom:16px; }
.ri-row { display:flex; gap:10px; align-items:center; padding:10px 0; border-bottom:1px solid var(--border); }
.ri-icon-wrap { width:36px; height:36px; border-radius:var(--r-sm); display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
.ri-info { flex:1; }
.ri-name { font-size:13px; font-weight:600; }
.ri-qty { color:var(--text-muted); font-weight:400; }
.ri-kitchen { font-size:10px; color:var(--text-muted); }
.ri-price { font-size:13px; font-weight:700; }
.divider { height:1px; background:var(--border); margin:12px 0; }
.ts-row { display:flex; justify-content:space-between; font-size:14px; color:var(--text-muted); padding:3px 0; }
.ts-row.total { font-size:18px; font-weight:800; color:var(--text); }
.ts-row.total span:last-child { color:var(--primary-light); }
.btn-block { width:100%; }
@media(max-width:850px){.checkout-layout{grid-template-columns:1fr;}.co-summary-card{position:static;}}
</style>
