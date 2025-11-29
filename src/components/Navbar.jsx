import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand fw-bold" to="/">
        Anvaya CRM
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarContent">
        <ul className="navbar-nav ms-auto">
          {/* Leads Section */}
          <li className="nav-item">
            <Link className="nav-link" to="/leads">
              Leads
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/create-lead">
              Create Lead
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/status">
              Lead Status View
            </Link>
          </li>

          {/* Reports */}
          <li className="nav-item">
            <Link className="nav-link" to="/reports">
              Reports
            </Link>
          </li>

          {/* ---- Agent Section (NO DROPDOWN) ---- */}
          <li className="nav-item">
            <Link className="nav-link" to="/agents">
              Agents
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/create-agent">
              Create Agent
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/sales-management">
              Agent Status
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
