import React, { useState, useEffect } from "react";
import api from "../utils/api";

const SalesAgentView = () => {
  const [groupedLeads, setGroupedLeads] = useState({});

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await api.get("/leads");
        const groups = res.data.leads.reduce((acc, lead) => {
          const agent = lead.salesAgent?.name || "Unassigned";
          acc[agent] = acc[agent] || [];
          acc[agent].push(lead);
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
      <h2 className="mb-3">Leads by Sales Agent</h2>

      {Object.keys(groupedLeads).map((agent) => (
        <div className="card p-3 mb-3" key={agent}>
          <h4 className="text-success">{agent}</h4>
          <ul className="list-group mt-2">
            {groupedLeads[agent].map((lead) => (
              <li className="list-group-item" key={lead._id}>
                {lead.name} — {lead.status} — Priority: {lead.priority}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SalesAgentView;
