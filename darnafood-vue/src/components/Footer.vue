<script setup>
</script>

<template>
  <footer class="footer">
    <div class="footer-grid">
      <div>
        <div class="nav-logo" style="margin-bottom:2px;">
          <div class="nav-logo-icon">🍽️</div>
          <div class="nav-logo-wordmark">
            <div class="nav-logo-en">DarnaFood</div>
            <div class="nav-logo-ar">دارنا فود</div>
          </div>
        </div>
        <p class="footer-brand-desc">La première plateforme de livraison de cuisine maison en Algérie.</p>
        <div class="footer-socials">
          <a href="#" class="footer-social">📘</a>
          <a href="#" class="footer-social">📸</a>
          <a href="#" class="footer-social">🎵</a>
          <a href="#" class="footer-social">💬</a>
        </div>
      </div>
      <div>
        <h4 class="footer-col-title">Plateforme</h4>
        <ul class="footer-links">
          <li><a href="#">Cuisines</a></li>
          <li><a href="#">Catégories</a></li>
          <li><a href="#">Promotions</a></li>
        </ul>
      </div>
      <div>
        <h4 class="footer-col-title">Cuisiniers</h4>
        <ul class="footer-links">
          <li><a href="#">Devenir partenaire</a></li>
          <li><a href="#">Tableau de bord</a></li>
          <li><a href="#">Support</a></li>
        </ul>
      </div>
      <div>
        <h4 class="footer-col-title">Aide</h4>
        <ul class="footer-links">
          <li><a href="#">FAQ</a></li>
          <li><a href="#">Contact</a></li>
          <li><a href="#">Conditions</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p class="footer-copy">© 2025 DarnaFood. Tous droits réservés. 🇩🇿</p>
      <div class="pay-badges">
        <span class="pay-badge">💵 Cash</span>
        <span class="pay-badge">📦 Livraison</span>
        <span class="pay-badge">✅ Paiement à réception</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer { background:var(--bg-card); border-top:1px solid var(--border); padding:56px 32px 28px; }
.footer-grid { max-width:1180px; margin:0 auto; display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:40px; margin-bottom:48px; }
.nav-logo { display:flex; align-items:center; gap:10px; cursor:pointer; }
.nav-logo-icon { width:40px; height:40px; background:linear-gradient(135deg,var(--primary-light),var(--primary-dark)); border-radius:var(--r-sm); display:flex; align-items:center; justify-content:center; font-size:22px; }
.nav-logo-en { font-size:20px; font-weight:800; background:linear-gradient(135deg,var(--primary-light),var(--primary)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.nav-logo-ar { font-family:'Cairo',sans-serif; font-size:11px; color:var(--text-muted); }
.footer-brand-desc { font-size:14px; color:var(--text-muted); line-height:1.75; margin:16px 0 22px; max-width:270px; }
.footer-socials { display:flex; gap:10px; }
.footer-social { width:36px; height:36px; border-radius:var(--r-sm); background:var(--bg-elevated); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-size:16px; text-decoration:none; }
.footer-social:hover { border-color:var(--primary); background:var(--primary-glow); }
.footer-col-title { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1.2px; color:var(--text-muted); margin-bottom:16px; }
.footer-links { list-style:none; padding:0; }
.footer-links li { margin-bottom:10px; }
.footer-links a { font-size:14px; color:var(--text-muted); text-decoration:none; }
.footer-links a:hover { color:var(--primary-light); }
.footer-bottom { max-width:1180px; margin:0 auto; padding-top:24px; border-top:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
.footer-copy { font-size:13px; color:var(--text-muted); }
.pay-badges { display:flex; gap:8px; }
.pay-badge { background:var(--bg-elevated); border:1px solid var(--border); padding:5px 12px; border-radius:var(--r-sm); font-size:11px; font-weight:600; color:var(--text-muted); }
@media(max-width:900px) { .footer-grid { grid-template-columns:1fr 1fr; } }
@media(max-width:600px) { .footer-grid { grid-template-columns:1fr; } }
</style>
