<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { Save, User, Bell, Shield, Store } from '@lucide/vue'

const auth = useAuthStore()
const settingsTab = ref('info')

const tabs = [
  { id: 'info', label: 'Informations', icon: User },
  { id: 'store', label: 'Cuisine', icon: Store },
  { id: 'notif', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Sécurité', icon: Shield },
]

const form = ref({
  name: auth.user?.firstName || '',
  lastName: auth.user?.lastName || '',
  email: auth.user?.email || '',
  phone: auth.user?.phone || '',
  kitchenName: auth.user?.name || 'Ma Cuisine',
  bio: '',
})

function saveSettings() {
  // placeholder
}
</script>

<template>
  <div class="settings-page">
    <div class="sp-header">
      <h1 class="sp-title">Paramètres</h1>
      <button class="btn-primary-save" @click="saveSettings"><Save :size="15" /> Enregistrer</button>
    </div>

    <div class="st-tabs">
      <button v-for="t in tabs" :key="t.id" class="st-tab" :class="{ active: settingsTab === t.id }" @click="settingsTab = t.id">
        <component :is="t.icon" :size="16" />
        {{ t.label }}
      </button>
    </div>

    <div class="settings-card">
      <div v-if="settingsTab === 'info'" class="setting-section">
        <h3>Informations personnelles</h3>
        <div class="field-row">
          <div class="field half">
            <label>Prénom</label>
            <input v-model="form.name" class="field-input" placeholder="Prénom">
          </div>
          <div class="field half">
            <label>Nom</label>
            <input v-model="form.lastName" class="field-input" placeholder="Nom">
          </div>
        </div>
        <div class="field-row">
          <div class="field half">
            <label>Email</label>
            <input v-model="form.email" class="field-input" placeholder="Email">
          </div>
          <div class="field half">
            <label>Téléphone</label>
            <input v-model="form.phone" class="field-input" placeholder="Téléphone">
          </div>
        </div>
      </div>

      <div v-else-if="settingsTab === 'store'" class="setting-section">
        <h3>Ma cuisine</h3>
        <div class="field">
          <label>Nom de la cuisine</label>
          <input v-model="form.kitchenName" class="field-input" placeholder="Nom de la cuisine">
        </div>
        <div class="field">
          <label>Bio / Description</label>
          <textarea v-model="form.bio" class="field-input field-textarea" placeholder="Décrivez votre cuisine..."></textarea>
        </div>
      </div>

      <div v-else-if="settingsTab === 'notif'" class="setting-section">
        <h3>Notifications</h3>
        <div class="notif-row"><span>Nouvelles commandes</span><label class="toggle-switch-sm"><input type="checkbox" checked><span class="toggle-slider-sm"></span></label></div>
        <div class="notif-row"><span>Notifications SMS</span><label class="toggle-switch-sm"><input type="checkbox"><span class="toggle-slider-sm"></span></label></div>
      </div>

      <div v-else-if="settingsTab === 'security'" class="setting-section">
        <h3>Sécurité</h3>
        <div class="field">
          <label>Nouveau mot de passe</label>
          <input type="password" class="field-input" placeholder="••••••••">
        </div>
        <div class="field">
          <label>Confirmer le mot de passe</label>
          <input type="password" class="field-input" placeholder="••••••••">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page { max-width:800px; }
.sp-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
.sp-title { font-size:24px; font-weight:800; color:#FAFAFA; margin:0; }
.btn-primary-save { display:inline-flex; align-items:center; gap:6px; background:#E8813A; color:#fff; border:none; padding:9px 18px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; }
.btn-primary-save:hover { filter:brightness(1.1); }

.st-tabs { display:flex; gap:4px; margin-bottom:20px; }
.st-tab { display:inline-flex; align-items:center; gap:6px; background:none; border:1px solid transparent; color:#A1A1AA; padding:8px 16px; border-radius:8px; font-size:13px; font-weight:500; cursor:pointer; }
.st-tab:hover { color:#FAFAFA; }
.st-tab.active { background:rgba(232,129,58,.12); color:#E8813A; border-color:rgba(232,129,58,.3); }

.settings-card { background:#141414; border:1px solid #262626; border-radius:12px; padding:24px; }
.setting-section h3 { font-size:15px; font-weight:700; color:#FAFAFA; margin:0 0 16px; }
.field-row { display:flex; gap:12px; margin-bottom:14px; }
.field { margin-bottom:14px; }
.field.half { flex:1; }
.field label { display:block; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:#A1A1AA; margin-bottom:6px; }
.field-input { width:100%; background:rgba(255,255,255,.05); border:1px solid #262626; border-radius:8px; color:#FAFAFA; padding:10px 12px; font-size:13px; outline:none; box-sizing:border-box; }
.field-input:focus { border-color:#E8813A; }
.field-textarea { min-height:80px; resize:vertical; }

.notif-row { display:flex; align-items:center; justify-content:space-between; padding:12px 0; border-bottom:1px solid #262626; font-size:13px; color:#FAFAFA; }
.notif-row:last-child { border-bottom:none; }
.toggle-switch-sm { position:relative; width:36px; height:20px; cursor:pointer; display:inline-block; }
.toggle-switch-sm input { opacity:0; width:0; height:0; position:absolute; }
.toggle-slider-sm { position:absolute; inset:0; background:#262626; border-radius:10px; transition:.2s; }
.toggle-slider-sm::before { content:''; position:absolute; width:16px; height:16px; border-radius:50%; background:#fff; top:2px; left:2px; transition:.2s; }
.toggle-switch-sm input:checked + .toggle-slider-sm { background:#22C55E; }
.toggle-switch-sm input:checked + .toggle-slider-sm::before { transform:translateX(16px); }
</style>
