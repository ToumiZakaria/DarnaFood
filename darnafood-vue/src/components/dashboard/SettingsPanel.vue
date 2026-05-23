<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { WILAYAS, COMMUNES } from '../../data'
import { apiUpdateProfile } from '../../api'
import {
  Save, User, Store, Bell, Shield, Eye, EyeOff, Camera, MapPin, Upload,
  Trash2, Clock, Smartphone, Laptop, LogOut
} from '@lucide/vue'

const auth = useAuthStore()
const settingsTab = ref('info')
const showCIN = ref(false)
const dirty = ref(false)

const tabs = [
  { id: 'info', label: 'Informations', icon: User },
  { id: 'store', label: 'Cuisine', icon: Store },
  { id: 'notif', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Sécurité', icon: Shield },
]

const form = ref({
  name: '',
  lastName: '',
  email: '',
  phone: '',
  cin: '',
  birthDate: '',
  birthWilaya: '',
  kitchenName: '',
  bio: '',
  wilaya: '',
  commune: '',
  hygieneCert: false,
  notifEmail: true,
  notifSMS: false,
  notifPush: true,
})

onMounted(() => {
  const u = auth.user
  if (!u) return
  form.value = {
    name: u.firstName || '',
    lastName: u.lastName || '',
    email: u.email || '',
    phone: u.phone || '',
    cin: u.cin || '',
    birthDate: u.dob || '',
    birthWilaya: u.birthWilaya || '',
    kitchenName: u.name || 'Ma Cuisine',
    bio: u.desc || '',
    wilaya: u.wilaya || '',
    commune: u.commune || '',
    hygieneCert: false,
    notifEmail: true,
    notifSMS: false,
    notifPush: true,
  }
})

const wilayas = WILAYAS
const communes = computed(() => form.value.wilaya ? (COMMUNES[form.value.wilaya] || []) : [])
const formDirty = computed(() => dirty.value)

function markDirty() { dirty.value = true }
async function saveSettings() {
  dirty.value = false
  const data = await apiUpdateProfile({
    firstName: form.value.name,
    lastName: form.value.lastName,
    phone: form.value.phone,
    name: form.value.kitchenName,
    desc: form.value.bio,
    wilaya: form.value.wilaya,
    commune: form.value.commune,
  })
  if (data.success && data.user) {
    auth.setUser(data.user)
    window.showToast?.('✅ Modifications enregistrées', 'success')
  }
}

const sessions = ref([
  { device: 'Chrome · Windows', ip: '196.65.XX.XX', time: 'Actif maintenant', icon: Laptop, current: true },
  { device: 'Safari · iPhone', ip: '196.65.XX.XX', time: 'Il y a 2h', icon: Smartphone, current: false },
])
</script>

<template>
  <div class="settings-page">
    <div class="sp-header">
      <h1 class="sp-title">Paramètres</h1>
      <button class="btn-primary-save" :class="{ visible: formDirty }" @click="saveSettings"><Save :size="15" /> Enregistrer les modifications</button>
    </div>

    <div class="st-tabs">
      <button v-for="t in tabs" :key="t.id" class="st-tab" :class="{ active: settingsTab === t.id }" @click="settingsTab = t.id">
        <component :is="t.icon" :size="16" /> {{ t.label }}
      </button>
    </div>

    <div class="settings-card">
      <!-- Informations -->
      <div v-if="settingsTab === 'info'" class="setting-section">
        <div class="photo-section">
          <div class="photo-preview">
            <div class="photo-circle">{{ (auth.user?.firstName || 'C').charAt(0) }}</div>
          </div>
          <button class="btn-outline-photo"><Camera :size="14" /> Modifier photo</button>
        </div>

        <div class="field-row">
          <div class="field half">
            <label>Prénom</label>
            <input v-model="form.name" class="field-input" placeholder="Prénom" @input="markDirty">
          </div>
          <div class="field half">
            <label>Nom</label>
            <input v-model="form.lastName" class="field-input" placeholder="Nom" @input="markDirty">
          </div>
        </div>

        <div class="field-row">
          <div class="field half">
            <label>Email</label>
            <input v-model="form.email" class="field-input" placeholder="Email" type="email" @input="markDirty">
          </div>
          <div class="field half">
            <label>Téléphone</label>
            <input v-model="form.phone" class="field-input" placeholder="Téléphone" @input="markDirty">
          </div>
        </div>

        <div class="field-row">
          <div class="field half">
            <label>Numéro CIN</label>
            <div class="cin-wrap">
              <input v-model="form.cin" class="field-input cin-input" :type="showCIN ? 'text' : 'password'" placeholder="Ex: 123456789" @input="markDirty">
              <button class="cin-toggle" @click="showCIN = !showCIN">
                <Eye v-if="!showCIN" :size="16" />
                <EyeOff v-else :size="16" />
              </button>
            </div>
          </div>
          <div class="field half">
            <label>Date de naissance</label>
            <input v-model="form.birthDate" class="field-input" type="date" @input="markDirty">
          </div>
        </div>

        <div class="field">
          <label>Wilaya de naissance</label>
          <select v-model="form.birthWilaya" class="field-input" @change="markDirty">
            <option value="">Sélectionner une wilaya</option>
            <option v-for="w in wilayas" :key="w" :value="w">{{ w }}</option>
          </select>
        </div>
      </div>

      <!-- Cuisine -->
      <div v-else-if="settingsTab === 'store'" class="setting-section">
        <h3>Ma cuisine</h3>
        <div class="field">
          <label>Nom de la cuisine</label>
          <input v-model="form.kitchenName" class="field-input" placeholder="Nom de votre cuisine" @input="markDirty">
        </div>
        <div class="field">
          <label>Description</label>
          <textarea v-model="form.bio" class="field-input field-textarea" placeholder="Décrivez votre cuisine et vos spécialités..." @input="markDirty"></textarea>
        </div>
        <div class="field-row">
          <div class="field half">
            <label>Wilaya</label>
            <select v-model="form.wilaya" class="field-input" @change="form.commune = ''; markDirty()">
              <option value="">Sélectionner une wilaya</option>
              <option v-for="w in wilayas" :key="w" :value="w">{{ w }}</option>
            </select>
          </div>
          <div class="field half">
            <label>Commune</label>
            <select v-model="form.commune" class="field-input" @change="markDirty">
              <option value="">Sélectionner une commune</option>
              <option v-for="c in communes" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
        </div>
        <div class="field">
          <div class="cert-row">
            <span>Certificat d'hygiène</span>
            <div class="cert-controls">
              <label class="toggle-switch-sm">
                <input type="checkbox" v-model="form.hygieneCert" @change="markDirty">
                <span class="toggle-slider-sm"></span>
              </label>
              <button class="btn-outline-upload"><Upload :size="13" /> Télécharger</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Notifications -->
      <div v-else-if="settingsTab === 'notif'" class="setting-section">
        <h3>Préférences de notification</h3>
        <div class="notif-row"><span><span class="notif-icon email"></span> Notifications email</span><label class="toggle-switch-sm"><input type="checkbox" v-model="form.notifEmail"><span class="toggle-slider-sm"></span></label></div>
        <div class="notif-row"><span><span class="notif-icon sms"></span> Notifications SMS</span><label class="toggle-switch-sm"><input type="checkbox" v-model="form.notifSMS"><span class="toggle-slider-sm"></span></label></div>
        <div class="notif-row"><span><span class="notif-icon push"></span> Notifications push</span><label class="toggle-switch-sm"><input type="checkbox" v-model="form.notifPush"><span class="toggle-slider-sm"></span></label></div>
      </div>

      <!-- Sécurité -->
      <div v-else-if="settingsTab === 'security'" class="setting-section">
        <h3>Changer le mot de passe</h3>
        <div class="field-row">
          <div class="field half">
            <label>Nouveau mot de passe</label>
            <input type="password" class="field-input" placeholder="••••••••" @input="markDirty">
          </div>
          <div class="field half">
            <label>Confirmer le mot de passe</label>
            <input type="password" class="field-input" placeholder="••••••••" @input="markDirty">
          </div>
        </div>

        <div class="section-divider"></div>
        <h3>Sessions actives</h3>
        <div class="sessions-list">
          <div v-for="s in sessions" :key="s.ip" class="session-row">
            <component :is="s.icon" :size="18" class="sess-icon" />
            <div class="sess-body">
              <div class="sess-device">{{ s.device }} <span v-if="s.current" class="sess-badge">Actuelle</span></div>
              <div class="sess-meta">{{ s.ip }} · {{ s.time }}</div>
            </div>
            <button v-if="!s.current" class="btn-sess-terminate"><LogOut :size="13" /> Fermer</button>
          </div>
        </div>

        <div class="section-divider"></div>
        <div class="danger-zone">
          <h3>Zone dangereuse</h3>
          <p>La suppression est irréversible. Toutes vos données seront perdues.</p>
          <button class="btn-delete-account"><Trash2 :size="14" /> Supprimer mon compte</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page { max-width:800px; }
.sp-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; position:sticky; top:0; z-index:10; background:#0A0A0A; padding:12px 0; }
.sp-title { font-size:24px; font-weight:800; color:#FAFAFA; margin:0; }
.btn-primary-save { display:inline-flex; align-items:center; gap:6px; background:#E8813A; color:#fff; border:none; padding:9px 18px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; opacity:.4; transition:opacity .25s; }
.btn-primary-save.visible { opacity:1; }
.btn-primary-save:hover { filter:brightness(1.1); }

.st-tabs { display:flex; gap:4px; margin-bottom:20px; flex-wrap:wrap; }
.st-tab { display:inline-flex; align-items:center; gap:6px; background:none; border:1px solid transparent; color:#A1A1AA; padding:8px 16px; border-radius:8px; font-size:13px; font-weight:500; cursor:pointer; white-space:nowrap; }
.st-tab:hover { color:#FAFAFA; }
.st-tab.active { background:rgba(232,129,58,.12); color:#E8813A; border-color:rgba(232,129,58,.3); }

.settings-card { background:#141414; border:1px solid #262626; border-radius:12px; padding:24px; }
.setting-section h3 { font-size:15px; font-weight:700; color:#FAFAFA; margin:0 0 16px; }

/* Photo */
.photo-section { display:flex; align-items:center; gap:16px; margin-bottom:20px; padding-bottom:20px; border-bottom:1px solid #262626; }
.photo-circle { width:64px; height:64px; border-radius:50%; background:#E8813A; display:flex; align-items:center; justify-content:center; font-size:28px; font-weight:700; color:#fff; }
.btn-outline-photo { display:inline-flex; align-items:center; gap:6px; background:transparent; border:1px solid #262626; color:#A1A1AA; padding:7px 14px; border-radius:8px; font-size:12px; font-weight:600; cursor:pointer; }
.btn-outline-photo:hover { border-color:#E8813A; color:#FAFAFA; }

/* CIN toggle */
.cin-wrap { position:relative; }
.cin-input { padding-right:40px !important; }
.cin-toggle { position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; color:#A1A1AA; cursor:pointer; padding:4px; }
.cin-toggle:hover { color:#FAFAFA; }

/* Fields */
.field-row { display:flex; gap:12px; margin-bottom:14px; }
.field { margin-bottom:14px; }
.field.half { flex:1; }
.field label { display:block; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:#A1A1AA; margin-bottom:6px; }
.field-input { width:100%; background:rgba(255,255,255,.05); border:1px solid #262626; border-radius:8px; color:#FAFAFA; padding:10px 12px; font-size:13px; outline:none; box-sizing:border-box; }
.field-input:focus { border-color:#E8813A; }
.field-input option { background:#141414; color:#FAFAFA; }
.field-textarea { min-height:80px; resize:vertical; }

/* Cert */
.cert-row { display:flex; align-items:center; justify-content:space-between; padding:12px 16px; background:rgba(255,255,255,.02); border:1px solid #262626; border-radius:8px; }
.cert-row span { font-size:13px; color:#FAFAFA; }
.cert-controls { display:flex; align-items:center; gap:10px; }
.btn-outline-upload { display:inline-flex; align-items:center; gap:5px; background:transparent; border:1px solid #262626; color:#A1A1AA; padding:6px 12px; border-radius:6px; font-size:11px; font-weight:600; cursor:pointer; }
.btn-outline-upload:hover { border-color:#E8813A; color:#FAFAFA; }

/* Notifications */
.notif-row { display:flex; align-items:center; justify-content:space-between; padding:14px 0; border-bottom:1px solid #262626; font-size:13px; color:#FAFAFA; }
.notif-row:last-child { border-bottom:none; }
.notif-icon { display:inline-block; width:8px; height:8px; border-radius:50%; margin-right:8px; }
.notif-icon.email { background:#3B82F6; }
.notif-icon.sms { background:#22C55E; }
.notif-icon.push { background:#EAB308; }

.toggle-switch-sm { position:relative; width:36px; height:20px; cursor:pointer; display:inline-block; }
.toggle-switch-sm input { opacity:0; width:0; height:0; position:absolute; }
.toggle-slider-sm { position:absolute; inset:0; background:#262626; border-radius:10px; transition:.2s; }
.toggle-slider-sm::before { content:''; position:absolute; width:16px; height:16px; border-radius:50%; background:#fff; top:2px; left:2px; transition:.2s; }
.toggle-switch-sm input:checked + .toggle-slider-sm { background:#22C55E; }
.toggle-switch-sm input:checked + .toggle-slider-sm::before { transform:translateX(16px); }

/* Sessions */
.section-divider { height:1px; background:#262626; margin:24px 0; }
.sessions-list { display:flex; flex-direction:column; gap:8px; }
.session-row { display:flex; align-items:center; gap:12px; padding:12px; background:rgba(255,255,255,.02); border:1px solid #262626; border-radius:8px; }
.sess-icon { color:#A1A1AA; flex-shrink:0; }
.sess-body { flex:1; }
.sess-device { font-size:13px; font-weight:600; color:#FAFAFA; }
.sess-badge { display:inline-block; font-size:9px; font-weight:700; background:rgba(34,197,94,.15); color:#22C55E; padding:1px 6px; border-radius:4px; margin-left:6px; text-transform:uppercase; letter-spacing:.3px; }
.sess-meta { font-size:11px; color:#A1A1AA; margin-top:1px; }
.btn-sess-terminate { display:inline-flex; align-items:center; gap:4px; background:transparent; border:1px solid #262626; color:#A1A1AA; padding:5px 10px; border-radius:6px; font-size:10px; font-weight:600; cursor:pointer; white-space:nowrap; }
.btn-sess-terminate:hover { border-color:#EF4444; color:#EF4444; }

/* Danger zone */
.danger-zone { border:1px solid rgba(239,68,68,.3); border-radius:8px; padding:16px; background:rgba(239,68,68,.04); }
.danger-zone h3 { color:#EF4444; }
.danger-zone p { font-size:12px; color:#A1A1AA; margin:0 0 12px; }
.btn-delete-account { display:inline-flex; align-items:center; gap:6px; background:transparent; border:1px solid #EF4444; color:#EF4444; padding:8px 16px; border-radius:8px; font-size:12px; font-weight:600; cursor:pointer; }
.btn-delete-account:hover { background:rgba(239,68,68,.1); }
</style>
