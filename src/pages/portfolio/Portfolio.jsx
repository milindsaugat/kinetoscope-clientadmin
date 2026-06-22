/* ============================================================
   Page: Portfolio.jsx
   Description: KFPL portfolio with premium segment overview and project detail drawer
   ============================================================ */

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { SEGMENTS } from '../../constants';
import { mockPortfolioProjects } from '../../data/mockData';

const PROJECT_META = {
  1: {
    summary: 'Flagship feature slate moving through production with cast-led marketing upside.',
    risk: 'Medium',
    horizon: 'Q4 2025 release window',
    roi: '15%',
    update: 'Principal photography completed; post-production review in progress.',
    allocation: 'Film production, talent, post-production, release planning',
    health: 'On Track',
    accent: '#10B981',
  },
  2: {
    summary: 'Music catalogue and album pipeline with recurring streaming revenue potential.',
    risk: 'Low',
    horizon: 'Released catalogue',
    roi: '10%',
    update: 'Five albums live across streaming platforms with royalty tracking active.',
    allocation: 'Recording, artist promotion, streaming distribution',
    health: 'Completed',
    accent: '#7C3AED',
  },
  3: {
    summary: 'Distribution portfolio across domestic and digital channels with title-level monetisation.',
    risk: 'Medium',
    horizon: '18 month cycle',
    roi: '12%',
    update: 'Twelve titles under active distribution with partner reporting underway.',
    allocation: 'Rights acquisition, channel placement, distribution operations',
    health: 'Performing',
    accent: '#2563EB',
  },
  4: {
    summary: 'Curated content IP vault focused on long-term licensing and remake value.',
    risk: 'Low',
    horizon: '24 month cycle',
    roi: '14%',
    update: 'Acquisition review running across shortlisted content properties.',
    allocation: 'IP acquisition, legal diligence, catalogue management',
    health: 'Building',
    accent: '#0F766E',
  },
  5: {
    summary: 'Trade and syndication desk for packaging content opportunities into deal flow.',
    risk: 'Medium',
    horizon: '12 month cycle',
    roi: '13%',
    update: 'Eight active deals in negotiation and syndication review.',
    allocation: 'Deal sourcing, syndication desk, commercial coordination',
    health: 'Active',
    accent: '#F59E0B',
  },
  6: {
    summary: 'Cinema exhibition rollout planned across priority micro-markets.',
    risk: 'Medium High',
    horizon: 'Planning phase',
    roi: '11%',
    update: 'Three locations under feasibility, lease, and operations planning.',
    allocation: 'Site diligence, setup planning, launch operations',
    health: 'Planned',
    accent: '#0891B2',
  },
};

const SEGMENT_ABBR = {
  'Film Making': 'FM',
  Distribution: 'DS',
  Music: 'MS',
  'Trading & Syndication': 'TS',
  'Content IP Bank': 'IP',
  'Film Exhibition': 'EX',
};

function cleanValue(value) {
  return value.replace(/^.+?(?=\d)/, '\u20B9');
}

