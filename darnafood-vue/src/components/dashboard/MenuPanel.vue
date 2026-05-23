<script setup>
import { ref, computed } from 'vue'
import {
  Plus, UtensilsCrossed, Edit3, Trash2, Image, X, Grid3X3, List, Upload
} from '@lucide/vue'

const activeCat = ref('Tous')
const viewMode = ref('grid')
const showModal = ref(false)
const editDish = ref(null)

const categoryTabs = ['Tous', 'Plats principaux', 'Entrees', 'Desserts', 'Boissons']

const dishes = ref([
  { id: 1, name: 'Couscous Royal', cat: 'Plats principaux', price: 1200, available: true, desc: 'Couscous aux légumes et poulet', emoji: '🍛', portion: 'Famille (4p)', ingredients: ['Couscous', 'Poulet', 'Légumes', 'Merguez'] },
  { id: 2, name: 'Harira', cat: 'Entrees', price: 400, available: true, desc: 'Soupe algérienne traditionnelle', emoji: '🍲', portion: 'Individuel', ingredients: ['Tomates', 'Vermicelle', 'Pois chiches'] },
  { id: 3, name: 'Tagine Zitoune', cat: 'Plats principaux', price: 1200, available: true, desc: 'Tagine aux olives et poulet', emoji: '🥘', portion: 'Famille (2p)', ingredients: ['Poulet', 'Olives', 'Citron'] },
  { id: 4, name: 'Makrout', cat: 'Desserts', price: 600, available: false, desc: 'Pâtisserie à la semoule et miel', emoji: '🍯', portion: 'Individuel', ingredients: ['Semoule', 'Miel', 'Dattes'] },
  { id: 5, name: 'Chorba Frik', cat: 'Entrees', price: 350, available: true, desc: 'Soupe frik traditionnelle', emoji: '🥣', portion: 'Individuel', ingredients: ['Frik', 'Tomates', 'Menthe'] },
  { id: 6, name: 'Jus Orange', cat: 'Boissons', price: 200, available: true, desc: 'Jus d\'orange frais', emoji: '🧃', portion: 'Individuel', ingredients: ['Orange'] },
])

const categoryOptions = ['Entrees', 'Plats principaux', 'Desserts', 'Boissons']
const portionOptions = ['Individuel', 'Famille (2p)', 'Famille (4p)']

const filtered = computed(() => {
  if (activeCat.value === 'Tous') return dishes.value
  return dishes.value.filter(d => d.cat === activeCat.value)
})

const fileInput = ref(null)
const photoPreview = ref(null)
const photoFile = ref(null)
const dragOver = ref(false)

function triggerFileInput() { fileInput.value?.click() }

function handleFileUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return
  processPhoto(file)
  e.target.value = ''
}

function processPhoto(file) {
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) { alert('L\'image ne doit pas dépasser 5 Mo.'); return }
  if (!file.type.startsWith('image/')) { alert('Format non supporté. Veuillez choisir une image.'); return }
  photoFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => { photoPreview.value = e.target.result }
  reader.readAsDataURL(file)
}

function onDragOver(e) { e.preventDefault(); dragOver.value = true }
function onDragLeave() { dragOver.value = false }
function onDrop(e) { e.preventDefault(); dragOver.value = false; const file = e.dataTransfer.files?.[0]; if (file) processPhoto(file) }

function removePhoto() { photoPreview.value = null; photoFile.value = null }

const form = ref({ name: '', cat: 'Plats principaux', price: '', desc: '', emoji: '', portion: 'Individuel', ingredients: [], available: true })
const ingredientInput = ref('')

function openAdd() {
  editDish.value = null
  photoPreview.value = null
  photoFile.value = null
  ingredientInput.value = ''
  form.value = { name: '', cat: 'Plats principaux', price: '', desc: '', emoji: '', portion: 'Individuel', ingredients: [], available: true }
  showModal.value = true
}
function openEdit(d) {
  editDish.value = d
  photoPreview.value = d.photo || null
  photoFile.value = null
  ingredientInput.value = ''
  form.value = { name: d.name, cat: d.cat, price: d.price, desc: d.desc, emoji: d.emoji || '', portion: d.portion || 'Individuel', ingredients: [...(d.ingredients || [])], available: d.available }
  showModal.value = true
}
function closeModal() { showModal.value = false }

function addIngredient() {
  const val = ingredientInput.value.trim()
  if (!val) return
  if (form.value.ingredients.includes(val)) return
  form.value.ingredients.push(val)
  ingredientInput.value = ''
}
function removeIngredient(i) { form.value.ingredients.splice(i, 1) }
function onIngredientKeydown(e) { if (e.key === 'Enter') { e.preventDefault(); addIngredient() } }

