"use client";
import { useMemo, useState } from "react";

type Product = { id: string; name: string; description: string | null; priceCents: number; imageUrl: string | null; unit: string | null };
type Category = { id: string; name: string; products: Product[] };
type Store = {
  name: string; description: string | null; logoUrl: string | null;
  address: string; phone: string; colorPrimary: string; categories: Category[];
};

function money(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

export default function StoreCatalog({ store }: { store: Store }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | "all">("all");

  // Filtrage 100% côté client : rapide, pas d'aller-retour serveur à chaque
  // frappe. Les données de départ sont déjà limitées à CE commerce.
  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase();
    return store.categories
      .filter((c) => activeCategory === "all" || c.id === activeCategory)
      .map((c) => ({
        ...c,
        products: c.products.filter((p) => !term || p.name.toLowerCase().includes(term)),
      }))
      .filter((c) => c.products.length > 0);
  }, [store.categories, search, activeCategory]);

  const brand = store.colorPrimary || "#C1272D";

  return (
    <main style={{ fontFamily: "sans-serif", maxWidth: 960, margin: "0 auto", padding: "24px 20px 80px" }}>
      <header style={{ display: "flex", gap: 16, alignItems: "center", padding: 20, border: "1px solid #eee", borderRadius: 16, marginBottom: 24 }}>
        {store.logoUrl ? (
          <img src={store.logoUrl} alt={store.name} style={{ height: 56, borderRadius: 10 }} />
        ) : (
          <div style={{ width: 56, height: 56, borderRadius: 10, background: brand }} />
        )}
        <div>
          <h1 style={{ margin: 0, fontSize: "1.5rem" }}>{store.name}</h1>
          {store.description && <p style={{ margin: "4px 0", color: "#666" }}>{store.description}</p>}
          <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>{store.address} · {store.phone}</p>
        </div>
      </header>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher un produit..."
        style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #ddd", marginBottom: 16 }}
      />

      <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 24, paddingBottom: 4 }}>
        <button
          onClick={() => setActiveCategory("all")}
          style={{
            padding: "8px 14px", borderRadius: 99, whiteSpace: "nowrap", cursor: "pointer",
            border: `1px solid ${brand}`, background: activeCategory === "all" ? brand : "transparent",
            color: activeCategory === "all" ? "#fff" : brand,
          }}
        >
          Tout
        </button>
        {store.categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            style={{
              padding: "8px 14px", borderRadius: 99, whiteSpace: "nowrap", cursor: "pointer",
              border: `1px solid ${brand}`, background: activeCategory === c.id ? brand : "transparent",
              color: activeCategory === c.id ? "#fff" : brand,
            }}
          >
            {c.name}
          </button>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <p style={{ color: "#888", textAlign: "center", padding: 40 }}>Aucun produit ne correspond à cette recherche.</p>
      )}

      {filteredCategories.map((cat) => (
        <section key={cat.id} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: 12 }}>{cat.name}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
            {cat.products.map((p) => (
              <div key={p.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
                {p.imageUrl && <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: 110, objectFit: "cover", borderRadius: 8, marginBottom: 8 }} />}
                <strong style={{ fontSize: "0.95rem" }}>{p.name}</strong>
                {p.description && <p style={{ fontSize: "0.8rem", color: "#888", margin: "4px 0" }}>{p.description}</p>}
                <div style={{ fontWeight: 700, color: brand }}>
                  {money(p.priceCents)}{p.unit ? ` / ${p.unit}` : ""}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
