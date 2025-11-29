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

        {/* Right side links */}
        <div className="d-flex gap-4 small">
          <Link
            to=""
            className="text-decoration-none text-light text-opacity-75"
          >
            Privacy
          </Link>
          <Link
            to=""
            className="text-decoration-none text-light text-opacity-75"
          >
            Terms
          </Link>
          <Link
            to=""
            className="text-decoration-none text-light text-opacity-75"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
