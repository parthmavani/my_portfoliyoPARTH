import { useState } from 'react';

function RepoList({ repos }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="repo-section">
      <div className="repo-search-bar">
        <input
          type="text"
          placeholder="🔍 Search repositories by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <span className="repo-count">
          Showing {filteredRepos.length} of {repos.length} repos
        </span>
      </div>

      {filteredRepos.length === 0 ? (
        <div className="no-repos">No repositories found matching "{searchTerm}"</div>
      ) : (
        <div className="repo-grid">
          {filteredRepos.map((repo) => (
            <div className="repo-card" key={repo.id}>
              <div className="repo-header">
                <h3 className="repo-title">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="repo-link"
                  >
                    📦 {repo.name}
                  </a>
                </h3>
                <span className="repo-stars" title="Star count">
                  ⭐ {repo.stargazers_count}
                </span>
              </div>
              <p className="repo-description">
                {repo.description || 'No description provided.'}
              </p>
              <div className="repo-footer">
                {repo.language && (
                  <span className="repo-language">🏷️ {repo.language}</span>
                )}
                {repo.forks_count > 0 && (
                  <span className="repo-forks">🍴 {repo.forks_count}</span>
                )}
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="repo-btn"
                >
                  View on GitHub ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RepoList;
