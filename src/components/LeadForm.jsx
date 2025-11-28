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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await api.get("/agents");
        setAgents(res.data.data.Agents);
      } catch {
        alert("Error fetching agents");
      }
    };
    fetchAgents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "tags") {
      setFormData({ ...formData, tags: value.split(",").map((t) => t.trim()) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/leads", formData);
      navigate("/");
    } catch {
      alert("Error creating lead");
    }
  };

  return (
    <div>
      <h2 className="mb-4 fw-semibold">Create New Lead</h2>

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Lead Name</label>
          <input
            name="name"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Lead Source</label>
          <select
            name="source"
            className="form-select"
            onChange={handleChange}
            required
          >
            <option value="">Select Source</option>
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Cold Call">Cold Call</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Sales Agent</label>
          <select
            name="salesAgent"
            className="form-select"
            onChange={handleChange}
            required
          >
            <option value="">Select Agent</option>
            {agents.map((agent) => (
              <option key={agent._id} value={agent._id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Status</label>
          <select name="status" className="form-select" onChange={handleChange}>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="col-md-12">
          <label className="form-label">Tags</label>
          <input
            className="form-control"
            name="tags"
            placeholder="Comma-separated"
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Time to Close (days)</label>
          <input
            type="number"
            className="form-control"
            name="timeToClose"
            required
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Priority</label>
          <select
            name="priority"
            className="form-select"
            onChange={handleChange}
          >
            <option value="High">High</option>
            <option value="Medium" defaultValue>
              Medium
            </option>
            <option value="Low">Low</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100 mt-3">
          Create Lead
        </button>
      </form>
    </div>
  );
};

export default LeadForm;
