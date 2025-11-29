import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light py-4 mt-4">
      <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
        {/* Left side text */}
        <span className="fw-semibold small">
          © {year} Anvaya CRM. All Rights Reserved.{" "}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
