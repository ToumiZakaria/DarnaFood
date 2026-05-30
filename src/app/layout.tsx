import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/providers/AuthProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "DarnaFood — Plats faits maison en Algérie",
    template: "%s | DarnaFood",
  },
  description:
    "Découvrez et commandez des plats faits maison préparés par des cuisiniers locaux algériens. Livraison à domicile ou retrait chez le cuisinier.",
  keywords: ["plats maison", "algérie", "livraison", "cuisinier", "couscous", "tajine", "chorba"],
  authors: [{ name: "DarnaFood" }],
  creator: "DarnaFood",
  openGraph: {
    type: "website",
    locale: "fr_DZ",
    siteName: "DarnaFood",
    title: "DarnaFood — Plats faits maison en Algérie",
    description:
      "Découvrez et commandez des plats faits maison préparés par des cuisiniers locaux algériens.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={nunito.variable}>
      <body>
        <AuthProvider>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Navbar />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
          </div>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-lg)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                background: "var(--surface)",
                padding: "0.75rem 1rem",
              },
              success: {
                iconTheme: {
                  primary: "var(--secondary)",
                  secondary: "white",
                },
              },
              error: {
                iconTheme: {
                  primary: "var(--error)",
                  secondary: "white",
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
