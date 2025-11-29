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
    <div>
      <h2 className="fw-bold mb-3 text-primary">📌 Leads by Sales Agent</h2>

      {/* Agent Selector */}
      <div className="mb-4">
        <label className="fw-semibold mb-2">Select Sales Agent</label>
        <select
          className="form-select"
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
          {/* Filter Section */}
          <div className="card p-3 mb-3 shadow-sm">
            <h5 className="fw-semibold">Filters</h5>
            <div className="row g-3 mt-2">
              <div className="col-md-4">
                <select
                  className="form-select"
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

              <div className="col-md-4">
                <select
                  className="form-select"
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="">Filter by Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="col-md-4">
                <select
                  className="form-select"
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="">Sort by</option>
                  <option value="timeToClose">Time to Close</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lead List */}
          <div className="card p-3 shadow-sm">
            <h5 className="fw-semibold">Leads Assigned</h5>

            {filteredLeads.length === 0 ? (
              <p className="text-muted text-center mt-3">
                No leads match the selected filters.
              </p>
            ) : (
              <ul className="list-group mt-3">
                {filteredLeads.map((lead) => (
                  <li
                    key={lead._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>{lead.name}</strong> —
                      <span className="text-primary"> {lead.status}</span>
                      <span className="badge bg-warning ms-2">
                        {lead.priority}
                      </span>
                    </div>

                    <Link
                      to={`/leads/${lead._id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      View Details
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SalesAgentView;