function parseCroreValue(value) {
  const cleaned = cleanValue(value);
  const match = cleaned.match(/([\d.]+)\s*(Cr|L)/i);

  if (!match) return 0;

  const number = Number(match[1]);
  return match[2].toLowerCase() === 'cr' ? number : number / 100;
}

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState('All');
  const [drawerProject, setDrawerProject] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('kfpl_portfolio_projects');
    if (stored) {
      setProjects(JSON.parse(stored));
    } else {
      setProjects(mockPortfolioProjects);
    }
  }, []);

  useEffect(() => {
    if (!drawerProject) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [drawerProject]);

  const enrichedProjects = useMemo(() => {
    return projects.map(project => ({
      ...project,
      ...PROJECT_META[project.id],
      valueLabel: cleanValue(project.value || '₹0 Cr'),
      valueCr: parseCroreValue(project.value || '₹0 Cr'),
      initials: SEGMENT_ABBR[project.segment] || project.name.slice(0, 2).toUpperCase(),
    }));
  }, [projects]);

  const filteredProjects = activeTab === 'All'
    ? enrichedProjects
    : enrichedProjects.filter(project => project.segment === activeTab);

  const totalValue = enrichedProjects.reduce((sum, project) => sum + project.valueCr, 0);
  const averageProgress = Math.round(
    enrichedProjects.reduce((sum, project) => sum + project.milestone, 0) / enrichedProjects.length
  );
  const activeProjects = enrichedProjects.filter(project => !['Released', 'Planned'].includes(project.status)).length;
  const completedProjects = enrichedProjects.filter(project => project.milestone >= 100).length;

  const summaryCards = [
    { label: 'Portfolio Value', value: `\u20B9${totalValue.toFixed(1)} Cr`, meta: 'Across active KFPL assets' },
    { label: 'Live Projects', value: enrichedProjects.length, meta: `${activeProjects} currently in motion` },
    { label: 'Avg. Milestone', value: `${averageProgress}%`, meta: 'Weighted by active project count' },
    { label: 'Completed', value: completedProjects, meta: 'Released or fully delivered' },
  ];

  const drawer = drawerProject && createPortal(
    <>
      <div className="kfpl-drawer-overlay kfpl-portfolio-drawer-overlay" onClick={() => setDrawerProject(null)}></div>
      <aside className="kfpl-drawer kfpl-portfolio-drawer" aria-label={`${drawerProject.name} details`}>
        <div className="kfpl-drawer-header kfpl-portfolio-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', paddingTop: '4px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{drawerProject.name}</h2>
            <span className="kfpl-portfolio-segment" style={{ marginTop: 0 }}>{drawerProject.segment}</span>
          </div>
          <button className="kfpl-modal-close" onClick={() => setDrawerProject(null)} aria-label="Close project details">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="kfpl-drawer-body kfpl-portfolio-drawer-body" style={{ '--portfolio-accent': drawerProject.accent }}>
          <div className="kfpl-portfolio-drawer-visual" style={{
            backgroundImage: drawerProject.bannerImg ? `linear-gradient(rgba(6, 29, 19, 0.5), rgba(6, 29, 19, 0.8)), url(${drawerProject.bannerImg})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>
            <span>{drawerProject.initials}</span>
            <div>
              <strong>{drawerProject.valueLabel}</strong>
              <small>Portfolio value</small>
            </div>
          </div>

          <p className="kfpl-portfolio-drawer-summary">{drawerProject.summary}</p>

          <div className="kfpl-portfolio-drawer-kpis">
            <div>
              <span>Status</span>
              <strong>{drawerProject.status}</strong>
            </div>
            <div>
              <span>Target ROI</span>
              <strong>{drawerProject.roi}</strong>
            </div>
            <div>
              <span>Risk</span>
              <strong>{drawerProject.risk}</strong>
            </div>
            <div>
              <span>Horizon</span>
              <strong>{drawerProject.horizon}</strong>
            </div>
            <div>
              <span>Segment</span>
              <strong>{drawerProject.segment}</strong>
            </div>
            <div>
              <span>Health</span>
              <strong>{drawerProject.health}</strong>
            </div>
          </div>

          <div className="kfpl-portfolio-drawer-section">
            <h3>Milestone Progress</h3>
            <div className="kfpl-portfolio-progress-row">
              <span>{drawerProject.health}</span>
              <strong>{drawerProject.milestone}%</strong>
            </div>
            <div className="kfpl-progress kfpl-portfolio-drawer-progress">
              <div className="kfpl-progress-fill" style={{ width: `${drawerProject.milestone}%` }}></div>
            </div>
          </div>

          <div className="kfpl-portfolio-drawer-section">
            <h3>Current Update</h3>
            <p>{drawerProject.update}</p>
          </div>

          <div className="kfpl-portfolio-drawer-section">
            <h3>Allocation Focus</h3>
            <p>{drawerProject.allocation}</p>
          </div>
        </div>
      </aside>
    </>,
    document.body
  );

  return (
    <div className="kfpl-page kfpl-portfolio-page">
      <section className="kfpl-portfolio-hero">
        <div className="kfpl-portfolio-hero-copy">
          <span className="kfpl-portfolio-eyebrow">Investor portfolio</span>
          <h1 className="kfpl-page-title">KFPL Portfolio</h1>
          <p className="kfpl-page-subtitle">
            Explore project health, segment exposure, milestone progress, and current operational updates.
          </p>
        </div>
        <div className="kfpl-portfolio-hero-panel">
          <span className="kfpl-portfolio-hero-label">Portfolio Coverage</span>
          <strong>{SEGMENTS.length}</strong>
          <span>Entertainment investment segments</span>
        </div>
      </section>

      <section className="kfpl-portfolio-summary" aria-label="Portfolio summary">
        {summaryCards.map(card => (
          <div key={card.label} className="kfpl-portfolio-summary-card">
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <small>{card.meta}</small>
          </div>
        ))}
      </section>

      <section className="kfpl-portfolio-toolbar" aria-label="Portfolio filters">
        <div className="kfpl-portfolio-tabs">
          {['All', ...SEGMENTS].map(tab => {
            const count = tab === 'All'
              ? enrichedProjects.length
              : enrichedProjects.filter(project => project.segment === tab).length;

            return (
              <button
                key={tab}
                type="button"
                className={`kfpl-portfolio-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                <span>{tab}</span>
                <small>{count}</small>
              </button>
            );
          })}
        </div>
      </section>

      <section className="kfpl-portfolio-grid" aria-label="Portfolio projects">
        {filteredProjects.map(project => (
          <button
            key={project.id}
            type="button"
            className="kfpl-portfolio-card"
            style={{ '--portfolio-accent': project.accent }}
            onClick={() => setDrawerProject(project)}
          >
            <div className="kfpl-portfolio-card-media" style={{
              backgroundImage: project.bannerImg ? `linear-gradient(rgba(6, 29, 19, 0.5), rgba(6, 29, 19, 0.8)), url(${project.bannerImg})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}>
              <span className="kfpl-portfolio-card-initials">{project.initials}</span>
              <span className="kfpl-portfolio-card-status">{project.health}</span>
            </div>

            <div className="kfpl-portfolio-card-body">
              <div className="kfpl-portfolio-card-topline">
                <span className="kfpl-portfolio-segment">{project.segment}</span>
                <strong>{project.valueLabel}</strong>
              </div>

              <h2>{project.name}</h2>
              <p>{project.summary}</p>

              <div className="kfpl-portfolio-metrics">
                <div>
                  <span>Status</span>
                  <strong>{project.status}</strong>
                </div>
                <div>
                  <span>Target ROI</span>
                  <strong>{project.roi}</strong>
                </div>
                <div>
                  <span>Risk</span>
                  <strong>{project.risk}</strong>
                </div>
              </div>

              <div className="kfpl-portfolio-progress-row">
                <span>Milestone Progress</span>
                <strong>{project.milestone}%</strong>
              </div>
              <div className="kfpl-progress">
                <div className="kfpl-progress-fill" style={{ width: `${project.milestone}%` }}></div>
              </div>
            </div>
          </button>
        ))}
      </section>

      {drawer}
    </div>
  );
}

/* ============ END: Portfolio.jsx ============ */
