<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function doLogin() {
  error.value = ''
  if (!email.value || !password.value) { window.showToast?.('⚠️ Veuillez remplir tous les champs', 'error'); return }
  loading.value = true
  try {
    const result = await auth.login(email.value, password.value)
    if (result.success) {
      window.showToast?.(`✅ Bienvenue !`, 'success')
      router.push(result.user?.role === 'cuisinier' ? { name: 'dashboard' } : { name: 'home' })
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
  <div class="page active" style="display:block">
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo" @click="router.push({name:'home'})">
          <div class="nav-logo-icon">🍽️</div>
          <div class="nav-logo-en" style="font-size:22px;">DarnaFood</div>
        </div>
        <h1 class="auth-title">Bon retour ! 👋</h1>
        <p class="auth-sub">Connectez-vous à votre compte DarnaFood</p>

        <div v-if="error" style="background:rgba(200,60,60,.12);border:1px solid rgba(200,60,60,.3);color:var(--danger);font-size:13px;padding:10px 14px;border-radius:var(--r-sm);margin-bottom:14px;text-align:center;">{{ error }}</div>

        <form @submit.prevent="doLogin">
          <div class="form-group">
            <label class="form-label">Adresse email</label>
            <input type="email" class="form-input" v-model="email" placeholder="votre@email.com">
          </div>
          <div class="form-group">
            <label class="form-label">Mot de passe</label>
            <input type="password" class="form-input" v-model="password" placeholder="••••••••">
          </div>
          <div style="text-align:right;margin:-6px 0 18px;">
            <a style="font-size:13px;color:var(--primary-light);cursor:pointer;">Mot de passe oublié ?</a>
          </div>
          <button type="submit" class="btn-primary btn-block" :disabled="loading">{{ loading ? 'Connexion...' : 'Se connecter →' }}</button>
        </form>

        <div class="auth-footer">Pas encore de compte ? <a @click="router.push({name:'register'})">S'inscrire gratuitement</a></div>
      </div>
    </div>
  </div>
</template>
