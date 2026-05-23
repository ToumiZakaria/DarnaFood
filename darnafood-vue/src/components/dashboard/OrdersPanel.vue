<script setup>
import { ref, computed } from 'vue'
import { MOCK_DASH_ORDERS } from '../../data'
import { dzd } from '../../utils'
import {
  Search, Download, Filter, X, Clock, CheckCircle, Truck, ChefHat, Phone, Ban, ChevronLeft, ChevronRight
} from '@lucide/vue'

const orders = ref(MOCK_DASH_ORDERS.map(o => ({ ...o })))
const filterTab = ref('toutes')
const searchQuery = ref('')
const selectedOrder = ref(null)
const drawerOpen = ref(false)
const page = ref(1)
const perPage = 10

const statusFilterTabs = [
  { id: 'toutes', label: 'Toutes' },
  { id: 'pending', label: 'Nouvelles' },
  { id: 'preparing', label: 'En prep' },
  { id: 'ready', label: 'Prêtes' },
  { id: 'delivered', label: 'Livrées' },
]

const filtered = computed(() => {
  let list = orders.value
  if (filterTab.value !== 'toutes') list = list.filter(o => o.status === filterTab.value)
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(o => o.id.toLowerCase().includes(q) || o.client.toLowerCase().includes(q))
  }
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage)))
const paged = computed(() => filtered.value.slice((page.value - 1) * perPage, page.value * perPage))

function openDrawer(o) {
  selectedOrder.value = o
  drawerOpen.value = true
}
function closeDrawer() {
  drawerOpen.value = false
  selectedOrder.value = null
}
function changeStatus(status) {
  if (selectedOrder.value) selectedOrder.value.status = status
}

const statusSteps = ['pending', 'confirmed', 'preparing', 'ready', 'delivered']
const statusLabels = { pending:'Nouvelle', confirmed:'Confirmée', preparing:'En préparation', ready:'Prête', delivered:'Livrée' }
const currentStep = computed(() => selectedOrder.value ? statusSteps.indexOf(selectedOrder.value.status) : 0)
</script>

<template>
  <div class="orders-page">
    <div class="op-header">
      <h1 class="op-title">Commandes</h1>
      <div class="op-actions">
        <div class="search-wrap">
          <Search :size="16" class="search-icon" />
          <input v-model="searchQuery" class="search-input" placeholder="Rechercher une commande...">
        </div>
        <button class="btn-outline-sm"><Download :size="15" /> Exporter</button>
      </div>
    </div>

    <div class="filter-tabs">
      <button v-for="t in statusFilterTabs" :key="t.id" class="filter-tab" :class="{ active: filterTab === t.id }" @click="filterTab = t.id; page = 1">
        {{ t.label }}
      </button>
    </div>

    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr><th>ID</th><th>Client</th><th>Plats</th><th>Total</th><th>Statut</th></tr>
        </thead>
        <tbody>
          <tr v-for="o in paged" :key="o.id" class="table-row" @click="openDrawer(o)">
            <td class="cell-id">{{ o.id }}</td>
            <td>{{ o.client }}</td>
            <td>{{ o.items }}</td>
            <td class="cell-price">{{ dzd(o.total) }}</td>
            <td><span class="status-pill" :class="o.status">{{ statusLabels[o.status] || o.status }}</span></td>
          </tr>
        </tbody>
      </table>
      <div v-if="!paged.length" class="empty-state">Aucune commande trouvée</div>
    </div>

    <div class="pagination">
      <span class="pag-total">{{ filtered.length }} commande{{ filtered.length > 1 ? 's' : '' }} total</span>
      <div class="pag-ctrl">
        <button class="pag-btn" :disabled="page <= 1" @click="page--"><ChevronLeft :size="14" /></button>
        <span class="pag-info">{{ page }} / {{ totalPages }}</span>
        <button class="pag-btn" :disabled="page >= totalPages" @click="page++"><ChevronRight :size="14" /></button>
      </div>
    </div>

    <Teleport to="body">
      <div class="drawer-overlay" :class="{ open: drawerOpen }" @click="closeDrawer"></div>
      <div class="order-drawer" :class="{ open: drawerOpen }">
        <div v-if="selectedOrder" class="drawer-content">
          <div class="drawer-head">
            <div>
              <span class="drawer-id">{{ selectedOrder.id }}</span>
              <span class="status-pill" :class="selectedOrder.status">{{ statusLabels[selectedOrder.status] || selectedOrder.status }}</span>
            </div>
            <button class="drawer-close" @click="closeDrawer"><X :size="18" /></button>
          </div>

          <div class="timeline">
            <div v-for="(s,i) in statusSteps" :key="s" class="tl-step" :class="{ done: i <= currentStep, active: i === currentStep }">
              <div class="tl-dot">
                <Clock v-if="i===0" :size="12" />
                <CheckCircle v-else-if="i===1" :size="12" />
                <ChefHat v-else-if="i===2" :size="12" />
                <Truck v-else-if="i===3" :size="12" />
                <CheckCircle v-else :size="12" />
              </div>
              <div class="tl-info">
                <div class="tl-label">{{ statusLabels[s] }}</div>
                <div class="tl-time" v-if="i === currentStep">En cours</div>
                <div class="tl-time" v-else-if="i < currentStep">Terminé</div>
              </div>
            </div>
          </div>

          <div class="drawer-section">
            <h4>Client</h4>
            <div class="d-customer">
              <div class="dc-avatar">{{ selectedOrder.client.charAt(0) }}</div>
              <div>
                <div class="dc-name">{{ selectedOrder.client }}</div>
                <div class="dc-contact">0550 XX XX XX</div>
              </div>
            </div>
          </div>

          <div class="drawer-section">
            <h4>Articles</h4>
            <div class="d-items">
              <div class="d-item">
                <span>{{ selectedOrder.items }}</span>
                <span class="d-item-qty">×1</span>
                <span class="d-item-price">{{ dzd(selectedOrder.total) }}</span>
              </div>
            </div>
            <div class="d-total">
              <span>Total</span>
              <span>{{ dzd(selectedOrder.total) }}</span>
            </div>
          </div>

          <div class="drawer-actions">
            <button v-if="selectedOrder.status === 'pending'" class="btn-primary-sm" @click="changeStatus('confirmed')"><CheckCircle :size="14" /> Accepter</button>
            <button v-if="selectedOrder.status === 'confirmed'" class="btn-primary-sm prep" @click="changeStatus('preparing')"><ChefHat :size="14" /> En préparation</button>
            <button v-if="selectedOrder.status === 'preparing'" class="btn-primary-sm ready" @click="changeStatus('ready')"><Truck :size="14" /> Marquer prête</button>
            <button v-if="selectedOrder.status === 'ready'" class="btn-outline-sm" @click="changeStatus('delivered')"><CheckCircle :size="14" /> Livrée</button>
            <button class="btn-outline-sm" style="color:#3B82F6;border-color:rgba(59,130,246,.3);"><Phone :size="14" /> Contacter</button>
            <button class="btn-outline-sm" style="color:#EF4444;border-color:rgba(239,68,68,.3);"><Ban :size="14" /> Annuler</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.orders-page { max-width:1200px; }
