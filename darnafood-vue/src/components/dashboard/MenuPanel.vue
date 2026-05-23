<script setup>
import { ref, computed } from 'vue'
import {
  Plus, UtensilsCrossed, Edit3, Trash2, Image, X, Tag, DollarSign, Grid3X3, List
} from '@lucide/vue'

const activeCat = ref('Tous')
const viewMode = ref('grid')
const showModal = ref(false)
const editDish = ref(null)

const categoryTabs = ['Tous', 'Plats', 'Entrées', 'Desserts', 'Boissons']

const dishes = ref([
  { id: 1, name: 'Couscous Royal', cat: 'Plats', price: 1200, available: true, desc: 'Couscous aux légumes et poulet', emoji: '🍛' },
  { id: 2, name: 'Harira', cat: 'Entrées', price: 400, available: true, desc: 'Soupe algérienne traditionnelle', emoji: '🍲' },
  { id: 3, name: 'Tagine Zitoune', cat: 'Plats', price: 1200, available: true, desc: 'Tagine aux olives et poulet', emoji: '🥘' },
  { id: 4, name: 'Makrout', cat: 'Desserts', price: 600, available: false, desc: 'Pâtisserie à la semoule et miel', emoji: '🍯' },
  { id: 5, name: 'Chorba Frik', cat: 'Entrées', price: 350, available: true, desc: 'Soupe frik traditionnelle', emoji: '🥣' },
  { id: 6, name: 'Jus Orange', cat: 'Boissons', price: 200, available: true, desc: 'Jus d\'orange frais', emoji: '🧃' },
])

const filtered = computed(() => {
  if (activeCat.value === 'Tous') return dishes.value
  return dishes.value.filter(d => d.cat === activeCat.value)
})

const form = ref({ name: '', cat: 'Plats', price: '', desc: '', emoji: '🍽️' })

function openAdd() {
  editDish.value = null
  form.value = { name: '', cat: 'Plats', price: '', desc: '', emoji: '🍽️' }
  showModal.value = true
}
function openEdit(d) {
  editDish.value = d
  form.value = { name: d.name, cat: d.cat, price: d.price, desc: d.desc, emoji: d.emoji }
  showModal.value = true
}
function closeModal() { showModal.value = false }
function saveDish() {
  if (!form.value.name || !form.value.price) return
  if (editDish.value) {
    Object.assign(editDish.value, { ...form.value, price: Number(form.value.price) })
  } else {
    dishes.value.push({ id: Date.now(), ...form.value, price: Number(form.value.price), available: true })
  }
  closeModal()
}
function deleteDish(d) {
  dishes.value = dishes.value.filter(x => x.id !== d.id)
}
function toggleAvailable(d) {
  d.available = !d.available
}
</script>

