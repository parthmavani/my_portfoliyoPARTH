import { useState } from 'react';
import { loginUser, registerUser } from '../api';
import './Auth.css';

function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const authAction = isLogin ? loginUser : registerUser;

    authAction({ email, password })
      .then(data => {
        if (data.success) {
          if (isLogin) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userEmail', data.user.email);
            onAuthSuccess(data.user);
          } else {
            setIsLogin(true); // Switch to login after successful register
            setError('Registration successful! Please log in.');
          }
        } else {
          setError(data.message || 'Authentication failed');
        }
      })
      .catch(err => {
        setError(err.message || 'Network error');
      });
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      {error && <div className="auth-error">{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <p>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <span className="auth-toggle" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Register here' : 'Login here'}
        </span>
      </p>
    </div>
  );
}

export default Auth;
