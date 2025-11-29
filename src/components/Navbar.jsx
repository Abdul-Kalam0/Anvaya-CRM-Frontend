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

          <li className="nav-item">
            <Link className="nav-link" to="/reports">
              Reports
            </Link>
          </li>

          {/* ---- Sales Agent Section ---- */}
          <li className="nav-item dropdown">
            <span
              className="nav-link dropdown-toggle"
              role="button"
              data-bs-toggle="dropdown"
            >
              Agents
            </span>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <Link className="dropdown-item" to="/agents">
                  View by Agent
                </Link>
              </li>

              <li>
                <Link className="dropdown-item" to="/create-agent">
                  Add New Agent
                </Link>
              </li>

              <li>
                <Link className="dropdown-item" to="/sales-management">
                  Manage Agents
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