<template>
  <div class="menu-page">
    <div class="mp-header">
      <h1 class="mp-title">Mon Menu</h1>
      <div class="mp-actions">
        <button class="btn-view" :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'"><Grid3X3 :size="16" /></button>
        <button class="btn-view" :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'"><List :size="16" /></button>
        <button class="btn-primary-add" @click="openAdd"><Plus :size="16" /> Ajouter un plat</button>
      </div>
    </div>

    <div class="cat-tabs">
      <button v-for="c in categoryTabs" :key="c" class="cat-tab" :class="{ active: activeCat === c }" @click="activeCat = c">{{ c }}</button>
    </div>

    <div v-if="filtered.length" class="dish-grid" :class="{ list: viewMode === 'list' }">
      <div v-for="d in filtered" :key="d.id" class="dish-card">
        <div class="dc-img">{{ d.emoji }}</div>
        <div class="dc-body">
          <div class="dc-top">
            <div class="dc-name">{{ d.name }}</div>
            <div class="dc-price">{{ d.price }} DA</div>
          </div>
          <div class="dc-cat">{{ d.cat }}</div>
          <div class="dc-toggle">
            <label class="toggle-switch-sm">
              <input type="checkbox" :checked="d.available" @change="toggleAvailable(d)">
              <span class="toggle-slider-sm"></span>
            </label>
            <span class="dc-status" :class="{ on: d.available }">{{ d.available ? 'Disponible' : 'Indisponible' }}</span>
          </div>
          <div class="dc-actions">
            <button class="dc-btn" @click="openEdit(d)"><Edit3 :size="14" /></button>
            <button class="dc-btn danger" @click="deleteDish(d)"><Trash2 :size="14" /></button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">
      <UtensilsCrossed :size="48" class="empty-icon" />
      <h3>Votre menu est vide</h3>
      <p>Ajoutez votre premier plat pour commencer</p>
      <button class="btn-primary-add" @click="openAdd"><Plus :size="16" /> Ajouter un plat</button>
    </div>

    <button class="fab-add" @click="openAdd"><Plus :size="22" /></button>

    <Teleport to="body">
      <div class="modal-overlay" :class="{ open: showModal }" @click="closeModal"></div>
      <div class="modal" :class="{ open: showModal }">
        <div class="modal-head">
          <h3>{{ editDish ? 'Modifier le plat' : 'Ajouter un plat' }}</h3>
          <button class="modal-close" @click="closeModal"><X :size="18" /></button>
        </div>
        <div class="modal-body">
          <div class="upload-zone">
            <Image :size="24" />
            <span>Déposer une photo ou cliquer</span>
          </div>
          <div class="field">
            <label>Nom du plat *</label>
            <input v-model="form.name" class="field-input" placeholder="Ex: Couscous Royal">
          </div>
          <div class="field-row">
            <div class="field half">
              <label>Catégorie</label>
              <select v-model="form.cat" class="field-input">
                <option v-for="c in ['Plats','Entrées','Desserts','Boissons']" :key="c">{{ c }}</option>
              </select>
            </div>
            <div class="field half">
              <label>Prix (DA) *</label>
              <input v-model="form.price" type="number" class="field-input" placeholder="1200">
            </div>
          </div>
          <div class="field">
            <label>Description</label>
            <textarea v-model="form.desc" class="field-input field-textarea" placeholder="Décrivez votre plat..."></textarea>
          </div>
        </div>
        <div class="modal-foot">
          <button class="btn-ghost-modal" @click="closeModal">Annuler</button>
          <button class="btn-primary-modal" @click="saveDish">{{ editDish ? 'Enregistrer' : 'Ajouter' }}</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.menu-page { max-width:1200px; }
