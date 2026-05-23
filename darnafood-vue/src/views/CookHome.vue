<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { MOCK_DASH_ORDERS } from '../data'
import { dzd } from '../utils'
import {
  ShoppingBag, TrendingUp, Star, Users, ClipboardList, UtensilsCrossed, Settings, Eye, Bell, Lightbulb, ArrowRight
} from '@lucide/vue'

const router = useRouter()
const auth = useAuthStore()
const kitchenOpen = ref(true)
const orders = ref(MOCK_DASH_ORDERS)
const pendingOrder = computed(() => orders.value.find(o => o.status === 'pending'))

const stats = [
  { icon: ShoppingBag, value: '8', label: 'Commandes aujourd\'hui', color: '#3B82F6', bg: 'rgba(59,130,246,.12)' },
  { icon: TrendingUp, value: dzd(4500), label: 'Revenus du jour', color: '#22C55E', bg: 'rgba(34,197,94,.12)' },
  { icon: Star, value: '4.9', label: 'Note moyenne', color: '#EAB308', bg: 'rgba(234,179,8,.12)' },
  { icon: Users, value: '18', label: 'Clients fidèles', color: '#E8813A', bg: 'rgba(232,129,58,.12)' },
]

const actions = [
  { icon: ClipboardList, label: 'Voir les commandes', desc: 'Gérez les commandes en cours', route: '/dashboard', tab: 'orders' },
  { icon: UtensilsCrossed, label: 'Gérer mon menu', desc: 'Ajoutez ou modifiez vos plats', route: '/dashboard', tab: 'menu' },
  { icon: Settings, label: 'Paramètres', desc: 'Modifiez vos informations', route: '/dashboard', tab: 'settings' },
  { icon: Eye, label: 'Voir ma page publique', desc: 'Ce que voient vos clients', route: 'profile' },
]

function go(action) {
  if (action.route === '/dashboard') {
    router.push({ name: 'dashboard' })
    localStorage.setItem('df_dash_tab', action.tab)
  } else if (action.route === 'profile') {
    const id = auth.user?._id || 'new'
    router.push({ name: 'cook-public-profile', params: { id } })
  } else {
    router.push(action.route)
  }
}

function acceptOrder(id) {
  const o = orders.value.find(x => x.id === id)
  if (o) o.status = 'confirmed'
}
</script>

<template>
  <div class="cook-home">
    <div class="ch-grid">
      <!-- Top: Greeting + Kitchen Status -->
      <div class="ch-top">
        <div class="ch-greeting">
          <div class="ch-avatar">{{ (auth.user?.firstName || 'C').charAt(0) }}</div>
          <div>
            <h1 class="ch-title">Bonjour, {{ auth.user?.firstName || 'Chef' }} !</h1>
            <p class="ch-sub">{{ new Date().toLocaleDateString('fr-DZ', { weekday:'long', year:'numeric', month:'long', day:'numeric' }) }}</p>
          </div>
        </div>
        <div class="ch-status">
          <div class="ch-status-info">
            <div class="ch-status-label">Votre cuisine</div>
            <div class="ch-status-val" :class="{ open: kitchenOpen }">{{ kitchenOpen ? 'Ouverte' : 'Fermée' }} aux commandes</div>
          </div>
          <label class="ch-toggle">
            <input type="checkbox" v-model="kitchenOpen">
            <span class="ch-toggle-slider"></span>
          </label>
        </div>
      </div>

      <!-- KPIs -->
      <div class="ch-kpis">
        <div v-for="s in stats" :key="s.label" class="ch-kpi">
          <div class="ch-kpi-icon" :style="{ background: s.bg, color: s.color }">
            <component :is="s.icon" :size="20" />
          </div>
          <div class="ch-kpi-val">{{ s.value }}</div>
          <div class="ch-kpi-label">{{ s.label }}</div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="ch-actions">
        <button v-for="a in actions" :key="a.label" class="ch-action" @click="go(a)">
          <div class="ch-action-icon">
            <component :is="a.icon" :size="22" />
          </div>
          <div class="ch-action-body">
            <div class="ch-action-label">{{ a.label }}</div>
            <div class="ch-action-desc">{{ a.desc }}</div>
          </div>
          <ArrowRight :size="16" class="ch-action-arrow" />
        </button>
      </div>

      <!-- Bottom: Order Alert + Tip -->
      <div class="ch-bottom">
        <div v-if="pendingOrder" class="ch-alert">
          <Bell :size="18" class="ch-alert-icon" />
          <div class="ch-alert-body">
            <div class="ch-alert-title">Nouvelle commande</div>
            <div class="ch-alert-order">
              <span class="ch-alert-id">{{ pendingOrder.id }}</span>
              <span class="ch-alert-dot">·</span>
              <span>{{ pendingOrder.client }}</span>
              <span class="ch-alert-dot">·</span>
              <span class="ch-alert-price">{{ dzd(pendingOrder.total) }}</span>
            </div>
          </div>
          <div class="ch-alert-actions">
            <button class="ch-alert-btn primary" @click="acceptOrder(pendingOrder.id)">Accepter</button>
            <button class="ch-alert-btn secondary" @click="go(actions[0])">Voir détails</button>
          </div>
        </div>
        <div class="ch-tip">
          <Lightbulb :size="18" class="ch-tip-icon" />
          <div class="ch-tip-text">Ajoutez une photo à vos plats pour attirer plus de clients</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cook-home {
  height: 100vh;
  background: #0A0A0A;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 32px;
}
.ch-grid {
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  max-height: 700px;
}

