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
      style={{
        maxWidth: "420px",
        margin: "20px auto",
      }}
    >
      <div className="card p-4 shadow-sm">
        <h3 className="mb-3 fw-bold">Create Sales Agent</h3>

        {/* Status Message */}
        {message && (
          <div className={`alert alert-${message.type} text-center`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="fw-semibold">Name</label>
            <input
              className="form-control"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <div className="text-danger small mt-1">{errors.name}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="fw-semibold">Email</label>
            <input
              className="form-control"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <div className="text-danger small mt-1">{errors.email}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Agent"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AgentForm;
