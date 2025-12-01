import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const stats = {
    new: leads.filter((l) => l.status === "New").length,
    contacted: leads.filter((l) => l.status === "Contacted").length,
    qualified: leads.filter((l) => l.status === "Qualified").length,
    proposal: leads.filter((l) => l.status === "Proposal Sent").length,
    closed: leads.filter((l) => l.status === "Closed").length,
  };

  const fetchLeads = async () => {
    try {
      const res = await api.get("/leads", {
        params: Object.fromEntries(searchParams),
      });

      if (!res.data.leads || res.data.leads.length === 0) {
        setShowModal(true);
      }

      setLeads(res.data.leads || []);
    } catch {
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const applyFilterAndRedirect = (status) => {
    navigate(`/leads?status=${encodeURIComponent(status)}`);
  };

  return (
    <div
      className="container-fluid py-4"
      style={{ minHeight: "72vh", background: "#f8f9fa" }}
    >
      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-center">
              <div className="modal-header">
                <h5 className="modal-title">⚠️ No Leads Found</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="text-muted">There are no leads available.</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={() => setShowModal(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Wrapper */}
      <div className="mx-auto" style={{ maxWidth: "1100px" }}>
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="fw-bold" style={{ fontSize: "2.2rem" }}>
            Anvaya CRM Dashboard
          </h1>
          <p className="text-muted">
            Track and manage lead performance efficiently 🚀
          </p>
        </div>

        {/* Floating Buttons */}
        <div className="d-flex justify-content-center gap-4 mb-5 flex-wrap">
          {loading ? (
            <span>Loading...</span>
          ) : (
            leads.slice(0, 3).map((lead) => (
              <button
                className="btn btn-success rounded-pill px-4 fw-semibold"
                key={lead._id}
              >
                {lead.name}
              </button>
            ))
          )}
        </div>

        {/* Status Cards */}
        <h4 className="fw-semibold text-center mb-5">Lead Status</h4>

        <div className="row justify-content-center g-5 mb-5">
          {[
            {
              label: "Total Leads",
              value: leads.length,
              icon: "📋",
              color: "#0d6efd",
            },
            { label: "New", value: stats.new, icon: "🆕", color: "#28a745" },
            {
              label: "In Progress",
              value: stats.contacted + stats.qualified + stats.proposal,
              icon: "⏳",
              color: "#ffc107",
            },
            {
              label: "Closed",
              value: stats.closed,
              icon: "🏆",
              color: "#17a2b8",
            },
          ].map((card, i) => (
            <div key={i} className="col-12 col-sm-6 col-md-3">
              <div className="shadow-sm p-4 rounded bg-white d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">{card.label}</p>
                  <h2 style={{ color: card.color }}>{card.value}</h2>
                </div>
                <span style={{ fontSize: "2.2rem" }}>{card.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Filters */}
        <h5 className="fw-semibold text-center mb-5">Quick Filters</h5>

        <div className="d-flex gap-3 justify-content-center flex-wrap">
          {["New", "Contacted", "Qualified", "Proposal Sent", "Closed"].map(
            (st) => (
              <button
                key={st}
                className="btn btn-outline-secondary rounded-pill px-4"
                onClick={() => applyFilterAndRedirect(st)}
              >
                {st}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
