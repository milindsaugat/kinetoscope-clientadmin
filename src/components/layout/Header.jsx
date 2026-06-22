/* ============================================================
   Component: Header.jsx
   Description: Top bar with breadcrumb, notifications, client profile
   ============================================================ */

import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// ── Route to Title & Breadcrumb Map ───────────────────────
const routeConfig = {
  '/dashboard': { title: 'Dashboard', breadcrumb: 'Overview' },
  '/investment': { title: 'Your Investment', breadcrumb: 'Investments' },
  '/complete-transaction-details': { title: 'Complete Transaction Details', breadcrumb: 'Investments' },
  '/portfolio': { title: 'KFPL Portfolio', breadcrumb: 'Investments' },
  '/projects': { title: 'Project Selection', breadcrumb: 'Investments' },
  '/perks': { title: 'Perks & Recognition', breadcrumb: 'Account' },
  '/payments': { title: 'Payments', breadcrumb: 'Account' },
  '/service-requests': { title: 'Service Requests', breadcrumb: 'Account' },
  '/service-requests/new': { title: 'New Service Request', breadcrumb: 'Account / Service Requests' },
  '/profile': { title: 'My Profile', breadcrumb: 'Account' },
  '/media': { title: 'Media & News', breadcrumb: 'More' },
  '/onboarding/details': { title: 'Complete Your Profile', breadcrumb: 'Onboarding' },
};

function getPageConfig(pathname) {
  if (routeConfig[pathname]) return routeConfig[pathname];
  if (pathname.match(/^\/service-requests\/.+/)) return { title: 'Request Details', breadcrumb: 'Account / Service Requests' };
  return { title: 'Client Portal', breadcrumb: '' };
}

export default function Header({ isCollapsed, onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const config = getPageConfig(location.pathname);

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Read logged-in client info from localStorage
  const authData = localStorage.getItem('kfpl_client_auth');
  let clientInfo = null;
  if (authData) {
    try {
      const parsed = JSON.parse(authData);
      const root = parsed?.client || parsed;
      clientInfo = root?.client || root?.data || root?.user || root;
    } catch (e) {
      console.error('Failed to parse authData', e);
    }
  }
  const clientName = clientInfo?.name || 'Investor';
  const clientEmail = clientInfo?.email || 'investor@kfpl.com';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('kfpl_client_auth');
    navigate('/login');
  };

  return (
    <header className={`kfpl-header ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="kfpl-header-left">
        <button className="kfpl-header-hamburger" onClick={onMenuClick} aria-label="Open menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div className="kfpl-header-title-wrap">
          <h1 className="kfpl-header-title">{config.title}</h1>
          {config.breadcrumb && (
            <div className="kfpl-header-breadcrumb">
              <span>Home</span> / {config.breadcrumb}
            </div>
          )}
        </div>
      </div>

      <div className="kfpl-header-right">
        {/* Notifications */}
        <button className="kfpl-header-icon-btn" aria-label="Notifications">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span className="kfpl-header-notification-dot"></span>
        </button>

        <div className="kfpl-header-divider"></div>

        {/* Client Profile with Dropdown */}
        <div className="kfpl-dropdown-container" ref={dropdownRef} style={{ position: 'relative' }}>
          <div className="kfpl-header-profile" onClick={() => setShowDropdown(!showDropdown)}>
            <div className="kfpl-header-avatar">{clientName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}</div>
            <div className="kfpl-header-profile-info">
              <span className="kfpl-header-profile-name">{clientName}</span>
              <span className="kfpl-header-profile-role">Investor</span>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14"
              style={{ color: 'var(--color-text-muted)', transform: showDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>

          {showDropdown && (
            <div className="kfpl-header-profile-dropdown">
              <div className="kfpl-dropdown-profile-header">
                <span className="kfpl-dropdown-profile-name">{clientName}</span>
                <span className="kfpl-dropdown-profile-email">{clientEmail}</span>
              </div>
              <div className="kfpl-dropdown-divider"></div>
              <div className="kfpl-dropdown-item" onClick={() => { setShowDropdown(false); navigate('/profile'); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                My Profile
              </div>
              <div className="kfpl-dropdown-item kfpl-dropdown-logout-btn" onClick={handleLogout}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ============ END: Header.jsx ============ */
