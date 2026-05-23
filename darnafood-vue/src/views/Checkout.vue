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

const form = ref({ wilaya: '', commune: '', address: '', phone: '', notes: '' })
const communeList = computed(() => COMMUNES[form.value.wilaya] || [])
const totalWithDelivery = computed(() => cart.total + 200)

function placeOrder() {
  if (!form.value.wilaya || !form.value.commune || !form.value.address || !form.value.phone) {
    window.showToast?.('⚠️ Veuillez remplir tous les champs obligatoires', 'error')
    return
  }
  router.push({ name: 'confirm' })
}
</script>

<template>
  <div class="page active" style="display:block;padding-top:68px;">
    <div style="max-width:1100px;margin:0 auto;padding:40px 28px;">
      <h1 style="font-size:26px;font-weight:800;margin-bottom:4px;">Finaliser la commande</h1>
      <p style="font-size:14px;color:var(--text-muted);margin-bottom:28px;">Vérifiez vos articles et votre adresse de livraison</p>
      <div class="checkout-layout">
        <div>
          <div class="form-card">
            <div class="form-card-title">📍 Adresse de livraison</div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Wilaya *</label>
                <select class="form-select" v-model="form.wilaya">
                  <option value="">Sélectionner...</option>
                  <option v-for="w in WILAYAS" :key="w" :value="w">{{ w }}</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Commune *</label>
                <select class="form-select" v-model="form.commune" :disabled="!form.wilaya">
                  <option value="">Sélectionner...</option>
                  <option v-for="c in communeList" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>
            </div>
            <div class="form-group"><label class="form-label">Adresse complète *</label><input class="form-input" v-model="form.address" placeholder="Numéro, rue, quartier..."></div>
            <div class="form-row">
              <div class="form-group"><label class="form-label">Téléphone *</label><input class="form-input" v-model="form.phone" placeholder="05 XX XX XX XX" type="tel"></div>
              <div class="form-group"><label class="form-label">Notes de livraison</label><textarea class="form-textarea" v-model="form.notes" placeholder="Instructions spéciales, interphone, étage..." style="height:45px;min-height:45px;"></textarea></div>
            </div>
          </div>
          <div class="cod-box">
            <span class="cod-icon">💵</span>
            <div><div class="cod-label">Paiement à la livraison</div><div class="cod-desc">Vous payez en espèces à la réception de votre commande</div></div>
            <span class="cod-check">✅</span>
          </div>
        </div>
        <div>
          <div class="summary-card">
            <div class="summary-card-title">🛒 Récapitulatif</div>
            <div v-for="item in cart.items" :key="item.id" class="sum-item">
              <div class="sum-name">{{ item.emoji }} {{ item.name }} <span>×{{ item.qty }}</span></div>
              <div class="sum-price">{{ dzd(item.price * item.qty) }}</div>
            </div>
            <div class="sum-item" style="border-top:1px solid var(--border);margin-top:4px;padding-top:12px;">
              <div class="sum-name">Sous-total</div>
              <div class="sum-price">{{ dzd(cart.total) }}</div>
            </div>
            <div class="sum-item">
              <div class="sum-name">Livraison</div>
              <div class="sum-price">{{ dzd(200) }}</div>
            </div>
            <div class="sum-item" style="font-size:16px;font-weight:800;">
              <div class="sum-name" style="font-size:15px;">Total</div>
              <div class="sum-price" style="color:var(--primary-light);font-size:17px;">{{ dzd(totalWithDelivery) }}</div>
            </div>
            <button class="btn-primary btn-block" style="margin-top:18px;" @click="placeOrder">✅ Confirmer la commande</button>
            <div class="secure-note">🔒 Paiement sécurisé · Livraison assurée</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
