import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../utils/api";

// Custom debounce function (replaces lodash for simplicity)
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [message, setMessage] = useState(null);

  // Delete Dialog State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // No Lead Popup State
  const [showNoLeadModal, setShowNoLeadModal] = useState(false);

  // Fetch Leads (Updated to handle 404 as "no leads" modal)
  const fetchLeads = async () => {
    setLoading(true);
    setErrorMessage(null); // Clear previous errors
    try {
      const params = Object.fromEntries(searchParams);
      console.log("Fetching leads with params:", params); // Debug: Check sent params
      const res = await api.get("/leads", { params });
      console.log("API Response:", res.data); // Debug: Check API response

      if (!res.data.leads || !res.data.leads.length) {
        console.log("No leads found - showing modal"); // Debug: Confirm modal trigger
        setShowNoLeadModal(true);
        setLeads([]);
        return;
      }

      setLeads(res.data.leads);
      setShowNoLeadModal(false);
    } catch (error) {
      console.error("Fetch error:", error); // Debug: Log errors
      // Check if it's a 404 (no leads found) - show modal instead of error
      if (error.response && error.response.status === 404) {
        console.log("404 - No leads found, showing modal"); // Debug
        setShowNoLeadModal(true);
        setLeads([]);
      } else {
        setErrorMessage(
          "Unable to fetch leads. Check your filters or try again."
        );
        setShowNoLeadModal(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [searchParams]);

  // Debounced Filter Handler for Text Inputs (500ms delay to reduce API calls)
  const debouncedHandleFilter = useCallback(
    debounce((key, value) => {
      const trimmedValue = value.trim();
      console.log(`Applying debounced filter: ${key} = "${trimmedValue}"`); // Debug: Track filter changes
      const updated = new URLSearchParams(searchParams);
      if (trimmedValue) {
        updated.set(key, trimmedValue);
      } else {
        updated.delete(key);
      }
      setSearchParams(updated);
    }, 500),
    [searchParams, setSearchParams]
  );

  // Immediate Filter Handler for Selects (no debounce needed)
  const handleFilter = (key, value) => {
    const trimmedValue = value.trim();
    console.log(`Applying immediate filter: ${key} = "${trimmedValue}"`); // Debug: Track filter changes
    const updated = new URLSearchParams(searchParams);
    if (trimmedValue) {
      updated.set(key, trimmedValue);
    } else {
      updated.delete(key);
    }
    setSearchParams(updated);
  };

  const resetFilters = () => {
    console.log("Resetting filters"); // Debug: Track reset
    setSearchParams({});
    setShowNoLeadModal(false);
  };

  // Open Delete Modal
  const requestDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    try {
      await api.delete(`/leads/${deleteId}`);
      setShowDeleteModal(false);
      setMessage({ type: "success", text: "Lead deleted successfully." });
      fetchLeads();
    } catch {
      setMessage({ type: "danger", text: "Failed to delete lead." });
    }
  };

  return (
    <div className="container py-4" style={{ minHeight: "72vh" }}>
      {/* Title */}
      <h3 className="fw-bold mb-4">📋 Leads</h3>

      {/* Notification */}
      {message && (
        <div className={`alert alert-${message.type} text-center fw-semibold`}>
          {message.text}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="alert alert-danger text-center fw-semibold">
          {errorMessage}
        </div>
      )}

      {/* No Leads Modal */}
      {showNoLeadModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-center">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">⚠️ No Leads Found</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowNoLeadModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="text-muted">
                  No leads match your selected filter criteria. Try adjusting
                  your filters or resetting them.
                </p>
              </div>
              <div className="modal-footer d-flex justify-content-center">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowNoLeadModal(false)}
                >
                  Close
                </button>
                <button className="btn btn-primary" onClick={resetFilters}>
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">⚠️ Confirm Delete</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body text-center">
                <p className="fw-semibold">
                  Are you sure you want to delete this lead?
                </p>
                <small className="text-muted">
                  This action cannot be undone.
                </small>
              </div>
              <div className="modal-footer d-flex justify-content-center">
                <button
                  className="btn btn-secondary px-4"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger px-4" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="card p-3 shadow-sm border-0 mb-4">
        <h5 className="fw-bold mb-3">🔍 Filters</h5>
        <div className="row g-3 align-items-center">
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Search by Agent"
              value={searchParams.get("salesAgent") || ""}
              onChange={(e) =>
                debouncedHandleFilter("salesAgent", e.target.value)
              }
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={searchParams.get("status") || ""}
              onChange={(e) => handleFilter("status", e.target.value)}
            >
              <option value="">📊 All Status</option>
              <option value="New">🆕 New</option>
              <option value="Contacted">📞 Contacted</option>
              <option value="Qualified">⭐ Qualified</option>
              <option value="Proposal Sent">📧 Proposal Sent</option>
              <option value="Closed">🏆 Closed</option>
            </select>
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Search tags"
              value={searchParams.get("tags") || ""}
              onChange={(e) => debouncedHandleFilter("tags", e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={searchParams.get("source") || ""}
              onChange={(e) => handleFilter("source", e.target.value)}
            >
              <option value="">🌐 All Sources</option>
              <option value="Website">🌍 Website</option>
              <option value="Referral">🤝 Referral</option>
              <option value="Cold Call">📞 Cold Call</option>
              <option value="Social Media">📱 Social Media</option>
            </select>
          </div>
        </div>
        <div className="text-end mt-3">
          <button
            className="btn btn-outline-danger px-4"
            onClick={resetFilters}
          >
            ⟲ Reset
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border text-primary"></div>
          <p className="mt-3">Loading leads...</p>
        </div>
      )}

      {/* Table */}
      {!loading && leads.length > 0 && (
        <div className="table-responsive shadow-sm rounded">
          <table className="table align-middle">
            <thead
              style={{
                background: "#212529",
                color: "white",
                fontSize: "16px",
              }}
            >
              <tr>
                <th>📝 Lead Name</th>
                <th>📊 Status</th>
                <th>👤 Agent</th>
                <th>⭐ Priority</th>
                <th className="text-center">⚙️ Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id}>
                  <td className="fw-semibold">{lead.name}</td>
                  <td>
                    <span
                      className={`badge px-3 py-2 ${
                        lead.status === "New"
                          ? "bg-primary"
                          : lead.status === "Contacted"
                          ? "bg-info"
                          : lead.status === "Qualified"
                          ? "bg-success"
                          : lead.status === "Proposal Sent"
                          ? "bg-warning text-dark"
                          : "bg-secondary"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td>{lead.salesAgent?.name || "Unassigned"}</td>
                  <td>
                    <span
                      className={`badge px-3 py-2 ${
                        lead.priority === "High"
                          ? "bg-danger"
                          : lead.priority === "Medium"
                          ? "bg-warning text-dark"
                          : "bg-secondary"
                      }`}
                    >
                      {lead.priority}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <Link
                        to={`/leads/${lead._id}`}
                        className="btn btn-sm fw-semibold"
                        style={{
                          background: "#0d6efd",
                          color: "white",
                          borderRadius: "25px",
                          padding: "8px 18px",
                        }}
                      >
                        👁 View
                      </Link>
                      <button
                        onClick={() => requestDelete(lead._id)}
                        className="btn btn-sm fw-semibold"
                        style={{
                          background: "#dc3545",
                          color: "white",
                          borderRadius: "25px",
                          padding: "8px 18px",
                        }}
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
      )}
    </div>
  );
};

export default LeadList;
