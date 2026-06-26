/* ============================================================
   Page: DashboardHome.jsx
   Description: Premium client dashboard with matching super-admin styling,
                custom SVG charts, quick actions, and personal widgets.
   ============================================================ */

import { useState, useEffect } from 'react';
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
import Modal from '../../components/ui/Modal';
import KpiCard from '../../components/ui/KpiCard';


export default function DashboardHome() {
  const navigate = useNavigate();

  const [statusHistory, setStatusHistory] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [historySegmentFilter, setHistorySegmentFilter] = useState('all');

  const SEGMENT_COLORS = {
    'Film Making': '#10B981', Distribution: '#1565C0', Music: '#7C3AED',
    'Trading & Syndication': '#F59E0B', 'Content IP Bank': '#0F766E', 'Film Exhibition': '#0891B2',
  };

  useEffect(() => {
    const storedHistory = localStorage.getItem('kfpl_investment_status_history');
    if (storedHistory) {
      setStatusHistory(JSON.parse(storedHistory));
    } else {
      const defaultHistory = [
        {
          id: 1,
          type: 'project',
          segment: 'Film Making',
          project: 'Project Astra',
          status: 'In Production',
          progress: 65,
          note: 'Post-production phase begins next week',
          date: '2025-04-10',
          media: [
            {
              id: 'mock-1',
              name: 'astra_poster.png',
              type: 'image/png',
              size: 154200,
              dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="100%" height="100%" fill="%230b3020"/><circle cx="150" cy="150" r="80" fill="%2310b981"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23061d13" font-family="sans-serif" font-weight="bold" font-size="24">PROJECT ASTRA</text></svg>',
              uploadedAt: '2025-04-10T12:00:00.000Z'
            }
          ]
        },
        { id: 2, type: 'project', segment: 'Distribution', project: 'Meridian Release', status: 'Active', progress: 80, note: 'Distribution across 3 states confirmed', date: '2025-04-08', media: [] },
        { id: 3, type: 'project', segment: 'Music', project: 'Rhythm Series', status: 'Recording', progress: 40, note: '4 tracks completed, 6 remaining', date: '2025-04-05', media: [] },
        { id: 4, type: 'project', segment: 'Trading & Syndication', project: 'Content Deal Q2', status: 'Negotiation', progress: 30, note: 'Final terms under discussion', date: '2025-04-12', media: [] },
        { id: 5, type: 'project', segment: 'Content IP Bank', project: 'Archive Digitization', status: 'Ongoing', progress: 55, note: '550 titles digitized so far', date: '2025-04-09', media: [] },
        { id: 6, type: 'project', segment: 'Film Exhibition', project: 'Screen Network', status: 'Planning', progress: 15, note: '3 new screen locations identified', date: '2025-04-11', media: [] }
      ];
      setStatusHistory(defaultHistory);
      localStorage.setItem('kfpl_investment_status_history', JSON.stringify(defaultHistory));
    }
  }, []);

  useEffect(() => {
    if (statusHistory.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % statusHistory.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [statusHistory]);

  const handlePrevSlide = () => {
    if (statusHistory.length === 0) return;
    setCurrentSlideIndex(prev => (prev - 1 + statusHistory.length) % statusHistory.length);
  };

  const handleNextSlide = () => {
    if (statusHistory.length === 0) return;
    setCurrentSlideIndex(prev => (prev + 1) % statusHistory.length);
  };

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

      {/* ═══════════════ LIVE INVESTMENT STATUS UPDATES SLIDER ═══════════════ */}
      <div className="kfpl-section-header" style={{ marginTop: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="kfpl-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ width: 18, height: 18, color: 'var(--color-success)' }}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          Live Portfolio & Segment Updates
        </h3>
        <button
          className="kfpl-btn kfpl-btn--ghost kfpl-btn--xs"
          onClick={() => setShowHistoryModal(true)}
          style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 12, height: 12 }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
          View Full History Log
        </button>
      </div>

      <div className="kfpl-status-slider-container" style={{ position: 'relative', marginBottom: '28px' }}>
        {statusHistory.length === 0 ? (
          <div className="kfpl-card" style={{ padding: '30px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No status updates published yet.
          </div>
        ) : (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            {/* Slider Navigation Buttons */}
            <button
              onClick={handlePrevSlide}
              className="kfpl-slider-nav-btn prev"
              style={{
                position: 'absolute', left: '-15px', zIndex: 10,
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.2s', fontWeight: 'bold'
              }}
            >
              &larr;
            </button>

            {/* Slider Viewport */}
            <div className="kfpl-slider-viewport" style={{ overflow: 'hidden', width: '100%', borderRadius: '12px' }}>
              <div
                className="kfpl-slider-track"
                style={{
                  display: 'flex',
                  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: `translateX(-${currentSlideIndex * 100}%)`
                }}
              >
                {statusHistory.map((update) => {
                  const accent = SEGMENT_COLORS[update.segment] || '#10B981';
                  return (
                    <div
                      key={update.id}
                      className="kfpl-slider-slide"
                      style={{
                        minWidth: '100%', boxSizing: 'border-box',
                        padding: '4px'
                      }}
                    >
                      <div
                        className="kfpl-card kfpl-status-slider-card"
                        style={{
                          borderLeft: `4px solid ${accent}`,
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                          cursor: 'pointer',
                          background: 'rgba(255, 255, 255, 0.03)',
                          backdropFilter: 'blur(10px)',
                          boxShadow: 'var(--shadow-card)',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                        }}
                        onClick={() => setSelectedUpdate(update)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <span
                              className="kfpl-badge"
                              style={{
                                background: `${accent}15`,
                                color: accent,
                                border: `1px solid ${accent}40`,
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                padding: '4px 8px',
                                borderRadius: '4px'
                              }}
                            >
                              {update.segment}
                            </span>
                            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text)', marginTop: '8px', marginBottom: 0 }}>
                              {update.type === 'segment' || !update.project ? 'Segment-Wide Update' : update.project}
                            </h4>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span className="text-xs text-muted" style={{ display: 'block', fontWeight: 600 }}>{update.date}</span>
                            <span
                              className="kfpl-badge"
                              style={{
                                background: 'var(--color-surface-alt)',
                                border: '1px solid var(--color-border)',
                                fontSize: '0.65rem',
                                color: 'var(--color-text-secondary)',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                marginTop: '4px',
                                display: 'inline-block'
                              }}
                            >
                              {update.status}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p style={{
                          fontSize: '0.875rem',
                          color: 'var(--color-text-secondary)',
                          lineHeight: '1.5',
                          margin: 0,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          fontStyle: 'italic'
                        }}>
                          "{update.note}"
                        </p>

                        {/* Progress and Attachments Footer */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, maxWidth: '200px' }}>
                            <span className="text-xs text-muted" style={{ fontWeight: 600, minWidth: '30px' }}>{update.progress}%</span>
                            <div className="kfpl-progress" style={{ height: '6px', flex: 1, margin: 0 }}>
                              <div className="kfpl-progress-fill" style={{ width: `${update.progress}%`, background: accent }}></div>
                            </div>
                          </div>
                          
                          {(update.media || []).length > 0 && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 12, height: 12 }}>
                                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                              </svg>
                              {update.media.length} File(s)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleNextSlide}
              className="kfpl-slider-nav-btn next"
              style={{
                position: 'absolute', right: '-15px', zIndex: 10,
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.2s', fontWeight: 'bold'
              }}
            >
              &rarr;
            </button>
          </div>
        )}
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

      {/* ═══════════════ 6 KPI CARDS (2x3) GRID ═══════════════ */}
      <div className="kfpl-dashboard-kpis">
        <KpiCard
          title="Total Invested"
          value={formatCurrency(mockStats.totalInvested)}
          trend="Active capital across selected projects"
          trendDirection="up"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>}
          iconColor="gold"
          className="kfpl-kpi-card--total"
          variant="gold"
          delay={0}
        />

        <KpiCard
          title="Monthly ROI"
          value={formatCurrency(mockStats.monthlyROI)}
          trend="Expected monthly payout"
          trendDirection="up"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
          iconColor="success"
          className="kfpl-kpi-card--roi"
          delay={80}
        />

        <KpiCard
          title="ROI Rate"
          value={`${mockStats.roiRate}%`}
          trend="Annual"
          trendDirection="up"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
          iconColor="info"
          className="kfpl-kpi-card--rate"
          delay={160}
        />

        <KpiCard
          title="Perk Tier"
          value={`${PERK_TIERS[mockStats.perkTier]?.icon || '🏅'} ${mockStats.perkTier}`}
          trend="Recognition benefits enabled"
          trendDirection="up"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>}
          iconColor="warning"
          className="kfpl-kpi-card--perk"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/perks')}
          delay={240}
        />

        <KpiCard
          title="Next ROI Date"
          value={mockStats.nextROIDate && mockStats.nextROIDate !== '—' ? new Date(mockStats.nextROIDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
          trend="Upcoming payout schedule"
          trendDirection="up"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
          iconColor="navy"
          className="kfpl-kpi-card--date"
          delay={320}
        />

        <KpiCard
          title="Active Projects"
          value={mockInvestments.length}
          trend="Diversified portfolio segments"
          trendDirection="up"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>}
          iconColor="info"
          className="kfpl-kpi-card--projects"
          delay={400}
        />
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

      {/* ═══════ Selected Update Detail Modal ═══════ */}
      <Modal
        isOpen={!!selectedUpdate}
        onClose={() => setSelectedUpdate(null)}
        title={selectedUpdate ? (selectedUpdate.type === 'segment' || !selectedUpdate.project ? `${selectedUpdate.segment} Segment Update` : selectedUpdate.project) : 'Update Details'}
        size={selectedUpdate?.media?.length > 0 ? 'lg' : 'md'}
        footer={
          <button className="kfpl-btn kfpl-btn--ghost" onClick={() => setSelectedUpdate(null)}>Close</button>
        }
      >
        {selectedUpdate && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="kfpl-badge" style={{ background: `${SEGMENT_COLORS[selectedUpdate.segment] || '#10B981'}15`, color: SEGMENT_COLORS[selectedUpdate.segment] || '#10B981', border: `1px solid ${SEGMENT_COLORS[selectedUpdate.segment] || '#10B981'}40` }}>
                {selectedUpdate.segment}
              </span>
              <span className="text-xs text-muted" style={{ fontWeight: 600 }}>{selectedUpdate.date}</span>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border-light)' }}>
              <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--color-text)', fontStyle: 'italic' }}>
                "{selectedUpdate.note}"
              </p>
            </div>

            {/* Progress */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                <span className="text-muted">Milestone Completion</span>
                <span style={{ color: SEGMENT_COLORS[selectedUpdate.segment] || '#10B981' }}>{selectedUpdate.progress}%</span>
              </div>
              <div className="kfpl-progress" style={{ height: '8px', margin: 0 }}>
                <div className="kfpl-progress-fill" style={{ width: `${selectedUpdate.progress}%`, background: SEGMENT_COLORS[selectedUpdate.segment] || '#10B981' }}></div>
              </div>
            </div>

            {/* Attached Files */}
            {(selectedUpdate.media || []).length > 0 && (
              <div>
                <h5 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', color: 'var(--color-text)' }}>Attached Files</h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                  {selectedUpdate.media.map(m => (
                    <div key={m.id} style={{
                      border: '1px solid var(--color-border-light)',
                      borderRadius: '8px',
                      padding: '8px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      alignItems: 'center',
                      textAlign: 'center'
                    }}>
                      {m.type?.startsWith('image/') ? (
                        <img src={m.dataUrl} alt={m.name} style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '4px' }} />
                      ) : (
                        <div style={{
                          height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'var(--color-surface)', width: '100%', borderRadius: '4px',
                          fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)'
                        }}>
                          {m.name?.split('.').pop()?.toUpperCase() || 'FILE'}
                        </div>
                      )}
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                        {m.name}
                      </span>
                      <a
                        href={m.dataUrl}
                        download={m.name}
                        className="kfpl-btn kfpl-btn--ghost kfpl-btn--xs"
                        style={{ width: '100%', textDecoration: 'none', textAlign: 'center', display: 'block', padding: '4px' }}
                      >
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ═══════ History Log Modal ═══════ */}
      <Modal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        title="Investment Status History"
        size="lg"
        footer={
          <button className="kfpl-btn kfpl-btn--ghost" onClick={() => setShowHistoryModal(false)}>Close</button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Filters */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              className="kfpl-input"
              placeholder="Search history by project or note..."
              value={historySearch}
              onChange={e => setHistorySearch(e.target.value)}
              style={{ flex: 1 }}
            />
            <select
              className="kfpl-select"
              value={historySegmentFilter}
              onChange={e => setHistorySegmentFilter(e.target.value)}
              style={{ width: '180px' }}
            >
              <option value="all">All Segments</option>
              {Object.keys(SEGMENT_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* List of historical records */}
          <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
            {statusHistory
              .filter(log => {
                const matchesSearch =
                  (log.project || '').toLowerCase().includes(historySearch.toLowerCase()) ||
                  (log.note || '').toLowerCase().includes(historySearch.toLowerCase());
                const matchesSegment =
                  historySegmentFilter === 'all' || log.segment === historySegmentFilter;
                return matchesSearch && matchesSegment;
              })
              .length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '20px' }}>
                No update history found matching your filters.
              </div>
            ) : statusHistory
                .filter(log => {
                  const matchesSearch =
                    (log.project || '').toLowerCase().includes(historySearch.toLowerCase()) ||
                    (log.note || '').toLowerCase().includes(historySearch.toLowerCase());
                  const matchesSegment =
                    historySegmentFilter === 'all' || log.segment === historySegmentFilter;
                  return matchesSearch && matchesSegment;
                })
                .map(log => {
                  const accent = SEGMENT_COLORS[log.segment] || '#10B981';
                  return (
                    <div key={log.id} style={{
                      border: '1px solid var(--color-border-light)',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      background: 'var(--color-surface)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      cursor: 'pointer'
                    }}
                    onClick={() => { setShowHistoryModal(false); setSelectedUpdate(log); }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="kfpl-badge" style={{ background: `${accent}15`, color: accent, borderColor: `${accent}30`, fontSize: '0.65rem', padding: '2px 6px' }}>{log.segment}</span>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>
                            {log.type === 'segment' || !log.project ? 'Segment-Wide Update' : log.project}
                          </strong>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>{log.date}</span>
                      </div>
                      
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, fontStyle: 'italic' }}>
                        "{log.note || 'No notes posted.'}"
                      </p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border-light)', paddingTop: '6px', marginTop: '2px' }}>
                        <span>Status: <strong>{log.status}</strong> • Progress: <strong>{log.progress}%</strong></span>
                        {(log.media || []).length > 0 && (
                          <span style={{ color: 'var(--color-success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 12, height: 12 }}>
                              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                            </svg>
                            {log.media.length} File(s)
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </Modal>
      </div>
    </div>
  );
}
