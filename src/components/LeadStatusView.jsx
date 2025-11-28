import React, { useState, useEffect } from "react";
import api from "../utils/api";

const LeadStatusView = () => {
  const [groupedLeads, setGroupedLeads] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await api.get("/leads");
        const data = res.data.leads || [];

        if (data.length === 0) {
          setGroupedLeads({});
        } else {
          const groups = data.reduce((acc, lead) => {
            acc[lead.status] = acc[lead.status] || [];
            acc[lead.status].push(lead);
            return acc;
          }, {});

          setGroupedLeads(groups);
        }
      } catch {
        setError("Failed to load lead data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  if (loading)
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );

  return (
    <div>
      <h2 className="mb-4 fw-bold text-primary">📌 Leads by Status</h2>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger text-center fw-semibold">
          {error}
        </div>
      )}

      {/* No Leads Case */}
      {!error && Object.keys(groupedLeads).length === 0 && (
        <div className="alert alert-info text-center fw-semibold">
          No leads available in the system.
        </div>
      )}

      {/* Status Groups */}
      {Object.keys(groupedLeads).map((status) => (
        <div className="card p-3 mb-4 shadow-sm border-0" key={status}>
          <h4 className="text-secondary border-bottom pb-2 fw-semibold">
            {status}
          </h4>

          {/* If no leads for status */}
          {groupedLeads[status].length === 0 ? (
            <p className="text-muted mt-2">No leads exist under this status.</p>
          ) : (
            <ul className="list-group mt-2">
              {groupedLeads[status].map((lead) => (
                <li
                  className="list-group-item d-flex justify-content-between align-items-center"
                  key={lead._id}
                >
                  <div>
                    <strong>{lead.name}</strong>
                    <br />
                    <small className="text-muted">
                      Agent: {lead.salesAgent?.name || "Not Assigned"}
                    </small>
                  </div>

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
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default LeadStatusView;
