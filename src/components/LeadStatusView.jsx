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
    <div className="px-2 px-sm-3 px-md-0">
      <h2 className="mb-3 mb-sm-4 fw-bold text-primary">📌 Leads by Status</h2>

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

      {/* Status Groups - Responsive Grid */}
      <div className="row g-3">
        {Object.keys(groupedLeads).map((status) => (
          <div className="col-12 col-lg-6" key={status}>
            <div className="card p-3 p-sm-4 shadow-sm border-0 h-100">
              <h5 className="text-secondary border-bottom pb-2 fw-semibold mb-3">
                {status}
              </h5>

              {/* If no leads for status */}
              {groupedLeads[status].length === 0 ? (
                <p className="text-muted">No leads exist under this status.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {groupedLeads[status].map((lead) => (
                    <li
                      className="list-group-item px-0 py-3 d-flex flex-column flex-sm-row justify-content-between align-items-start align-sm-items-center"
                      key={lead._id}
                    >
                      <div className="flex-grow-1 mb-2 mb-sm-0">
                        <strong className="text-break">{lead.name}</strong>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadStatusView;
