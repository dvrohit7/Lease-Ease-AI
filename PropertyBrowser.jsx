// src/user/PropertyBrowser.jsx
import React, { useEffect, useMemo, useState } from "react";
import { apiGet, apiPostJson } from "./api";   // ✅ updated import
import { backend } from "./api";   // or "../api" depending on your file tree

// normalize and prefix helper
const srcFor = (url) => {
  if (!url) return null;
  const clean = String(url).replace(/\\/g, "/"); // win backslashes → forward slashes
  return clean.startsWith("http") ? clean : `${backend}${clean}`;
};

export default function PropertyBrowser({ userEmail }) {
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  // detail drawer
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet("/api/properties");
        setAll(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setAll([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    let list = all;
    const term = q.trim().toLowerCase();
    if (term) {
      list = list.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(term) ||
          (p.location || "").toLowerCase().includes(term) ||
          (p.description || "").toLowerCase().includes(term)
      );
    }
    if (type) list = list.filter((p) => (p.type || "").toLowerCase() === type.toLowerCase());
    if (min !== "") list = list.filter((p) => Number(p.price) >= Number(min));
    if (max !== "") list = list.filter((p) => Number(p.price) <= Number(max));
    return list;
  }, [all, q, type, min, max]);

  // ✅ updated handleBook to use apiPostJson
  const handleBook = async (propertyId) => {
    try {
      const res = await apiPostJson(`/api/bookings/${propertyId}`, {});
      if (!res) throw new Error("No response body");
      alert("Booking request sent!");
    } catch (err) {
      alert("Error booking property: " + (err?.message || "Unknown error"));
    }
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* Controls */}
      <section style={panel}>
        <div style={row}>
          <input placeholder="Search title, location…" value={q} onChange={(e) => setQ(e.target.value)} style={input} />
          <select value={type} onChange={(e) => setType(e.target.value)} style={input}>
            <option value="">All Types</option>
            <option>APARTMENT</option>
            <option>HOUSE</option>
            <option>VILLA</option>
          </select>
          <input type="number" placeholder="Min price" value={min} onChange={(e) => setMin(e.target.value)} style={input} />
          <input type="number" placeholder="Max price" value={max} onChange={(e) => setMax(e.target.value)} style={input} />
          <button onClick={() => { setQ(""); setType(""); setMin(""); setMax(""); }} style={mutedBtn}>Reset</button>
        </div>
        <div style={{ color: "#6b7280", marginTop: 6 }}>
          Showing <b>{filtered.length}</b> of {all.length}
        </div>
      </section>

      {/* Grid */}
      {loading ? (
        <SkeletonGrid />
      ) : filtered.length === 0 ? (
        <EmptyState title="No properties found" subtitle="Try adjusting filters or search terms." />
      ) : (
        <div style={grid}>
          {filtered.map((p) => {
            const id = p.id ?? p.propertyId;
            return (
              <article key={id} style={card} onClick={() => { setActive(p); setOpen(true); }}>
                {p.imageUrl ? (
                  <img src={srcFor(p.imageUrl)} alt={p.title} style={img} onError={(e) => (e.currentTarget.style.display = "none")} />
                ) : (
                  <div style={{ ...img, background: "#f3f4f6", display: "grid", placeItems: "center", color: "#9ca3af" }}>No Image</div>
                )}

                {/* Title + Book button on same row; price row shows type + location */}
                <div style={{ padding: 12 }}>
                  <div style={headerRow}>
                    <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.2 }}>{p.title}</div>
                    <button onClick={(e) => { e.stopPropagation(); handleBook(id); }} style={bookBtn}>
                      Book
                    </button>
                  </div>

                  <div style={priceRow}>
                    <span style={{ fontWeight: 900 }}>₹ {p.price}</span>
                    <span>• {p.type}</span>
                    <span>• {p.location}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Drawer / Modal */}
      {open && active && (
        <div style={drawerBackdrop} onClick={() => setOpen(false)}>
          <div style={drawer} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "grid", gap: 12 }}>
              {active.imageUrl && (
                <img src={srcFor(active.imageUrl)} alt={active.title} style={{ width: "100%", height: 260, objectFit: "cover", borderRadius: 12 }} />
              )}
              <h3 style={{ margin: 0 }}>{active.title}</h3>
              <div>📍 {active.location}</div>
              <div>💰 ₹ {active.price}</div>
              <div>🏠 {active.type}</div>
              {active.description && <p style={{ color: "#374151" }}>{active.description}</p>}
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button onClick={() => setOpen(false)} style={mutedBtn}>Close</button>
                <button onClick={() => handleBook(active.id ?? active.propertyId)} style={primaryBtn}>Book</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* UI bits */
function SkeletonGrid() {
  return (
    <div style={grid}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{ ...card, animation: "pulse 1.5s infinite", background: "linear-gradient(90deg,#f3f4f6,#e5e7eb,#f3f4f6)" }} />
      ))}
    </div>
  );
}
function EmptyState({ title, subtitle }) {
  return (
    <div style={panel}>
      <div style={{ fontWeight: 700 }}>{title}</div>
      <div style={{ color: "#6b7280", marginTop: 6 }}>{subtitle}</div>
    </div>
  );
}

/* styles */
const panel = { background: "rgba(248, 250, 252, 0.85)", border: "1px solid rgba(229,231,235,.6)", padding: 12, borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.04)", backdropFilter: "blur(4px)" };
const row = { display: "grid", gridTemplateColumns: "1fr 160px 130px 130px 100px", gap: 10, alignItems: "center" };
const input = { padding: "10px 12px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff" };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 };
const card = { position: "relative", background: "rgba(255, 255, 255, 0.75)", border: "1px solid rgba(229,231,235,.5)", borderRadius: 14, overflow: "hidden", boxShadow: "0 10px 24px rgba(0,0,0,0.08)", cursor: "pointer", backdropFilter: "saturate(120%) blur(6px)" };
const img = { width: "100%", height: 160, objectFit: "cover" };
const chip = { background: "#eef2ff", color: "#3730a3", padding: "2px 8px", borderRadius: 999, fontSize: 12, fontWeight: 700 };
const primaryBtn = { position: "relative", padding: "10px 12px", borderRadius: 10, border: "none", background: "#4f46e5", color: "#fff", fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 10px rgba(79,70,229,.35)" };
const mutedBtn = { padding: "10px 12px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", fontWeight: 700, cursor: "pointer" };
const drawerBackdrop = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.36)", display: "grid", placeItems: "end center", padding: 16, zIndex: 50 };
const drawer = { width: "min(720px, 96%)", background: "#fff", borderRadius: "16px 16px 0 0", padding: 16, boxShadow: "0 -8px 30px rgba(0,0,0,.25)" };
const headerRow = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 };
const bookBtn = { padding: "8px 12px", borderRadius: 10, border: "none", background: "#4f46e5", color: "#fff", fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 10px rgba(79,70,229,.25)" };
const priceRow = { display: "flex", gap: 10, alignItems: "center", marginTop: 8, color: "#374151", fontSize: 14 };
