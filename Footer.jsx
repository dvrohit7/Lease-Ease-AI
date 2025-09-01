// src/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.links}>
        <a href="/about" style={styles.link}>About Us</a> |{" "}
        <a href="/terms" style={styles.link}>Terms & Conditions</a> |{" "}
        <a href="/disclaimer" style={styles.link}>Disclaimer Policy</a> |{" "}
        <a href="/privacy" style={styles.link}>Privacy Policy</a> |{" "}
        <a href="/refund" style={styles.link}>Cancellation & Refund Policy</a>
      </div>
      <div style={styles.credit}>
        Designed & Developed by <span style={{ fontWeight: 600 }}>@ LeaseEase Team</span>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: "#222",
    color: "#fff",
    textAlign: "center",
    padding: "16px 10px",
    fontSize: 14,
    marginTop: "40px",
  },
  links: {
    marginBottom: 8,
    color: "#ddd",
  },
  link: {
    color: "#ddd",
    textDecoration: "none",
    margin: "0 4px",
  },
  credit: {
    fontSize: 13,
    opacity: 0.9,
  },
};
