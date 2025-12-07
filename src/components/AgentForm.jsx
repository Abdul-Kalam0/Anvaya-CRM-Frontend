// src/components/AgentForm.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";

const AgentForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

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
        setMessage({ type: "success", text: "✅ Agent created successfully!" });

        setTimeout(() => {
          navigate("/agents");
        }, 1200);
      }
    } catch (error) {
      setMessage({
        type: "danger",
        text:
          error.response?.data?.error ||
          "❌ Failed to create agent. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid px-3 px-sm-4 px-md-0 "
      style={{ minHeight: "72vh" }}
    >
      <div className="row">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 mx-auto">
          <div style={{ paddingTop: "20px", paddingBottom: "40px" }}>
            {/* Header */}
            <div className="mb-4">
              <h2
                className="fw-bold text-primary mb-2"
                style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)" }}
              >
                🧑‍💼 Create Sales Agent
              </h2>
              <p className="text-muted fs-6">
                Add a new sales agent to your CRM system
              </p>
            </div>

            {/* Card */}
            <div className="card shadow-lg border-0 p-3 p-sm-4 p-md-5">
              {/* Status Message */}
              {message && (
                <div
                  className={`alert alert-${message.type} alert-dismissible fade show mb-4`}
                  role="alert"
                >
                  <span className="fw-semibold">{message.text}</span>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setMessage(null)}
                    aria-label="Close"
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Name Field */}
                <div className="mb-4">
                  <label className="form-label fw-semibold mb-2">
                    👤 Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    className={`form-control form-control-lg ${
                      errors.name ? "is-invalid border-danger" : ""
                    }`}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., John Smith"
                    style={{
                      fontSize: "clamp(14px, 2vw, 16px)",
                      padding: "12px 16px",
                      minHeight: "48px",
                    }}
                  />
                  {errors.name && (
                    <div className="invalid-feedback d-block mt-2 text-danger fw-semibold">
                      ⚠️ {errors.name}
                    </div>
                  )}
                </div>

                {/* Email Field */}
                <div className="mb-4">
                  <label className="form-label fw-semibold mb-2">
                    📧 Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    className={`form-control form-control-lg ${
                      errors.email ? "is-invalid border-danger" : ""
                    }`}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g., john@example.com"
                    style={{
                      fontSize: "clamp(14px, 2vw, 16px)",
                      padding: "12px 16px",
                      minHeight: "48px",
                    }}
                  />
                  {errors.email && (
                    <div className="invalid-feedback d-block mt-2 text-danger fw-semibold">
                      ⚠️ {errors.email}
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="d-grid gap-2">
                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg fw-bold"
                    disabled={loading}
                    style={{
                      minHeight: "48px",
                      fontSize: "clamp(14px, 2vw, 16px)",
                    }}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Creating...
                      </>
                    ) : (
                      "✨ Create Agent"
                    )}
                  </button>

                  {/* Cancel Button */}
                  <Link
                    to="/agents"
                    className="btn btn-outline-secondary btn-lg fw-semibold"
                    style={{
                      minHeight: "48px",
                      fontSize: "clamp(14px, 2vw, 16px)",
                      textDecoration: "none",
                    }}
                  >
                    ❌ Cancel
                  </Link>
                </div>
              </form>

              {/* Footer Info */}
              <hr className="my-4" />
              <p className="text-center text-muted small">
                Need help?{" "}
                <Link
                  to="/"
                  className="text-decoration-none fw-semibold text-primary"
                >
                  🏠 Back to Dashboard
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentForm;
