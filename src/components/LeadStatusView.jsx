import React, { useState, useEffect } from "react";
import api from "../utils/api";

const LeadStatusView = () => {
  const [groupedLeads, setGroupedLeads] = useState({});

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await api.get("/leads");
        const groups = res.data.leads.reduce((acc, lead) => {
          acc[lead.status] = acc[lead.status] || [];
          acc[lead.status].push(lead);
          return acc;
        }, {});
        setGroupedLeads(groups);
      } catch {
        alert("Error fetching leads");
      }
    };
    fetchLeads();
  }, []);

  return (
    <div>
      <h2 className="mb-3">Leads by Status</h2>

      {Object.keys(groupedLeads).map((status) => (
        <div className="card p-3 mb-3" key={status}>
          <h4 className="text-primary">{status}</h4>
          <ul className="list-group mt-2">
            {groupedLeads[status].map((lead) => (
              <li className="list-group-item" key={lead._id}>
                {lead.name} — {lead.salesAgent?.name || "No Agent"} — Priority:{" "}
                {lead.priority}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default LeadStatusView;
