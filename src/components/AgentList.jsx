import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

const AgentList = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchAgents = async () => {
    try {
      const res = await api.get("/agents");
      setAgents(res.data.data.Agents || []);
    } catch (err) {
      setError("No agents found or failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-2 px-sm-3 px-md-0">
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <div className="mb-4">
          <h2 className="fw-bold text-primary mb-1">🧑‍💼 Sales Agents</h2>
          <p className="text-muted">
            Manage and view all sales agents in your team
          </p>
        </div>

        {/* Search Bar */}
        <div className="card p-3 p-sm-4 shadow-sm mb-4 border-0">
          <div className="input-group">
            <span className="input-group-text bg-light border-0">🔍</span>
            <input
              type="text"
              className="form-control form-control-lg border-0"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                fontSize: "16px",
                padding: "12px 16px",
                minHeight: "48px",
              }}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div
            className="alert alert-warning alert-dismissible fade show mb-4"
            role="alert"
          >
            <strong>⚠️ Warning:</strong> {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError(null)}
            ></button>
          </div>
        )}

        {/* Agents Table/Cards */}
        {!loading && !error && agents.length > 0 && (
          <>
            {/* Desktop Table View */}
            <div className="d-none d-md-block">
              <div className="card shadow-sm border-0 p-3 p-sm-4 mb-4">
                <h5 className="fw-semibold mb-3">📋 Agent List</h5>
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th className="fw-semibold">Name</th>
                        <th className="fw-semibold">Email</th>
                        <th className="fw-semibold text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAgents.map((agent) => (
                        <tr key={agent._id} className="align-middle">
                          <td>
                            <span className="fw-semibold">{agent.name}</span>
                          </td>
                          <td>
                            <span className="text-muted text-break">
                              {agent.email}
                            </span>
                          </td>
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-info"
                              style={{ minHeight: "36px", fontSize: "14px" }}
                              onClick={() =>
                                navigate(`/leads?salesAgent=${agent._id}`)
                              }
                            >
                              👁️ View Leads
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="d-md-none">
              <div className="card shadow-sm border-0 p-3 p-sm-4 mb-4">
                <h5 className="fw-semibold mb-3">📋 Agent List</h5>
                {filteredAgents.length === 0 ? (
                  <p className="text-muted text-center py-4">
                    No agents match your search.
                  </p>
                ) : (
                  filteredAgents.map((agent) => (
                    <div
                      key={agent._id}
                      className="card mb-3 p-3 border"
                      style={{
                        borderLeft: "4px solid #007bff",
                        borderTopLeftRadius: "0.375rem",
                        borderBottomLeftRadius: "0.375rem",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-semibold text-break mb-0">
                          {agent.name}
                        </h6>
                      </div>
                      <p className="mb-3">
                        <small className="text-muted d-block mb-1">Email</small>
                        <span className="text-break">{agent.email}</span>
                      </p>
                      <button
                        className="btn btn-info btn-sm w-100 fw-semibold"
                        style={{ minHeight: "44px", fontSize: "14px" }}
                        onClick={() =>
                          navigate(`/leads?salesAgent=${agent._id}`)
                        }
                      >
                        👁️ View Leads
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && agents.length === 0 && (
          <div className="card p-5 text-center shadow-sm border-0 mb-4">
            <h5 className="text-muted fw-semibold mb-3">📭 No Agents Found</h5>
            <p className="text-muted mb-4">
              There are no sales agents in the system yet. Create one to get
              started!
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="row g-2 mb-4">
          <div className="col-12 col-sm-6">
            <button
              className="btn btn-primary w-100 fw-semibold"
              onClick={() => navigate("/create-agent")}
              style={{ minHeight: "48px", fontSize: "16px" }}
            >
              ✨ Add New Agent
            </button>
          </div>
          <div className="col-12 col-sm-6">
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
      </div>
    </div>
  );
};

export default AgentList;