.mp-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:12px; }
.mp-title { font-size:24px; font-weight:800; color:#FAFAFA; margin:0; }
.mp-actions { display:flex; align-items:center; gap:8px; }
.btn-view { width:34px; height:34px; border-radius:8px; background:transparent; border:1px solid #262626; color:#A1A1AA; display:flex; align-items:center; justify-content:center; cursor:pointer; }
.btn-view.active { background:rgba(232,129,58,.12); border-color:rgba(232,129,58,.3); color:#E8813A; }
.btn-primary-add { display:inline-flex; align-items:center; gap:6px; background:#E8813A; color:#fff; border:none; padding:9px 18px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; }
.btn-primary-add:hover { filter:brightness(1.1); }

.cat-tabs { display:flex; gap:4px; margin-bottom:20px; overflow-x:auto; }
.cat-tab { background:none; border:1px solid transparent; color:#A1A1AA; padding:7px 16px; border-radius:8px; font-size:13px; font-weight:500; cursor:pointer; white-space:nowrap; }
.cat-tab:hover { color:#FAFAFA; }
.cat-tab.active { background:rgba(232,129,58,.12); color:#E8813A; border-color:rgba(232,129,58,.3); }

.dish-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.dish-grid.list { grid-template-columns:1fr; }
.dish-card { background:#141414; border:1px solid #262626; border-radius:12px; overflow:hidden; }
.dish-card:hover { border-color:#333; }
.dc-img { height:140px; background:rgba(232,129,58,.08); display:flex; align-items:center; justify-content:center; font-size:48px; }
.dish-grid.list .dc-img { width:80px; height:80px; font-size:32px; flex-shrink:0; }
.dish-grid.list .dish-card { display:flex; }
.dc-body { padding:14px; }
.dc-top { display:flex; justify-content:space-between; align-items:flex-start; }
.dc-name { font-size:14px; font-weight:600; color:#FAFAFA; }
.dc-price { font-size:14px; font-weight:700; color:#22C55E; }
.dc-cat { font-size:11px; color:#A1A1AA; margin-top:2px; }
.dc-toggle { display:flex; align-items:center; gap:8px; margin-top:10px; }
.toggle-switch-sm { position:relative; width:32px; height:18px; cursor:pointer; }
.toggle-switch-sm input { opacity:0; width:0; height:0; position:absolute; }
.toggle-slider-sm { position:absolute; inset:0; background:#262626; border-radius:9px; transition:.2s; }
.toggle-slider-sm::before { content:''; position:absolute; width:14px; height:14px; border-radius:50%; background:#fff; top:2px; left:2px; transition:.2s; }
.toggle-switch-sm input:checked + .toggle-slider-sm { background:#22C55E; }
.toggle-switch-sm input:checked + .toggle-slider-sm::before { transform:translateX(14px); }
.dc-status { font-size:11px; color:#A1A1AA; }
.dc-status.on { color:#22C55E; }
.dc-actions { display:flex; gap:6px; margin-top:10px; }
.dc-btn { width:30px; height:30px; border-radius:6px; background:rgba(255,255,255,.05); border:1px solid #262626; color:#A1A1AA; display:flex; align-items:center; justify-content:center; cursor:pointer; }
.dc-btn:hover { color:#E8813A; border-color:#E8813A; }
.dc-btn.danger:hover { color:#EF4444; border-color:#EF4444; }

.empty-state { text-align:center; padding:80px 20px; background:#141414; border:1px solid #262626; border-radius:12px; }
.empty-icon { color:#A1A1AA; margin-bottom:12px; }
.empty-state h3 { font-size:18px; font-weight:700; color:#FAFAFA; margin:0 0 6px; }
.empty-state p { font-size:13px; color:#A1A1AA; margin:0 0 20px; }

/* Modal */
.fab-add {
  position:fixed; bottom:32px; right:32px; z-index:100; width:56px; height:56px; border-radius:16px;
  background:#E8813A; color:#fff; border:none; display:flex; align-items:center; justify-content:center;
  cursor:pointer; box-shadow:0 4px 20px rgba(232,129,58,.4); transition:transform .2s,box-shadow .2s;
}
.fab-add:hover { transform:translateY(-2px); box-shadow:0 6px 28px rgba(232,129,58,.5); }

.modal-overlay { position:fixed; inset:0; z-index:300; background:rgba(0,0,0,.6); opacity:0; pointer-events:none; transition:opacity .25s; }
.modal-overlay.open { opacity:1; pointer-events:all; }
.modal { position:fixed; top:50%; left:50%; transform:translate(-50%,-50%) scale(.95); z-index:301; width:480px; max-width:90vw; background:#141414; border:1px solid #262626; border-radius:12px; opacity:0; pointer-events:none; transition:all .25s; }
.modal.open { opacity:1; pointer-events:all; transform:translate(-50%,-50%) scale(1); }
.modal-head { display:flex; align-items:center; justify-content:space-between; padding:20px 24px; border-bottom:1px solid #262626; }
.modal-head h3 { font-size:16px; font-weight:700; color:#FAFAFA; margin:0; }
.modal-close { width:30px; height:30px; border-radius:6px; background:rgba(255,255,255,.05); border:1px solid #262626; color:#A1A1AA; display:flex; align-items:center; justify-content:center; cursor:pointer; }
.modal-body { padding:20px 24px; }
.upload-zone { border:2px dashed #262626; border-radius:8px; padding:24px; text-align:center; color:#A1A1AA; cursor:pointer; margin-bottom:16px; display:flex; flex-direction:column; align-items:center; gap:8px; font-size:13px; }
.field { margin-bottom:14px; }
.field label { display:block; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:#A1A1AA; margin-bottom:6px; }
.field-row { display:flex; gap:12px; }
.field.half { flex:1; }
.field-input { width:100%; background:rgba(255,255,255,.05); border:1px solid #262626; border-radius:8px; color:#FAFAFA; padding:10px 12px; font-size:13px; outline:none; }
.field-input:focus { border-color:#E8813A; }
.field-textarea { min-height:80px; resize:vertical; }
.modal-foot { display:flex; justify-content:flex-end; gap:10px; padding:16px 24px; border-top:1px solid #262626; }
.btn-ghost-modal { background:transparent; border:1px solid #262626; color:#A1A1AA; padding:9px 20px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; }
.btn-ghost-modal:hover { border-color:#E8813A; color:#FAFAFA; }
.btn-primary-modal { background:#E8813A; color:#fff; border:none; padding:9px 20px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; }
</style>
