import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

const AgentList = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();

  const fetchAgents = async () => {
    try {
      const res = await api.get("/agents");
      setAgents(res.data.data.Agents || []);
    } catch (err) {
      console.error("Error fetching agents:", err); // Added logging for debugging
      setError("⚠️ Failed to fetch agents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showMessagePopup = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 2200);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleteLoading(true);
    try {
      await api.delete(`/agents/${deleteId}`); // Ensure backend has DELETE /agents/:id
      showMessagePopup("success", "🗑 Agent deleted successfully!");
      setShowDeleteModal(false);
      setDeleteId(null);
      fetchAgents(); // Refresh the list
    } catch (err) {
      console.error("Error deleting agent:", err); // Added logging for debugging
      // Check if error is due to agent being assigned to leads
      if (
        err.response?.status === 400 &&
        err.response.data?.message?.includes("assigned")
      ) {
        showMessagePopup(
          "danger",
          "❌ Cannot delete agent assigned to leads. Reassign leads first."
        );
      } else {
        showMessagePopup(
          "danger",
          "❌ Failed to delete agent. Please try again."
        );
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="px-2 px-sm-3 px-md-0" style={{ minHeight: "72vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Alert message */}
        {message && (
          <div
            className={`alert alert-${message.type} alert-dismissible fade show mt-3`}
            role="alert"
          >
            {message.text}
            <button
              className="btn-close"
              onClick={() => setMessage(null)}
            ></button>
          </div>
        )}

        {/* Header */}
        <div className="mb-4 mt-3">
          <h2 className="fw-bold text-primary mb-1">🧑‍💼 Sales Agents</h2>
          <p className="text-muted">Manage, view, and delete agents</p>
        </div>

        {/* Search Bar */}
        <div className="card p-3 shadow-sm mb-4 border-0">
          <div className="input-group">
            <span className="input-group-text bg-light border-0">🔍</span>
            <input
              type="text"
              className="form-control form-control-lg border-0"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ minHeight: "48px" }}
            />
          </div>
        </div>

        {/* Desktop Table */}
        {!loading && filteredAgents.length > 0 && (
          <div className="d-none d-md-block">
            <div className="card shadow-sm border-0 p-3 mb-4">
              <h5 className="fw-semibold mb-3">📋 Agent List</h5>
              <table className="table table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAgents.map((agent) => (
                    <tr key={agent._id}>
                      <td>{agent.name}</td>
                      <td>{agent.email}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            className="btn btn-sm btn-info"
                            onClick={() =>
                              navigate(`/leads?salesAgent=${agent._id}`)
                            }
                          >
                            👁 View Leads
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => confirmDelete(agent._id)}
                          >
                            🗑 Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mobile Cards */}
        <div className="d-md-none">
          {filteredAgents.map((agent) => (
            <div key={agent._id} className="card shadow-sm border-0 p-3 mb-3">
              <h6 className="fw-bold">{agent.name}</h6>
              <p className="text-muted">{agent.email}</p>

              <div className="d-grid gap-2">
                <button
                  className="btn btn-info"
                  onClick={() => navigate(`/leads?salesAgent=${agent._id}`)}
                >
                  👁 View Leads
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => confirmDelete(agent._id)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <>
            <div className="modal-backdrop fade show"></div>

            <div className="modal d-block" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">⚠ Confirm Delete</h5>
                    <button
                      className="btn-close"
                      onClick={() => setShowDeleteModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <p>
                      Are you sure you want to delete this agent?
                      <br />
                      This action <strong>cannot be undone.</strong>
                    </p>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={handleDelete}
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Bottom Buttons */}
        <div className="row g-2 mt-3 mb-4">
          <div className="col-12 col-sm-6">
            <button
              className="btn btn-primary w-100"
              onClick={() => navigate("/create-agent")}
            >
              ✨ Add New Agent
            </button>
          </div>
          <div className="col-12 col-sm-6">
            <Link className="btn btn-outline-primary w-100" to="/">
              🏠 Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentList;
