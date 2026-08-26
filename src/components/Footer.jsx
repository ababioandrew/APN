import { Link } from 'react-router-dom';
import './Footer.css';

// ✅ Import APN logo
import APNIcon from '../icons/APN.png';

export default function Footer() {
  const links = [
    { to: '/',        label: 'Home' },
    { to: '/about',   label: 'About Us' },
    { to: '/services',label: 'Ministries' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <footer className="footer">
      {/* Quote band */}
      <div className="footer-quote">
        <div className="footer-quote-inner">
          <p className="quote-text">
            "Tenaciously, the pursuit of excellence defines every engagement.
            We stand beside our community through every challenge — in faith, hope, and love."
          </p>
          <span className="quote-attr">— Answered Prayer Network</span>
        </div>
      </div>

      {/* Footer nav */}
      <div className="footer-nav">
        <div className="footer-nav-inner">
          <Link to="/" className="footer-logo">
            <div className="footer-logo-mark">
              {/* ✅ Use APN logo */}
              <img src={APNIcon} alt="Answered Prayer Network Logo" className="footer-logo-icon" />
            </div>
            <div className="footer-logo-text">
              <span className="footer-brand">Answered Prayer Network</span>
              <span className="footer-sub">FAITH • HOPE • LOVE</span>
            </div>
          </Link>

          <ul className="footer-links">
            {links.map(l => (
              <li key={l.to}>
                <Link to={l.to} className="footer-link">{l.label}</Link>
              </li>
            ))}
          </ul>

          <p className="footer-copy">© {new Date().getFullYear()} Answered Prayer Network, all rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
