import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

const LeadDetails = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [updateData, setUpdateData] = useState({});

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const res = await api.get(`/leads/${id}`);
        setLead(res.data);
      } catch {
        alert("Error loading lead");
      }
    };

    const fetchComments = async () => {
      try {
        const res = await api.get(`/leads/${id}/comments`);
        setComments(res.data.data.comments);
      } catch {}
    };

    fetchLead();
    fetchComments();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await api.put(`/leads/${id}`, updateData);
      alert("Lead updated!");
    } catch {
      alert("Update failed");
    }
  };

  const handleAddComment = async () => {
    try {
      await api.post(`/leads/${id}/comments`, { commentText: newComment });
      setNewComment("");
      const updated = await api.get(`/leads/${id}/comments`);
      setComments(updated.data.data.comments);
    } catch {
      alert("Error adding comment");
    }
  };

  if (!lead) return <div>Loading...</div>;

  return (
    <div className="card p-4 shadow-sm">
      <h2 className="fw-bold">{lead.name}</h2>
      <p>
        <strong>Status:</strong> {lead.status}
      </p>
      <p>
        <strong>Agent:</strong> {lead.salesAgent?.name || "Not Assigned"}
      </p>

      <div className="mt-3">
        <label className="form-label">Update Status</label>
        <div className="input-group">
          <input
            className="form-control"
            placeholder="New Status"
            onChange={(e) =>
              setUpdateData({ ...updateData, status: e.target.value })
            }
          />
          <button className="btn btn-success" onClick={handleUpdate}>
            Update
          </button>
        </div>
      </div>

      <h4 className="mt-4">Comments</h4>
      <ul className="list-group mb-3">
        {comments.map((c) => (
          <li className="list-group-item" key={c.id}>
            <strong>{c.author}</strong>: {c.commentText} <br />
            <small className="text-muted">
              {new Date(c.createdAt).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>

      <textarea
        className="form-control mb-2"
        placeholder="Add a comment"
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
