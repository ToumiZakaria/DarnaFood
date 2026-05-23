<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { KITCHENS, CATS } from '../data'
import KitchenCard from '../components/KitchenCard.vue'

const router = useRouter()
const auth = useAuthStore()
const featured = ref([])
const topRated = ref([])
const activeCat = ref(null)
const filterCat = ref(null)

onMounted(() => {
  featured.value = KITCHENS.filter(k => k.featured)
  topRated.value = [...KITCHENS].sort((a, b) => b.rating - a.rating).slice(0, 4)
})

function setCat(cat) {
  filterCat.value = filterCat.value === cat ? null : cat
}
</script>

<template>
  <!-- CUISINIER HOME -->
  <div v-if="auth.isCuisinier" class="main-content page-home">
    <section class="chef-hero">
      <div class="hero-glow"></div>
      <div class="chef-hero-content">
        <div class="chef-avatar">{{ (auth.user?.firstName || 'C').charAt(0) }}</div>
        <h1 class="chef-title">Bonjour, {{ auth.user?.firstName || 'Chef' }} ! 👋</h1>
        <p class="chef-sub">Bienvenue sur votre espace cuisinier DarnaFood</p>
        <div class="chef-actions">
          <button class="btn-primary btn-lg hero-btn" @click="router.push({name:'dashboard'})">📊 Tableau de bord</button>
          <button class="btn-outline btn-lg hero-btn" @click="router.push({name:'kitchens'})">🍽️ Voir les cuisines</button>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="chef-stats">
        <div class="chef-stat-card"><span class="chef-stat-icon">📦</span><div class="chef-stat-val">8</div><div class="chef-stat-label">Commandes aujourd'hui</div></div>
        <div class="chef-stat-card"><span class="chef-stat-icon">💵</span><div class="chef-stat-val">4 500 DA</div><div class="chef-stat-label">Revenus du jour</div></div>
        <div class="chef-stat-card"><span class="chef-stat-icon">⭐</span><div class="chef-stat-val">4.9</div><div class="chef-stat-label">Note moyenne</div></div>
        <div class="chef-stat-card"><span class="chef-stat-icon">👥</span><div class="chef-stat-val">18</div><div class="chef-stat-label">Clients fidèles</div></div>
      </div>
    </section>
  </div>

  <!-- CLIENT / GUEST HOME -->
  <div v-else class="main-content page-home">
    <section class="hero">
      <div class="hero-glow"></div>
      <div class="hero-bg-float">
        <span>🍲</span><span>🥘</span><span>🧆</span><span>🥗</span><span>🫓</span><span>🍛</span><span>🥩</span><span>🍖</span>
      </div>
      <div class="hero-content">
        <p class="hero-greeting">Bonjour, dar !</p>
        <h1 class="hero-title">Des repas faits<br>maison, livrés<br>chez <span class="gold">vous</span></h1>
        <p class="hero-sub">Découvrez les cuisines maison de Oued Rhiou et ses environs. Des plats authentiques préparés avec amour par vos voisins.</p>
        <div class="hero-actions">
          <button class="btn-primary btn-lg hero-btn" @click="router.push({name:'kitchens'})">Voir les cuisines</button>
          <button class="btn-outline btn-lg hero-btn" @click="router.push({name:'kitchens'})">Comment ça marche</button>
        </div>
      </div>
      <div class="hero-stats">
        <div class="hero-stat"><span class="hero-stat-val">120+</span><span class="hero-stat-label">Cuisines</span></div>
        <div class="hero-stat"><span class="hero-stat-val">58</span><span class="hero-stat-label">Wilayas</span></div>
        <div class="hero-stat"><span class="hero-stat-val">4.8</span><span class="hero-stat-label">Note</span></div>
      </div>
    </section>

    <section class="section how-section">
      <h2 class="section-title">Comment ça marche</h2>
      <div class="how-grid">
        <div class="how-card"><div class="hc-icon">🔍</div><div class="hc-title">Choisissez</div><div class="hc-desc">Parcourez les cuisines proches de chez vous</div></div>
        <div class="how-card"><div class="hc-icon">🛒</div><div class="hc-title">Commandez</div><div class="hc-desc">Ajoutez vos plats préférés au panier</div></div>
        <div class="how-card"><div class="hc-icon">📦</div><div class="hc-title">Recevez</div><div class="hc-desc">Livraison rapide à votre porte</div></div>
      </div>
    </section>

    <section class="section">
      <div class="section-heading">
        <h2 class="section-title">Catégories</h2>
        <button class="btn-ghost-sm" @click="router.push({name:'kitchens'})">Voir tout →</button>
      </div>
      <div class="cats-scroll">
        <button v-for="c in CATS" :key="c.id" class="cat-chip" @click="setCat(c.id)">
          <span>{{ c.emoji }}</span>{{ c.label }}
        </button>
      </div>
    </section>

    <section class="section kitchens-section">
      <div class="section-heading">
        <h2 class="section-title">🌟 Recommandés</h2>
        <button class="btn-ghost-sm" @click="router.push({name:'kitchens'})">Toutes les cuisines →</button>
      </div>
      <div v-if="featured.length" class="k-grid">
        <KitchenCard v-for="k in featured" :key="k.id" :kitchen="k" />
      </div>
    </section>

    <section v-if="!auth.isAuthenticated" class="section cta-section">
      <div class="cta-card">
        <h2 class="cta-title">Vous cuisinez ? Rejoignez-nous !</h2>
        <p class="cta-desc">Transformez votre passion en revenus. Créez votre cuisine virtuelle et commencez à recevoir des commandes dès aujourd'hui.</p>
        <button class="btn-primary btn-lg" @click="router.push({name:'register'})">👨‍🍳 Devenir cuisinier</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.main-content { min-height:calc(100vh - 68px); }

