<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

function go(page) {
  router.push({ name: page })
}
</script>

<template>
  <div class="welcome-splash">
    <div class="ws-bg-pattern"></div>
    <div class="ws-content">
      <div class="ws-logo-icon">🍽️</div>
      <div class="ws-title">DarnaFood</div>
      <div class="ws-sub">دارنا فود</div>
      <p class="ws-desc">La première plateforme de livraison de cuisine maison en Algérie.</p>
      <div class="ws-actions">
        <button class="btn-primary btn-lg" @click="go('home')">🏠 Accueil</button>
        <button class="btn-outline btn-lg" @click="go('kitchens')">🍽️ Voir les cuisines</button>
      </div>
      <div class="ws-auth">
        <span v-if="!auth.isAuthenticated">
          <a href="#" @click.prevent="go('login')">Se connecter</a>
          <span class="ws-dot">·</span>
          <a href="#" @click.prevent="go('register')">S'inscrire</a>
        </span>
        <span v-else>
          Bonjour {{ auth.user.firstName || auth.user.name }} !
          <a href="#" @click.prevent="auth.isCuisinier ? go('dashboard') : go('myorders')">Mon compte</a>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.welcome-splash { min-height:100vh; display:flex; align-items:center; justify-content:center; background:var(--bg); position:relative; }
.ws-bg-pattern { position:absolute; inset:0; background:radial-gradient(circle at 30% 40%,rgba(232,144,26,.06) 0%,transparent 50%),radial-gradient(circle at 70% 60%,rgba(232,144,26,.04) 0%,transparent 50%); pointer-events:none; }
.ws-content { position:relative; z-index:1; text-align:center; padding:40px 20px; }
.ws-logo-icon { width:90px; height:90px; margin:0 auto 18px; background:linear-gradient(135deg,var(--primary-light),var(--primary-dark)); border-radius:var(--r); display:flex; align-items:center; justify-content:center; font-size:48px; box-shadow:0 8px 32px rgba(232,144,26,.3); }
.ws-title { font-size:48px; font-weight:900; background:linear-gradient(135deg,var(--primary-light),var(--primary)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.ws-sub { font-family:'Cairo',sans-serif; font-size:16px; color:var(--text-muted); margin-bottom:14px; }
.ws-desc { color:var(--text-muted); font-size:16px; max-width:360px; margin:0 auto 26px; line-height:1.6; }
.ws-actions { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin-bottom:22px; }
.ws-auth { font-size:14px; color:var(--text-muted); display:flex; gap:8px; justify-content:center; }
.ws-auth a { color:var(--primary-light); text-decoration:none; font-weight:600; }
.ws-dot { color:var(--border); }
</style>
