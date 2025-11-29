import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Link } from "react-router-dom";
import api from "../utils/api";

// Register Chart.js Dependencies
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const Reports = () => {
  const [lastWeekData, setLastWeekData] = useState([]);
  const [pipelineData, setPipelineData] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const lastWeekRes = await api.get("/report/last-week");
        const pipelineRes = await api.get("/report/pipeline");

        setLastWeekData(lastWeekRes.data.data || []);
        setPipelineData(pipelineRes.data.data.totalLeadsInPipeline);
      } catch {
        setError("Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading)
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );

  if (error)
    return (
      <div className="alert alert-danger mt-3 text-center fw-semibold">
        {error}
      </div>
    );

  const barData = {
    labels: lastWeekData.map((d) => d.name),
    datasets: [
      {
        label: "Closed Leads",
        data: lastWeekData.map(() => 1),
        backgroundColor: "#17a2b8",
        borderRadius: 5,
      },
    ],
  };

  const pieData = {
    labels: ["In Pipeline", "Closed Last Week"],
    datasets: [
      {
        data: [pipelineData, lastWeekData.length],
        backgroundColor: ["#007bff", "#28a745"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="px-2 px-sm-3 px-md-0">
      <h2 className="mb-3 mb-sm-4 fw-bold text-primary">
        📊 Reporting Dashboard
      </h2>

      {/* Summary Cards */}
      <div className="row g-3 g-md-4 mb-4">
        <div className="col-12 col-md-6">
          <div className="card text-center shadow-sm p-3 border-0">
            <h6 className="text-secondary fw-semibold">
              Leads Closed Last Week
            </h6>
            <h3 className="fw-bold text-success mt-2">{lastWeekData.length}</h3>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card text-center shadow-sm p-3 border-0">
            <h6 className="text-secondary fw-semibold">
              Total Leads in Pipeline
            </h6>
            <h3 className="fw-bold text-warning mt-2">{pipelineData}</h3>
          </div>
        </div>
      </div>

      {/* Graphs - Stacked on Mobile */}
      <div className="row g-3 g-md-4 mb-4">
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0 p-3 p-sm-4">
            <h6 className="fw-semibold mb-3 text-info">📌 Closed Leads</h6>
            <div
              style={{ position: "relative", height: "250px", width: "100%" }}
            >
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0 p-3 p-sm-4">
            <h6 className="fw-semibold mb-3 text-info">
              📌 Pipeline Distribution
            </h6>
            <div
              style={{ position: "relative", height: "250px", width: "100%" }}
            >
              <Pie data={pieData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-sm p-3 p-sm-4 border-0 mb-4">
        <h6 className="fw-semibold text-dark mb-3">
          🧾 Closed Leads Breakdown
        </h6>

        {/* Desktop Table View */}
        <div className="d-none d-md-block table-responsive">
          <table className="table table-striped">
            <thead className="table-dark">
              <tr>
                <th>Lead</th>
                <th>Agent</th>
                <th>Closed Date</th>
              </tr>
            </thead>
            <tbody>
              {lastWeekData.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center text-muted">
                    No closed leads last week
                  </td>
                </tr>
              ) : (
                lastWeekData.map((lead) => (
                  <tr key={lead.id}>
                    <td>{lead.name}</td>
                    <td>{lead.salesAgent}</td>
                    <td>{new Date(lead.closedAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="d-md-none">
          {lastWeekData.length === 0 ? (
            <p className="text-center text-muted">No closed leads last week</p>
          ) : (
            lastWeekData.map((lead) => (
              <div key={lead.id} className="card mb-3 p-3">
                <p className="mb-2">
                  <strong>Lead:</strong>{" "}
                  <span className="text-break">{lead.name}</span>
                </p>
                <p className="mb-2">
                  <strong>Agent:</strong>{" "}
                  <span className="text-break">{lead.salesAgent}</span>
                </p>
                <p className="mb-0">
                  <strong>Closed Date:</strong>{" "}
                  {new Date(lead.closedAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Back to Dashboard Button */}
      <div className="mb-4">
        <Link
          to="/"
          className="btn btn-outline-primary w-100 fw-semibold"
          style={{
            minHeight: "48px",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          🏠 Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Reports;
