import React, { useState } from "react";

const roles = ["User", "Owner", "Admin"];

export default function AuthPage({ setAuth }) {
  const [selectedRole, setSelectedRole] = useState("User");
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const backendUrl = "http://localhost:8091";

  const resetForm = () => {
    setFormData({ email: "", username: "", password: "", confirmPassword: "" });
    setMessage(null);
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setIsLogin(true);
    resetForm();
  };

  const toggleFormType = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const handleChange = (e) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const { email, username, password, confirmPassword } = formData;

    if (!email || !password || (!isLogin && !confirmPassword)) {
      setMessage("Please fill in all required fields.");
      return;
    }
    if (!isLogin && password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      let url = "";
      if (selectedRole === "User") {
        url = isLogin ? `${backendUrl}/api/login` : `${backendUrl}/api/register`;
      } else if (selectedRole === "Owner") {
        url = isLogin ? `${backendUrl}/api/owner/login` : `${backendUrl}/api/owner/register`;
      } else if (selectedRole === "Admin") {
        url = isLogin ? `${backendUrl}/api/admin/login` : `${backendUrl}/api/admin/register`;
      }

      const body = isLogin
        ? { email, password }
        : { name: username, email, password };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        // You can replace this with real token from backend
        const fakeToken = "fake-jwt-token";
        setAuth({ token: fakeToken, role: selectedRole.toLowerCase(), name: data.name || username || email });
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
      <div style={styles.sidebar}>
        <h2 style={{ color: "#fff", marginBottom: 40, fontWeight: "bold" }}>Select Role</h2>
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => handleRoleChange(role)}
            style={{
              ...styles.roleButton,
              ...(selectedRole === role ? styles.roleButtonActive : {}),
            }}
          >
            {role}
          </button>
        ))}
        <div style={{ marginTop: 40 }}>
          <button onClick={toggleFormType} style={styles.toggleButton}>
            {isLogin ? "Switch to Register" : "Switch to Login"}
          </button>
        </div>
      </div>

      <div style={styles.formContainer}>
        <h1 style={styles.heading}>
          {selectedRole} {isLogin ? "Login" : "Register"}
        </h1>
        {message && (
          <div
            style={{
              marginBottom: 20,
              color: message.toLowerCase().includes("success") ? "limegreen" : "tomato",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <input
              type="text"
              placeholder={`Enter ${selectedRole} Name`}
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={styles.input}
              required
            />
          )}

          <input
            type="email"
            placeholder="Enter Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />

          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.input}
              required
            />
          )}

          <button type="submit" style={styles.submitButton} disabled={loading}>
            {loading ? (isLogin ? "Logging in..." : "Registering...") : isLogin ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    height: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  sidebar: {
    width: 200,
    background: "linear-gradient(145deg, #5a47ab, #3a2d6f)",
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "5px 0 15px rgba(0,0,0,0.3)",
  },
  roleButton: {
    width: "100%",
    padding: "15px",
    marginBottom: 20,
    fontSize: "1.1rem",
    borderRadius: 12,
    border: "none",
    background: "#7266d1",
    color: "#ddd",
    cursor: "pointer",
    boxShadow:
      "0 4px 6px rgba(0,0,0,0.1), inset 0 -3px 5px rgba(255,255,255,0.2)",
    transition: "all 0.3s ease",
  },
  roleButtonActive: {
    background: "linear-gradient(145deg, #9a8fe7, #6a52e6)",
    color: "#fff",
    boxShadow:
      "0 6px 10px rgba(0,0,0,0.3), inset 0 3px 5px rgba(255,255,255,0.6)",
  },
  toggleButton: {
    marginTop: 20,
    padding: "12px 20px",
    fontSize: "1rem",
    borderRadius: 15,
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(145deg, #ffa726, #fb8c00)",
    color: "#fff",
    fontWeight: "bold",
    boxShadow:
      "0 5px 10px rgba(251, 140, 0, 0.6), inset 0 2px 5px rgba(255, 165, 0, 0.6)",
    transition: "background 0.3s ease",
  },
  formContainer: {
    flex: 1,
    background: "#fff",
    borderRadius: "20px 0 0 20px",
    padding: 50,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    boxShadow:
      "10px 0 30px rgba(0,0,0,0.2), inset 0 0 30px rgba(102, 126, 234, 0.3)",
  },
  heading: {
    marginBottom: 30,
    fontSize: "2.6rem",
    color: "#333",
    textShadow: "0 2px 6px rgba(102, 126, 234, 0.5)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    marginBottom: 20,
    padding: "15px 20px",
    fontSize: "1.2rem",
    borderRadius: 15,
    border: "2px solid #ddd",
    outline: "none",
    transition: "border-color 0.3s ease",
    boxShadow:
      "0 5px 15px rgba(102, 126, 234, 0.2), inset 0 1px 3px rgba(255,255,255,0.7)",
  },
  submitButton: {
    padding: "18px 25px",
    fontSize: "1.4rem",
    fontWeight: "700",
    borderRadius: 20,
    border: "none",
    background:
      "linear-gradient(145deg, #667eea, #764ba2)",
    color: "#fff",
    cursor: "pointer",
    boxShadow:
      "0 10px 20px rgba(102, 126, 234, 0.7), inset 0 0 20px rgba(255, 255, 255, 0.5)",
    transition: "transform 0.2s ease",
  },
};

