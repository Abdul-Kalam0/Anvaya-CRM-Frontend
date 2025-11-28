import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../utils/api";

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const params = Object.fromEntries(searchParams);
        const res = await api.get("/leads", { params });
        setLeads(res.data.leads);
      } catch {
        alert("Error fetching leads");
      }
    };
    fetchLeads();
  }, [searchParams]);

  const handleFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    setSearchParams(newParams);
  };

  return (
    <div>
      <h2 className="mb-3">Leads</h2>

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

          <div className="col-md-3">
            <select
              className="form-select"
              onChange={(e) => handleFilter("source", e.target.value)}
            >
              <option value="">All Sources</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Cold Call">Cold Call</option>
            </select>
          </div>
        </div>
      </div>

      <table className="table table-hover">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Agent</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id}>
              <td>
                <Link to={`/leads/${lead._id}`} className="fw-semibold">
                  {lead.name}
                </Link>
              </td>
              <td>{lead.status}</td>
              <td>{lead.salesAgent?.name || "Unassigned"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadList;
