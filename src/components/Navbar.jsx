import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand fw-bold" to="/">
        Anvaya CRM
      </Link>

      <div className="collapse navbar-collapse show">
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
            <Link className="nav-link" to="/create-agent">
              Create Agent
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/status">
              By Status
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/agents">
              By Agent
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/reports">
              Reports
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
