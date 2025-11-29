// src/components/AgentForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const AgentForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null); // success / error message
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear errors or success message when typing
    if (errors[name] || message) {
      setErrors({ ...errors, [name]: "" });
      setMessage(null);
    }
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
        setMessage({ type: "success", text: "Agent created successfully!" });

        setTimeout(() => {
          navigate("/agents"); // redirect after success
        }, 1000);
      }
    } catch (error) {
      setMessage({
        type: "danger",
        text:
          error.response?.data?.error ||
          "Failed to create agent. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-100"
      style={{
        maxWidth: "420px",
        margin: "12px auto",
        padding: "0 12px",
      }}
    >
      <div className="card p-3 p-sm-4 shadow-sm">
        <h3 className="mb-3 fw-bold text-start">Create Sales Agent</h3>

        {/* Status Message */}
        {message && (
          <div className={`alert alert-${message.type} text-center mb-3`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Name</label>
            <input
              className={`form-control form-control-lg ${
                errors.name ? "is-invalid" : ""
              }`}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter agent name"
            />
            {errors.name && (
              <div className="invalid-feedback d-block">{errors.name}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Email</label>
            <input
              className={`form-control form-control-lg ${
                errors.email ? "is-invalid" : ""
              }`}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter agent email"
            />
            {errors.email && (
              <div className="invalid-feedback d-block">{errors.email}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-semibold"
            disabled={loading}
            style={{ minHeight: "44px" }}
          >
            {loading ? "Creating..." : "Create Agent"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AgentForm;
