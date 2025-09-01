import React, { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import UserDashboard from "./UserDashboard";
import OwnerDashboard from "./OwnerDashboard";
import Footer from "./Footer"; 
// 🖼 Import images
import logoImg from "./assets/logo.png";
import heroImg from "./assets/hero.jpg";
// bannerImg removed from use (kept import if you still need it elsewhere)
// import bannerImg from "./assets/banner.png";

// ✅ Public property browser on the home page
import PropertyBrowser from "./PropertyBrowser";

/* ───────────────────── Fixed full-window background helper ─────────────────── */
function BackgroundImageFull({ src, dim = 0.35 }) {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        filter: `brightness(${1 - dim})`,
      }}
    />
  );
}
/* ───────────────────────────── Navy navbar ───────────────────────────── */
function NavBar({ authed, role, onLogout }) {
  const [open, setOpen] = useState(null); // "login" | "register" | null

  const item = {
    color: "#fff",
    textDecoration: "none",
    fontWeight: 600,
    padding: "10px 12px",
    borderRadius: 8,
  };

  const ddBox = {
    position: "absolute",
    top: "100%",
    right: 0,
    background: "#0b2859",
    color: "#dee4e5ff",
    border: "1px solid rgba(255,255,255,.15)",
    borderRadius: 10,
    padding: 8,
    boxShadow: "0 8px 24px rgba(0,0,0,.25)",
    minWidth: 180,
    zIndex: 20,
  };

  const ddLink = {
    display: "block",
    color: "#eceff1ff",
    textDecoration: "none",
    padding: "8px 10px",
    borderRadius: 8,
    fontWeight: 600,
  };

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        background: "#0a2a5e",
        color: "#fff",
        borderBottom: "1px solid rgba(255,255,255,.12)", 
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        {/* Left: Logo */}
{/* Left: Logo */}
<Link
  to="/"
  style={{
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    height: "60px",            // fix navbar height
  }}
>
  <img
    src={logoImg}
    alt="LeaseEase"
    style={{
      height: "100px",         // big logo
      width: "auto",
      objectFit: "contain",
      marginTop: "-40px",      // pull it up so it doesn’t push navbar down
      marginBottom: "-40px",   // pull it down a bit if needed
    }}
  />
</Link>



        {/* Right: Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
          {!authed && (
            <>
              {/* Login (dropdown) */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setOpen(open === "login" ? null : "login")}
                  style={{
                    ...item,
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,.25)",
                    cursor: "pointer",
                  }}
                >
                  Log in ▾
                </button>
                {open === "login" && (
                  <div style={ddBox} onMouseLeave={() => setOpen(null)}>
                    <Link to="/user-login" style={ddLink}>User login</Link>
                    <Link to="/owner-login" style={ddLink}>Owner login</Link>
                  </div>
                )}
              </div>

              {/* Register (dropdown) */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setOpen(open === "register" ? null : "register")}
                  style={{
                    ...item,
                    background: "#0fb48a",
                    border: "1px solid rgba(255,255,255,.25)",
                    cursor: "pointer",
                  }}
                >
                  Register ▾
                </button>
                {open === "register" && (
                  <div style={ddBox} onMouseLeave={() => setOpen(null)}>
                    <Link to="/user-login" style={ddLink}>User register</Link>
                    <Link to="/owner-login" style={ddLink}>Owner register</Link>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Contact us (dummy link to home for now) */}
          <Link to="/" style={{ ...item, border: "1px solid rgba(255,255,255,.25)" }}>
            Contact us
          </Link>

          {authed && (
            <>
              {role === "user" && <Link to="/user" style={{ ...item }}>Dashboard</Link>}
              {role === "owner" && <Link to="/owner" style={{ ...item }}>Owner</Link>}
              <button
                onClick={onLogout}
                style={{
                  ...item,
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,.25)",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────────── Your existing shared styles (unchanged) ───────────── */
const btn = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #ddd",
  background: "#ffffffff",
  cursor: "pointer",
};

const styles = {
  page: {
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f1f4f7ff",
  },
  title: {
    marginBottom: 40,
    fontSize: "3rem",
    color: "#4a47a3",
    fontWeight: "900",
    textShadow: "2px 2px 6px #bbb",
  },
  panel: {
    backgroundColor: "rgba(179, 212, 219, 0.95)",
    padding: 30,
    width: 420,
    borderRadius: 12,
    boxShadow: "0 8px 20px rgba(74, 71, 163, 0.3)",
    textAlign: "center",
  },
  roleSelector: {
    marginBottom: 20,
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#333",
    display: "flex",
    justifyContent: "center",
    gap: 40,
  },
  formTitle: {
    marginBottom: 15,
    color: "#5956e9",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "12px 16px",
    marginBottom: 15,
    borderRadius: 8,
    border: "1.5px solid #b1aedf",
    fontSize: "1rem",
    outline: "none",
    boxShadow: "inset 2px 2px 5px #e1e1ff",
  },
  button: {
    padding: "12px 16px",
    borderRadius: 8,
    border: "none",
    backgroundColor: "#5956e9",
    color: "#fff",
    fontWeight: "700",
    fontSize: "1.1rem",
    cursor: "pointer",
    boxShadow: "0 5px 12px #7a77f5",
    transition: "background-color 0.3s ease",
  },
  forgotPassword: {
    marginTop: 10,
    color: "#5956e9",
    cursor: "pointer",
    fontWeight: "600",
    userSelect: "none",
  },
  toggleText: {
    marginTop: 20,
    fontSize: "0.9rem",
    color: "#666",
  },
  toggleLink: {
    color: "#5956e9",
    fontWeight: "700",
    cursor: "pointer",
    userSelect: "none",
  },
  resetBox: {
    marginTop: 16,
    background: "#f8fafc",
    border: "1px dashed #cbd5e1",
    borderRadius: 10,
    padding: 12,
    textAlign: "left",
  },
};

/* ───────────── AuthPanel (kept as you had it) ───────────── */
function AuthPanel({ fixedRole = null, onLogin }) {
  const [role, setRole] = useState(fixedRole || "user");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const backendUrl = "http://localhost:8091";

  const clearForm = () => {
    setEmail(""); setUsername(""); setMobile(""); setPassword(""); setConfirmPassword("");
    setResetToken(""); setNewPassword(""); setMessage(null);
  };

  const toggleLoginRegister = () => { setIsLogin(v => !v); setMessage(null); };

  const handleForgotPassword = async () => {
    if (!email) { setMessage("Please enter your email first."); return; }
    setLoading(true); setMessage(null);
    try {
      if (role === "user") {
        const res = await fetch(`${backendUrl}/api/forgot-password`, {
          method: "POST", credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json().catch(() => ({}));
        setMessage(res.ok ? `Reset token (user): ${data.token ?? "(check email in prod)"}` :
          data.error || `Failed to generate reset token (user) [${res.status}]`);
      } else {
        const res = await fetch(
          `${backendUrl}/api/owner/forgot-password?email=${encodeURIComponent(email)}`,
          { method: "POST", credentials: "include" }
        );
        const data = await res.json().catch(() => ({}));
        setMessage(res.ok ? `Reset token (owner): ${data.token ?? "(check email in prod)"}` :
          data.error || `Failed to generate reset token (owner) [${res.status}]`);
      }
    } catch (err) {
      setMessage(`Network error during forgot password: ${err?.message || "Failed to fetch"}`);
    } finally { setLoading(false); }
  };

  const handleResetPassword = async () => {
    if (!resetToken || !newPassword) { setMessage("Provide reset token and new password."); return; }
    setLoading(true); setMessage(null);
    try {
      if (role === "user") {
        const res = await fetch(`${backendUrl}/api/reset-password?token=${encodeURIComponent(resetToken)}`, {
          method: "POST", credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newPassword }),
        });
        const data = await res.json().catch(() => ({}));
        setMessage(res.ok ? "Password updated successfully (user)." :
          data.error || `Failed to reset password (user) [${res.status}]`);
      } else {
        const res = await fetch(
          `${backendUrl}/api/owner/reset-password?token=${encodeURIComponent(resetToken)}&newPassword=${encodeURIComponent(newPassword)}`,
          { method: "POST", credentials: "include" }
        );
        const text = await res.text();
        setMessage(res.ok ? (text || "Password updated successfully (owner).") :
          (text || `Failed to reset password (owner) [${res.status}]`));
      }
      setResetToken(""); setNewPassword("");
    } catch (err) {
      setMessage(`Network error during reset password: ${err?.message || "Failed to fetch"}`);
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setMessage(null);
    if (!email || !password || (!isLogin && (!confirmPassword || !mobile))) {
      setMessage("Please fill in all required fields."); return;
    }
    if (!isLogin && password !== confirmPassword) { setMessage("Passwords do not match."); return; }

    setLoading(true);
    try {
      const basePath = role === "user" ? "/api" : "/api/owner";
      const url = isLogin ? `${backendUrl}${basePath}/login` : `${backendUrl}${basePath}/register`;
      const body = isLogin ? { email, password } : { name: username, email, password, mobileNumber: mobile };
      const res = await fetch(url, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const isJson = res.headers.get("content-type")?.includes("application/json");
      const data = isJson ? await res.json() : {};
      if (res.ok) {
        const userRole = data.role ? String(data.role).toLowerCase() : role;
        onLogin?.({ role: userRole, name: data.name || username || email, email });
        clearForm();
      } else {
        setMessage(data.error || data.message || `Login/Register failed [${res.status}]`);
      }
    } catch (err) {
      setMessage(`Network error: ${err?.message || "Failed to fetch"}`);
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>LeaseEase AI</h1>
      <div style={styles.panel}>
        {!fixedRole && (
          <div style={styles.roleSelector}>
            <label>
              <input type="radio" value="user" checked={role === "user"}
                onChange={() => { setRole("user"); setIsLogin(true); setMessage(null); }} />
              {" "}User Portal
            </label>
            <label style={{ marginLeft: 20 }}>
              <input type="radio" value="owner" checked={role === "owner"}
                onChange={() => { setRole("owner"); setIsLogin(true); setMessage(null); }} />
              {" "}Owner Portal
            </label>
          </div>
        )}

        <h2 style={styles.formTitle}>{isLogin ? "Sign In" : "Register"}</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <>
              <input style={styles.input} type="text"
                placeholder={role === "user" ? "Create User Name" : "Create Owner Name"}
                value={username} onChange={(e) => setUsername(e.target.value)} required />
              <input style={styles.input} type="tel" placeholder="Enter Mobile Number"
                value={mobile} onChange={(e) => setMobile(e.target.value)}
                pattern="[0-9]{10}" required />
            </>
          )}

          <input style={styles.input} type="email" placeholder="Enter Email"
            value={email} onChange={(e) => setEmail(e.target.value)} required />

          <input style={styles.input} type="password" placeholder="Password"
            value={password} onChange={(e) => setPassword(e.target.value)} required />

          {!isLogin && (
            <input style={styles.input} type="password" placeholder="Confirm Password"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          )}

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? (isLogin ? "Logging in..." : "Registering...") : isLogin ? "Login" : "Register"}
          </button>
        </form>

        {isLogin && (
          <p style={styles.forgotPassword} onClick={handleForgotPassword}>Forgot Password?</p>
        )}

        <div style={styles.resetBox}>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>Reset Password</div>
          <input style={styles.input} type="text" placeholder="Reset Token"
            value={resetToken} onChange={(e) => setResetToken(e.target.value)} />
          <input style={styles.input} type="password" placeholder="New Password"
            value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <button style={{ ...styles.button, padding: "10px 14px" }} onClick={handleResetPassword} disabled={loading} type="button">
            Update Password
          </button>
        </div>

        <p style={styles.toggleText}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span style={styles.toggleLink} onClick={toggleLoginRegister}>
            {isLogin ? "Register here" : "Login here"}
          </span>
        </p>

        {message && (
          <p style={{ color: message.toLowerCase().includes("success") ? "green" : "red", whiteSpace: "pre-wrap" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

function UserAuth({ onLogin }) { return <AuthPanel fixedRole="user" onLogin={onLogin} />; }
function OwnerAuth({ onLogin }) { return <AuthPanel fixedRole="owner" onLogin={onLogin} />; }

/* ───────────────────────────── App (minimal edits) ─────────────────────────── */
export default function App() {
  const [auth, setAuth] = useState(null);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await fetch("http://localhost:8091/api/logout", { method: "POST", credentials: "include" });
    } catch {}
    setAuth(null);
    navigate("/");
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 16, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto" }}>
      {/* NEW: Navy header */}
      <NavBar authed={!!auth} role={auth?.role} onLogout={logout} />

      {/* ROUTES */}
      <Routes>
        <Route
          path="/"
          element={
            // Full background + scrolling content
            <div style={{ position: "relative", minHeight: "100vh", paddingTop: 16 }}>
              <BackgroundImageFull src={heroImg} dim={0.35} />

              <div style={{ display: "grid", gap: 20, position: "relative", zIndex: 1 }}>
                {/* Properties section over translucent panel for readability */}
                <section style={{ textAlign: "left", background: "rgba(255,255,255,0.88)", borderRadius: 16, padding: 16 }}>
                  <h2 style={{ margin: "8px 0 12px" }}>Available Properties</h2>
                  <PropertyBrowser userEmail={auth?.email} />
                </section>

                <p style={{ color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,.6)", textAlign: "center" }}>
                  Welcome! Please login as a <Link to="/user-login" style={{ color: "#fff", fontWeight: 700 }}>User</Link> or{" "}
                  <Link to="/owner-login" style={{ color: "#fff", fontWeight: 700 }}>Owner</Link>.
                </p>
              </div>
            </div>
          }
        />

        {/* Auth routes (unchanged behavior) */}
        <Route
          path="/user-login"
          element={
            <UserAuth
              onLogin={(info) => {
                setAuth({ role: "user", ...info });
                navigate("/user");
              }}
            />
          }
        />
        <Route
          path="/owner-login"
          element={
            <OwnerAuth
              onLogin={(info) => {
                setAuth({ role: "owner", ...info });
                navigate("/owner");
              }}
            />
          }
        />

        <Route
          path="/user"
          element={
            auth?.role === "user" ? (
              <UserDashboard name={auth.name} email={auth.email} logout={logout} />
            ) : (
              <div>Please login as User.</div>
            )
          }
        />
        <Route
          path="/owner"
          element={
            auth?.role === "owner" ? (
              <OwnerDashboard name={auth.name} logout={logout} />
            ) : (
              <div>Please login as Owner.</div>
            )
          }
        />
      </Routes>
       {/* ✅ Footer is added here */}
      <Footer />
    </div>
  );
}
