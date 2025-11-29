import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

const LeadDetails = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

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
      } catch (err) {
        setMessage({ type: "danger", text: "Failed to load lead details." });
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
    fetchComments();
  }, [id]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 1500);
  };

  const handleStatusUpdate = async () => {
    try {
      await api.put(`/leads/${id}`, { status });
      showMessage("success", "Status updated successfully!");
    } catch {
      showMessage("danger", "Failed to update status.");
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
      showMessage("success", "Comment added!");
    } catch {
      showMessage("danger", "Failed to add comment.");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );

  return (
    <div className="card p-3 p-sm-4 shadow-sm">
      {/* Status Message */}
      {message && (
        <div className={`alert alert-${message.type} text-center`} role="alert">
          {message.text}
        </div>
      )}

      <h2 className="fw-bold mb-3">{lead.name}</h2>

      {/* Lead Info Grid */}
      <div className="row g-2 mb-4">
        <div className="col-12 col-sm-6">
          <p className="mb-2">
            <strong>Source:</strong>{" "}
            <span className="text-break">{lead.source}</span>
          </p>
        </div>
        <div className="col-12 col-sm-6">
          <p className="mb-2">
            <strong>Priority:</strong>{" "}
            <span className="text-break">{lead.priority}</span>
          </p>
        </div>
        <div className="col-12">
          <p className="mb-0">
            <strong>Assigned Agent:</strong>{" "}
            <span className="badge bg-dark">
              {lead.salesAgent?.name || "Not Assigned"}
            </span>
          </p>
        </div>
      </div>

      {/* Status Update */}
      <div className="mt-4 mb-4">
        <label className="form-label fw-semibold mb-2">Update Status</label>
        <div className="input-group gap-2 flex-column flex-sm-row">
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Closed">Closed</option>
          </select>
          <button
            className="btn btn-success fw-semibold"
            onClick={handleStatusUpdate}
            style={{ minHeight: "44px" }}
          >
            Update
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <h4 className="mt-4 mb-3">Comments</h4>

      <ul className="list-group mb-3">
        {comments.length === 0 ? (
          <li className="list-group-item text-muted text-center">
            No comments yet.
          </li>
        ) : (
          comments.map((c) => (
            <li className="list-group-item p-2 p-sm-3" key={c.id || c._id}>
              <strong className="text-break">{c.author}</strong>:
              <div className="text-break mt-1">{c.commentText}</div>
              <small className="text-muted d-block mt-2">
                {new Date(c.createdAt).toLocaleString()}
              </small>
            </li>
          ))
        )}
      </ul>

      <textarea
        className="form-control mb-3"
        placeholder="Write a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        style={{ minHeight: "100px" }}
        rows="4"
      ></textarea>

      <button
        className="btn btn-primary w-100 fw-semibold"
        onClick={handleAddComment}
        style={{ minHeight: "44px" }}
      >
        Add Comment
      </button>
    </div>
  );
};

export default LeadDetails;
