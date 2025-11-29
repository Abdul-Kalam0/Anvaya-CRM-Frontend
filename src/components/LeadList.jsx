import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../utils/api";

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

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
    <div className="px-2 px-sm-3 px-md-0">
      <h2 className="mb-3 fw-bold">Leads</h2>

      {/* Filter Toggle Button - Mobile Only */}
      <div className="d-md-none mb-3">
        <button
          className="btn btn-outline-primary w-100"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filters Card */}
      <div
        className={`card p-3 mb-4 shadow-sm ${
          !showFilters ? "d-none d-md-block" : ""
        }`}
      >
        <div className="row g-2 g-md-3">
          <div className="col-12 col-md-3">
            <input
              className="form-control form-control-sm"
              placeholder="Filter by Agent ID"
              onChange={(e) => handleFilter("salesAgent", e.target.value)}
            />
          </div>

          <div className="col-12 col-md-3">
            <select
              className="form-select form-select-sm"
              onChange={(e) => handleFilter("status", e.target.value)}
            >
              <option value="">All Status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="col-12 col-md-3">
            <input
              className="form-control form-control-sm"
              placeholder="Filter by tags"
              onChange={(e) => handleFilter("tags", e.target.value)}
            />
          </div>

          <div className="col-12 col-md-2">
            <select
              className="form-select form-select-sm"
              onChange={(e) => handleFilter("source", e.target.value)}
            >
              <option value="">All Sources</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Cold Call">Cold Call</option>
              <option value="Social Media">Social Media</option>
            </select>
          </div>

          <div className="col-12 col-md-1 d-flex">
            <button
              className="btn btn-outline-danger w-100 btn-sm"
              onClick={resetFilters}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">Loading leads...</p>
        </div>
      )}

      {/* Error or Empty State */}
      {!loading && errorMessage && (
        <div className="alert alert-warning text-center">{errorMessage}</div>
      )}

      {/* Desktop Table View */}
      {!loading && !errorMessage && (
        <>
          <div className="d-none d-md-block table-responsive">
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Agent</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead._id}>
                    <td className="fw-semibold">{lead.name}</td>
                    <td>{lead.status}</td>
                    <td>{lead.salesAgent?.name || "Unassigned"}</td>
                    <td className="text-center">
                      <Link
                        className="btn btn-primary btn-sm"
                        to={`/leads/${lead._id}`}
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="d-md-none">
            {leads.map((lead) => (
              <div key={lead._id} className="card mb-3 shadow-sm">
                <div className="card-body p-3">
                  <h6 className="card-title fw-semibold mb-2">{lead.name}</h6>
                  <p className="mb-2">
                    <small className="text-muted">Status:</small>{" "}
                    <span className="badge bg-info">{lead.status}</span>
                  </p>
                  <p className="mb-3">
                    <small className="text-muted">Agent:</small>{" "}
                    <span className="d-block">
                      {lead.salesAgent?.name || "Unassigned"}
                    </span>
                  </p>
                  <Link
                    className="btn btn-primary btn-sm w-100"
                    to={`/leads/${lead._id}`}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LeadList;
