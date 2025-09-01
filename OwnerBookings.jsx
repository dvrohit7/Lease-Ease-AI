// src/user/OwnerBookings.jsx
import React, { useEffect, useState } from "react";
import { apiGet, apiPatch } from "./api";

export default function OwnerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet("/api/bookings/owner");
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching owner bookings:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const updated = await apiPatch(`/api/bookings/${id}/${action}`);
      // ✅ Replace updated booking in state
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? updated : b))
      );
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={wrap}>
      <h2 style={{ marginBottom: 16 }}>Owner Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <table style={table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Property</th>
              <th>Status</th>
              <th>User Name</th>
              <th>User Email</th>
              <th>User Mobile</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.propertyTitle}</td>
                <td>{b.status}</td>

                {/* ✅ show user details (only available after approve) */}
                <td>{b.userName || "-"}</td>
                <td>{b.userEmail || "-"}</td>
                <td>{b.userMobile || "-"}</td>

                <td>
                  {b.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleAction(b.id, "approve")}
                        style={approveBtn}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(b.id, "reject")}
                        style={rejectBtn}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* Styles */
const wrap = { padding: 20 };
const table = { width: "100%", borderCollapse: "collapse" };
const approveBtn = {
  marginRight: 8,
  padding: "6px 10px",
  background: "#4ade80",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};
const rejectBtn = {
  padding: "6px 10px",
  background: "#f87171",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};
