import React, { useState } from "react";

export default function UserAuth({ setAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const backendUrl = "http://localhost:8091";

  const toggleForm = () => {
    setMessage(null);
    setIsLogin(!isLogin);
    clearForm();
  };

  const clearForm = () => {
    setEmail("");
    setUsername("");
    setMobile("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!email || !password || (!isLogin && (!confirmPassword || !username || !mobile))) {
      setMessage("Please fill in all required fields.");
      return;
    }
    if (!isLogin && password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const url = isLogin
        ? `${backendUrl}/api/login`
        : `${backendUrl}/api/register`;

      const body = isLogin
        ? { email, password }
        : { name: username, email, mobile, password };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        const fakeToken = "fake-jwt-token";
        setAuth({ token: fakeToken, role: "user", name: data.name || username || email });
        setMessage("Login/Register successful!");
      } else {
        setMessage(data.error || JSON.stringify(data));
      }
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.leftSection}>
        <div style={{ fontWeight: "bold", marginBottom: 40 }}>User Portal</div>

        <h1 style={styles.heading}>{isLogin ? "Sign In" : "Sign Up"}</h1>
        <p style={styles.subheading}>Welcome to User Portal</p>

        <p style={styles.smallText}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span style={styles.link} onClick={toggleForm}>
            {isLogin ? " Register here!" : " Login here!"}
          </span>
        </p>
      </div>

      <div style={styles.rightSection}>
        {message && (
          <div
            style={{
              marginBottom: 20,
              color: message.toLowerCase().includes("success") ? "green" : "red",
            }}
          >
            {message}
          </div>
        )}

        <form style={styles.form} onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Create User Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                required
              />
              <input
                type="tel"
                placeholder="Enter Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                style={styles.input}
                pattern="[0-9]{10}"
                required
              />
            </>
          )}

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              required
            />
          )}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? (isLogin ? "Logging in..." : "Registering...") : isLogin ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: "#f9f9fb" },
  leftSection: { flex: 1, padding: "80px 60px", color: "#000", backgroundColor: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", boxShadow: "0 0 10px rgb(0 0 0 / 0.1)" },
  heading: { fontWeight: "900", fontSize: "2.4rem", marginBottom: 10 },
  subheading: { fontWeight: "400", fontSize: "1.3rem", marginBottom: 30 },
  smallText: { fontSize: "0.85rem", fontWeight: "400", color: "#444" },
  link: { color: "#5956e9", fontWeight: "600", cursor: "pointer", marginLeft: 4, userSelect: "none" },
  rightSection: { flex: 1, backgroundColor: "#f4f3ff", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 40px", boxShadow: "0 0 10px rgb(0 0 0 / 0.1)" },
  form: { width: "100%", maxWidth: 350, display: "flex", flexDirection: "column" },
  input: { marginBottom: 20, padding: "14px 18px", borderRadius: 8, border: "1px solid #d6d3f0", backgroundColor: "#e8e7ff", fontSize: "1rem", outline: "none" },
  button: { padding: "14px 18px", backgroundColor: "#5956e9", color: "#fff", fontWeight: "600", fontSize: "1rem", border: "none", borderRadius: 8, cursor: "pointer", boxShadow: "0 6px 8px #9d97f7", transition: "background-color 0.3s" },
};
