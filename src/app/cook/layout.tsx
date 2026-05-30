import CookSidebar from "@/components/cook/CookSidebar";
import CookHeader from "@/components/cook/CookHeader";
import NewOrderAlert from "@/components/cook/NewOrderAlert";

export const metadata = {
  title: "Espace Cuisinier | DarnaFood",
};

export default function CookLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8FAFC" }}>
      <CookSidebar />
      <div className="cook-layout-content" style={{ marginLeft: 280, flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <CookHeader />
        <main style={{ padding: "2rem", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          {children}
        </main>
      </div>
      <NewOrderAlert />
    </div>
  );
}
