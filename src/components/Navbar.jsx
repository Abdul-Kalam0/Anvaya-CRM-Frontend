import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark px-2 px-sm-3 px-md-4 sticky-top">
      <div className="container-fluid">
        <NavLink
          className="navbar-brand fw-bold text-white"
          style={{ fontSize: "1.25rem" }}
          to="/"
          onClick={handleNavClick}
        >
          📱 Anvaya CRM
        </NavLink>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0"
          type="button"
          aria-controls="navbarSupportedContent"
          aria-expanded={isOpen ? "true" : "false"}
          aria-label="Toggle navigation"
          onClick={handleToggle}
          style={{ outline: "none" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}
        <div
          className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link px-2 py-2 ${
                    isActive ? "active bg-primary rounded" : ""
                  }`
                }
                to="/leads"
                onClick={handleNavClick}
              >
                📋 Leads
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link px-2 py-2 ${
                    isActive ? "active bg-primary rounded" : ""
                  }`
                }
                to="/agents"
                onClick={handleNavClick}
              >
                🧑‍💼 Agents
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link px-2 py-2 ${
                    isActive ? "active bg-primary rounded" : ""
                  }`
                }
                to="/create-lead"
                onClick={handleNavClick}
              >
                ➕ New Lead
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link px-2 py-2 ${
                    isActive ? "active bg-primary rounded" : ""
                  }`
                }
                to="/create-agent"
                onClick={handleNavClick}
              >
                ➕ New Agent
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link px-2 py-2 ${
                    isActive ? "active bg-primary rounded" : ""
                  }`
                }
                to="/status"
                onClick={handleNavClick}
              >
                📊 Status
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link px-2 py-2 ${
                    isActive ? "active bg-primary rounded" : ""
                  }`
                }
                to="/sales-management"
                onClick={handleNavClick}
              >
                📈 Sales
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link px-2 py-2 ${
                    isActive ? "active bg-primary rounded" : ""
                  }`
                }
                to="/reports"
                onClick={handleNavClick}
              >
                📑 Reports
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