/* Top row */
.ch-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.ch-greeting {
  display: flex;
  align-items: center;
  gap: 14px;
}
.ch-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #E8813A;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}
.ch-title {
  font-size: 22px;
  font-weight: 800;
  color: #FAFAFA;
  margin: 0;
  line-height: 1.2;
}
.ch-sub {
  font-size: 12px;
  color: #A1A1AA;
  margin: 2px 0 0;
}
.ch-status {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #141414;
  border: 1px solid #262626;
  border-radius: 12px;
  padding: 12px 20px;
}
.ch-status-label {
  font-size: 11px;
  color: #A1A1AA;
  text-transform: uppercase;
  letter-spacing: .5px;
}
.ch-status-val {
  font-size: 14px;
  font-weight: 700;
  color: #A1A1AA;
  margin-top: 1px;
}
.ch-status-val.open {
  color: #22C55E;
}
.ch-toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
}
.ch-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}
.ch-toggle-slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: #333;
  border-radius: 24px;
  transition: .3s;
}
.ch-toggle-slider::before {
  content: '';
  position: absolute;
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background: #fff;
  border-radius: 50%;
  transition: .3s;
}
.ch-toggle input:checked + .ch-toggle-slider {
  background: #22C55E;
}
.ch-toggle input:checked + .ch-toggle-slider::before {
  transform: translateX(20px);
}

/* KPIs */
.ch-kpis {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}
.ch-kpi {
  background: #141414;
  border: 1px solid #262626;
  border-radius: 12px;
  padding: 18px 20px;
}
.ch-kpi-icon {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}
.ch-kpi-val {
  font-size: 22px;
  font-weight: 800;
  color: #FAFAFA;
}
.ch-kpi-label {
  font-size: 11px;
  color: #A1A1AA;
  margin-top: 2px;
}

/* Quick Actions */
.ch-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.ch-action {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #141414;
  border: 1px solid #262626;
  border-radius: 12px;
  padding: 16px 18px;
  cursor: pointer;
  transition: all .2s;
  text-align: left;
  width: 100%;
}
.ch-action:hover {
  border-color: #E8813A;
  background: rgba(232,129,58,.05);
}
.ch-action-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: rgba(232,129,58,.1);
  color: #E8813A;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.ch-action-body {
  flex: 1;
  min-width: 0;
}
.ch-action-label {
  font-size: 14px;
  font-weight: 700;
  color: #FAFAFA;
}
.ch-action-desc {
  font-size: 11px;
  color: #A1A1AA;
  margin-top: 1px;
}
.ch-action-arrow {
  color: #A1A1AA;
  flex-shrink: 0;
  transition: .2s;
}
.ch-action:hover .ch-action-arrow {
  color: #E8813A;
  transform: translateX(2px);
}

/* Bottom */
.ch-bottom {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 14px;
}
.ch-alert {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(232,129,58,.08);
  border: 1px solid rgba(232,129,58,.25);
  border-radius: 12px;
  padding: 14px 18px;
}
.ch-alert-icon {
  color: #E8813A;
  flex-shrink: 0;
}
.ch-alert-body {
  flex: 1;
  min-width: 0;
}
.ch-alert-title {
  font-size: 12px;
  font-weight: 700;
  color: #E8813A;
  text-transform: uppercase;
  letter-spacing: .5px;
  margin-bottom: 4px;
}
.ch-alert-order {
  font-size: 13px;
  color: #FAFAFA;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.ch-alert-id {
  font-family: monospace;
  color: #E8813A;
  font-size: 12px;
}
.ch-alert-dot {
  color: #A1A1AA;
}
.ch-alert-price {
  color: #22C55E;
}
.ch-alert-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
.ch-alert-btn {
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all .2s;
}
.ch-alert-btn.primary {
  background: #E8813A;
  color: #fff;
  border-color: #E8813A;
}
.ch-alert-btn.primary:hover {
  background: #d6732e;
  border-color: #d6732e;
}
.ch-alert-btn.secondary {
  background: transparent;
  color: #A1A1AA;
  border-color: #333;
}
.ch-alert-btn.secondary:hover {
  border-color: #E8813A;
  color: #E8813A;
}
.ch-tip {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(234,179,8,.06);
  border: 1px solid rgba(234,179,8,.15);
  border-radius: 12px;
  padding: 14px 18px;
}
.ch-tip-icon {
  color: #EAB308;
  flex-shrink: 0;
}
.ch-tip-text {
  font-size: 12px;
  color: #EAB308;
  line-height: 1.5;
}

/* Responsive */
@media(max-width: 768px) {
  .cook-home {
    padding: 16px;
    align-items: flex-start;
    height: auto;
    min-height: 100vh;
  }
  .ch-grid {
    max-height: none;
    gap: 14px;
  }
  .ch-top {
    flex-direction: column;
    align-items: stretch;
  }
  .ch-status {
    justify-content: space-between;
  }
  .ch-kpis {
    grid-template-columns: 1fr 1fr;
  }
  .ch-actions {
    grid-template-columns: 1fr;
  }
  .ch-bottom {
    grid-template-columns: 1fr;
  }
}
</style>
