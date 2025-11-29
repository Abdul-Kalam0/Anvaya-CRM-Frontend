import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

const AgentList = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchAgents = async () => {
    try {
      const res = await api.get("/agents");
      setAgents(res.data.data.Agents);
    } catch (err) {
      setError("No agents found or failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div className="container-fluid px-2 px-sm-3 px-md-4 mt-2 mt-sm-3 mt-md-4">
      <h2 className="fw-bold text-center mb-3 mb-sm-4">🧑‍💼 Sales Agents</h2>

      {/* Sidebar + Content Layout - Stacks on Mobile */}
      <div className="row g-3">
        {/* Sidebar - Hidden on Mobile, Visible on Tablet+ */}
        <div className="col-12 col-md-3 d-none d-md-block">
          <div className="card shadow-sm p-3">
            <h5 className="fw-semibold">Menu</h5>
            <hr />
            <ul className="list-group">
              <li className="list-group-item">
                <Link to="/" className="text-decoration-none">
                  ⬅ Back to Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Agent List - Full width on Mobile */}
        <div className="col-12 col-md-9">
          <div className="card p-3 p-sm-4 shadow-sm">
            <h4 className="fw-semibold mb-3">📋 Sales Agent List</h4>

            {loading && (
              <div className="d-flex justify-content-center py-4">
                <div className="spinner-border text-primary"></div>
              </div>
            )}

            {error && (
              <div className="alert alert-warning text-center fw-semibold">
                {error}
              </div>
            )}

            {!loading && !error && (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.map((agent) => (
                      <tr key={agent._id}>
                        <td>{agent.name}</td>
                        <td className="text-truncate">{agent.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Add New Agent Button */}
            <button
              className="btn btn-primary w-100 mt-3 py-2 fw-semibold"
              onClick={() => navigate("/create-agent")}
              style={{ minHeight: "44px" }}
            >
              ➕ Add New Agent
            </button>
          </div>

          {/* Mobile Back Button - Only Visible on Mobile */}
          <div className="d-md-none mt-2">
            <Link to="/" className="btn btn-outline-secondary w-100">
              ⬅ Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentList;
