<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const form = ref({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    const result = await auth.login(form.value)
    if (result.success) {
      window.showToast('Connecté avec succès', 'success')
      router.push(auth.isCuisinier ? { name: 'dashboard' } : { name: 'home' })
    } else {
      error.value = result.error || 'Identifiants incorrects'
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
    <div class="auth-card">
      <div class="auth-logo" @click="router.push({name:'home'})">
        <div class="auth-logo-icon">🍽️</div>
        <div class="auth-logo-txt">DarnaFood</div>
      </div>
      <h1 class="auth-title">Connexion</h1>
      <p class="auth-sub">Connectez-vous pour commander ou gérer votre cuisine</p>
      <div v-if="error" class="auth-error">{{ error }}</div>
      <form @submit.prevent="handleLogin">
        <div class="field-wrap">
          <label>Email</label>
          <input v-model="form.email" type="email" class="field-input" placeholder="vous@exemple.com" required>
        </div>
        <div class="field-wrap">
          <label>Mot de passe</label>
          <input v-model="form.password" type="password" class="field-input" placeholder="•••••••" required>
        </div>
        <button type="submit" class="btn-primary btn-block btn-lg" :disabled="loading" style="margin-top:6px;">
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>
      <p class="auth-link">Pas de compte ? <a href="#" @click.prevent="router.push({name:'register'})">S'inscrire</a></p>
    </div>
  </div>
</template>

<style scoped>
.auth-page { min-height:100vh; display:flex; align-items:center; justify-content:center; background:var(--bg); padding:20px; }
.auth-card { width:100%; max-width:400px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--r-lg); padding:40px 32px; }
.auth-logo { display:flex; align-items:center; gap:10px; justify-content:center; margin-bottom:24px; cursor:pointer; }
.auth-logo-icon { width:44px; height:44px; background:linear-gradient(135deg,var(--primary-light),var(--primary-dark)); border-radius:var(--r-sm); display:flex; align-items:center; justify-content:center; font-size:24px; }
.auth-logo-txt { font-size:24px; font-weight:800; background:linear-gradient(135deg,var(--primary-light),var(--primary)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.auth-title { font-size:22px; font-weight:800; text-align:center; margin-bottom:4px; }
.auth-sub { font-size:13px; text-align:center; color:var(--text-muted); margin-bottom:24px; }
.auth-error { background:rgba(200,60,60,.12); border:1px solid rgba(200,60,60,.3); color:var(--danger); font-size:13px; padding:10px 14px; border-radius:var(--r-sm); margin-bottom:14px; text-align:center; }
.field-wrap { margin-bottom:14px; }
.field-wrap label { display:block; font-size:12px; font-weight:700; color:var(--text-muted); margin-bottom:5px; text-transform:uppercase; letter-spacing:.5px; }
.field-input { width:100%; background:var(--bg); border:1px solid var(--border); color:var(--text); padding:13px 14px; border-radius:var(--r-sm); font-size:14px; outline:none; }
.field-input:focus { border-color:var(--primary); }
.btn-block { width:100%; justify-content:center; }
.auth-link { text-align:center; margin-top:18px; font-size:13px; color:var(--text-muted); }
.auth-link a { color:var(--primary-light); font-weight:600; text-decoration:none; }
</style>
