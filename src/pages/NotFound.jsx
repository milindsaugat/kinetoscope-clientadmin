/* ============================================================
   Page: NotFound.jsx
   Description: 404 page for client portal
   ============================================================ */

import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="kfpl-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 800, color: 'var(--color-gold)', marginBottom: '8px' }}>404</h1>
        <h2 style={{ marginBottom: '8px' }}>Page Not Found</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>The page you're looking for doesn't exist or has been moved.</p>
        <button className="kfpl-btn kfpl-btn--primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
      </div>
    </div>
  );
}

/* ============ END: NotFound.jsx ============ */