.op-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:12px; }
.op-title { font-size:24px; font-weight:800; color:#FAFAFA; margin:0; }
.op-actions { display:flex; align-items:center; gap:10px; }
.search-wrap { position:relative; }
.search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#A1A1AA; }
.search-input { background:#141414; border:1px solid #262626; border-radius:8px; color:#FAFAFA; padding:9px 12px 9px 36px; font-size:13px; width:220px; outline:none; }
.search-input:focus { border-color:#E8813A; }
.btn-outline-sm { display:inline-flex; align-items:center; gap:6px; background:transparent; border:1px solid #262626; color:#A1A1AA; padding:8px 14px; border-radius:8px; font-size:12px; font-weight:600; cursor:pointer; }
.btn-outline-sm:hover { border-color:#E8813A; color:#FAFAFA; }

.filter-tabs { display:flex; gap:4px; margin-bottom:16px; }
.filter-tab { background:none; border:1px solid transparent; color:#A1A1AA; padding:7px 16px; border-radius:8px; font-size:13px; font-weight:500; cursor:pointer; }
.filter-tab:hover { color:#FAFAFA; }
.filter-tab.active { background:rgba(232,129,58,.12); color:#E8813A; border-color:rgba(232,129,58,.3); }

.table-card { background:#141414; border:1px solid #262626; border-radius:12px; overflow:hidden; }
.data-table { width:100%; border-collapse:collapse; }
.data-table th { text-align:left; font-size:11px; font-weight:700; color:#A1A1AA; text-transform:uppercase; letter-spacing:.5px; padding:12px 16px; border-bottom:1px solid #262626; }
.data-table td { padding:14px 16px; font-size:13px; color:#FAFAFA; border-bottom:1px solid #262626; }
.table-row { cursor:pointer; transition:background .15s; }
.table-row:hover { background:rgba(255,255,255,.03); }
.table-row:last-child td { border-bottom:none; }
.cell-id { font-family:monospace; font-size:12px; color:#E8813A; font-weight:600; }
.cell-price { font-weight:700; color:#22C55E; }
.status-pill { display:inline-block; padding:3px 10px; border-radius:999px; font-size:11px; font-weight:600; }
.status-pill.pending { background:rgba(234,179,8,.12); color:#EAB308; }
.status-pill.confirmed { background:rgba(59,130,246,.12); color:#3B82F6; }
.status-pill.preparing { background:rgba(59,130,246,.12); color:#3B82F6; }
.status-pill.ready { background:rgba(34,197,94,.12); color:#22C55E; }
.status-pill.delivered { background:rgba(255,255,255,.05); color:#A1A1AA; }
.empty-state { padding:40px; text-align:center; color:#A1A1AA; font-size:14px; }

.pagination { display:flex; align-items:center; justify-content:space-between; margin-top:16px; }
.pag-total { font-size:12px; color:#A1A1AA; }
.pag-ctrl { display:flex; align-items:center; gap:8px; }
.pag-btn { width:30px; height:30px; border-radius:6px; background:#141414; border:1px solid #262626; color:#A1A1AA; display:flex; align-items:center; justify-content:center; cursor:pointer; }
.pag-btn:hover:not(:disabled) { border-color:#E8813A; color:#E8813A; }
.pag-btn:disabled { opacity:.3; cursor:not-allowed; }
.pag-info { font-size:12px; color:#A1A1AA; min-width:50px; text-align:center; }

/* Drawer */
.drawer-overlay { position:fixed; inset:0; z-index:200; background:rgba(0,0,0,.6); opacity:0; pointer-events:none; transition:opacity .25s; }
.drawer-overlay.open { opacity:1; pointer-events:all; }
.order-drawer { position:fixed; top:0; right:0; bottom:0; z-index:201; width:420px; max-width:100vw; background:#141414; border-left:1px solid #262626; transform:translateX(100%); transition:transform .3s; display:flex; flex-direction:column; }
.order-drawer.open { transform:translateX(0); }
.drawer-content { flex:1; overflow-y:auto; padding:24px; }
.drawer-head { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:20px; }
.drawer-head > div { display:flex; align-items:center; gap:10px; }
.drawer-id { font-family:monospace; font-size:16px; font-weight:700; color:#E8813A; }
.drawer-close { width:32px; height:32px; border-radius:8px; background:rgba(255,255,255,.05); border:1px solid #262626; color:#A1A1AA; display:flex; align-items:center; justify-content:center; cursor:pointer; }
.drawer-close:hover { color:#FAFAFA; }

.timeline { display:flex; flex-direction:column; gap:8px; margin-bottom:24px; padding:16px; background:rgba(255,255,255,.02); border-radius:10px; }
.tl-step { display:flex; align-items:center; gap:10px; }
.tl-dot { width:28px; height:28px; border-radius:50%; background:#262626; color:#A1A1AA; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.tl-step.done .tl-dot { background:rgba(34,197,94,.15); color:#22C55E; }
.tl-step.active .tl-dot { background:rgba(232,129,58,.15); color:#E8813A; box-shadow:0 0 0 3px rgba(232,129,58,.2); }
.tl-step.active .tl-label { color:#E8813A; }
.tl-label { font-size:13px; font-weight:600; color:#FAFAFA; }
.tl-time { font-size:11px; color:#A1A1AA; }

.drawer-section { margin-bottom:20px; }
.drawer-section h4 { font-size:11px; font-weight:700; color:#A1A1AA; text-transform:uppercase; letter-spacing:.5px; margin:0 0 10px; }
.d-customer { display:flex; align-items:center; gap:10px; }
.dc-avatar { width:36px; height:36px; border-radius:50%; background:rgba(232,129,58,.15); color:#E8813A; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; }
.dc-name { font-size:14px; font-weight:600; color:#FAFAFA; }
.dc-contact { font-size:12px; color:#A1A1AA; }
.d-items { margin-bottom:12px; }
.d-item { display:flex; align-items:center; gap:8px; padding:8px 0; border-bottom:1px solid #262626; font-size:13px; color:#FAFAFA; }
.d-item span:first-child { flex:1; }
.d-item-qty { color:#A1A1AA; font-size:12px; }
.d-item-price { color:#22C55E; font-weight:600; }
.d-total { display:flex; justify-content:space-between; font-size:15px; font-weight:700; color:#FAFAFA; padding-top:8px; }
.d-total span:last-child { color:#E8813A; }
.drawer-actions { display:flex; flex-wrap:wrap; gap:8px; margin-top:20px; padding-top:16px; border-top:1px solid #262626; }
.btn-primary-sm { display:inline-flex; align-items:center; gap:6px; background:#E8813A; color:#fff; border:none; padding:9px 16px; border-radius:8px; font-size:12px; font-weight:600; cursor:pointer; }
.btn-primary-sm:hover { filter:brightness(1.1); }
.btn-primary-sm.prep { background:rgba(234,179,8,.9); color:#0A0A0A; }
.btn-primary-sm.ready { background:#22C55E; }
</style>
