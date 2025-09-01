import React, { useEffect, useState } from "react";
import { apiGet, apiDelete, backend } from "./api"; // api.js should use credentials:"include"

export default function OwnerMyProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      // ⚠️ Your backend exposes /api/properties/mine for the logged-in owner
      const data = await apiGet("/api/properties/mine");
      setProperties(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load my properties:", e);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const srcFor = (url) => (!url ? null : url.startsWith("http") ? url : `${backend}${url}`);

  const del = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    try {
      await apiDelete(`/api/properties/${id}`);
      setProperties((prev) => prev.filter((p) => (p.id ?? p.propertyId) !== id));
    } catch (e) {
      alert("Delete failed: " + e.message);
    }
  };

  if (loading) return <div style={s.card}>Loading your properties…</div>;

  return (
    <section>
      <h2>My Properties</h2>
      {properties.length === 0 ? (
        <div style={s.muted}>You haven’t added any properties yet.</div>
      ) : (
        properties.map((p) => {
          const id = p.id ?? p.propertyId;
          return (
            <div key={id} style={s.card}>
              <div style={{ display: "flex", gap: 16 }}>
                {p.imageUrl && (
                  <img
                    src={srcFor(p.imageUrl)}
                    alt={p.title}
                    style={{ width: 180, height: 120, objectFit: "cover", borderRadius: 8 }}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginTop: 0 }}>{p.title}</h3>
                  <div>📍 {p.location} &nbsp; | &nbsp; 💰 {p.price} &nbsp; | &nbsp; 🏠 {p.type}</div>
                  {p.description && <p style={{ marginTop: 8 }}>{p.description}</p>}
                  <div style={{ marginTop: 8 }}>
                    <button style={s.danger} onClick={() => del(id)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </section>
  );
}

const s = {
  card: { background: "#fff", padding: 16, borderRadius: 12, boxShadow: "0 6px 16px rgba(0,0,0,0.08)", marginBottom: 16 },
  muted: { color: "#666", padding: 12 },
  danger: { padding: "10px 12px", borderRadius: 8, border: "none", background: "#ff6b6b", color: "#fff", cursor: "pointer" },
};