function saveDish() {
  if (!form.value.name || !form.value.price) return
  const payload = {
    name: form.value.name,
    cat: form.value.cat,
    price: Number(form.value.price),
    desc: form.value.desc,
    emoji: form.value.emoji,
    portion: form.value.portion,
    ingredients: form.value.ingredients,
    available: form.value.available,
    photo: photoPreview.value,
  }
  if (editDish.value) {
    Object.assign(editDish.value, payload)
  } else {
    dishes.value.push({ id: Date.now(), ...payload })
  }
  closeModal()
}

function deleteDish(d) { dishes.value = dishes.value.filter(x => x.id !== d.id) }
function toggleAvailable(d) { d.available = !d.available }
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
        <div v-if="d.photo" class="dc-img" :style="{ backgroundImage: 'url('+d.photo+')', backgroundSize:'cover', backgroundPosition:'center' }"></div>
        <div v-else class="dc-img">{{ d.emoji || '🍽️' }}</div>
        <div class="dc-body">
          <div class="dc-top">
            <div class="dc-name">{{ d.name }}</div>
            <div class="dc-price">{{ d.price }} DA</div>
          </div>
          <div class="dc-cat">{{ d.cat }} · {{ d.portion }}<span v-if="d.ingredients?.length"> · {{ d.ingredients.join(', ') }}</span></div>
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
          <div class="upload-zone" :class="{ 'drag-over': dragOver, 'has-preview': photoPreview }"
            @click="triggerFileInput" @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDrop">
            <input ref="fileInput" type="file" accept="image/*" @change="handleFileUpload" class="file-input-hidden">
            <template v-if="photoPreview">
              <img :src="photoPreview" class="photo-preview-img">
              <button class="photo-remove" @click.stop="removePhoto"><X :size="14" /></button>
            </template>
            <template v-else>
              <Upload :size="24" />
              <span>Déposer une photo ou cliquer</span>
              <span class="upload-hint">PNG, JPG — max 5 Mo</span>
            </template>
          </div>

          <div class="field-row">
            <div class="field half">
              <label>Nom du plat *</label>
              <input v-model="form.name" class="field-input" placeholder="Ex: Couscous Royal">
            </div>
            <div class="field half">
              <label>Prix (DA) *</label>
              <input v-model="form.price" type="number" class="field-input" placeholder="1200">
            </div>
          </div>

          <div class="field">
            <label>Catégorie</label>
            <select v-model="form.cat" class="field-input">
              <option v-for="c in categoryOptions" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>

          <div class="field">
            <label>Portion</label>
            <div class="portion-row">
              <label v-for="p in portionOptions" :key="p" class="portion-radio" :class="{ active: form.portion === p }">
                <input type="radio" :value="p" v-model="form.portion">
                <span>{{ p }}</span>
              </label>
            </div>
          </div>

          <div class="field">
            <label>Ingrédients</label>
            <div class="ingr-input-wrap">
              <input v-model="ingredientInput" class="field-input ingr-input" placeholder="Ajouter un ingrédient et appuyer sur Entrée" @keydown="onIngredientKeydown">
              <button class="ingr-add-btn" @click="addIngredient"><Plus :size="14" /></button>
            </div>
            <div v-if="form.ingredients.length" class="ingr-pills">
              <span v-for="(ing, i) in form.ingredients" :key="i" class="ingr-pill">
                {{ ing }} <button class="ingr-remove" @click="removeIngredient(i)"><X :size="10" /></button>
              </span>
            </div>
          </div>

          <div class="field">
            <label>Description</label>
            <textarea v-model="form.desc" class="field-input field-textarea" placeholder="Décrivez votre plat..."></textarea>
          </div>

          <div class="field">
            <label>Disponibilité</label>
            <div class="avail-row">
              <span class="avail-label">Plat disponible</span>
              <label class="toggle-switch-md">
                <input type="checkbox" v-model="form.available">
                <span class="toggle-slider-md"></span>
              </label>
            </div>
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

.fab-add {
  position:fixed; bottom:32px; right:32px; z-index:100; width:56px; height:56px; border-radius:16px;
  background:#E8813A; color:#fff; border:none; display:flex; align-items:center; justify-content:center;
  cursor:pointer; box-shadow:0 4px 20px rgba(232,129,58,.4); transition:transform .2s,box-shadow .2s;
}
.fab-add:hover { transform:translateY(-2px); box-shadow:0 6px 28px rgba(232,129,58,.5); }

