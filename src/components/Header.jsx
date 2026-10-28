import { Link } from 'react-router-dom';
import './Header.css';

function Header({ name, title, studentId = "24IT050" }) {
  return (
    <header className="hero-header" id="hero">
      <div className="hero-section">
        <div className="hero-badge">
          <span className="badge-glow-dot"></span>
          <span>👋 Welcome to my Portfolio & Workspace</span>
        </div>

        <h1 className="hero-name">{name}</h1>

        <div className="hero-meta-tag">
          <span className="meta-pill id-pill">ID: {studentId}</span>
          <span className="meta-pill dept-pill">Information Technology</span>
          <span className="meta-pill uni-pill">CHARUSAT</span>
        </div>

        <p className="hero-title">{title}</p>
        <p className="hero-desc">
          Building high-performance, asynchronous REST APIs and modern responsive web applications 
          powered by Node.js, Express, MongoDB, and React.
        </p>

        <div className="hero-cta">
          <Link to="/projects" className="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/>
            </svg>
            <span>Launch Task Manager</span>
          </Link>
          <a href="#about" className="btn btn-outline">
            About Me
          </a>
        </div>

        <div className="hero-social-row">
          <a
            href="https://github.com/parthmavani"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-social-link"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>github.com/parthmavani</span>
          </a>

          <a
            href="https://linkedin.com/in/parthmavani"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-social-link"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span>LinkedIn Profile</span>
          </a>
        </div>

        <div className="hero-glow"></div>
      </div>
    </header>
  );
}

export default Header;
