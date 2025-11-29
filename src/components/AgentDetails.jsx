import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

const SalesAgentManagement = () => {
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
    <div className="container mt-4">
      <h2 className="fw-bold text-center mb-4">🧑‍💼 Sales Agent Management</h2>

      {/* Sidebar + Content Layout */}
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3">
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

        {/* Agent List */}
        <div className="col-md-9">
          <div className="card p-3 shadow-sm">
            <h4 className="fw-semibold mb-3">📋 Sales Agent List</h4>

            {loading && (
              <div className="d-flex justify-content-center">
                <div className="spinner-border text-primary"></div>
              </div>
            )}

            {error && (
              <div className="alert alert-warning text-center fw-semibold">
                {error}
              </div>
            )}

            {!loading && !error && (
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
                      <td>{agent.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Add New Agent Button */}
            <button
              className="btn btn-primary w-100 mt-3"
              onClick={() => navigate("/create-agent")}
            >
              ➕ Add New Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAgentManagement;
