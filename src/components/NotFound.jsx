import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={{ textAlign: 'center', marginTop: '5rem' }}>
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you are looking for does not exist.</p>
      <Link to="/" style={{ color: '#1ABCFE', textDecoration: 'none', fontWeight: 'bold' }}>
        Go back to Home
      </Link>
    </div>
  );
}

export default NotFound;
