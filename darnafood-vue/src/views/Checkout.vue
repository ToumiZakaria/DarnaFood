<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { apiCreateOrder } from '../api'
import { dzd, toast } from '../utils'
import { WILAYAS, COMMUNES } from '../data'
import { ShoppingCart, ChevronLeft, MapPin, Phone, FileText, CreditCard } from '@lucide/vue'

const router = useRouter()
const cart = useCartStore()
const auth = useAuthStore()
const loading = ref(false)

const form = ref({
  wilaya: auth.user?.wilaya || '',
  commune: auth.user?.commune || '',
  address: auth.user?.address || '',
  phone: auth.user?.phone || '',
  notes: '',
})
const communeList = computed(() => COMMUNES[form.value.wilaya] || [])
const totalWithDelivery = computed(() => cart.total + 200)

async function placeOrder() {
  if (!form.value.wilaya || !form.value.commune || !form.value.address || !form.value.phone) {
    toast('Veuillez remplir tous les champs obligatoires', 'error')
    return
  }
  if (!cart.kitchenId) {
    toast('Votre panier est vide', 'error')
    return
  }
  loading.value = true
  try {
    const data = await apiCreateOrder({
      cookId: cart.kitchenId,
      clientName: (auth.user?.firstName || '') + ' ' + (auth.user?.lastName || ''),
      clientPhone: form.value.phone,
      wilaya: form.value.wilaya,
      commune: form.value.commune,
      address: form.value.address,
      notes: form.value.notes,
      items: cart.items.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, emoji: i.emoji })),
      subtotal: cart.total,
      deliveryFee: 200,
      total: totalWithDelivery.value,
    })
    if (data.success) {
      router.push({ name: 'confirm', state: { order: data.order } })
    } else {
      toast(data.error || 'Erreur lors de la création de la commande', 'error')
    }
  } catch {
    toast('Erreur réseau. Veuillez réessayer.', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="checkout-page">
    <div class="checkout-inner">
      <button class="back-btn" @click="router.back()"><ChevronLeft :size="18" /> Retour</button>
      <h1 class="checkout-title">Finaliser la commande</h1>
      <p class="checkout-sub">Vérifiez vos articles et votre adresse de livraison</p>

      <div class="checkout-layout">
        <div class="checkout-left">
          <!-- Cart items -->
          <div class="checkout-card">
            <div class="checkout-card-title"><ShoppingCart :size="18" /> Articles</div>
            <div v-for="item in cart.items" :key="item.id" class="checkout-item">
              <div class="checkout-item-emoji">{{ item.emoji || '🍽️' }}</div>
              <div class="checkout-item-info">
                <div class="checkout-item-name">{{ item.name }}</div>
                <div class="checkout-item-qty">x{{ item.qty }}</div>
              </div>
              <div class="checkout-item-price">{{ dzd(item.price * item.qty) }}</div>
            </div>
          </div>

          <!-- Address form -->
          <div class="checkout-card">
            <div class="checkout-card-title"><MapPin :size="18" /> Adresse de livraison</div>
            <div class="checkout-form-row">
              <div class="checkout-field">
                <label class="checkout-label">Wilaya</label>
                <select v-model="form.wilaya" class="checkout-select">
                  <option value="">Sélectionner...</option>
                  <option v-for="w in WILAYAS" :key="w" :value="w">{{ w }}</option>
                </select>
              </div>
              <div class="checkout-field">
                <label class="checkout-label">Commune</label>
                <select v-model="form.commune" class="checkout-select" :disabled="!form.wilaya">
                  <option value="">Sélectionner...</option>
                  <option v-for="c in communeList" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>
            </div>
            <div class="checkout-field">
              <label class="checkout-label">Adresse complète</label>
              <input v-model="form.address" class="checkout-input" placeholder="Numéro, rue, quartier..." />
            </div>
            <div class="checkout-form-row">
              <div class="checkout-field">
                <label class="checkout-label"><Phone :size="12" /> Téléphone</label>
                <input v-model="form.phone" class="checkout-input" placeholder="05 XX XX XX XX" type="tel" />
              </div>
              <div class="checkout-field">
                <label class="checkout-label"><FileText :size="12" /> Notes</label>
                <input v-model="form.notes" class="checkout-input" placeholder="Instructions spéciales..." />
              </div>
            </div>
          </div>

          <!-- Payment -->
          <div class="checkout-card payment">
            <div class="checkout-card-title"><CreditCard :size="18" /> Paiement</div>
            <div class="payment-method">
              <div class="payment-radio checked"></div>
              <div>
                <div class="payment-name">Paiement à la livraison</div>
                <div class="payment-desc">Vous payez en espèces à la réception</div>
              </div>
            </div>
          </div>
        </div>

        <div class="checkout-right">
          <div class="summary-card">
            <div class="summary-title">Récapitulatif</div>
            <div class="summary-row">
              <span>Sous-total</span>
              <span>{{ dzd(cart.total) }}</span>
            </div>
            <div class="summary-row">
              <span>Livraison</span>
              <span>{{ dzd(200) }}</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-row total">
              <span>Total</span>
              <span class="total-amt">{{ dzd(totalWithDelivery) }}</span>
            </div>
            <button class="order-btn" :disabled="loading" @click="placeOrder">
              <span v-if="loading" class="btn-spinner"></span>
              <span v-else>Confirmer la commande</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkout-page { min-height:100vh; padding-top:64px; background:#F8F7F4; }
.checkout-inner { max-width:1000px; margin:0 auto; padding:32px 24px 80px; }
.back-btn { display:inline-flex; align-items:center; gap:6px; background:none; border:none; color:#6B7280; font-size:13px; font-weight:500; cursor:pointer; margin-bottom:16px; transition:.15s; }
.back-btn:hover { color:#E8813A; }
.checkout-title { font-size:26px; font-weight:800; color:#1A1A1A; margin:0 0 4px; }
.checkout-sub { font-size:14px; color:#6B7280; margin:0 0 28px; }
.checkout-layout { display:grid; grid-template-columns:1fr 340px; gap:24px; align-items:start; }
.checkout-left { display:flex; flex-direction:column; gap:16px; }
.checkout-card { background:#fff; border:1px solid #E5E7EB; border-radius:14px; padding:22px; }
.checkout-card.payment { padding:16px 22px; }
.checkout-card-title { display:flex; align-items:center; gap:8px; font-size:15px; font-weight:700; color:#1A1A1A; margin-bottom:16px; }
.checkout-item { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid #F3F4F6; }
.checkout-item:last-child { border-bottom:none; }
.checkout-item-emoji { font-size:22px; }
.checkout-item-info { flex:1; }
.checkout-item-name { font-size:13px; font-weight:600; color:#1A1A1A; }
.checkout-item-qty { font-size:11px; color:#9CA3AF; }
.checkout-item-price { font-size:14px; font-weight:700; color:#E8813A; }
.checkout-form-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.checkout-field { margin-bottom:12px; }
.checkout-label { display:flex; align-items:center; gap:4px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:#6B7280; margin-bottom:6px; }
.checkout-input, .checkout-select { width:100%; background:#F9FAFB; border:1px solid #E5E7EB; padding:11px 14px; border-radius:10px; font-size:14px; color:#1A1A1A; outline:none; transition:.15s; }
.checkout-input:focus, .checkout-select:focus { border-color:#E8813A; box-shadow:0 0 0 3px rgba(232,129,58,.1); }
.checkout-select { cursor:pointer; appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 12px center; background-size:14px; }
.payment-method { display:flex; align-items:center; gap:12px; }
.payment-radio { width:20px; height:20px; border-radius:50%; border:2px solid #E8813A; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.payment-radio.checked::after { content:''; width:10px; height:10px; border-radius:50%; background:#E8813A; }
.payment-name { font-size:14px; font-weight:600; color:#1A1A1A; }
.payment-desc { font-size:12px; color:#6B7280; }
.summary-card { background:#fff; border:1px solid #E5E7EB; border-radius:14px; padding:24px; position:sticky; top:88px; }
.summary-title { font-size:17px; font-weight:700; color:#1A1A1A; margin-bottom:18px; }
.summary-row { display:flex; justify-content:space-between; align-items:center; padding:6px 0; font-size:14px; color:#6B7280; }
.summary-row.total { font-size:16px; font-weight:800; color:#1A1A1A; padding:10px 0; }
.total-amt { color:#E8813A; font-size:18px; }
.summary-divider { height:1px; background:#F3F4F6; margin:8px 0; }
.order-btn { display:flex; align-items:center; justify-content:center; width:100%; background:linear-gradient(135deg,#E8813A,#D4702A); color:#fff; border:none; padding:14px; border-radius:12px; font-size:15px; font-weight:700; cursor:pointer; transition:.2s; margin-top:16px; box-shadow:0 4px 14px rgba(232,129,58,.25); }
.order-btn:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(232,129,58,.35); }
.order-btn:disabled { opacity:.5; cursor:not-allowed; transform:none; box-shadow:none; }
.btn-spinner { width:20px; height:20px; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:spin .6s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
@media(max-width:768px) { .checkout-layout { grid-template-columns:1fr; } .checkout-form-row { grid-template-columns:1fr; } }
</style>