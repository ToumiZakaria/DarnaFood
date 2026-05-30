"use client";

import { useState } from "react";
import { Bell, ToggleLeft, ToggleRight } from "lucide-react";

const notifItems = [
  { id: "new_order", label: "Nouvelles commandes", desc: "Quand un client passe une commande" },
  { id: "order_status", label: "Changements de statut", desc: "Mises à jour de vos commandes" },
  { id: "reviews", label: "Nouveaux avis", desc: "Quand un client laisse un avis" },
  { id: "messages", label: "Messages", desc: "Nouveaux messages des clients" },
  { id: "promotions", label: "Promotions", desc: "Offres et actualités DarnaFood" },
];

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}>
      {on ? <ToggleRight size={32} color="#F97316" /> : <ToggleLeft size={32} color="#CBD5E1" />}
    </button>
  );
}

export default function NotificationsSection() {
  const [notifs, setNotifs] = useState<Record<string, boolean>>({
    new_order: true,
    order_status: true,
    reviews: true,
    messages: false,
    promotions: false,
  });

  return (
    <div style={{ background: "white", borderRadius: 20, border: "1px solid #F1F5F9", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "1.25rem 1.75rem", borderBottom: "1px solid #F1F5F9" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Bell size={18} color="#F97316" />
        </div>
        <div>
          <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#0F172A", margin: 0 }}>Notifications</h2>
          <p style={{ fontSize: "13px", color: "#94A3B8", margin: "2px 0 0" }}>Choisissez ce que vous souhaitez recevoir</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {notifItems.map((item, i, arr) => (
          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.75rem", borderBottom: i < arr.length - 1 ? "1px solid #F1F5F9" : "none" }}>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "#0F172A" }}>{item.label}</div>
              <div style={{ fontSize: "13px", color: "#94A3B8", marginTop: 2 }}>{item.desc}</div>
            </div>
            <Toggle on={notifs[item.id]} onToggle={() => setNotifs(n => ({ ...n, [item.id]: !n[item.id] }))} />
          </div>
        ))}
      </div>
    </div>
  );
}
