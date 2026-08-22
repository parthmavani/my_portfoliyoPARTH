function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container">
      <div className="error-card">
        <div className="error-icon">⚠️</div>
        <h3>Failed to Load Repositories</h3>
        <p>{message || 'An unexpected error occurred while fetching data.'}</p>
        {onRetry && (
          <button className="retry-btn" onClick={onRetry}>
            🔄 Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
