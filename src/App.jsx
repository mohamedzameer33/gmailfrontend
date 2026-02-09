import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import EmailHome from './assets/EmailHome';
import NewTemplate from './assets/NewTemplate';


/** * PROFESSIONAL LOGIN COMPONENT
 * Deep Purple & Professional White Theme
 */
const Login = ({ onLoginSuccess }) => {
  const [creds, setCreds] = useState({ user: '', pass: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    const token = btoa(`${creds.user}:${creds.pass}`);
    try {
      const res = await fetch('http://localhost:8080/api/mail/templates', {
        headers: { 'Authorization': `Basic ${token}` }
      });
      if (res.ok) {
        localStorage.setItem('auth_token', token);
        onLoginSuccess();
      } else {
        setErr('Invalid operator credentials.');
      }
    } catch {
      setErr('Server connection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', 
      justifyContent: 'center', background: '#f0f2f5', fontFamily: "'Inter', sans-serif",
      position: 'fixed', top: 0, left: 0, zIndex: 1000
    }}>
      <div style={{
        background: '#ffffff', padding: '40px', borderRadius: '20px', width: '90%', 
        maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', 
        border: '1px solid #e1e4e8', textAlign: 'center'
      }}>
        <div style={{ fontSize: '42px', marginBottom: '15px' }}>🛡️</div>
        <h1 style={{ color: '#1a1f36', fontSize: '26px', margin: '0 0 10px 0', fontWeight: '800' }}>
          Z-MAILER <span style={{ color: '#6366f1' }}>PRO</span>
        </h1>
        <p style={{ color: '#697386', fontSize: '14px', marginBottom: '30px' }}>Enterprise Template Management</p>

        {err && <div style={{ color: '#ef4444', fontSize: '13px', marginBottom: '15px', fontWeight: '600' }}>{err}</div>}

        <form onSubmit={login}>
          <input
            style={{
              width: '100%', padding: '14px', marginBottom: '16px', borderRadius: '10px',
              border: '1px solid #dcdfe4', fontSize: '16px', boxSizing: 'border-box', outline: 'none'
            }}
            placeholder="Operator ID"
            onChange={(e) => setCreds({ ...creds, user: e.target.value })}
            required
          />
          <input
            style={{
              width: '100%', padding: '14px', marginBottom: '20px', borderRadius: '10px',
              border: '1px solid #dcdfe4', fontSize: '16px', boxSizing: 'border-box', 
              outline: 'none', type: 'password'
            }}
            type="password"
            placeholder="Access Key"
            onChange={(e) => setCreds({ ...creds, pass: e.target.value })}
            required
          />
          <button 
            style={{
              width: '100%', padding: '14px', background: '#6366f1', color: 'white',
              border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '16px',
              cursor: 'pointer', opacity: loading ? 0.7 : 1, transition: '0.2s'
            }} 
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

/**
 * MAIN APP COMPONENT
 */
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('auth_token'));
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;

  return (
    <Router>
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
        
        {/* Responsive Header */}
        <header style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '15px 5%', background: '#ffffff', borderBottom: '1px solid #e2e8f0',
          position: 'sticky', top: 0, zIndex: 100
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', color: '#1e293b' }}>
              Z-MAILER <span style={{ color: '#6366f1' }}>PRO</span>
            </h2>
            <small style={{ color: '#94a3b8', fontWeight: 'bold' }}>{time} // ONLINE</small>
          </div>

          <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#475569', fontWeight: '600', fontSize: '14px' }}>HUB</Link>
            <Link to="/new-template" style={{ textDecoration: 'none', color: '#475569', fontWeight: '600', fontSize: '14px' }}>TEMPLATES</Link>
            <button 
              onClick={handleLogout} 
              style={{
                background: '#fee2e2', color: '#ef4444', border: '1px solid #fca5a5',
                padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
                fontWeight: '700', fontSize: '12px'
              }}
            >
              EXIT
            </button>
          </nav>
        </header>

        {/* Responsive Content Grid */}
        <main style={{ padding: '30px 5%' }}>
          <div style={{
            background: '#ffffff', borderRadius: '16px', padding: '25px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', minHeight: '75vh',
            border: '1px solid #e2e8f0'
          }}>
            <Routes>
              <Route path="/" element={<EmailHome />} />
              <Route path="/new-template" element={<NewTemplate />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;