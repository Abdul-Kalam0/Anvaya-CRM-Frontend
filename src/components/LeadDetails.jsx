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
    <div className="card p-4 shadow-sm">
      {/* Status Message */}
      {message && (
        <div className={`alert alert-${message.type} text-center`} role="alert">
          {message.text}
        </div>
      )}

      <h2 className="fw-bold">{lead.name}</h2>
      <p>
        <strong>Source:</strong> {lead.source}
      </p>
      <p>
        <strong>Priority:</strong> {lead.priority}
      </p>

      <p>
        <strong>Assigned Agent:</strong>{" "}
        <span className="badge bg-dark">
          {lead.salesAgent?.name || "Not Assigned"}
        </span>
      </p>

      {/* Status Update */}
      <div className="mt-4">
        <label className="form-label fw-semibold">Update Status</label>
        <div className="input-group">
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
          <button className="btn btn-success" onClick={handleStatusUpdate}>
            Update
          </button>
        </div>
      </div>

      {/* Comments */}
      <h4 className="mt-4">Comments</h4>

      <ul className="list-group mb-3">
        {comments.length === 0 ? (
          <li className="list-group-item text-muted text-center">
            No comments yet.
          </li>
        ) : (
          comments.map((c) => (
            <li className="list-group-item" key={c.id || c._id}>
              <strong>{c.author}</strong>: {c.commentText}
              <br />
              <small className="text-muted">
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
      ></textarea>

      <button className="btn btn-primary w-100" onClick={handleAddComment}>
        Add Comment
      </button>
    </div>
  );
};

export default LeadDetails;
