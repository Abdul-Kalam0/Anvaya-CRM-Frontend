import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../utils/api";

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    closedLeads: 0,
    inProgress: 0,
  });

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = Object.fromEntries(searchParams);
      const res = await api.get("/leads", { params });

      if (!res.data.leads || res.data.leads.length === 0) {
        setLeads([]);
        setErrorMessage("No leads match the selected filters.");
      } else {
        setLeads(res.data.leads);
        setErrorMessage(null);

        // Calculate stats
        const totalLeads = res.data.leads.length;
        const newLeads = res.data.leads.filter(
          (l) => l.status === "New"
        ).length;
        const closedLeads = res.data.leads.filter(
          (l) => l.status === "Closed"
        ).length;
        const inProgress = res.data.leads.filter(
          (l) => l.status !== "New" && l.status !== "Closed"
        ).length;

        setStats({ totalLeads, newLeads, closedLeads, inProgress });
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setLeads([]);
        setErrorMessage("No leads found with the applied filters.");
      } else {
        setErrorMessage("Unable to fetch leads. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [searchParams]);

  const handleFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setSearchParams({});
    setErrorMessage(null);
    setShowFilters(false);
  };

  return (
    <div
      className="px-2 px-sm-3 px-md-0"
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        paddingBottom: "40px",
      }}
    >
      {/* Header Section */}
      <div className="mb-4" style={{ paddingTop: "20px" }}>
        <h1 className="fw-bold text-primary mb-2" style={{ fontSize: "2rem" }}>
          📊 Dashboard
        </h1>
        <p className="text-muted">
          Welcome to Anvaya CRM - Manage your leads efficiently
        </p>
      </div>

      {/* Stats Cards */}
      {!loading && leads.length > 0 && (
        <div className="row g-3 g-md-4 mb-4">
          <div className="col-12 col-sm-6 col-md-3">
            <div
              className="card border-0 shadow-sm p-4"
              style={{ borderTop: "4px solid #007bff" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted fw-semibold mb-1">Total Leads</p>
                  <h3 className="fw-bold text-primary mb-0">
                    {stats.totalLeads}
                  </h3>
                </div>
                <div style={{ fontSize: "2.5rem" }}>📋</div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <div
              className="card border-0 shadow-sm p-4"
              style={{ borderTop: "4px solid #28a745" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted fw-semibold mb-1">New Leads</p>
                  <h3 className="fw-bold text-success mb-0">
                    {stats.newLeads}
                  </h3>
                </div>
                <div style={{ fontSize: "2.5rem" }}>🆕</div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <div
              className="card border-0 shadow-sm p-4"
              style={{ borderTop: "4px solid #ffc107" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted fw-semibold mb-1">In Progress</p>
                  <h3 className="fw-bold text-warning mb-0">
                    {stats.inProgress}
                  </h3>
                </div>
                <div style={{ fontSize: "2.5rem" }}>⏳</div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <div
              className="card border-0 shadow-sm p-4"
              style={{ borderTop: "4px solid #17a2b8" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted fw-semibold mb-1">Closed Leads</p>
                  <h3 className="fw-bold text-info mb-0">
                    {stats.closedLeads}
                  </h3>
                </div>
                <div style={{ fontSize: "2.5rem" }}>🏆</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Toggle Button - Mobile Only */}
      <div className="d-md-none mb-3">
        <button
          className="btn btn-primary w-100 fw-semibold"
          onClick={() => setShowFilters(!showFilters)}
          style={{ minHeight: "48px" }}
        >
          {showFilters ? "▼ Hide Filters" : "▶ Show Filters"}
        </button>
      </div>

      {/* Filters Card */}
      <div
        className={`card p-3 p-sm-4 mb-4 shadow-sm border-0 ${
          !showFilters ? "d-none d-md-block" : ""
        }`}
      >
        <h5 className="fw-semibold mb-3">🔍 Filters</h5>
        <div className="row g-2 g-md-3">
          <div className="col-12 col-md-2">
            <input
              className="form-control"
              placeholder="Search by Agent"
              onChange={(e) => handleFilter("salesAgent", e.target.value)}
              style={{ fontSize: "14px", minHeight: "40px" }}
            />
          </div>

          <div className="col-12 col-md-2">
            <select
              className="form-select"
              onChange={(e) => handleFilter("status", e.target.value)}
              style={{ fontSize: "14px", minHeight: "40px" }}
            >
              <option value="">📊 All Status</option>
              <option value="New">🆕 New</option>
              <option value="Contacted">📞 Contacted</option>
              <option value="Qualified">✅ Qualified</option>
              <option value="Proposal Sent">📧 Proposal Sent</option>
              <option value="Closed">🏆 Closed</option>
            </select>
          </div>

          <div className="col-12 col-md-2">
            <input
              className="form-control"
              placeholder="Search tags"
              onChange={(e) => handleFilter("tags", e.target.value)}
              style={{ fontSize: "14px", minHeight: "40px" }}
            />
          </div>

          <div className="col-12 col-md-2">
            <select
              className="form-select"
              onChange={(e) => handleFilter("source", e.target.value)}
              style={{ fontSize: "14px", minHeight: "40px" }}
            >
              <option value="">🌐 All Sources</option>
              <option value="Website">📌 Website</option>
              <option value="Referral">👥 Referral</option>
              <option value="Cold Call">☎️ Cold Call</option>
              <option value="Social Media">📱 Social Media</option>
            </select>
          </div>

          <div className="col-12 col-md-2">
            <button
              className="btn btn-outline-danger w-100 fw-semibold"
              onClick={resetFilters}
              style={{ minHeight: "40px" }}
            >
              ⟲ Reset
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3 text-muted fw-semibold">Loading leads...</p>
        </div>
      )}

      {/* Error or Empty State */}
      {!loading && errorMessage && (
        <div className="alert alert-warning border-0 shadow-sm" role="alert">
          <div className="d-flex align-items-center">
            <span style={{ fontSize: "1.5rem" }}>⚠️</span>
            <span className="ms-3 fw-semibold">{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Desktop Table View */}
      {!loading && !errorMessage && (
        <>
          <div className="d-none d-md-block">
            <div className="card border-0 shadow-sm p-0 mb-4">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th className="fw-semibold">📝 Lead Name</th>
                      <th className="fw-semibold">📊 Status</th>
                      <th className="fw-semibold">🧑‍💼 Agent</th>
                      <th className="fw-semibold">⭐ Priority</th>
                      <th className="fw-semibold text-center">⚙️ Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead._id} className="align-middle">
                        <td className="fw-semibold text-break">{lead.name}</td>
                        <td>
                          <span
                            className={`badge ${
                              lead.status === "New"
                                ? "bg-primary"
                                : lead.status === "Contacted"
                                ? "bg-info"
                                : lead.status === "Qualified"
                                ? "bg-success"
                                : lead.status === "Proposal Sent"
                                ? "bg-warning text-dark"
                                : "bg-secondary"
                            }`}
                          >
                            {lead.status}
                          </span>
                        </td>
                        <td>{lead.salesAgent?.name || "Unassigned"}</td>
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
                            className="btn btn-primary btn-sm fw-semibold"
                            to={`/leads/${lead._id}`}
                            style={{ minHeight: "36px" }}
                          >
                            👁️ View
                          </Link>
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
            {leads.map((lead) => (
              <div
                key={lead._id}
                className="card mb-3 shadow-sm border-0 p-3"
                style={{ borderLeft: "4px solid #007bff" }}
              >
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="fw-semibold text-break mb-0">{lead.name}</h6>
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
                </div>

                <div className="row g-2 my-2">
                  <div className="col-6">
                    <small className="text-muted d-block">Status</small>
                    <span
                      className={`badge ${
                        lead.status === "New"
                          ? "bg-primary"
                          : lead.status === "Contacted"
                          ? "bg-info"
                          : lead.status === "Qualified"
                          ? "bg-success"
                          : lead.status === "Proposal Sent"
                          ? "bg-warning text-dark"
                          : "bg-secondary"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </div>
                  <div className="col-6">
                    <small className="text-muted d-block">Agent</small>
                    <span className="d-block fw-semibold">
                      {lead.salesAgent?.name || "Unassigned"}
                    </span>
                  </div>
                </div>

                <Link
                  className="btn btn-primary btn-sm w-100 fw-semibold mt-3"
                  to={`/leads/${lead._id}`}
                  style={{ minHeight: "44px" }}
                >
                  👁️ View Details
                </Link>
              </div>
            ))}
          </div>
        </>
      )}

      {/* No Leads State */}
      {!loading && !errorMessage && leads.length === 0 && (
        <div className="card p-5 text-center border-0 shadow-sm">
          <div style={{ fontSize: "4rem" }}>📭</div>
          <h5 className="fw-bold mt-3 mb-2">No Leads Found</h5>
          <p className="text-muted">
            Start by creating your first lead or adjusting your filters
          </p>
        </div>
      )}
    </div>
  );
};

export default LeadList;
