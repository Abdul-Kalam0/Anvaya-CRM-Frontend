import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);
  const [desktopSettingsOpen, setDesktopSettingsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);
  const handleNavClick = () => {
    setIsOpen(false);
    setMobileSettingsOpen(false);
    setDesktopSettingsOpen(false);
  };

  // settings moved to after Reports (last item)
  const navItems = [
    { key: "leads", to: "/leads", label: "📋 Leads" },
    { key: "agents", to: "/agents", label: "🧑‍💼 Agents" },
    { key: "status", to: "/status", label: "📊 Status" },
    { key: "sales", to: "/sales-management", label: "📈 Sales" },
    { key: "reports", to: "/reports", label: "📑 Reports" },
    {
      key: "settings",
      label: "⚙️ Settings",
      children: [
        { to: "/create-lead", label: "➕ New Lead" },
        { to: "/create-agent", label: "➕ New Agent" },
      ],
    },
  ];

  // mobile layout: show leads+agents row, then status/sales/reports, then settings row last
  const mobileRows = [
    navItems.slice(0, 2), // Row 1: Leads, Agents
    navItems.slice(2, 5), // Row 2: Status, Sales, Reports
    [navItems[5]], // Row 3: Settings (contains New Lead/New Agent)
  ];

  return (
    <nav className="navbar navbar-dark bg-dark px-3 sticky-top">
      {/* Top Row (Brand + Toggle) */}
      <div className="d-flex justify-content-between align-items-center w-100">
        {/* Brand */}
        <NavLink
          className="navbar-brand fw-bold text-white"
          to="/"
          onClick={handleNavClick}
          style={{ fontSize: "1.3rem" }}
        >
          📱 Anvaya CRM
        </NavLink>

        {/* Mobile Toggle - Hidden on Medium and Up */}
        <button
          onClick={handleToggle}
          className="border-0 d-md-none"
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "10px",
            background: "#2f3034",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0px 3px 8px rgba(0,0,0,0.3)",
            cursor: "pointer",
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div
          className="d-md-none w-100"
          style={{
            background: "#1d1e21",
            borderRadius: "12px",
            padding: "12px",
            marginTop: "12px",
            marginBottom: "10px",
            boxShadow: "0px 12px 25px rgba(0,0,0,0.4)",
          }}
        >
          {mobileRows.map((row, rowIndex) => (
            <div key={rowIndex} className="d-grid gap-2 mb-2">
              {row.map((item, i) => {
                if (item.key === "settings") {
                  return (
                    <div key={i}>
                      <button
                        onClick={() =>
                          setMobileSettingsOpen(!mobileSettingsOpen)
                        }
                        className="btn btn-sm btn-outline-light text-light w-100 d-flex justify-content-between align-items-center"
                        style={{ fontSize: "14px", minHeight: "40px" }}
                      >
                        {item.label}
                        <span
                          style={{
                            transform: mobileSettingsOpen
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                          }}
                        >
                          ▸
                        </span>
                      </button>

                      {mobileSettingsOpen && (
                        <div className="mt-2 d-grid gap-2">
                          {item.children.map((c, ci) => (
                            <NavLink
                              key={ci}
                              to={c.to}
                              onClick={handleNavClick}
                              className="btn btn-sm btn-primary"
                              style={{ fontSize: "14px", minHeight: "40px" }}
                            >
                              {c.label}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={i}
                    to={item.to}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `btn btn-sm ${
                        isActive
                          ? "btn-primary fw-semibold"
                          : "btn-outline-light text-light"
                      }`
                    }
                    style={{
                      fontSize: "14px",
                      textDecoration: "none",
                      minHeight: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Desktop Menu */}
      <div className="d-none d-md-flex ms-auto position-relative">
        <ul className="navbar-nav d-flex flex-row gap-2 align-items-center">
          {navItems.map((item, i) => {
            if (item.key === "settings") {
              return (
                <li
                  key={i}
                  className="nav-item"
                  onMouseEnter={() => setDesktopSettingsOpen(true)}
                  onMouseLeave={() => setDesktopSettingsOpen(false)}
                  style={{ position: "relative" }}
                >
                  <button
                    className={`nav-link rounded px-3 py-2 text-white`}
                    style={{
                      background: desktopSettingsOpen
                        ? "#0d6efd"
                        : "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => setDesktopSettingsOpen(!desktopSettingsOpen)}
                  >
                    {item.label}
                  </button>

                  {desktopSettingsOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        right: 0,
                        background: "#212529",
                        borderRadius: "8px",
                        padding: "8px",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
                        minWidth: "180px",
                        zIndex: 2000,
                      }}
                    >
                      {item.children.map((c, ci) => (
                        <NavLink
                          key={ci}
                          to={c.to}
                          onClick={handleNavClick}
                          className="d-block text-white text-decoration-none px-3 py-2 rounded"
                          style={{ background: "transparent" }}
                        >
                          {c.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </li>
              );
            }

            return (
              <li key={i} className="nav-item">
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `nav-link rounded px-3 py-2 ${
                      isActive ? "bg-primary text-white" : "text-white"
                    }`
                  }
                  style={{ fontSize: "15px" }}
                >
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
