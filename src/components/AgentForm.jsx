// src/components/AgentForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const AgentForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Email validation regex (matches your backend's strictEmailRegex)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear errors on change
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Please enter a valid email address.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await api.post("/agents", formData);
      if (response.data.success) {
        alert("Sales agent created successfully!");
        navigate("/"); // Redirect to leads list (or /agents if you have an agents list page)
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        "Failed to create agent. Please try again.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2>Create Sales Agent</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            required
          />
          {errors.name && (
            <p style={{ color: "red", fontSize: "14px" }}>{errors.name}</p>
          )}
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            required
          />
          {errors.email && (
            <p style={{ color: "red", fontSize: "14px" }}>{errors.email}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating..." : "Create Agent"}
        </button>
      </form>
    </div>
  );
};

export default AgentForm;
