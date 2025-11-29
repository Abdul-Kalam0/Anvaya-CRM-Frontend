import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";

const LeadForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    source: "",
    salesAgent: "",
    status: "New",
    tags: [],
    timeToClose: "",
    priority: "Medium",
  });

  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 2500);
  };

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await api.get("/agents");
        setAgents(res.data.data.Agents || []);
      } catch {
        showMessage("danger", "❌ Failed to load sales agents.");
      }
    };
    fetchAgents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "tags" ? value.split(",").map((t) => t.trim()) : value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Lead name is required";
    if (!formData.source) newErrors.source = "Lead source is required";
    if (!formData.salesAgent) newErrors.salesAgent = "Sales agent is required";
    if (!formData.timeToClose)
      newErrors.timeToClose = "Time to close is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      await api.post("/leads", formData);
      showMessage("success", "✅ Lead created successfully!");

      setTimeout(() => navigate("/leads"), 1500);
    } catch (error) {
      showMessage(
        "danger",
        error.response?.data?.message || "❌ Failed to create lead."
      );
    } finally {
      setLoading(false);
    }
  };

  const selectStyle = {
    fontSize: "16px",
    padding: "12px 16px",
    minHeight: "48px",
    border: "1px solid #dee2e6",
    borderRadius: "0.375rem",
    backgroundColor: "#fff",
    width: "100%",
  };

  return (
    <div className="px-2 px-sm-3 px-md-0">
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          paddingTop: "20px",
          paddingBottom: "40px",
        }}
      >
        {/* Header */}
        <div className="mb-4">
          <h2 className="fw-bold text-primary mb-1">📝 Create New Lead</h2>
          <p className="text-muted">
            Fill in the details to add a new lead to your pipeline
          </p>
        </div>

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

        {/* Form Card */}
        <div className="card shadow-lg border-0 p-4 p-sm-5">
          <form onSubmit={handleSubmit}>
            {/* Lead Name */}
            <div className="mb-4">
              <label className="form-label fw-semibold mb-2">
                👤 Lead Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="name"
                className={`form-control form-control-lg ${
                  errors.name ? "is-invalid border-danger" : ""
                }`}
                placeholder="e.g., ABC Corporation"
                value={formData.name}
                onChange={handleChange}
                style={{
                  fontSize: "16px",
                  padding: "12px 16px",
                  minHeight: "48px",
                }}
              />
              {errors.name && (
                <div className="invalid-feedback d-block mt-2 fw-semibold">
                  ⚠️ {errors.name}
                </div>
              )}
            </div>

            {/* Lead Source & Priority */}
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold mb-2">
                  🌐 Lead Source <span className="text-danger">*</span>
                </label>
                <select
                  name="source"
                  style={selectStyle}
                  className={`form-select ${
                    errors.source ? "is-invalid border-danger" : ""
                  }`}
                  value={formData.source}
                  onChange={handleChange}
                >
                  <option value="">-- Select Source --</option>
                  <option value="Website">📌 Website</option>
                  <option value="Referral">👥 Referral</option>
                  <option value="Cold Call">☎️ Cold Call</option>
                  <option value="Social Media">📱 Social Media</option>
                </select>
                {errors.source && (
                  <div className="text-danger mt-2 fw-semibold small">
                    ⚠️ {errors.source}
                  </div>
                )}
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold mb-2">
                  ⭐ Priority <span className="text-danger">*</span>
                </label>
                <select
                  name="priority"
                  style={selectStyle}
                  className="form-select"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="High">🔴 High</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Low">🟢 Low</option>
                </select>
              </div>
            </div>

            {/* Sales Agent & Status */}
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold mb-2">
                  🧑‍💼 Sales Agent <span className="text-danger">*</span>
                </label>
                <select
                  name="salesAgent"
                  style={selectStyle}
                  className={`form-select ${
                    errors.salesAgent ? "is-invalid border-danger" : ""
                  }`}
                  value={formData.salesAgent}
                  onChange={handleChange}
                >
                  <option value="">-- Select Agent --</option>
                  {agents.length > 0 ? (
                    agents.map((agent) => (
                      <option key={agent._id} value={agent._id}>
                        {agent.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No Agents Available</option>
                  )}
                </select>
                {errors.salesAgent && (
                  <div className="text-danger mt-2 fw-semibold small">
                    ⚠️ {errors.salesAgent}
                  </div>
                )}
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold mb-2">📊 Status</label>
                <select
                  name="status"
                  style={selectStyle}
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="New">🆕 New</option>
                  <option value="Contacted">📞 Contacted</option>
                  <option value="Qualified">✅ Qualified</option>
                  <option value="Proposal Sent">📧 Proposal Sent</option>
                  <option value="Closed">🏆 Closed</option>
                </select>
              </div>
            </div>

            {/* Time to Close */}
            <div className="mb-4">
              <label className="form-label fw-semibold mb-2">
                ⏱️ Time to Close (days) <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                name="timeToClose"
                className={`form-control form-control-lg ${
                  errors.timeToClose ? "is-invalid border-danger" : ""
                }`}
                placeholder="e.g., 30"
                value={formData.timeToClose}
                onChange={handleChange}
                min="1"
                style={{
                  fontSize: "16px",
                  padding: "12px 16px",
                  minHeight: "48px",
                }}
              />
              {errors.timeToClose && (
                <div className="invalid-feedback d-block mt-2 fw-semibold">
                  ⚠️ {errors.timeToClose}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="mb-4">
              <label className="form-label fw-semibold mb-2">🏷️ Tags</label>
              <input
                type="text"
                name="tags"
                className="form-control form-control-lg"
                placeholder="e.g., urgent, vip, premium (comma-separated)"
                value={formData.tags.join(", ")}
                onChange={handleChange}
                style={{
                  fontSize: "16px",
                  padding: "12px 16px",
                  minHeight: "48px",
                }}
              />
              <small className="text-muted d-block mt-2">
                💡 Separate multiple tags with commas
              </small>
            </div>

            {/* Buttons */}
            <div className="row g-2">
              <div className="col-12 col-sm-6">
                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-bold"
                  disabled={loading}
                  style={{ minHeight: "48px", fontSize: "16px" }}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Creating...
                    </>
                  ) : (
                    "✨ Create Lead"
                  )}
                </button>
              </div>
              <div className="col-12 col-sm-6">
                <Link
                  to="/leads"
                  className="btn btn-outline-secondary w-100 fw-semibold"
                  style={{ minHeight: "48px", fontSize: "16px" }}
                >
                  Cancel
                </Link>
              </div>
            </div>
          </form>

          {/* Helper Info */}
          <hr className="my-4" />
          <p className="text-center text-muted small mb-0">
            Need help?{" "}
            <Link to="/" className="text-decoration-none fw-semibold">
              Go back to dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeadForm;
