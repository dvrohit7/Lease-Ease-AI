import React from "react";

export default function AdminDashboard({ logout }) {
  return (
    <div style={{ padding: 40 }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
