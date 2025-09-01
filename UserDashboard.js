// src/user/UserDashboard.jsx
import React from "react";
import PropertyBrowser from "./PropertyBrowser";
import MyBookings from "./MyBookings";

export default function UserDashboard({ logout, name, email }) {
  const [tab, setTab] = React.useState("browse");

  return (
    <div style={{ padding: 40, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0 }}>User Dashboard</h1>
          <p style={{ opacity: 0.85 }}>Welcome, {name}</p>
        </div>
        <button onClick={logout} style={btn}>Logout</button>
      </div>

      {/* Tabs */}
      <nav style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <button onClick={() => setTab("browse")} style={tabBtn(tab === "browse")}>Browse Properties</button>
        <button onClick={() => setTab("bookings")} style={tabBtn(tab === "bookings")}>My Bookings</button>
      </nav>

      {/* Content */}
      {tab === "browse" && <PropertyBrowser userEmail={email} />}
      {tab === "bookings" && <MyBookings />}
    </div>
  );
}

const btn = {
  padding: "10px 16px",
  borderRadius: 8,
  border: "none",
  background: "#e55353",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer"
};

function tabBtn(active) {
  return {
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid #cfd2ff",
    background: active ? "#5956e9" : "#fff",
    color: active ? "#fff" : "#333",
    fontWeight: 700,
    cursor: "pointer"
  };
}
