import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom";

const SalesAgentView = () => {
  const [agents, setAgents] = useState([]);
  const [leads, setLeads] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await api.get("/agents");
        setAgents(res.data.data.Agents || []);
      } catch (err) {
        setError("Failed to load agents");
      }
    };

    const fetchLeads = async () => {
      try {
        const res = await api.get("/leads");
        setLeads(res.data.leads || []);
      } catch (err) {
        setError("Failed to load leads");
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
    fetchLeads();
  }, []);

  useEffect(() => {
    let filtered = leads.filter(
      (lead) => lead.salesAgent?._id === selectedAgent
    );

    if (statusFilter) {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }

    if (priorityFilter) {
      filtered = filtered.filter((lead) => lead.priority === priorityFilter);
    }

    if (sortOption === "timeToClose") {
      filtered = [...filtered].sort((a, b) => a.timeToClose - b.timeToClose);
    }

    setFilteredLeads(filtered);
  }, [selectedAgent, statusFilter, priorityFilter, sortOption, leads]);

  if (loading)
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  if (error)
    return (
      <div className="alert alert-danger text-center mt-3 fw-semibold">
        {error}
      </div>
    );

  return (
    <div className="px-2 px-sm-3 px-md-0">
      <h2 className="fw-bold mb-3 text-primary">📌 Leads by Sales Agent</h2>

      {/* Agent Selector */}
      <div className="card p-3 p-sm-4 mb-4 shadow-sm border-0">
        <label className="fw-semibold mb-2">Select Sales Agent</label>

        {/* Custom Dropdown */}
        <div style={{ position: "relative", width: "100%" }}>
          <div
            onClick={() => setOpenDropdown(!openDropdown)}
            style={{
              border: "1px solid #ccc",
              padding: "12px 14px",
              borderRadius: "10px",
              background: "#fff",
              fontSize: "16px",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            }}
          >
            {selectedAgent
              ? agents.find((a) => a._id === selectedAgent)?.name
              : "-- Choose an Agent --"}
          </div>

          {/* Dropdown Menu */}
          {openDropdown && (
            <div
              style={{
                position: "absolute",
                top: "105%",
                width: "100%",
                background: "#fff",
                borderRadius: "10px",
                maxHeight: "220px",
                overflowY: "auto",
                zIndex: 10,
                boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
              }}
            >
              {agents.map((agent) => (
                <div
                  key={agent._id}
                  onClick={() => {
                    setSelectedAgent(agent._id);
                    setOpenDropdown(false);
                  }}
                  style={{
                    padding: "12px",
                    fontSize: "15px",
                    borderBottom: "1px solid #eee",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.target.style.background = "#f5f5f5")}
                  onMouseLeave={(e) => (e.target.style.background = "#fff")}
                >
                  {agent.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedAgent && (
        <>
          {/* Mobile Filter Toggle */}
          <div className="d-md-none mb-3">
            <button
              className="btn btn-outline-primary w-100 fw-semibold"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "▼ Hide Filters" : "▶ Show Filters"}
            </button>
          </div>

          {/* Filters Section */}
          <div
            className={`card p-3 p-sm-4 mb-4 shadow-sm border-0 ${
              !showFilters ? "d-none d-md-block" : ""
            }`}
          >
            <h5 className="fw-semibold mb-3">🔍 Filters</h5>

            <div className="row g-2 g-md-3">
              <div className="col-12 col-sm-6 col-md-4">
                <select
                  className="form-select form-select-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="col-12 col-sm-6 col-md-4">
                <select
                  className="form-select form-select-sm"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="">All Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="col-12 col-sm-6 col-md-4">
                <select
                  className="form-select form-select-sm"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="">Sort by</option>
                  <option value="timeToClose">Time to Close</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lead Table / Cards */}
          <div className="card p-3 p-sm-4 shadow-sm border-0 mb-4">
            <h5 className="fw-semibold mb-3">
              📋 Leads ({filteredLeads.length})
            </h5>

            {/* Desktop Table */}
            <div className="d-none d-md-block table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Lead Name</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead._id}>
                      <td className="fw-semibold text-break">{lead.name}</td>
                      <td>{lead.status}</td>
                      <td>
                        <span
                          className={`badge ${
                            lead.priority === "High"
                              ? "bg-danger"
                              : lead.priority === "Medium"
                              ? "bg-warning text-dark"
                              : "bg-secondary"
                          }`}
                        >
                          {lead.priority}
                        </span>
                      </td>
                      <td className="text-center">
                        <Link
                          to={`/leads/${lead._id}`}
                          className="btn btn-sm btn-primary"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="d-md-none">
              {filteredLeads.map((lead) => (
                <div key={lead._id} className="card mb-3 p-3 border">
                  <h6 className="fw-semibold text-break">{lead.name}</h6>
                  <div className="row g-2 my-2">
                    <div className="col-6">
                      <small className="text-muted">Status</small>
                      <div>{lead.status}</div>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Priority</small>
                      <div>{lead.priority}</div>
                    </div>
                  </div>
                  <Link
                    className="btn btn-primary btn-sm w-100"
                    to={`/leads/${lead._id}`}
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Back to Dashboard Button */}
      <div className="mb-4">
        <Link
          to="/"
          className="btn btn-outline-primary w-100 fw-semibold"
          style={{
            minHeight: "48px",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          🏠 Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default SalesAgentView;
