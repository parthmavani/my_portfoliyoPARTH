import { useState, useEffect } from 'react';
import Spinner from './Spinner';
import ErrorMessage from './ErrorMessage';
import RepoList from './RepoList';
import Skills from './Skills';
import './Projects.css';

function Projects({ skillsData }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('octocat');
  const [inputUsername, setInputUsername] = useState('octocat');

  const fetchRepos = (targetUser = username) => {
    setLoading(true);
    setError(null);

    fetch(`https://api.github.com/users/${targetUser}/repos?sort=updated`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setRepos(data);
        } else {
          throw new Error('Received unexpected data format from API');
        }
      })
      .catch((err) => {
        setError(err.message || 'Error fetching repositories');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRepos(username);
  }, [username]);

  const handleUserSearch = (e) => {
    e.preventDefault();
    if (inputUsername.trim()) {
      setUsername(inputUsername.trim());
    }
  };

  return (
    <div className="projects-container">
      <h2 className="projects-title">GitHub Live Repositories</h2>
      <p className="projects-subtitle">
        Practical 3 REST API Integration - Fetching repositories dynamically from GitHub API
      </p>

      <form onSubmit={handleUserSearch} className="api-controls">
        <label htmlFor="github-user-input" style={{ fontWeight: 500 }}>
          GitHub User:
        </label>
        <input
          id="github-user-input"
          type="text"
          value={inputUsername}
          onChange={(e) => setInputUsername(e.target.value)}
          placeholder="Enter GitHub username..."
          className="username-input"
        />
        <button type="submit" className="fetch-btn">
          Fetch Repositories
        </button>
      </form>

      {/* Conditional Rendering based on state */}
      {loading && <Spinner />}

      {!loading && error && (
        <ErrorMessage message={error} onRetry={() => fetchRepos(username)} />
      )}

      {!loading && !error && <RepoList repos={repos} />}

      <hr style={{ margin: '3rem 0 2rem 0', borderColor: '#e2e8f0' }} />

      <h2 className="projects-title">Technical Skills & Expertise</h2>
      {skillsData && <Skills skills={skillsData} />}
    </div>
  );
}

export default Projects;
