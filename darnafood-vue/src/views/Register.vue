<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const step = ref(1)
const role = ref(null)
const loading = ref(false)
const error = ref('')

const clientForm = ref({ fn: '', ln: '', email: '', phone: '', wilaya: '', commune: '', pwd: '' })
const cuisinierForm = ref({ fn: '', ln: '', dob: '', bwilaya: '', cin: '', name: '', cat: '', wilaya: '', commune: '', desc: '', phone: '', email: '', pwd: '' })

function selectRole(r) {
  role.value = r
}
function nextStep() {
  if (!role.value) { window.showToast?.('⚠️ Veuillez choisir votre rôle', 'error'); return }
  step.value = 2
}
function prevStep() {
  step.value = 1
}

async function doRegister() {
  error.value = ''
  let payload = {}
  if (role.value === 'client') {
    const f = clientForm.value
    if (!f.fn || !f.ln || !f.email || !f.phone || !f.wilaya || !f.pwd) { window.showToast?.('⚠️ Veuillez remplir tous les champs obligatoires', 'error'); return }
    if (f.pwd.length < 6) { window.showToast?.('⚠️ Le mot de passe doit faire au moins 6 caractères', 'error'); return }
    payload = { name:`${f.fn} ${f.ln}`, firstName:f.fn, lastName:f.ln, email:f.email, password:f.pwd, role:'client', phone:f.phone, wilaya:f.wilaya, commune:f.commune }
  } else {
    const f = cuisinierForm.value
    if (!f.fn || !f.ln || !f.dob || !f.bwilaya || !f.cin) { window.showToast?.('⚠️ Veuillez remplir vos informations d\'identité', 'error'); return }
    if (f.cin.replace(/\s/g,'').length < 6) { window.showToast?.('⚠️ Numéro CIN invalide', 'error'); return }
    if (!f.name || !f.cat || !f.wilaya || !f.phone || !f.email || !f.pwd) { window.showToast?.('⚠️ Veuillez remplir tous les champs obligatoires', 'error'); return }
    if (f.pwd.length < 6) { window.showToast?.('⚠️ Le mot de passe doit faire au moins 6 caractères', 'error'); return }
    payload = { name:f.name, firstName:f.fn, lastName:f.ln, dob:f.dob, birthWilaya:f.bwilaya, cin:f.cin, email:f.email, password:f.pwd, role:'cuisinier', cat:f.cat, wilaya:f.wilaya, commune:f.commune, desc:f.desc, phone:f.phone }
  }
  loading.value = true
  try {
    const result = await auth.register(payload)
    if (result.success) {
      window.showToast?.('🎉 Compte créé !', 'success')
      router.push(auth.isCuisinier ? { name: 'dashboard' } : { name: 'home' })
    } else {
      error.value = result.error || 'Erreur lors de la création'
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
        <h1 class="auth-title">Créer un compte</h1>
        <p class="auth-sub">Rejoignez la communauté DarnaFood 🇩🇿</p>

        <div class="steps-indicator">
          <div class="step-dot" :class="{ active: step === 1 }"></div>
          <div class="step-dot" :class="{ active: step === 2 }"></div>
        </div>

        <div v-if="error" style="background:rgba(200,60,60,.12);border:1px solid rgba(200,60,60,.3);color:var(--danger);font-size:13px;padding:10px 14px;border-radius:var(--r-sm);margin-bottom:14px;text-align:center;">{{ error }}</div>

        <!-- Step 1: Role picker -->
        <div v-if="step === 1">
          <p style="font-size:14px;font-weight:600;text-align:center;margin-bottom:16px;color:var(--text-muted);">Je suis...</p>
          <div class="role-grid">
            <div class="role-card" :class="{ selected: role === 'client' }" @click="selectRole('client')">
              <span class="role-icon">🛒</span>
              <div class="role-name">Client</div>
              <div class="role-desc">Je veux commander de la cuisine maison</div>
            </div>
            <div class="role-card" :class="{ selected: role === 'cuisinier' }" @click="selectRole('cuisinier')">
              <span class="role-icon">👩‍🍳</span>
              <div class="role-name">Cuisinier</div>
              <div class="role-desc">Je veux vendre mes plats maison</div>
            </div>
          </div>
          <button class="btn-primary btn-block" style="margin-top:8px;" @click="nextStep">Continuer →</button>
        </div>

        <!-- Step 2: Form -->
        <div v-else>
          <!-- Client form -->
          <div v-if="role === 'client'" id="reg-form-client">
            <div class="form-row">
              <div class="form-group"><label class="form-label">Prénom *</label><input type="text" class="form-input" v-model="clientForm.fn" placeholder="Votre prénom"></div>
              <div class="form-group"><label class="form-label">Nom *</label><input type="text" class="form-input" v-model="clientForm.ln" placeholder="Votre nom"></div>
            </div>
            <div class="form-group"><label class="form-label">Email *</label><input type="email" class="form-input" v-model="clientForm.email" placeholder="votre@email.com"></div>
            <div class="form-group"><label class="form-label">Téléphone *</label><input type="tel" class="form-input" v-model="clientForm.phone" placeholder="06 XX XX XX XX"></div>
            <div class="form-group">
              <label class="form-label">Wilaya *</label>
              <select class="form-select" v-model="clientForm.wilaya">
                <option value="">Sélectionner votre wilaya...</option>
                <option>Adrar</option><option>Chlef</option><option>Laghouat</option><option>Oum El Bouaghi</option><option>Batna</option><option>Béjaïa</option><option>Biskra</option><option>Béchar</option><option>Blida</option><option>Bouira</option><option>Tamanrasset</option><option>Tébessa</option><option>Tlemcen</option><option>Tiaret</option><option>Tizi Ouzou</option><option>Alger</option><option>Djelfa</option><option>Jijel</option><option>Sétif</option><option>Saïda</option><option>Skikda</option><option>Sidi Bel Abbès</option><option>Annaba</option><option>Guelma</option><option>Constantine</option><option>Médéa</option><option>Mostaganem</option><option>M'Sila</option><option>Mascara</option><option>Ouargla</option><option>Oran</option><option>El Bayadh</option><option>Illizi</option><option>Bordj Bou Arréridj</option><option>Boumerdès</option><option>El Tarf</option><option>Tindouf</option><option>Tissemsilt</option><option>El Oued</option><option>Khenchela</option><option>Souk Ahras</option><option>Tipaza</option><option>Mila</option><option>Aïn Defla</option><option>Naâma</option><option>Aïn Témouchent</option><option>Ghardaïa</option><option>Relizane</option><option>Timimoun</option><option>Bordj Badji Mokhtar</option><option>Ouled Djellal</option><option>Béni Abbès</option><option>In Salah</option><option>In Guezzam</option><option>Touggourt</option><option>Djanet</option><option>El M'Ghair</option><option>El Meniaa</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Commune *</label>
              <select class="form-select" v-model="clientForm.commune">
                <option value="">Sélectionnez d'abord une wilaya</option>
              </select>
            </div>
            <div class="form-group"><label class="form-label">Mot de passe *</label><input type="password" class="form-input" v-model="clientForm.pwd" placeholder="Minimum 6 caractères"></div>
          </div>

          <!-- Cuisinier form -->
          <div v-else id="reg-form-cuisinier">
            <div style="background:var(--primary-glow);border:1px solid rgba(232,144,26,.3);border-radius:var(--r);padding:12px 14px;margin-bottom:20px;display:flex;gap:10px;align-items:flex-start;">
              <span style="font-size:20px;flex-shrink:0">📍</span>
              <div>
                <div style="font-size:13px;font-weight:700;color:var(--primary-light);margin-bottom:2px;">Vérification d'identité</div>
                <div style="font-size:12px;color:var(--text-muted);line-height:1.5;">Ces informations sont nécessaires pour activer votre compte cuisinier. Elles restent confidentielles.</div>
              </div>
            </div>
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--border);">Identité personnelle</div>
            <div class="form-row">
              <div class="form-group"><label class="form-label">Prénom *</label><input type="text" class="form-input" v-model="cuisinierForm.fn" placeholder="Votre prénom"></div>
              <div class="form-group"><label class="form-label">Nom *</label><input type="text" class="form-input" v-model="cuisinierForm.ln" placeholder="Votre nom de famille"></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label class="form-label">Date de naissance *</label><input type="date" class="form-input" v-model="cuisinierForm.dob"></div>
              <div class="form-group">
                <label class="form-label">Wilaya de naissance *</label>
                <select class="form-select" v-model="cuisinierForm.bwilaya">
                  <option value="">Sélectionner...</option>
                  <option>Adrar</option><option>Chlef</option><option>Laghouat</option><option>Oum El Bouaghi</option><option>Batna</option><option>Béjaïa</option><option>Biskra</option><option>Béchar</option><option>Blida</option><option>Bouira</option><option>Tamanrasset</option><option>Tébessa</option><option>Tlemcen</option><option>Tiaret</option><option>Tizi Ouzou</option><option>Alger</option><option>Djelfa</option><option>Jijel</option><option>Sétif</option><option>Saïda</option><option>Skikda</option><option>Sidi Bel Abbès</option><option>Annaba</option><option>Guelma</option><option>Constantine</option><option>Médéa</option><option>Mostaganem</option><option>M'Sila</option><option>Mascara</option><option>Ouargla</option><option>Oran</option><option>El Bayadh</option><option>Illizi</option><option>Bordj Bou Arréridj</option><option>Boumerdès</option><option>El Tarf</option><option>Tindouf</option><option>Tissemsilt</option><option>El Oued</option><option>Khenchela</option><option>Souk Ahras</option><option>Tipaza</option><option>Mila</option><option>Aïn Defla</option><option>Naâma</option><option>Aïn Témouchent</option><option>Ghardaïa</option><option>Relizane</option><option>Timimoun</option><option>Bordj Badji Mokhtar</option><option>Ouled Djellal</option><option>Béni Abbès</option><option>In Salah</option><option>In Guezzam</option><option>Touggourt</option><option>Djanet</option><option>El M'Ghair</option><option>El Meniaa</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">N° Carte Nationale d'Identité (CIN) *</label>
              <input type="text" class="form-input" v-model="cuisinierForm.cin" placeholder="Ex: 123456789" maxlength="18" style="letter-spacing:2px;font-family:monospace;font-size:15px;">
              <div style="font-size:11px;color:var(--text-muted);margin-top:5px;">Votre CIN est utilisée uniquement pour la vérification de votre identité.</div>
            </div>
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);margin:18px 0 12px;padding-bottom:8px;border-bottom:1px solid var(--border);">Votre cuisine</div>
            <div class="form-group"><label class="form-label">Nom de votre cuisine *</label><input type="text" class="form-input" v-model="cuisinierForm.name" placeholder="Ex: Dar Lalla Fatima"></div>
            <div class="form-group">
              <label class="form-label">Spécialité principale *</label>
              <input type="text" class="form-input" v-model="cuisinierForm.cat" placeholder="Ex: Couscous, Berkoukes, Chakhchoukha...">
            </div>
            <div class="form-group">
              <label class="form-label">Wilaya *</label>
              <select class="form-select" v-model="cuisinierForm.wilaya">
                <option value="">Sélectionner votre wilaya...</option>
                <option>Adrar</option><option>Chlef</option><option>Laghouat</option><option>Oum El Bouaghi</option><option>Batna</option><option>Béjaïa</option><option>Biskra</option><option>Béchar</option><option>Blida</option><option>Bouira</option><option>Tamanrasset</option><option>Tébessa</option><option>Tlemcen</option><option>Tiaret</option><option>Tizi Ouzou</option><option>Alger</option><option>Djelfa</option><option>Jijel</option><option>Sétif</option><option>Saïda</option><option>Skikda</option><option>Sidi Bel Abbès</option><option>Annaba</option><option>Guelma</option><option>Constantine</option><option>Médéa</option><option>Mostaganem</option><option>M'Sila</option><option>Mascara</option><option>Ouargla</option><option>Oran</option><option>El Bayadh</option><option>Illizi</option><option>Bordj Bou Arréridj</option><option>Boumerdès</option><option>El Tarf</option><option>Tindouf</option><option>Tissemsilt</option><option>El Oued</option><option>Khenchela</option><option>Souk Ahras</option><option>Tipaza</option><option>Mila</option><option>Aïn Defla</option><option>Naâma</option><option>Aïn Témouchent</option><option>Ghardaïa</option><option>Relizane</option><option>Timimoun</option><option>Bordj Badji Mokhtar</option><option>Ouled Djellal</option><option>Béni Abbès</option><option>In Salah</option><option>In Guezzam</option><option>Touggourt</option><option>Djanet</option><option>El M'Ghair</option><option>El Meniaa</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Commune *</label>
              <select class="form-select" v-model="cuisinierForm.commune">
                <option value="">Sélectionnez d'abord une wilaya</option>
              </select>
            </div>
            <div class="form-group"><label class="form-label">Description</label><textarea class="form-textarea" v-model="cuisinierForm.desc" placeholder="Décrivez votre cuisine maison..."></textarea></div>
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);margin:18px 0 12px;padding-bottom:8px;border-bottom:1px solid var(--border);">Contact &amp; accès</div>
            <div class="form-group"><label class="form-label">Téléphone *</label><input type="tel" class="form-input" v-model="cuisinierForm.phone" placeholder="06 XX XX XX XX"></div>
            <div class="form-group"><label class="form-label">Email *</label><input type="email" class="form-input" v-model="cuisinierForm.email" placeholder="votre@email.com"></div>
            <div class="form-group"><label class="form-label">Mot de passe *</label><input type="password" class="form-input" v-model="cuisinierForm.pwd" placeholder="Minimum 6 caractères"></div>
          </div>

          <div style="display:flex;gap:10px;margin-top:8px;">
            <button class="btn-ghost" style="padding:12px;" @click="prevStep">← Retour</button>
            <button class="btn-primary" style="flex:1;justify-content:center;" @click="doRegister" :disabled="loading">{{ loading ? 'Création...' : 'Créer mon compte →' }}</button>
          </div>
        </div>

        <div class="auth-footer">Déjà un compte ? <a @click="router.push({name:'login'})">Se connecter</a></div>
      </div>
    </div>
  </div>
</template>
