import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Link } from "react-router-dom";
import api from "../utils/api";

// Chart dependencies
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  ChartDataLabels
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

        setLastWeekData(lastWeekRes?.data?.data || []);
        setPipelineData(pipelineRes?.data?.data?.totalLeadsInPipeline || 0);
      } catch (err) {
        setError("⚠️ Failed to fetch reporting data. Please try again.");
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
      legend: { position: "bottom" },
    },
  };

  const pieOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      datalabels: {
        display: true,
        color: "#fff",
        anchor: "center",
        align: "center",
        backgroundColor: "rgba(0,0,0,0.35)",
        borderRadius: 6,
        padding: 6,
        font: { weight: "600", size: 12 },
        formatter: (value, context) => {
          if (!value) return "";
          const data = context.chart.data.datasets[0].data;
          const sum = data.reduce((a, b) => a + b, 0);
          const pct = sum ? ((value / sum) * 100).toFixed(1) : "0.0";
          return `${value} (${pct}%)`;
        },
      },
    },
  };

  return (
    <div className="px-2 px-sm-3 px-md-0" style={{ minHeight: "72vh" }}>
      <h2 className="mb-3 fw-bold text-primary">📊 Reporting Dashboard</h2>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card text-center shadow-sm p-3 border-0">
            <h6 className="text-secondary fw-semibold">
              Leads Closed Last Week
            </h6>
            <h3 className="fw-bold text-success mt-2">{lastWeekData.length}</h3>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card text-center shadow-sm p-3 border-0">
            <h6 className="text-secondary fw-semibold">
              Total Leads in Pipeline
            </h6>
            <h3 className="fw-bold text-warning mt-2">{pipelineData}</h3>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row g-3 mb-4">
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 p-3">
            <h6 className="fw-semibold mb-3 text-info">📌 Closed Leads</h6>
            {lastWeekData.length > 0 ? (
              <div style={{ height: "250px" }}>
                <Bar data={barData} options={chartOptions} />
              </div>
            ) : (
              <p className="text-center text-muted">No closed leads to show</p>
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm border-0 p-3">
            <h6 className="fw-semibold mb-3 text-info">
              📌 Pipeline Distribution
            </h6>
            <div style={{ height: "250px" }}>
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-sm p-3 border-0 mb-4">
        <h6 className="fw-semibold text-dark mb-3">
          🧾 Closed Leads Breakdown
        </h6>

        {lastWeekData.length === 0 ? (
          <p className="text-center text-muted">No closed leads last week</p>
        ) : (
          <>
            {/* Desktop */}
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
                  {lastWeekData.map((lead) => (
                    <tr key={lead.id}>
                      <td>{lead.name}</td>
                      <td>{lead.salesAgent}</td>
                      <td>{new Date(lead.closedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="d-md-none">
              {lastWeekData.map((lead) => (
                <div key={lead.id} className="card mb-3 p-3">
                  <p>
                    <strong>Lead:</strong> {lead.name}
                  </p>
                  <p>
                    <strong>Agent:</strong> {lead.salesAgent}
                  </p>
                  <p>
                    <strong>Closed:</strong>{" "}
                    {new Date(lead.closedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Back Button */}
      <Link to="/" className="btn btn-outline-primary w-100 fw-semibold mb-4">
        🏠 Back to Dashboard
      </Link>
    </div>
  );
};

export default Reports;
