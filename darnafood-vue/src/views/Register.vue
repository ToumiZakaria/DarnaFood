<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const form = ref({
  firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', role: 'client', wilaya: '',
})
const loading = ref(false)
const error = ref('')

async function handleRegister() {
  error.value = ''
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Les mots de passe ne correspondent pas'
    return
  }
  loading.value = true
  try {
    const result = await auth.register(form.value)
    if (result.success) {
      window.showToast('Compte créé avec succès', 'success')
      router.push(form.value.role === 'cuisinier' ? { name: 'dashboard' } : { name: 'home' })
    } else {
      error.value = result.error || 'Erreur lors de l\'inscription'
    }
  } catch (e) {
    error.value = 'Erreur de connexion au serveur'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card register-card">
      <div class="auth-logo" @click="router.push({name:'home'})">
        <div class="auth-logo-icon">🍽️</div>
        <div class="auth-logo-txt">DarnaFood</div>
      </div>
      <h1 class="auth-title">Créer un compte</h1>
      <p class="auth-sub">Rejoignez DarnaFood dès aujourd'hui</p>
      <div v-if="error" class="auth-error">{{ error }}</div>
      <form @submit.prevent="handleRegister">
        <div class="role-toggle-row">
          <button type="button" class="role-toggle" :class="{ active: form.role === 'client' }" @click="form.role = 'client'">🛒 Client</button>
          <button type="button" class="role-toggle" :class="{ active: form.role === 'cuisinier' }" @click="form.role = 'cuisinier'">👨‍🍳 Cuisinier</button>
        </div>
        <div class="field-row">
          <div class="field-wrap half"><label>Prénom</label><input v-model="form.firstName" class="field-input" required></div>
          <div class="field-wrap half"><label>Nom</label><input v-model="form.lastName" class="field-input" required></div>
        </div>
        <div class="field-row">
          <div class="field-wrap half"><label>Email</label><input v-model="form.email" type="email" class="field-input" required></div>
          <div class="field-wrap half"><label>Téléphone</label><input v-model="form.phone" class="field-input" required></div>
        </div>
        <div class="field-row">
          <div class="field-wrap half"><label>Mot de passe</label><input v-model="form.password" type="password" class="field-input" required></div>
          <div class="field-wrap half"><label>Confirmer</label><input v-model="form.confirmPassword" type="password" class="field-input" required></div>
        </div>
        <button type="submit" class="btn-primary btn-block btn-lg" :disabled="loading" style="margin-top:6px;">
          {{ loading ? 'Inscription...' : 'Créer mon compte' }}
        </button>
      </form>
      <p class="auth-link">Déjà un compte ? <a href="#" @click.prevent="router.push({name:'login'})">Se connecter</a></p>
    </div>
  </div>
</template>

<style scoped>
.auth-page { min-height:100vh; display:flex; align-items:center; justify-content:center; background:var(--bg); padding:20px; }
.register-card { max-width:500px; }
.auth-logo { display:flex; align-items:center; gap:10px; justify-content:center; margin-bottom:20px; cursor:pointer; }
.auth-logo-icon { width:44px; height:44px; background:linear-gradient(135deg,var(--primary-light),var(--primary-dark)); border-radius:var(--r-sm); display:flex; align-items:center; justify-content:center; font-size:24px; }
.auth-logo-txt { font-size:24px; font-weight:800; background:linear-gradient(135deg,var(--primary-light),var(--primary)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.auth-title { font-size:22px; font-weight:800; text-align:center; margin-bottom:4px; }
.auth-sub { font-size:13px; text-align:center; color:var(--text-muted); margin-bottom:20px; }
.auth-error { background:rgba(200,60,60,.12); border:1px solid rgba(200,60,60,.3); color:var(--danger); font-size:13px; padding:10px 14px; border-radius:var(--r-sm); margin-bottom:14px; text-align:center; }
.role-toggle-row { display:flex; gap:10px; margin-bottom:18px; }
.role-toggle { flex:1; background:var(--bg); border:1px solid var(--border); color:var(--text-muted); padding:12px; border-radius:var(--r-sm); font-size:14px; font-weight:600; cursor:pointer; }
.role-toggle.active { border-color:var(--primary); background:var(--primary-glow); color:var(--primary-light); }
.field-row { display:flex; gap:12px; }
.field-wrap { margin-bottom:14px; }
.field-wrap.half { flex:1; }
.field-wrap label { display:block; font-size:11px; font-weight:700; color:var(--text-muted); margin-bottom:5px; text-transform:uppercase; letter-spacing:.5px; }
.field-input { width:100%; background:var(--bg); border:1px solid var(--border); color:var(--text); padding:13px 14px; border-radius:var(--r-sm); font-size:14px; outline:none; }
.field-input:focus { border-color:var(--primary); }
.btn-block { width:100%; justify-content:center; }
.auth-link { text-align:center; margin-top:16px; font-size:13px; color:var(--text-muted); }
.auth-link a { color:var(--primary-light); font-weight:600; text-decoration:none; }
</style>
