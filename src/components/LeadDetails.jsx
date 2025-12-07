import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";

const LeadDetails = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [agents, setAgents] = useState([]); // ...existing code...
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [status, setStatus] = useState("");
  const [assignedAgent, setAssignedAgent] = useState(""); // added
  const [source, setSource] = useState(""); // added
  const [priority, setPriority] = useState(""); // added
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [assigning, setAssigning] = useState(false); // added
  const [updatingSource, setUpdatingSource] = useState(false); // separate loading for source
  const [updatingPriority, setUpdatingPriority] = useState(false); // separate loading for priority

  // UI messages
  const [message, setMessage] = useState(null);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/leads/${id}/comments`);
      setComments(res.data.data.comments);
    } catch {
      setComments([]); // No comments found
    }
  };

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const res = await api.get(`/leads/${id}`);
        setLead(res.data.data);
        setStatus(res.data.data.status);
        setAssignedAgent(res.data.data.salesAgent?._id || ""); // set current assignment
        setSource(res.data.data.source); // added
        setPriority(res.data.data.priority); // added
      } catch (err) {
        setMessage({ type: "danger", text: "Failed to load lead details." });
      } finally {
        setLoading(false);
      }
    };

    const fetchAgents = async () => {
      try {
        const res = await api.get("/agents");
        setAgents(res.data.data?.Agents || []);
      } catch {
        setAgents([]);
      }
    };

    fetchLead();
    fetchComments();
    fetchAgents(); // fetch list of agents for assign select
  }, [id]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 1500);
  };

  const handleStatusUpdate = async () => {
    try {
      setUpdating(true);
      await api.put(`/leads/${id}`, { status });
      await (async () => {
        // refresh lead to reflect status change
        const res = await api.get(`/leads/${id}`);
        setLead(res.data.data);
        setStatus(res.data.data.status);
      })();
      showMessage("success", "✅ Status updated successfully!");
    } catch {
      showMessage("danger", "❌ Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  // New: assign agent handler
  const handleAssignAgent = async () => {
    if (!assignedAgent) {
      showMessage("danger", "Select an agent to assign.");
      return;
    }

    try {
      setAssigning(true);
      await api.put(`/leads/${id}`, { salesAgent: assignedAgent });
      // refresh lead to reflect assigned agent
      const res = await api.get(`/leads/${id}`);
      setLead(res.data.data);
      setAssignedAgent(res.data.data.salesAgent?._id || "");
      showMessage("success", "✅ Assigned agent updated!");
    } catch {
      showMessage("danger", "❌ Failed to assign agent.");
    } finally {
      setAssigning(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      showMessage("danger", "Comment cannot be empty.");
      return;
    }

    try {
      await api.post(`/leads/${id}/comments`, { commentText: newComment });
      setNewComment("");
      fetchComments();
      showMessage("success", "✅ Comment added!");
    } catch {
      showMessage("danger", "❌ Failed to add comment.");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );

  return (
    <div className="container-fluid py-3 py-sm-4" style={{ minHeight: "72vh" }}>
      <div className="row">
        <div className="col-12 col-lg-10 mx-lg-auto">
          {/* Status Message */}
          {message && (
            <div
              className={`alert alert-${message.type} alert-dismissible fade show mb-4`}
              role="alert"
            >
              <span className="fw-semibold">{message.text}</span>
              <button
                type="button"
                className="btn-close"
                onClick={() => setMessage(null)}
                aria-label="Close"
              ></button>
            </div>
          )}

          {/* Header Card */}
          <div className="card p-3 p-sm-4 shadow-sm border-0 mb-4">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start mb-3 gap-2">
              <div className="flex-grow-1">
                <h2
                  className="fw-bold text-primary mb-1"
                  style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)" }}
                >
                  📋 {lead.name}
                </h2>
                <p
                  className="text-muted mb-0"
                  style={{ fontSize: "clamp(12px, 2vw, 14px)" }}
                >
                  Lead ID: {id}
                </p>
              </div>
            </div>

            {/* Lead Info Grid */}
            <div className="row g-2 g-sm-3">
              <div className="col-12 col-sm-6 col-md-3">
                <small className="text-muted d-block mb-1">Source</small>
                <span
                  className="fw-semibold"
                  style={{ fontSize: "clamp(13px, 2vw, 15px)" }}
                >
                  {lead.source}
                </span>
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <small className="text-muted d-block mb-1">Priority</small>
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
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <small className="text-muted d-block mb-1">Status</small>
                <span className="badge bg-info">{lead.status}</span>
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <small className="text-muted d-block mb-1">
                  Assigned Agent
                </small>
                <span className="badge bg-dark">
                  {lead.salesAgent?.name || "Not Assigned"}
                </span>
              </div>
            </div>
          </div>

          {/* Status + Assign + Source/Priority Card */}
          <div className="card p-3 p-sm-4 shadow-sm border-0 mb-4">
            <h5
              className="fw-semibold mb-3"
              style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)" }}
            >
              🔄 Update Status
            </h5>
            <div className="row g-2 g-sm-3 align-items-center">
              <div className="col-12 col-sm-8">
                <select
                  className="form-select form-select-lg"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={updating}
                  style={{
                    minHeight: "48px",
                    fontSize: "clamp(13px, 2vw, 16px)",
                  }}
                >
                  <option value="New">🆕 New</option>
                  <option value="Contacted">📞 Contacted</option>
                  <option value="Qualified">✅ Qualified</option>
                  <option value="Proposal Sent">📧 Proposal Sent</option>
                  <option value="Closed">🏆 Closed</option>
                </select>
              </div>
              <div className="col-12 col-sm-4">
                <button
                  className="btn btn-success w-100 fw-semibold"
                  onClick={handleStatusUpdate}
                  disabled={updating}
                  style={{
                    minHeight: "48px",
                    fontSize: "clamp(13px, 2vw, 16px)",
                  }}
                >
                  {updating ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Updating...
                    </>
                  ) : (
                    "✅ Update Status"
                  )}
                </button>
              </div>

              {/* Assign Agent row */}
              <div className="col-12 mt-3">
                <h6 className="mb-2 fw-semibold">🧑‍💼 Assign Agent</h6>
                <div className="row g-2">
                  <div className="col-12 col-sm-8">
                    <select
                      className="form-select"
                      value={assignedAgent}
                      onChange={(e) => setAssignedAgent(e.target.value)}
                      disabled={assigning}
                      style={{ minHeight: "48px" }}
                    >
                      <option value="">-- Select Agent --</option>
                      {agents.map((a) => (
                        <option key={a._id} value={a._id}>
                          {a.name} — {a.email}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12 col-sm-4">
                    <button
                      className="btn btn-primary w-100 fw-semibold"
                      onClick={handleAssignAgent}
                      disabled={assigning}
                      style={{ minHeight: "48px" }}
                    >
                      {assigning ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Assigning...
                        </>
                      ) : (
                        "🔁 Update Agent"
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Update Source and Priority row */}
              <div className="col-12 mt-2">
                <div className="row g-2 g-sm-3">
                  {/* Update Source */}
                  <div className="col-12 mt-4">
                    <h6 className="mb-2 fw-semibold">📌 Update Source</h6>
                    <div className="row g-2 align-items-center">
                      <div className="col-12 col-sm-8">
                        <select
                          className="form-select form-select-lg"
                          value={source}
                          onChange={(e) => setSource(e.target.value)}
                          disabled={updatingSource}
                          style={{
                            minHeight: "48px",
                            fontSize: "clamp(14px, 2vw, 16px)",
                          }}
                        >
                          <option value="">-- Select Source --</option>
                          <option value="Website">💻 Website</option>
                          <option value="Referral">👥 Referral</option>
                          <option value="Cold Call">📞 Cold Call</option>
                          <option value="Social Media">📱 Social Media</option>
                        </select>
                      </div>
                      <div className="col-12 col-sm-4">
                        <button
                          className="btn btn-warning w-100 fw-semibold"
                          onClick={async () => {
                            if (!source) {
                              showMessage("danger", "Please select a source.");
                              return;
                            }
                            try {
                              setUpdatingSource(true);
                              await api.put(`/leads/${id}`, { source });
                              // refresh lead
                              const res = await api.get(`/leads/${id}`);
                              setLead(res.data.data);
                              setSource(res.data.data.source);
                              showMessage(
                                "success",
                                "📌 Source updated successfully!"
                              );
                            } catch {
                              showMessage(
                                "danger",
                                "❌ Failed to update source."
                              );
                            } finally {
                              setUpdatingSource(false);
                            }
                          }}
                          disabled={updatingSource}
                          style={{ minHeight: "48px" }}
                        >
                          {updatingSource ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Updating...
                            </>
                          ) : (
                            "🔄 Update Source"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Update Priority */}
                  <div className="col-12 mt-4">
                    <h6 className="mb-2 fw-semibold">⭐ Update Priority</h6>
                    <div className="row g-2 align-items-center">
                      <div className="col-12 col-sm-8">
                        <select
                          className="form-select form-select-lg"
                          value={priority}
                          onChange={(e) => setPriority(e.target.value)}
                          disabled={updatingPriority}
                          style={{
                            minHeight: "48px",
                            fontSize: "clamp(14px, 2vw, 16px)",
                          }}
                        >
                          <option value="">-- Select Priority --</option>
                          <option value="Low">🟦 Low</option>
                          <option value="Medium">🟨 Medium</option>
                          <option value="High">🟥 High</option>
                        </select>
                      </div>
                      <div className="col-12 col-sm-4">
                        <button
                          className="btn btn-info w-100 fw-semibold"
                          onClick={async () => {
                            if (!priority) {
                              showMessage(
                                "danger",
                                "Please select a priority."
                              );
                              return;
                            }
                            try {
                              setUpdatingPriority(true);
                              await api.put(`/leads/${id}`, { priority });
                              // refresh lead
                              const res = await api.get(`/leads/${id}`);
                              setLead(res.data.data);
                              setPriority(res.data.data.priority);
                              showMessage(
                                "success",
                                "⭐ Priority updated successfully!"
                              );
                            } catch {
                              showMessage(
                                "danger",
                                "❌ Failed to update priority."
                              );
                            } finally {
                              setUpdatingPriority(false);
                            }
                          }}
                          disabled={updatingPriority}
                          style={{ minHeight: "48px" }}
                        >
                          {updatingPriority ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Updating...
                            </>
                          ) : (
                            "⚙️ Update Priority"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section Card */}
          <div className="card p-3 p-sm-4 shadow-sm border-0 mb-4">
            <h5
              className="fw-semibold mb-3"
              style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)" }}
            >
              💬 Comments ({comments.length})
            </h5>

            {/* Comments List */}
            <div className="mb-4">
              {comments.length === 0 ? (
                <div className="alert alert-light text-muted text-center py-4 mb-0">
                  No comments yet. Be the first to add one!
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {comments.map((c) => (
                    <div
                      className="list-group-item px-0 py-3 border-bottom"
                      key={c.id || c._id}
                    >
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start mb-2 gap-2">
                        <strong
                          className="text-break"
                          style={{ fontSize: "clamp(13px, 2vw, 15px)" }}
                        >
                          {c.author}
                        </strong>
                        <small
                          className="text-muted"
                          style={{ fontSize: "clamp(12px, 2vw, 13px)" }}
                        >
                          {new Date(c.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      <p
                        className="text-break mb-0"
                        style={{ fontSize: "clamp(13px, 2vw, 15px)" }}
                      >
                        {c.commentText}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Comment Form */}
            <div className="border-top pt-3">
              <label
                className="form-label fw-semibold mb-2"
                style={{ fontSize: "clamp(13px, 2vw, 15px)" }}
              >
                Add a Comment
              </label>
              <textarea
                className="form-control mb-3"
                placeholder="Write your comment here..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{
                  minHeight: "120px",
                  fontSize: "clamp(13px, 2vw, 16px)",
                  padding: "12px 16px",
                }}
                rows="4"
              ></textarea>

              <button
                className="btn btn-primary w-100 fw-semibold"
                onClick={handleAddComment}
                style={{
                  minHeight: "48px",
                  fontSize: "clamp(13px, 2vw, 16px)",
                }}
              >
                ✨ Add Comment
              </button>
            </div>
          </div>

          {/* Back to Dashboard Button */}
          <div className="mb-4">
            <Link
              to="/"
              className="btn btn-outline-primary w-100 fw-semibold d-flex align-items-center justify-content-center"
              style={{
                minHeight: "48px",
                fontSize: "clamp(13px, 2vw, 16px)",
                gap: "8px",
                textDecoration: "none",
              }}
            >
              🏠 Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
