// src/OwnerDashboard.jsx
import React, { useEffect, useState } from "react";
import { apiGet, apiPostMultipart, apiDelete, apiPatch, backend } from "./api";

export default function OwnerDashboard({ name, logout }) {
  const [tab, setTab] = useState("properties");
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [form, setForm] = useState({
    title: "", location: "", price: "", type: "APARTMENT", description: "",
  });
  const [image, setImage] = useState(null);

  const srcFor = (url) => (!url ? null : url.startsWith("http") ? url : `${backend}${url}`);

  const loadProperties = async () => {
    try {
      const data = await apiGet("/api/properties/mine");
      setProperties(Array.isArray(data) ? data : []);
    } catch (e) { console.error("Failed to load properties:", e); }
  };

  const loadBookings = async () => {
    try {
      const data = await apiGet("/api/bookings/owner");
      console.log("Owner bookings →", data); // debug
      setBookings(Array.isArray(data) ? data : []);
    } catch (e) { console.error("Failed to load bookings:", e); }
  };

  useEffect(() => { 
    if (tab === "properties") loadProperties(); 
    if (tab === "bookings") loadBookings(); 
  }, [tab]);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const addProperty = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append("file", image);

      await apiPostMultipart("/api/properties/create-with-image", fd);
      setForm({ title: "", location: "", price: "", type: "APARTMENT", description: "" });
      setImage(null);
      setTab("properties");
      await loadProperties();
      alert("Property added!");
    } catch (err) {
      alert("Failed to add property: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    try { await apiDelete(`/api/properties/${id}`); await loadProperties(); }
    catch (e) { alert("Delete failed: " + e.message); }
  };

  const updateBookingStatus = async (bookingId, action) => {
    try { await apiPatch(`/api/bookings/${bookingId}/${action}`); await loadBookings(); }
    catch (e) { alert(`Failed to ${action} booking: ` + e.message); }
  };

  return (
    <div style={s.wrap}>
      <header style={s.header}>
        <div>
          <h1 style={{ margin: 0 }}>Owner Dashboard</h1>
          <div style={{ opacity: 0.8 }}>Welcome, {name}</div>
        </div>
        <button style={s.logout} onClick={logout}>Logout</button>
      </header>

      <nav style={s.tabs}>
        <button onClick={() => setTab("properties")} style={tabBtn(tab === "properties")}>My Properties</button>
        <button onClick={() => setTab("add")} style={tabBtn(tab === "add")}>Add Property</button>
        <button onClick={() => setTab("bookings")} style={tabBtn(tab === "bookings")}>Bookings</button>
      </nav>

      {tab === "add" && (
        <section style={s.card}>
          <h2>Add Property</h2>
          <form onSubmit={addProperty} style={s.form}>
            <input name="title" placeholder="Title" value={form.title} onChange={onChange} required style={s.input} />
            <input name="location" placeholder="Location" value={form.location} onChange={onChange} required style={s.input} />
            <input name="price" type="number" placeholder="Price" value={form.price} onChange={onChange} required style={s.input} />
            <select name="type" value={form.type} onChange={onChange} style={s.input}>
              <option>APARTMENT</option><option>HOUSE</option><option>VILLA</option>
            </select>
            <textarea name="description" placeholder="Description" value={form.description} onChange={onChange} style={s.textarea} />
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={s.input} />
            <button disabled={loading} style={s.primary}>{loading ? "Saving..." : "Add Property"}</button>
          </form>
        </section>
      )}

      {tab === "properties" && (
        <section>
          <h2>My Properties</h2>
          {properties.length === 0 ? (
            <div style={s.muted}>You haven’t added any properties yet.</div>
          ) : (
            properties.map((p) => (
              <div key={p.id || p.propertyId} style={s.card}>
                <div style={{ display: "flex", gap: 16 }}>
                  {p.imageUrl && (<img src={srcFor(p.imageUrl)} alt={p.title} style={{ width: 180, height: 120, objectFit: "cover", borderRadius: 8 }} />)}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginTop: 0 }}>{p.title}</h3>
                    <div>📍 {p.location} &nbsp; | &nbsp; 💰 {p.price} &nbsp; | &nbsp; 🏠 {p.type}</div>
                    {p.description && <p style={{ marginTop: 8 }}>{p.description}</p>}
                    <div style={{ marginTop: 8 }}>
                      <button style={s.danger} onClick={() => deleteProperty(p.id || p.propertyId)}>Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {tab === "bookings" && (
        <section>
          <h2>Bookings for My Properties</h2>
          {bookings.length === 0 ? (
            <div style={s.muted}>No bookings yet.</div>
          ) : (
            bookings.map((b) => (
              <div key={b.id} style={s.card}>
                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 220px", gap: 16, alignItems: "center" }}>
                  {b.property?.imageUrl ? (
                    <img src={srcFor(b.property.imageUrl)} alt={b.property?.title} style={{ width: 120, height: 90, objectFit: "cover", borderRadius: 8 }} />
                  ) : <div style={{ width: 120, height: 90, background: "#eee", borderRadius: 8 }} />}

                  <div>
                    <div style={{ fontWeight: 700 }}>{b.property?.title}</div>
                    <div>📍 {b.property?.location} &nbsp; | &nbsp; 💰 {b.property?.price}</div>

                    {/* ✅ Request by */}
                    <div style={{ marginTop: 6, fontSize: 14 }}>
                      Request by: <b>{b.userName || "—"}</b>
                      {b.userEmail ? <> · {b.userEmail}</> : null}
                    </div>

                    <div style={{ marginTop: 6, fontSize: 14 }}>
                      Status: <span style={{ fontWeight: 700 }}>{b.status}</span>
                    </div>

                    {/* ✅ Contact details only after approval */}
                    {String(b.status).toUpperCase() === "APPROVED" && (
                      <div
                        style={{
                          marginTop: 8,
                          padding: "6px 10px",
                          background: "#d1e7dd",
                          border: "1px solid #badbcc",
                          borderRadius: 8,
                          fontSize: 14,
                          display: "flex",
                          gap: 12,
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <span>👤 {b.userName || "—"}</span>
                        {b.userEmail && <span>📧 {b.userEmail}</span>}
                        {b.userMobile && <span>📱 {b.userMobile}</span>}
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button onClick={() => updateBookingStatus(b.id, "approve")} disabled={b.status === "APPROVED"} style={s.success}>Approve</button>
                    <button onClick={() => updateBookingStatus(b.id, "reject")} disabled={b.status === "REJECTED"} style={s.warn}>Reject</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      )}
    </div>
  );
}

const s = {
  wrap: { padding: 32, maxWidth: 1000, margin: "0 auto", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  logout: { padding: "10px 16px", borderRadius: 8, border: "none", background: "#e55353", color: "#fff", fontWeight: 700, cursor: "pointer" },
  tabs: { display: "flex", gap: 12, marginBottom: 16 },
  card: { background: "#fff", padding: 16, borderRadius: 12, boxShadow: "0 6px 16px rgba(0,0,0,0.08)", marginBottom: 16 },
  form: { display: "grid", gap: 12 },
  input: { padding: "12px 14px", borderRadius: 8, border: "1px solid #d6d3f0", background: "#f7f7ff" },
  textarea: { padding: "12px 14px", minHeight: 90, borderRadius: 8, border: "1px solid #d6d3f0", background: "#f7f7ff" },
  primary: { padding: "12px 14px", background: "#5956e9", border: "none", color: "#fff", borderRadius: 8, fontWeight: 700, cursor: "pointer" },
  muted: { color: "#666", padding: 12 },
  danger: { padding: "10px 12px", borderRadius: 8, border: "none", background: "#ff6b6b", color: "#fff", cursor: "pointer" },
  success: { padding: "10px 12px", borderRadius: 8, border: "none", background: "#2eb85c", color: "#fff", cursor: "pointer" },
  warn: { padding: "10px 12px", borderRadius: 8, border: "none", background: "#f9b115", color: "#222", cursor: "pointer" },
};

function tabBtn(active) {
  return {
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid #cfd2ff",
    background: active ? "#5956e9" : "#fff",
    color: active ? "#fff" : "#333",
    fontWeight: 700,
    cursor: "pointer",
  };
}
