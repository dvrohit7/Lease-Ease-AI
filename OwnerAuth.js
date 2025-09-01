import React, { useState } from "react";
import { apiPostJson } from "./api";

export default function OwnerAuth({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("ownerpass");
  const [msg, setMsg] = useState("");

  const login = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const data = await apiPostJson("/api/owner/login", { email, password });
      onLogin({ name: data.name || email, email });
    } catch (err) {
      setMsg(err.message || "Login failed");
    }
  };

  return (
    <div style={wrap}>
      <h2>Owner Login</h2>
      <form onSubmit={login} style={form}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={input} />
        <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={input} />
        <button style={primary}>Login</button>
      </form>
      {msg && <div style={{ color: "crimson" }}>{msg}</div>}
    </div>
  );
}

const wrap = { maxWidth: 420, margin: "0 auto" };
const form = { display: "grid", gap: 10 };
const input = { padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd" };
const primary = { padding: "10px 12px", borderRadius: 8, border: "none", background: "#5956e9", color: "#fff", fontWeight: 700 };
