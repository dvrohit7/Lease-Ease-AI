import React from "react";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      style={{
        padding: "10px 15px",
        marginBottom: 20,
        backgroundColor: "#5956e9",
        color: "#fff",
        border: "none",
        borderRadius: 5,
        cursor: "pointer",
      }}
    >
      Go Back
    </button>
  );
}
