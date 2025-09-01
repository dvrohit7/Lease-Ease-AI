// src/user/MyBookings.jsx
import React, { useEffect, useState } from "react";
import { apiGet, backend } from "./api";   // ✅ use same backend helper as owner

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const srcFor = (url) => (!url ? null : url.startsWith("http") ? url : `${backend}${url}`);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet("/api/bookings/mine");
        setBookings(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load bookings", e);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <ListSkeleton />;

  if (bookings.length === 0) {
    return (
      <div style={s.panel}>
        <div style={{ fontWeight: 700 }}>No bookings yet</div>
        <div style={{ color: "#6b7280", marginTop: 6 }}>
          Find a property you like and send a booking request.
        </div>
      </div>
    );
  }

  return (
    <section>
      <h2>My Bookings</h2>
      {bookings.map((b) => (
        <div key={b.id} style={s.card}>
          <div style={{ display: "grid", gridTemplateColumns: "120px 1fr auto", gap: 16, alignItems: "center" }}>
            {/* Property Image */}
            {b.property?.imageUrl ? (
              <img
                src={srcFor(b.property.imageUrl)}
                alt={b.property?.title}
                style={{ width: 120, height: 90, objectFit: "cover", borderRadius: 8 }}
              />
            ) : (
              <div style={{ width: 120, height: 90, background: "#eee", borderRadius: 8 }} />
            )}

            {/* Property Info */}
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{b.property?.title || "Property"}</div>
              <div style={{ color: "#6b7280", marginTop: 4 }}>
                📍 {b.property?.location} &nbsp; | &nbsp; 💰 {b.property?.price}
              </div>
              {b.createdAt && (
                <div style={{ color: "#6b7280", marginTop: 6, fontSize: 13 }}>
                  Requested: {new Date(b.createdAt).toLocaleString()}
                </div>
              )}
            </div>

            {/* Status Badge */}
            <StatusBadge status={b.status} />
          </div>
        </div>
      ))}
    </section>
  );
}

/* Status Badge */
function StatusBadge({ status }) {
  const map = {
    PENDING: { bg: "#fff7ed", fg: "#9a3412", label: "Pending" },
    APPROVED: { bg: "#ecfdf5", fg: "#065f46", label: "Approved" },
    REJECTED: { bg: "#fef2f2", fg: "#991b1b", label: "Rejected" },
  };
  const s = map[status] || map.PENDING;
  return (
    <span
      style={{
        background: s.bg,
        color: s.fg,
        padding: "6px 12px",
        borderRadius: 999,
        fontWeight: 700,
        fontSize: 13,
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
}

/* Skeleton loader */
function ListSkeleton() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          style={{
            ...s.card,
            height: 100,
            animation: "pulse 1.4s infinite",
            background: "linear-gradient(90deg,#f3f4f6,#e5e7eb,#f3f4f6)",
          }}
        />
      ))}
    </div>
  );
}

/* styles */
const s = {
  panel: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    padding: 12,
    borderRadius: 12,
    boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
  },
  card: {
    background: "#fff",
    padding: 16,
    borderRadius: 12,
    boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
    marginBottom: 12,
  },
};
