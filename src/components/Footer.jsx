import './Footer.css';

function Footer({ email, socialLinks }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="logo-icon">◈</span>
            <span className="logo-text">Parth Mavani • TaskFlow</span>
          </div>
          <p className="footer-tagline">
            Information Technology (24IT050) • CSPIT, CHARUSAT University.
          </p>
        </div>

        <div className="footer-contact">
          <h3 className="footer-heading">Connect & Collaborate</h3>
          <a href={`mailto:${email}`} className="footer-email" id="contact-email">
            {email}
          </a>
          <div className="footer-socials" id="social-links">
            {socialLinks && socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © {currentYear} Parth Mavani (24IT050). All rights reserved. Built with React, Express, MongoDB & Node.js.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
