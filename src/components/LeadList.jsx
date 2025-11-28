import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../utils/api";

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

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
    } catch (error) {
      setErrorMessage("Unable to fetch leads. Please try again.");
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
  };

  return (
    <div>
      <h2 className="mb-3 fw-bold">Leads</h2>

      {/* Filter Controls */}
      <div className="card p-3 mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Filter by Agent ID"
              onChange={(e) => handleFilter("salesAgent", e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
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

          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Filter by tags"
              onChange={(e) => handleFilter("tags", e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              onChange={(e) => handleFilter("source", e.target.value)}
            >
              <option value="">All Sources</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Cold Call">Cold Call</option>
              <option value="Social Media">Social Media</option>
            </select>
          </div>

          <div className="col-md-1 d-flex align-items-center">
            <button
              className="btn btn-outline-danger w-100"
              onClick={resetFilters}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="table table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Agent</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="text-center py-4">
                <div className="spinner-border text-primary"></div>
              </td>
            </tr>
          ) : errorMessage ? (
            <tr>
              <td colSpan="4" className="text-center text-muted py-4">
                {errorMessage}
              </td>
            </tr>
          ) : (
            leads.map((lead) => (
              <tr key={lead._id}>
                <td className="fw-semibold">{lead.name}</td>
                <td>{lead.status}</td>
                <td>{lead.salesAgent?.name || "Unassigned"}</td>
                <td className="text-center">
                  <Link to={`/leads/${lead._id}`}>
                    <button className="btn btn-outline-primary btn-sm">
                      View Details
                    </button>
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeadList;
