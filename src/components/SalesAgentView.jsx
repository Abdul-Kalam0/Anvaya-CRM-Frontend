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

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await api.get("/agents");
        setAgents(res.data.data.Agents);
      } catch {
        console.log("Error fetching agents");
      }
    };

    const fetchLeads = async () => {
      try {
        const res = await api.get("/leads");
        setLeads(res.data.leads);
      } catch {
        console.log("Error fetching leads");
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

  return (
    <div className="px-2 px-sm-3 px-md-0">
      <h2 className="fw-bold mb-3 mb-sm-4 text-primary">
        📌 Leads by Sales Agent
      </h2>

      {/* Agent Selector */}
      <div className="mb-4">
        <label className="form-label fw-semibold mb-2">
          Select Sales Agent
        </label>
        <select
          className="form-select form-select-lg"
          onChange={(e) => setSelectedAgent(e.target.value)}
        >
          <option value="">-- Select an Agent --</option>
          {agents.map((agent) => (
            <option key={agent._id} value={agent._id}>
              {agent.name} ({agent.email})
            </option>
          ))}
        </select>
      </div>

      {selectedAgent && (
        <>
          {/* Filter Toggle - Mobile Only */}
          <div className="d-md-none mb-3">
            <button
              className="btn btn-outline-primary w-100"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {/* Filter Section */}
          <div
            className={`card p-3 p-sm-4 mb-4 shadow-sm ${
              !showFilters ? "d-none d-md-block" : ""
            }`}
          >
            <h5 className="fw-semibold mb-3">Filters</h5>
            <div className="row g-2 g-md-3">
              <div className="col-12 col-md-4">
                <select
                  className="form-select form-select-sm"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Filter by Status</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="col-12 col-md-4">
                <select
                  className="form-select form-select-sm"
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="">Filter by Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="col-12 col-md-4">
                <select
                  className="form-select form-select-sm"
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="">Sort by</option>
                  <option value="timeToClose">Time to Close</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lead List */}
          <div className="card p-3 p-sm-4 shadow-sm">
            <h5 className="fw-semibold mb-3">Leads Assigned</h5>

            {filteredLeads.length === 0 ? (
              <p className="text-muted text-center mt-3">
                No leads match the selected filters.
              </p>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="d-none d-md-block table-responsive">
                  <table className="table table-hover">
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
                          <td className="fw-semibold">{lead.name}</td>
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
                    <div key={lead._id} className="card mb-3 p-3">
                      <h6 className="fw-semibold mb-2 text-break">
                        {lead.name}
                      </h6>
                      <p className="mb-2">
                        <small className="text-muted">Status:</small>
                        <span className="badge bg-info ms-2">
                          {lead.status}
                        </span>
                      </p>
                      <p className="mb-3">
                        <small className="text-muted">Priority:</small>
                        <span
                          className={`badge ms-2 ${
                            lead.priority === "High"
                              ? "bg-danger"
                              : lead.priority === "Medium"
                              ? "bg-warning text-dark"
                              : "bg-secondary"
                          }`}
                        >
                          {lead.priority}
                        </span>
                      </p>
                      <Link
                        to={`/leads/${lead._id}`}
                        className="btn btn-primary btn-sm w-100"
                      >
                        View Details
                      </Link>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SalesAgentView;
