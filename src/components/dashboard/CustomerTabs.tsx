"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, User as UserIcon, Eye } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: Date;
  cook: {
    name: string | null;
  };
  items: {
    quantity: number;
    dish: {
      name: string;
    };
  }[];
}

interface UserProfile {
  name: string | null;
  email: string;
  phone: string | null;
}

export default function CustomerTabs({ orders, user }: { orders: Order[]; user: UserProfile }) {
  const [activeTab, setActiveTab] = useState<"ORDERS" | "PROFILE">("ORDERS");

  const statusColors: Record<string, string> = {
    PENDING: "badge-warning",
    CONFIRMED: "badge-primary",
    PREPARING: "badge-primary",
    DELIVERING: "badge-primary",
    COMPLETED: "badge-success",
    CANCELLED: "badge-error",
  };

  const statusText: Record<string, string> = {
    PENDING: "En attente",
    CONFIRMED: "Confirmée",
    PREPARING: "En préparation",
    DELIVERING: "En livraison",
    COMPLETED: "Terminée",
    CANCELLED: "Annulée",
  };

  return (
    <div>
      <div className="flex gap-4 border-b mb-6">
        <button
          onClick={() => setActiveTab("ORDERS")}
          className={`pb-4 px-2 border-b-2 font-medium flex items-center gap-2 ${
            activeTab === "ORDERS" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Package className="w-5 h-5" />
          Mes Commandes
        </button>
        <button
          onClick={() => setActiveTab("PROFILE")}
          className={`pb-4 px-2 border-b-2 font-medium flex items-center gap-2 ${
            activeTab === "PROFILE" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <UserIcon className="w-5 h-5" />
          Mon Profil
        </button>
      </div>

      {activeTab === "ORDERS" && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Vous n&apos;avez pas encore passé de commande.</p>
              <Link href="/" className="btn btn-primary mt-4">Découvrir les plats</Link>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="card p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center hover:shadow-md transition-all">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg">Commande #{order.id.slice(-6).toUpperCase()}</span>
                    <span className={`badge ${statusColors[order.status] || "badge-neutral"}`}>
                      {statusText[order.status] || order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Chez {order.cook.name || "Cuisinier inconnu"} • {format(new Date(order.createdAt), "d MMM yyyy 'à' HH:mm", { locale: fr })}
                  </p>
                  <p className="text-sm">
                    {order.items.map(i => `${i.quantity}x ${i.dish?.name || "Plat"}`).join(", ")}
                  </p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <span className="font-bold text-xl">{order.totalAmount} DZD</span>
                  <Link href={`/dashboard/orders/${order.id}`} className="btn btn-secondary">
                    <Eye className="w-4 h-4" /> Détails
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "PROFILE" && (
        <div className="card p-6 max-w-2xl">
          <h2 className="text-xl font-bold mb-6">Informations personnelles</h2>
          <form className="space-y-4">
            <div className="form-group">
              <label className="label">Nom complet</label>
              <input type="text" className="input" defaultValue={user.name || ""} placeholder="Votre nom" />
            </div>
            <div className="form-group">
              <label className="label">Adresse Email (Lecture seule)</label>
              <input type="email" className="input bg-gray-50" defaultValue={user.email} disabled />
            </div>
            <div className="form-group">
              <label className="label">Numéro de téléphone</label>
              <input type="tel" className="input" defaultValue={user.phone || ""} placeholder="Ex: 0555..." />
            </div>
            <button type="button" className="btn btn-primary mt-4">Enregistrer les modifications</button>
            <p className="text-sm text-gray-500 mt-2">Note: La modification du profil n&apos;est pas encore connectée à l&apos;API dans cette phase.</p>
          </form>
        </div>
      )}
    </div>
  );
}
