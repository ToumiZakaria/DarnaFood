<script setup>
</script>

<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-col brand">
        <div class="footer-logo">
          <div class="footer-logo-icon">D</div>
          <div class="footer-logo-word">
            <span class="footer-logo-name">DarnaFood</span>
            <span class="footer-logo-ar">دارنا فود</span>
          </div>
        </div>
        <p class="footer-desc">La première plateforme de livraison de cuisine maison en Algérie.</p>
      </div>
      <div class="footer-col">
        <h4 class="footer-col-title">Plateforme</h4>
        <a href="#">Cuisines</a>
        <a href="#">Catégories</a>
        <a href="#">Promotions</a>
      </div>
      <div class="footer-col">
        <h4 class="footer-col-title">Cuisiniers</h4>
        <a href="#">Devenir partenaire</a>
        <a href="#">Tableau de bord</a>
        <a href="#">Support</a>
      </div>
      <div class="footer-col">
        <h4 class="footer-col-title">Aide</h4>
        <a href="#">FAQ</a>
        <a href="#">Contact</a>
        <a href="#">Conditions</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p class="footer-copy">© 2025 DarnaFood. Tous droits réservés.</p>
      <div class="footer-badges">
        <span class="footer-badge">Paiement à la livraison</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer { background:#fff; border-top:1px solid #E5E7EB; padding:48px 24px 24px; }
.footer-inner { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:40px; margin-bottom:40px; }
.footer-logo { display:flex; align-items:center; gap:10px; }
.footer-logo-icon { width:36px; height:36px; background:linear-gradient(135deg,#E8813A,#D4702A); border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:800; color:#fff; }
.footer-logo-word { line-height:1; }
.footer-logo-name { font-size:18px; font-weight:800; color:#1A1A1A; }
.footer-logo-ar { font-family:'Cairo',sans-serif; font-size:10px; color:#9CA3AF; }
.footer-desc { font-size:14px; color:#6B7280; line-height:1.7; margin-top:16px; max-width:260px; }
.footer-col { display:flex; flex-direction:column; gap:10px; }
.footer-col-title { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#9CA3AF; margin-bottom:6px; }
.footer-col a { font-size:14px; color:#6B7280; text-decoration:none; }
.footer-col a:hover { color:#E8813A; }
.footer-bottom { max-width:1200px; margin:0 auto; padding-top:20px; border-top:1px solid #F3F4F6; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
.footer-copy { font-size:13px; color:#9CA3AF; }
.footer-badge { background:#F9FAFB; border:1px solid #E5E7EB; padding:4px 12px; border-radius:8px; font-size:11px; font-weight:600; color:#6B7280; }
@media(max-width:768px) { .footer-inner { grid-template-columns:1fr 1fr; } .brand { grid-column:1/-1; } }
@media(max-width:480px) { .footer-inner { grid-template-columns:1fr; } }
</style>