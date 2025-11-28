import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
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

  return (
    <div>
      <h2 className="mb-4 fw-bold text-primary">📊 Reporting Dashboard</h2>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card text-center shadow-sm p-3 border-0">
            <h5 className="text-secondary">Leads Closed Last Week</h5>
            <h2 className="fw-bold text-success">{lastWeekData.length}</h2>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card text-center shadow-sm p-3 border-0">
            <h5 className="text-secondary">Total Leads in Pipeline</h5>
            <h2 className="fw-bold text-warning">{pipelineData}</h2>
          </div>
        </div>
      </div>

      {/* Graphs */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-4">
            <h5 className="fw-semibold mb-3 text-info">📌 Closed Leads</h5>
            <Bar data={barData} height={250} />
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-4">
            <h5 className="fw-semibold mb-3 text-info">
              📌 Pipeline Distribution
            </h5>
            <Pie data={pieData} height={250} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-sm p-3 mt-4 border-0">
        <h5 className="fw-semibold text-dark mb-3">
          🧾 Closed Leads Breakdown
        </h5>
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
    </div>
  );
};

export default Reports;
