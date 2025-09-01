import React, { useEffect, useState } from "react";

export default function PropertyList({ userEmail }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = "http://localhost:8091";

  useEffect(() => {
    fetch(`${backendUrl}/api/properties`)
      .then((res) => res.json())
      .then((data) => {
        setProperties(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching properties:", err);
        setLoading(false);
      });
  }, []);

  const handleBook = async (propertyId) => {
    try {
      const res = await fetch(`${backendUrl}/api/bookings/${propertyId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail }),
      });

      if (res.ok) {
        alert("Booking request sent!");
      } else {
        const t = await res.text();
        alert("Error booking property: " + t);
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("Network error during booking.");
    }
  };

  if (loading) return <p>Loading properties...</p>;

  const srcFor = (url) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `${backendUrl}${url}`;
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h2>Available Properties</h2>
      {properties.length === 0 ? (
        <p>No properties available.</p>
      ) : (
        properties.map((p) => (
          <div
            key={p.id || p.propertyId}
            style={{
              border: "1px solid #aaa",
              padding: 12,
              borderRadius: 6,
              marginBottom: 10,
            }}
          >
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <p>
              📍 {p.location} | 💰 {p.price} | 🏠 {p.type}
            </p>
            {p.imageUrl && (
              <img
                src={srcFor(p.imageUrl)}
                alt={p.title}
                style={{ width: "100%", borderRadius: 8, marginBottom: 10, objectFit: "cover" }}
              />
            )}
            <button onClick={() => handleBook(p.id || p.propertyId)}>Book</button>
          </div>
        ))
      )}
    </div>
  );
}
