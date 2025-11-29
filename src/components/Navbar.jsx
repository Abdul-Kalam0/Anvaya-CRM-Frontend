import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <NavLink className="navbar-brand fw-bold" to="/">
        Anvaya CRM
      </NavLink>

      {/* Mobile Toggle Button */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <NavLink className="nav-link" to="/leads">
              Leads
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink className="nav-link" to="/agents">
              Agents
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink className="nav-link" to="/create-lead">
              Create Lead
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink className="nav-link" to="/create-agent">
              Create Agent
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink className="nav-link" to="/status">
              Leads Status
            </NavLink>
          </li>

          {/* <li className="nav-item">
            <Link className="nav-link" to="/sales-management">
              Agents Status
            </Link>
          </li> */}

          <li className="nav-item">
            <NavLink className="nav-link" to="/reports">
              Reports
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
