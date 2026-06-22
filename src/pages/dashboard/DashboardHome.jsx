/* ============================================================
   Page: DashboardHome.jsx
   Description: Premium client dashboard with matching super-admin styling,
                custom SVG charts, quick actions, and personal widgets.
   ============================================================ */

import { useNavigate } from 'react-router-dom';
import { JOURNEY_STEPS, PERK_TIERS } from '../../constants';
import {
  mockJourney,
  mockStats,
  mockClient,
  mockInvestments,
  mockROIHistory,
  mockPortfolioProjects,
  formatCurrency,
  formatNumber
} from '../../data/mockData';
import DonutChart from '../../components/charts/DonutChart';
import LineChart from '../../components/charts/LineChart';

export default function DashboardHome() {
  const navigate = useNavigate();

  // Calculate journey progress
  const completedSteps = JOURNEY_STEPS.filter(step => mockJourney[step.key]).length;
  const progress = Math.round((completedSteps / JOURNEY_STEPS.length) * 100);
  const fillPercent = completedSteps > 0 ? ((completedSteps - 1) / (JOURNEY_STEPS.length - 1)) * 100 : 0;

  const showOnboardingBanner = !mockClient.onboardingComplete;

  // Prepare Donut Chart data dynamically
  const totalInvestedAmount = mockInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const segmentAllocation = mockInvestments.map(inv => ({
    segment: inv.segment,
    value: Math.round((inv.amount / totalInvestedAmount) * 100)
  }));

  // Prepare Line Chart data dynamically
  const lineChartData = mockROIHistory.map(roi => ({
    month: roi.month.split(' ')[0],
    amount: roi.received > 0 ? roi.received : roi.expected
  }));

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Quick Action Config
  const quickActionItems = [
    { label: 'Raise Query', subtitle: 'Service request', route: '/service-requests/new', color: '#7B1FA2', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
    { label: 'Add Funds', subtitle: 'Invest in slots', route: '/projects', color: '#10B981', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
    { label: 'Request Payout', subtitle: 'Withdraw request', route: '/payments', color: '#C62828', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
    { label: 'View Portfolio', subtitle: 'Active portfolio', route: '/portfolio', color: '#1565C0', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> },
    { label: 'Support Details', subtitle: 'Contact desk', route: '/profile?tab=support', color: '#0E7490', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
  ];

  return (
    <div className="kfpl-page" id="client-dashboard-page">
      
      {/* ═══════════════ WELCOME HERO BANNER ═══════════════ */}
      <div className="kfpl-welcome-banner">
        <div className="kfpl-welcome-content">
          <div className="kfpl-welcome-text">
            <div className="kfpl-welcome-eyebrow">Client investment portal</div>
            <h1 className="kfpl-welcome-title">
              Welcome back, <span className="kfpl-welcome-name">{mockClient.name}</span>
            </h1>
            <p className="kfpl-welcome-subtitle">
              {dateStr} — Here's your portal and investment overview.
            </p>
          </div>
          <div className="kfpl-welcome-stats">
            <div className="kfpl-stat-pill">
              <span className="kfpl-stat-pill-value">
                {formatCurrency(mockStats.totalInvested)}
              </span>
              <span className="kfpl-stat-pill-label">Total Invested</span>
            </div>
            <div className="kfpl-stat-pill">
              <span className="kfpl-stat-pill-value">
                {formatCurrency(mockStats.monthlyROI)}
              </span>
              <span className="kfpl-stat-pill-label">Monthly ROI</span>
            </div>
          </div>
        </div>
        {/* Decorative background elements */}
        <div className="kfpl-welcome-deco" aria-hidden="true">
          <div className="kfpl-welcome-circle kfpl-welcome-circle--1" />
          <div className="kfpl-welcome-circle kfpl-welcome-circle--2" />
          <div className="kfpl-welcome-circle kfpl-welcome-circle--3" />
        </div>
      </div>

      {/* Onboarding Profile Alert Banner */}
      {showOnboardingBanner && (
        <div className="kfpl-onboarding-banner" onClick={() => navigate('/onboarding/details')} style={{ cursor: 'pointer', marginBottom: '24px' }}>
          <div className="kfpl-onboarding-banner-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div className="kfpl-onboarding-banner-text">
            <h4>Complete Your Profile</h4>
            <p>Add your nominee details and select your risk profile to complete onboarding.</p>
          </div>
          <button className="kfpl-btn kfpl-btn--primary kfpl-btn--sm">Complete Now →</button>
        </div>
      )}

      {/* Journey Progress Bar */}
      <div className="kfpl-journey" style={{ marginBottom: '28px' }}>
        <div className="kfpl-journey-header">
          <div>
            <h2 className="kfpl-journey-title">Your Investment Journey</h2>
            <p className="kfpl-journey-subtitle">{completedSteps} of {JOURNEY_STEPS.length} milestones completed</p>
          </div>
          <div className="kfpl-journey-progress-summary">
            <span className="kfpl-journey-status">On track</span>
            <div className="kfpl-journey-percent">{progress}<span>%</span></div>
          </div>
        </div>
        <div className="kfpl-journey-bar">
          <div className="kfpl-journey-line">
            <div className="kfpl-journey-line-fill" style={{ width: `${fillPercent}%` }}></div>
          </div>
          {JOURNEY_STEPS.map((step, i) => {
            const isCompleted = mockJourney[step.key];
            const isCurrent = !isCompleted && (i === 0 || mockJourney[JOURNEY_STEPS[i - 1]?.key]);
            const stepState = isCompleted ? 'completed' : isCurrent ? 'current' : 'pending';
            return (
              <div key={step.id} className={`kfpl-journey-step ${stepState}`}>
                <div className={`kfpl-journey-dot ${stepState}`}>
                  {isCompleted ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : step.id}
                </div>
                <div className="kfpl-journey-step-copy">
                  <span className="kfpl-journey-step-index">Step {String(i + 1).padStart(2, '0')}</span>
                  <span className="kfpl-journey-label">{step.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════════════ 5 KPI CARDS GRID ═══════════════ */}
      <div className="kfpl-dashboard-kpis">
        <div className="kfpl-card kfpl-kpi-card kfpl-kpi-card--total kfpl-kpi-card--highlight">
          <div className="kfpl-kpi-header">
            <span className="kfpl-kpi-label">Total Invested</span>
            <div className="kfpl-kpi-icon gold">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            </div>
          </div>
          <span className="kfpl-kpi-value">{formatCurrency(mockStats.totalInvested)}</span>
          <span className="kfpl-kpi-meta">Active capital across selected projects</span>
        </div>

        <div className="kfpl-card kfpl-kpi-card kfpl-kpi-card--roi">
          <div className="kfpl-kpi-header">
            <span className="kfpl-kpi-label">Monthly ROI</span>
            <div className="kfpl-kpi-icon success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
          </div>
          <span className="kfpl-kpi-value">{formatCurrency(mockStats.monthlyROI)}</span>
          <span className="kfpl-kpi-meta">Expected monthly payout</span>
        </div>

        <div className="kfpl-card kfpl-kpi-card kfpl-kpi-card--rate">
          <div className="kfpl-kpi-header">
            <span className="kfpl-kpi-label">ROI Rate</span>
            <div className="kfpl-kpi-icon info">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
          </div>
          <span className="kfpl-kpi-value">{mockStats.roiRate}%</span>
          <span className="kfpl-kpi-trend up" style={{ marginTop: '6px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
            Annual
          </span>
        </div>

        <div className="kfpl-card kfpl-kpi-card kfpl-kpi-card--perk" style={{ cursor: 'pointer' }} onClick={() => navigate('/perks')}>
          <div className="kfpl-kpi-header">
            <span className="kfpl-kpi-label">Perk Tier</span>
            <div className="kfpl-kpi-icon warning">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
            </div>
          </div>
          <span className="kfpl-kpi-value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {PERK_TIERS[mockStats.perkTier]?.icon} {mockStats.perkTier}
          </span>
          <span className="kfpl-kpi-meta">Recognition benefits enabled</span>
        </div>

        <div className="kfpl-card kfpl-kpi-card kfpl-kpi-card--date">
          <div className="kfpl-kpi-header">
            <span className="kfpl-kpi-label">Next ROI Date</span>
            <div className="kfpl-kpi-icon navy">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
          </div>
          <span className="kfpl-kpi-value">
            {new Date(mockStats.nextROIDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <span className="kfpl-kpi-meta">Upcoming payout schedule</span>
        </div>
      </div>

      {/* ═══════════════ CHARTS 2-COLUMN GRID ═══════════════ */}
      <div className="kfpl-dashboard-charts-grid">
        {/* Segment Allocation Chart */}
        <div className="kfpl-chart-card kfpl-chart-card--glass">
          <div className="kfpl-chart-header">
            <div>
              <div className="kfpl-chart-title">Asset Allocation</div>
              <div className="kfpl-chart-subtitle">Portfolio distribution by segment</div>
            </div>
            <span className="kfpl-badge kfpl-badge--active">Allocated</span>
          </div>
          <div className="kfpl-chart-body">
            <DonutChart data={segmentAllocation} defaultValue={mockInvestments.length} defaultLabel="Segments" />
          </div>
          <div className="kfpl-chart-legend">
            {segmentAllocation.map((seg, i) => (
              <div className="kfpl-legend-item" key={seg.segment}>
                <span className="kfpl-legend-dot" style={{ background: ['#10B981', '#1565C0', '#2E7D32', '#E65100', '#7B1FA2', '#00838F'][i % 6] }} />
                <span>{seg.segment}</span>
                <span className="kfpl-legend-value">{seg.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* ROI Earnings Line Chart */}
        <div className="kfpl-chart-card kfpl-chart-card--glass">
          <div className="kfpl-chart-header">
            <div>
              <div className="kfpl-chart-title">Monthly ROI Earnings</div>
              <div className="kfpl-chart-subtitle">Historical ROI payout tracking — FY 2025</div>
            </div>
            <span className="kfpl-badge kfpl-badge--gold-tier">Paid</span>
          </div>
          <div className="kfpl-chart-body">
            <LineChart data={lineChartData} height={220} color="#10B981" />
          </div>
        </div>
      </div>

      {/* ═══════════════ QUICK ACTIONS ═══════════════ */}
      <div className="kfpl-quick-actions-section">
        <div className="kfpl-section-header">
          <h3 className="kfpl-section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18, color: 'var(--color-gold)' }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            Quick Portal Actions
          </h3>
          <span className="kfpl-section-subtitle">One-click actions to manage your investment</span>
        </div>
        <div className="kfpl-quick-actions-grid">
          {quickActionItems.map((action, i) => (
            <button
              key={i}
              className="kfpl-quick-action-btn"
              onClick={() => navigate(action.route)}
              style={{ '--action-color': action.color }}
            >
              <div className="kfpl-quick-action-num">{String(i + 1).padStart(2, '0')}</div>
              <div className="kfpl-quick-action-icon-wrap" style={{ background: `${action.color}12`, color: action.color }}>
                {action.icon}
              </div>
              <div className="kfpl-quick-action-text">
                <span className="kfpl-quick-action-label">{action.label}</span>
                <span className="kfpl-quick-action-sublabel">{action.subtitle}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════ BOTTOM WIDGETS ═══════════════ */}
      <div className="kfpl-dashboard-widgets" style={{ marginBottom: '24px' }}>
        
        {/* Widget 1: Recent Payouts */}
        <div className="kfpl-chart-card">
          <div className="kfpl-chart-header">
            <div>
              <div className="kfpl-chart-title">Recent Payouts</div>
              <div className="kfpl-chart-subtitle">Last 5 ROI transfers</div>
            </div>
            <button className="kfpl-btn kfpl-btn--ghost kfpl-btn--sm" onClick={() => navigate('/investment')}>View History</button>
          </div>
          <div className="kfpl-chart-body" style={{ padding: '8px 24px 24px' }}>
            <div className="kfpl-widget-list">
              {mockROIHistory.slice(0, 5).map((roi, idx) => (
                <div className="kfpl-widget-item" key={idx}>
                  <div className="kfpl-widget-rank silver">
                    {idx + 1}
                  </div>
                  <div className="kfpl-widget-item-info">
                    <div className="kfpl-widget-item-name">{roi.month}</div>
                    <div className="kfpl-widget-item-sub">
                      Status: <span className={`kfpl-badge kfpl-badge--${roi.status.toLowerCase()}`} style={{ fontSize: '0.625rem', padding: '1px 6px' }}>{roi.status}</span>
                    </div>
                  </div>
                  <div className="kfpl-widget-item-value" style={{ color: roi.status === 'Paid' ? 'var(--color-success)' : 'var(--color-warning)' }}>
                    {formatCurrency(roi.received > 0 ? roi.received : roi.expected)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Widget 2: Portfolio Projects */}
        <div className="kfpl-chart-card">
          <div className="kfpl-chart-header">
            <div>
              <div className="kfpl-chart-title">Project Milestones</div>
              <div className="kfpl-chart-subtitle">Status of active projects</div>
            </div>
            <button className="kfpl-btn kfpl-btn--ghost kfpl-btn--sm" onClick={() => navigate('/portfolio')}>All Projects</button>
          </div>
          <div className="kfpl-chart-body" style={{ padding: '8px 24px 24px' }}>
            <div className="kfpl-widget-list">
              {mockPortfolioProjects.slice(0, 4).map((project) => (
                <div className="kfpl-widget-item" key={project.id}>
                  <div className="kfpl-widget-item-info">
                    <div className="kfpl-widget-item-name" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{project.name}</span>
                      <span className="text-muted text-xs" style={{ marginLeft: 'auto', fontWeight: '500' }}>{project.milestone}%</span>
                    </div>
                    <div className="kfpl-widget-item-sub" style={{ marginTop: '4px' }}>
                      <div className="kfpl-progress" style={{ height: '6px' }}>
                        <div className="kfpl-progress-fill" style={{ width: `${project.milestone}%` }}></div>
                      </div>
                    </div>
                    <div className="text-xs text-muted" style={{ marginTop: '4px', fontSize: '0.6875rem' }}>
                      {project.segment} • {project.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Widget 3: Wealth Advisor Contact */}
        <div className="kfpl-chart-card">
          <div className="kfpl-chart-header">
            <div>
              <div className="kfpl-chart-title">Personal Wealth Advisor</div>
              <div className="kfpl-chart-subtitle">Get in touch with your manager</div>
            </div>
          </div>
          <div className="kfpl-chart-body" style={{ padding: '16px 24px 24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-gold) 0%, var(--color-gold-dark) 100%)',
                color: 'var(--color-white)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                fontWeight: '800',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
              }}>
                {mockClient.agentName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>{mockClient.agentName}</h4>
                <p className="text-muted text-sm" style={{ marginTop: '2px' }}>ID: {mockClient.agentId} • Senior Wealth Manager</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '8px' }}>
                <a href={`tel:${mockClient.phone}`} className="kfpl-btn kfpl-btn--ghost kfpl-btn--sm" style={{ flex: 1 }}>
                  📞 Call
                </a>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="kfpl-btn kfpl-btn--primary kfpl-btn--sm" style={{ flex: 1, background: '#25D366', borderColor: '#25D366' }}>
                  💬 WhatsApp
                </a>
              </div>
              <p className="text-xs text-muted" style={{ marginTop: '4px' }}>
                Available Mon - Sat, 10 AM to 6 PM IST
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
