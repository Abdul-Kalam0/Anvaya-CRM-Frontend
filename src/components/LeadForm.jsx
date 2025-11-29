import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  // Auto-hide message function
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 2000);
  };

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await api.get("/agents");
        setAgents(res.data.data.Agents || []);
      } catch {
        showMessage("danger", "Failed to load sales agents.");
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/leads", formData);
      showMessage("success", "Lead created successfully!");

      setTimeout(() => navigate("/"), 1200);
    } catch {
      showMessage("danger", "Failed to create lead.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-2 px-sm-3 px-md-0">
      <h2 className="mb-4 fw-semibold">Create New Lead</h2>

      {/* Status Message */}
      {message && (
        <div className={`alert alert-${message.type} text-center`} role="alert">
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold">Lead Name</label>
          <input
            name="name"
            className="form-control form-control-lg"
            placeholder="Enter lead name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold">Lead Source</label>
          <select
            name="source"
            className="form-select form-select-lg"
            value={formData.source}
            onChange={handleChange}
            required
          >
            <option value="">Select Source</option>
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Cold Call">Cold Call</option>
            <option value="Social Media">Social Media</option>
          </select>
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold">Sales Agent</label>
          <select
            name="salesAgent"
            className="form-select form-select-lg"
            value={formData.salesAgent}
            onChange={handleChange}
            required
          >
            <option value="">Select Agent</option>
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
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold">Status</label>
          <select
            name="status"
            className="form-select form-select-lg"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="col-12">
          <label className="form-label fw-semibold">Tags</label>
          <input
            className="form-control form-control-lg"
            name="tags"
            placeholder="Comma-separated (e.g., urgent, vip)"
            value={formData.tags.join(", ")}
            onChange={handleChange}
          />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold">Time to Close (days)</label>
          <input
            type="number"
            className="form-control form-control-lg"
            name="timeToClose"
            placeholder="Enter number of days"
            value={formData.timeToClose}
            required
            onChange={handleChange}
          />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold">Priority</label>
          <select
            name="priority"
            className="form-select form-select-lg"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 mt-3 py-2 fw-semibold"
          disabled={loading}
          style={{ minHeight: "44px" }}
        >
          {loading ? "Creating..." : "Create Lead"}
        </button>
      </form>
    </div>
  );
};

export default LeadForm;
