import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

import APNIcon from "../icons/APN.png";

export default function Navbar() {
const { pathname }= useLocation();
const [drawerOpen, setDrawerOpen]= useState(false);
const [adminOpen, setAdminOpen]= useState(false);
const [adminVerified, setAdminVerified]= useState(false);
const [adminPassword, setAdminPassword]= useState("");
const [showAdminPassword, setShowAdminPassword]= useState(false);
const [adminError, setAdminError]= useState("");

  useEffect(()=> {
    setDrawerOpen(false);
    setAdminOpen(false);
  }, [pathname]);

  useEffect(()=> {
    document.body.style.overflow= drawerOpen ? "hidden" : "";

    return ()=> {
      document.body.style.overflow= "";
    };
  }, [drawerOpen]);

  //=========================================================
  // MAIN NAVIGATION
  //=========================================================

  const links= [
    {
      to: "/",
      label: "Home",
    },
    {
      to: "/about",
      label: "About Us",
    },
    {
      to: "/services",
      label: "Ministries",
    },
    {
      to: "/contact",
      label: "Contact",
    },
  ];

  //=========================================================
  // ADMIN NAVIGATION
  //=========================================================

  const adminLinks= [
    {
      to: "/Admin",
      label: "Admin Dashboard",
    },
    {
      to: "/MembersDashboard",
      label: "Members",
    },
    {
      to: "/FullDetails",
      label: "Add Member",
    },
  ];

  const isActive= (path)=> {
    if (path=== "/") {
      return pathname=== "/";
    }

    return (
      pathname=== path ||
      pathname.startsWith(`${path}/`)
    );
  };

  const isAdminActive= adminLinks.some((link)=>
    isActive(link.to)
  );

const ADMIN_PASSWORD= ".toAdmin";

const handleAdminClick= ()=> {
  if (adminVerified) {
    setAdminOpen((prev)=> !prev);
    return;
  }

  setAdminPassword("");
  setAdminError("");
  setAdminOpen(false);
};

const verifyAdminPassword= (e)=> {
  e.preventDefault();

  if (adminPassword=== ADMIN_PASSWORD) {
    setAdminVerified(true);
    setAdminOpen(true);
    setShowAdminPassword(false);
    setAdminPassword("");
    setAdminError("");
  } else {
    setAdminError("Incorrect admin password.");
    setAdminPassword("");
  }
};

  return (
    <>
      {/*=====================================================
          MAIN NAVBAR
    ===================================================== */}

      <header className="navbar">
        <div className="navbar-inner">

          {/*=================================================
              MOBILE HAMBURGER
        ================================================= */}

          <div className="navbar-mobile-menu">
            <button
              type="button"
              className="hamburger"
              onClick={()=> setDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>

          {/*=================================================
              CHURCH LOGO / BRAND
        ================================================= */}

          <Link
            to="/"
            className="navbar-logo"
            aria-label="Answered Prayer Network home"
          >
            <div className="logo-mark">
              <img
                src={APNIcon}
                alt="Answered Prayer Network Logo"
                className="logo-icon"
              />
            </div>

            <div className="logo-text">
              <span className="logo-brand">
                Answered Prayer Network
              </span>

              <span className="logo-sub">
                FAITH • HOPE • LOVE
              </span>
            </div>
          </Link>

          {/*=================================================
              DESKTOP NAVIGATION
        ================================================= */}

          <nav
            className="navbar-nav"
            aria-label="Main navigation"
          >
            <ul className="navbar-links">

              {links.map((link)=> (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`nav-link ${
                      isActive(link.to) ? "active" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              {/*=================================================
                  ADMIN DROPDOWN
            ================================================= */}
<li
  className={`admin-nav-item ${isAdminActive ? "admin-active" : ""}`}
  onMouseEnter={()=> {
    if (!adminVerified) setShowAdminPassword(true);
    if (adminVerified) setAdminOpen(true);
  }}
  onMouseLeave={()=> {
    if (adminVerified) {
      setAdminOpen(false);
    } else {
      setShowAdminPassword(false);
    }
  }}
>
  <button
    type="button"
    className={`nav-link admin-button ${isAdminActive ? "active" : ""}`}
    onClick={handleAdminClick}
  >
    <span>Admin</span>
    <span className="admin-arrow">{adminOpen ? "▲" : "▼"}</span>
  </button>

  {/* Admin Verification */}
  {!adminVerified && showAdminPassword && (
    <div className="admin-login-box open">
      <form onSubmit={verifyAdminPassword}>
        <div className="admin-login-title">Admin Verification</div>
        <div className="admin-login-text">Enter admin password</div>

        <div className="admin-password-wrapper">
          <input
            type={showAdminPassword ? "text" : "password"}
            value={adminPassword}
            onChange={(e)=> {
              setAdminPassword(e.target.value);
              setAdminError("");
            }}
            placeholder="•••••••••"
            autoComplete="off"
          />

          <button
            type="button"
            className="password-toggle"
            onClick={()=> setShowAdminPassword((prev)=> !prev)}
          >
            {showAdminPassword ? "Hide" : "Show"}
          </button>
        </div>

        {adminError && (
          <div className="admin-login-error">{adminError}</div>
        )}

        <button type="submit" className="admin-verify-button">
          Verify
        </button>
      </form>
    </div>
  )}

  {/* Dropdown After Verification */}
  {adminVerified && adminOpen && (
    <div className="admin-dropdown verified">
      {adminLinks.map((link)=> (
        <Link
          key={link.to}
          to={link.to}
          className={`admin-dropdown-link ${isActive(link.to) ? "active" : ""}`}
          onClick={()=> setAdminOpen(false)}
        >
          <span>{link.label}</span>
          <span className="admin-dropdown-arrow">→</span>
        </Link>
      ))}
    </div>
  )}
</li>
            </ul>
          </nav>

        </div>
      </header>

      {/*=====================================================
          MOBILE DRAWER BACKDROP
    ===================================================== */}

      <div
        className={`drawer-backdrop ${
          drawerOpen ? "open" : ""
        }`}
        onClick={()=> setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/*=====================================================
          MOBILE DRAWER
    ===================================================== */}

      <aside
        className={`drawer ${
          drawerOpen ? "open" : ""
        }`}
      >

        {/* Drawer Header */}

        <div className="drawer-header">

          <Link
            to="/"
            className="drawer-logo"
            onClick={()=> setDrawerOpen(false)}
          >
            <div className="logo-mark">
              <img
                src={APNIcon}
                alt="Answered Prayer Network Logo"
                className="logo-icon"
              />
            </div>

            <div className="logo-text">
              <span className="logo-brand">
                Answered Prayer Network
              </span>

              <span className="logo-sub">
                FAITH • HOPE • LOVE
              </span>
            </div>
          </Link>

          <button
            type="button"
            className="drawer-close"
            onClick={()=> setDrawerOpen(false)}
            aria-label="Close navigation menu"
          >
            ✕
          </button>

        </div>

        <div className="drawer-rule" />

        {/*=================================================
            MOBILE NAVIGATION
      ================================================= */}

        <nav className="drawer-nav">
          <ul>

            {links.map((link)=> (
              <li key={link.to}>

                <Link
                  to={link.to}
                  className={`drawer-link ${
                    isActive(link.to)
                      ? "active"
                      : ""
                  }`}
                  onClick={()=>
                    setDrawerOpen(false)
                  }
                >
                  <span className="drawer-link-label">
                    {link.label}
                  </span>

                  <span className="drawer-link-arrow">
                    →
                  </span>
                </Link>

              </li>
            ))}

            {/*=================================================
                MOBILE ADMIN
          ================================================= */}

            <li className="mobile-admin-section">

              <button
                type="button"
                className={`drawer-link mobile-admin-button ${
                  isAdminActive ? "active" : ""
                }`}
                onClick={()=>
                  setAdminOpen((prev)=> !prev)
                }
              >
                <span className="drawer-link-label">
                  Admin
                </span>

                <span className="mobile-admin-arrow">
                  {adminOpen ? "▲" : "▼"}
                </span>
              </button>

              {adminOpen && (
                <div className="mobile-admin-submenu">

                  {adminLinks.map((link)=> (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`mobile-admin-link ${
                        isActive(link.to)
                          ? "active"
                          : ""
                      }`}
                      onClick={()=> {
                        setDrawerOpen(false);
                        setAdminOpen(false);
                      }}
                    >
                      <span className="mobile-admin-dot">
                        •
                      </span>

                      <span>
                        {link.label}
                      </span>

                      <span className="mobile-admin-link-arrow">
                        →
                      </span>
                    </Link>
                  ))}

                </div>
              )}

            </li>

          </ul>
        </nav>

        {/*=================================================
            DRAWER FOOTER
      ================================================= */}

        <div className="drawer-footer">

          <p className="drawer-footer-label">
            WELCOME
          </p>

          <p className="drawer-footer-text">
            We welcome you to worship, fellowship,
            grow in faith, and serve together.
          </p>

          <Link
            to="/contact"
            className="btn-gold drawer-cta"
            onClick={()=> setDrawerOpen(false)}
          >
            Contact Us
          </Link>

        </div>

      </aside>
    </>
  );
}