/* Modal */
.modal-overlay { position:fixed; inset:0; z-index:300; background:rgba(0,0,0,.6); opacity:0; pointer-events:none; transition:opacity .25s; }
.modal-overlay.open { opacity:1; pointer-events:all; }
.modal { position:fixed; top:50%; left:50%; transform:translate(-50%,-50%) scale(.95); z-index:301; width:520px; max-width:90vw; background:#141414; border:1px solid #262626; border-radius:12px; opacity:0; pointer-events:none; transition:all .25s; }
.modal.open { opacity:1; pointer-events:all; transform:translate(-50%,-50%) scale(1); }
.modal-head { display:flex; align-items:center; justify-content:space-between; padding:20px 24px; border-bottom:1px solid #262626; }
.modal-head h3 { font-size:16px; font-weight:700; color:#FAFAFA; margin:0; }
.modal-close { width:30px; height:30px; border-radius:6px; background:rgba(255,255,255,.05); border:1px solid #262626; color:#A1A1AA; display:flex; align-items:center; justify-content:center; cursor:pointer; }
.modal-body { padding:20px 24px; max-height:60vh; overflow-y:auto; }
.upload-zone { border:2px dashed #262626; border-radius:8px; padding:24px; text-align:center; color:#A1A1AA; cursor:pointer; margin-bottom:16px; display:flex; flex-direction:column; align-items:center; gap:8px; font-size:13px; position:relative; transition:border-color .2s; }
.upload-zone.drag-over { border-color:#E8813A; background:rgba(232,129,58,.05); }
.upload-zone.has-preview { padding:8px; }
.file-input-hidden { display:none; }
.photo-preview-img { max-width:100%; max-height:160px; border-radius:6px; object-fit:cover; }
.photo-remove { position:absolute; top:8px; right:8px; width:24px; height:24px; border-radius:50%; background:rgba(0,0,0,.6); border:none; color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; }
.upload-hint { font-size:10px; color:#52525B; }
.field { margin-bottom:14px; }
.field label { display:block; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:#A1A1AA; margin-bottom:6px; }
.field-row { display:flex; gap:12px; }
.field.half { flex:1; }
.field-input { width:100%; background:rgba(255,255,255,.05); border:1px solid #262626; border-radius:8px; color:#FAFAFA; padding:10px 12px; font-size:13px; outline:none; box-sizing:border-box; }
.field-input:focus { border-color:#E8813A; }
.field-textarea { min-height:80px; resize:vertical; }
.field-input option { background:#141414; color:#FAFAFA; }

/* Portion */
.portion-row { display:flex; gap:8px; }
.portion-radio { flex:1; cursor:pointer; }
.portion-radio input { display:none; }
.portion-radio span { display:flex; align-items:center; justify-content:center; padding:9px 8px; border:1px solid #262626; border-radius:8px; font-size:12px; color:#A1A1AA; transition:all .2s; text-align:center; }
.portion-radio:hover span { border-color:#E8813A; color:#FAFAFA; }
.portion-radio.active span { background:rgba(232,129,58,.12); border-color:rgba(232,129,58,.3); color:#E8813A; font-weight:600; }

/* Ingredients */
.ingr-input-wrap { display:flex; gap:6px; }
.ingr-input { flex:1; }
.ingr-add-btn { width:36px; height:36px; border-radius:8px; background:#E8813A; border:none; color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; }
.ingr-add-btn:hover { filter:brightness(1.1); }
.ingr-pills { display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
.ingr-pill { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; background:#E8813A; border-radius:99px; font-size:11px; font-weight:600; color:#fff; }
.ingr-remove { width:16px; height:16px; border-radius:50%; background:rgba(0,0,0,.2); border:none; color:#fff; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; padding:0; margin-left:2px; flex-shrink:0; }
.ingr-remove:hover { background:rgba(0,0,0,.4); }

/* Availability */
.avail-row { display:flex; align-items:center; justify-content:space-between; padding:10px 14px; background:rgba(255,255,255,.02); border:1px solid #262626; border-radius:8px; }
.avail-label { font-size:13px; color:#FAFAFA; }
.toggle-switch-md { position:relative; width:40px; height:22px; cursor:pointer; }
.toggle-switch-md input { opacity:0; width:0; height:0; position:absolute; }
.toggle-slider-md { position:absolute; inset:0; background:#262626; border-radius:11px; transition:.2s; }
.toggle-slider-md::before { content:''; position:absolute; width:18px; height:18px; border-radius:50%; background:#fff; top:2px; left:2px; transition:.2s; }
.toggle-switch-md input:checked + .toggle-slider-md { background:#22C55E; }
.toggle-switch-md input:checked + .toggle-slider-md::before { transform:translateX(18px); }

.modal-foot { display:flex; justify-content:flex-end; gap:10px; padding:16px 24px; border-top:1px solid #262626; }
.btn-ghost-modal { background:transparent; border:1px solid #262626; color:#A1A1AA; padding:9px 20px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; }
.btn-ghost-modal:hover { border-color:#E8813A; color:#FAFAFA; }
.btn-primary-modal { background:#E8813A; color:#fff; border:none; padding:9px 20px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; }
</style>