/* Chef home */
.chef-hero { position:relative; min-height:400px; display:flex; align-items:center; justify-content:center; text-align:center; padding:80px 20px 40px; overflow:hidden; }
.hero-glow { position:absolute; top:-40%; left:50%; transform:translateX(-50%); width:700px; height:700px; background:radial-gradient(circle,rgba(232,144,26,.12) 0%,transparent 70%); pointer-events:none; }
.chef-hero-content { position:relative; }
.chef-avatar { width:80px; height:80px; border-radius:50%; background:linear-gradient(135deg,var(--primary-light),var(--primary-dark)); display:flex; align-items:center; justify-content:center; font-size:36px; font-weight:800; color:#fff; margin:0 auto 16px; box-shadow:0 8px 32px rgba(232,144,26,.3); }
.chef-title { font-size:36px; font-weight:800; margin-bottom:8px; }
.chef-sub { font-size:16px; color:var(--text-muted); margin-bottom:28px; }
.chef-actions { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; }
.hero-btn { padding:16px 32px; font-size:16px; border-radius:var(--r); }
.chef-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
.chef-stat-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--r-lg); padding:24px 20px; text-align:center; }
.chef-stat-icon { font-size:32px; display:block; margin-bottom:10px; }
.chef-stat-val { font-size:26px; font-weight:800; color:var(--primary-light); }
.chef-stat-label { font-size:12px; color:var(--text-muted); margin-top:4px; }

/* Guest/client home */
.hero { position:relative; min-height:540px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:120px 20px 40px; overflow:hidden; }
.hero-bg-float { position:absolute; inset:0; pointer-events:none; }
.hero-bg-float span { position:absolute; font-size:36px; opacity:.18; animation:float 18s ease-in-out infinite; }
.hero-bg-float span:nth-child(1){top:15%;left:8%;animation-delay:0s;font-size:42px;}
.hero-bg-float span:nth-child(2){top:65%;left:5%;animation-delay:2s;font-size:52px;}
.hero-bg-float span:nth-child(3){top:22%;right:12%;animation-delay:4s;font-size:38px;}
.hero-bg-float span:nth-child(4){top:55%;right:8%;animation-delay:6s;font-size:46px;}
.hero-bg-float span:nth-child(5){top:10%;left:50%;animation-delay:8s;font-size:34px;}
.hero-bg-float span:nth-child(6){top:75%;left:42%;animation-delay:10s;font-size:40px;}
.hero-bg-float span:nth-child(7){bottom:15%;right:22%;animation-delay:12s;font-size:44px;}
.hero-bg-float span:nth-child(8){top:38%;left:35%;animation-delay:14s;font-size:30px;}
@keyframes float { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-25px) rotate(8deg)} }
.hero-content { position:relative; max-width:700px; }
.hero-greeting { font-size:14px; font-weight:600; color:var(--primary-light); margin-bottom:12px; text-transform:uppercase; letter-spacing:2px; }
.hero-title { font-size:52px; font-weight:900; line-height:1.05; margin-bottom:18px; }
.hero-title .gold { background:linear-gradient(135deg,var(--primary-light),var(--primary)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.hero-sub { font-size:18px; color:var(--text-muted); margin-bottom:36px; max-width:480px; margin-left:auto; margin-right:auto; }
.hero-actions { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; }
.hero-stats { display:flex; gap:40px; justify-content:center; margin-top:48px; padding-top:32px; border-top:1px solid var(--border); width:100%; max-width:400px; }
.hero-stat { display:flex; flex-direction:column; align-items:center; gap:4px; }
.hero-stat-val { font-size:28px; font-weight:800; color:var(--primary-light); }
.hero-stat-label { font-size:12px; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; }
.section { padding:60px 28px; max-width:1180px; margin:0 auto; }
.section-heading { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; }
.section-title { font-size:24px; font-weight:800; }
.how-section { text-align:center; }
.how-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-top:32px; }
.how-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--r-lg); padding:36px 22px; }
.hc-icon { font-size:42px; margin-bottom:12px; }
.hc-title { font-size:18px; font-weight:700; margin-bottom:8px; }
.hc-desc { font-size:14px; color:var(--text-muted); line-height:1.6; }
.cats-scroll { display:flex; gap:10px; overflow-x:auto; padding-bottom:10px; }
.cat-chip { display:flex; align-items:center; gap:8px; background:var(--bg-card); border:1px solid var(--border); color:var(--text-muted); padding:12px 22px; border-radius:99px; font-size:14px; font-weight:600; cursor:pointer; white-space:nowrap; }
.cat-chip.active, .cat-chip:hover { border-color:var(--primary); background:var(--primary-glow); color:var(--primary-light); }
.k-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:24px; }
.cta-section { padding-bottom:60px; }
.cta-card { background:linear-gradient(145deg,var(--bg-card),var(--bg-elevated)); border:1px solid var(--border); border-radius:var(--r-lg); padding:64px 40px; text-align:center; }
.cta-title { font-size:32px; font-weight:800; margin-bottom:12px; }
.cta-desc { color:var(--text-muted); max-width:480px; margin:0 auto 28px; font-size:15px; line-height:1.7; }
@media(max-width:768px){.hero-title{font-size:36px;}.chef-title{font-size:26px;}.how-grid{grid-template-columns:1fr;}.chef-stats{grid-template-columns:1fr 1fr;}}
</style>
