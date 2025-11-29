import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hovered, setHovered] = useState(null);

  const navItems = [
    { to: "/leads", label: "📋 Leads" },
    { to: "/agents", label: "🧑‍💼 Agents" },
    { to: "/status", label: "📊 Status" },
    { to: "/sales-management", label: "📈 Sales" },
    { to: "/reports", label: "📑 Reports" },
  ];

  return (
    <nav className="navbar navbar-dark bg-dark px-4 py-3 sticky-top shadow-sm w-100">
      {/* -------- Full Width Row -------- */}
      <div className="w-100 d-flex justify-content-between align-items-center">
        {/* -------- BRAND -------- */}
        <NavLink
          to="/"
          className="navbar-brand fw-semibold d-flex align-items-center gap-2 text-white"
          style={{ fontSize: "1.25rem" }}
        >
          <img
            src="/logo.png"
            alt="Anvaya CRM Logo"
            style={{ width: "28px", height: "28px", objectFit: "contain" }}
          />
          Anvaya CRM
        </NavLink>

        {/* -------- MOBILE TOGGLE -------- */}
        <button
          className="navbar-toggler d-md-none"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* -------- DESKTOP NAV -------- */}
        <div className="d-none d-md-flex align-items-center gap-2 ms-auto">
          {navItems.map((item, i) => (
            <NavLink
              key={i}
              to={item.to}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={({ isActive }) =>
                `px-3 py-2 rounded text-decoration-none ${
                  isActive ? "text-white fw-semibold" : "text-light"
                }`
              }
              style={({ isActive }) => ({
                fontSize: "15px",
                background:
                  isActive || hovered === i ? "#0d6efd" : "transparent",
                transition: "0.2s",
                cursor: "pointer",
              })}
            >
              {item.label}
            </NavLink>
          ))}

          {/* --- Settings Dropdown --- */}
          <div
            className="position-relative"
            onMouseEnter={() => setHovered("settings")}
            onMouseLeave={() => setHovered(null)}
          >
            <button
              className="btn text-light px-3 py-2 rounded"
              style={{
                background: hovered === "settings" ? "#0d6efd" : "transparent",
                border:
                  hovered === "settings"
                    ? "1px solid #0d6efd"
                    : "1px solid #6c757d",
                transition: "0.2s",
              }}
              onClick={() => setSettingsOpen(!settingsOpen)}
            >
              ⚙️ Settings
            </button>

            {settingsOpen && (
              <ul className="dropdown-menu dropdown-menu-end show shadow">
                <li>
                  <NavLink className="dropdown-item" to="/create-lead">
                    ➕ Create Lead
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/create-agent">
                    ➕ Create Agent
                  </NavLink>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* -------- MOBILE MENU -------- */}
      {isOpen && (
        <div
          className="d-md-none mt-3 p-3 rounded w-100"
          style={{ background: "#1D1E21" }}
        >
          {navItems.map((item, i) => (
            <NavLink
              key={i}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `btn w-100 mb-2 ${
                  isActive ? "btn-primary" : "btn-outline-light"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          {/* mobile settings */}
          <button
            className="btn btn-outline-light w-100 mt-2"
            onClick={() => setSettingsOpen(!settingsOpen)}
          >
            ⚙️ Settings
          </button>

          {settingsOpen && (
            <div className="d-grid gap-2 mt-2">
              <NavLink
                to="/create-lead"
                className="btn btn-primary"
                onClick={() => setIsOpen(false)}
              >
                ➕ Create Lead
              </NavLink>
              <NavLink
                to="/create-agent"
                className="btn btn-primary"
                onClick={() => setIsOpen(false)}
              >
                ➕ Create Agent
              </NavLink>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
