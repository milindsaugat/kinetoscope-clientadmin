/* ============================================================
   Page: InvestmentOverview.jsx
   Description: Investment module with allocation chart, ROI table, calculator, dividend bonus
   ============================================================ */

import { useState } from 'react';
import { mockInvestments, mockROIHistory, mockTotalInvested, mockDividendBonus, mockClient } from '../../data/mockData';

const CHART_COLORS = ['#10B981', '#0F766E', '#2563EB', '#F59E0B', '#7C3AED', '#0891B2'];

export default function InvestmentOverview() {
  const [roiFilter, setRoiFilter] = useState('All');
  const [calcPrincipal, setCalcPrincipal] = useState(6000000);
  const [calcRate, setCalcRate] = useState(13.5);

  const formatAmount = (num) => {
    if (num >= 10000000) return `\u20B9${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `\u20B9${(num / 100000).toFixed(1)} L`;
    return `\u20B9${num.toLocaleString('en-IN')}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const total = mockInvestments.reduce((sum, investment) => sum + investment.amount, 0);
  const monthlyReturn = Math.round((calcPrincipal * calcRate) / 100 / 12);
  const annualReturn = Math.round((calcPrincipal * calcRate) / 100);
  const weightedROI = total
    ? mockInvestments.reduce((sum, investment) => sum + investment.amount * investment.roiAllocated, 0) / total
    : 0;
  const receivedROI = mockROIHistory.reduce((sum, roi) => sum + roi.received, 0);
  const paidMonths = mockROIHistory.filter(roi => roi.status === 'Paid').length;

  let cumulativePercent = 0;
  const segments = mockInvestments.map((investment, index) => {
    const percent = (investment.amount / total) * 100;
    const start = cumulativePercent;
    cumulativePercent += percent;

    return {
      ...investment,
      percent,
      dashArray: `${percent * 2.51327} ${251.327 - percent * 2.51327}`,
      dashOffset: -(start * 2.51327),
      color: CHART_COLORS[index % CHART_COLORS.length],
    };
  });

  const filteredROI = roiFilter === 'All' ? mockROIHistory : mockROIHistory.filter(roi => roi.status === roiFilter);
  const summaryCards = [
    { label: 'Total Invested', value: formatAmount(mockTotalInvested), meta: `${mockInvestments.length} active segments` },
    { label: 'Monthly ROI', value: formatAmount(monthlyReturn), meta: `${calcRate}% annual projection` },
    { label: 'Weighted ROI', value: `${weightedROI.toFixed(1)}%`, meta: 'Allocated across portfolio' },
    { label: 'ROI Received', value: formatAmount(receivedROI), meta: `${paidMonths} payouts completed` },
  ];

  return (
    <div className="kfpl-page kfpl-investment-page">
      <div className="kfpl-page-header">
        <div className="kfpl-page-header-left">
          <h1 className="kfpl-page-title">Your Investment</h1>
          <p className="kfpl-page-subtitle">Track your investment allocation, ROI, and bonuses</p>
        </div>
      </div>

      <section className="kfpl-investment-summary" aria-label="Investment summary">
        {summaryCards.map(card => (
          <div key={card.label} className="kfpl-investment-summary-card">
            <span className="kfpl-investment-summary-label">{card.label}</span>
            <strong className="kfpl-investment-summary-value">{card.value}</strong>
            <span className="kfpl-investment-summary-meta">{card.meta}</span>
          </div>
        ))}
      </section>

      <div className="kfpl-investment-analytics">
        <div className="kfpl-chart-card kfpl-investment-card kfpl-investment-allocation-card">
          <div className="kfpl-chart-card-header">
            <div>
              <h3 className="kfpl-chart-card-title">Segment Allocation</h3>
              <p className="kfpl-investment-card-subtitle">Portfolio split by active investment category</p>
            </div>
            <span className="kfpl-investment-total">{formatAmount(total)}</span>
          </div>

          <div className="kfpl-donut-container">
            <div className="kfpl-donut-chart">
              <svg viewBox="0 0 100 100" role="img" aria-label="Investment segment allocation chart">
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-surface-alt)" strokeWidth="16" />
                {segments.map((segment, index) => (
                  <circle
                    key={index}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={segment.color}
                    strokeWidth="16"
                    strokeDasharray={segment.dashArray}
                    strokeDashoffset={segment.dashOffset}
                    className="kfpl-investment-donut-segment"
                  />
                ))}
              </svg>

              <div className="kfpl-donut-center">
                <div className="kfpl-donut-center-value">{mockInvestments.length}</div>
                <div className="kfpl-donut-center-label">Segments</div>
              </div>
            </div>

            <div className="kfpl-investment-legend">
              {segments.map((segment, index) => (
                <div key={index} className="kfpl-investment-legend-item">
                  <div className="kfpl-chart-legend-dot" style={{ background: segment.color }}></div>
                  <div className="kfpl-investment-legend-copy">
                    <span className="kfpl-chart-legend-label">{segment.segment}</span>
                    <span className="kfpl-investment-legend-amount">{formatAmount(segment.amount)}</span>
                  </div>
                  <span className="kfpl-chart-legend-value">{segment.percent.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="kfpl-calculator kfpl-investment-card">
          <div className="kfpl-investment-card-heading">
            <h3 className="kfpl-chart-card-title">ROI Calculator</h3>
            <p className="kfpl-investment-card-subtitle">Estimate projected returns from any principal amount</p>
          </div>

          <div className="kfpl-form-section kfpl-investment-calculator-fields">
            <div className="kfpl-input-group">
              <label className="kfpl-input-label">Principal Amount ({'\u20B9'})</label>
              <input
                type="number"
                className="kfpl-input"
                value={calcPrincipal}
                onChange={event => setCalcPrincipal(Number(event.target.value))}
              />
            </div>

            <div className="kfpl-input-group">
              <label className="kfpl-input-label">ROI Rate (% per annum)</label>
              <input
                type="number"
                className="kfpl-input"
                value={calcRate}
                onChange={event => setCalcRate(Number(event.target.value))}
                step="0.5"
              />
            </div>
          </div>

          <div className="kfpl-calculator-result">
            <div className="kfpl-calculator-result-label">Monthly Returns</div>
            <div className="kfpl-calculator-result-value">{formatAmount(monthlyReturn)}</div>
            <div className="kfpl-calculator-result-label kfpl-calculator-result-note">
              Annual Returns: {formatAmount(annualReturn)}
            </div>
          </div>
        </div>
      </div>

      <div className="kfpl-table-wrapper kfpl-investment-table">
        <div className="kfpl-table-header">
          <div>
            <h3 className="kfpl-table-title">Investment by Segment</h3>
            <p className="kfpl-investment-card-subtitle">Contract status, allocation, and received ROI by category</p>
          </div>
        </div>

        <div className="kfpl-table-container">
          <table className="kfpl-table">
            <thead>
              <tr>
                <th>Segment</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Contract</th>
                <th>ROI Allocated</th>
                <th>ROI Received</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockInvestments.map(investment => (
                <tr key={investment.id}>
                  <td className="kfpl-table-cell-primary">{investment.segment}</td>
                  <td className="kfpl-table-cell-mono">{formatAmount(investment.amount)}</td>
                  <td>{formatDate(investment.date)}</td>
                  <td>{investment.contractPeriod}</td>
                  <td><strong>{investment.roiAllocated}%</strong></td>
                  <td className="kfpl-investment-positive">{investment.roiReceived}%</td>
                  <td><span className="kfpl-badge kfpl-badge--active">{investment.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="kfpl-table-wrapper kfpl-investment-table">
        <div className="kfpl-table-header">
          <div>
            <h3 className="kfpl-table-title">Monthly ROI History</h3>
            <p className="kfpl-investment-card-subtitle">Expected versus credited return history</p>
          </div>

          <div className="kfpl-filter-chips">
            {['All', 'Paid', 'Pending'].map(filter => (
              <button
                key={filter}
                type="button"
                className={`kfpl-filter-chip ${roiFilter === filter ? 'active' : ''}`}
                onClick={() => setRoiFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="kfpl-table-container">
          <table className="kfpl-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Expected</th>
                <th>Received</th>
                <th>Payment Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredROI.map((roi, index) => (
                <tr key={index}>
                  <td className="kfpl-table-cell-primary">{roi.month}</td>
                  <td className="kfpl-table-cell-mono">{formatAmount(roi.expected)}</td>
                  <td className="kfpl-table-cell-mono">{roi.received > 0 ? formatAmount(roi.received) : '\u2014'}</td>
                  <td>{formatDate(roi.date)}</td>
                  <td><span className={`kfpl-badge kfpl-badge--${roi.status.toLowerCase()}`}>{roi.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Agent Commission Section */}
      {mockClient.agentCommission && (
        <div className="kfpl-table-wrapper kfpl-investment-table">
          <div className="kfpl-table-header">
            <div>
              <h3 className="kfpl-table-title">Agent Commission</h3>
              <p className="kfpl-investment-card-subtitle">Commission earned by your agent ({mockClient.agentName}) on your investment</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{
                background: 'var(--color-surface-alt, #f0fdf4)', borderRadius: '10px',
                padding: '8px 16px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>One-Time</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-success)' }}>{mockClient.agentCommission.oneTimePercent}%</div>
              </div>
              <div style={{
                background: 'var(--color-surface-alt, #eff6ff)', borderRadius: '10px',
                padding: '8px 16px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Monthly</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-navy, #1565C0)' }}>{mockClient.agentCommission.monthlyPercent}%</div>
              </div>
              <div style={{
                background: 'var(--color-surface-alt, #fef3c7)', borderRadius: '10px',
                padding: '8px 16px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Total Paid</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-gold-dark, #B8860B)' }}>{formatAmount(mockClient.agentCommission.totalPaid)}</div>
              </div>
            </div>
          </div>

          <div className="kfpl-table-container">
            <table className="kfpl-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockClient.agentCommission.history.map(com => (
                  <tr key={com.id}>
                    <td className="kfpl-table-cell-primary">{com.month}</td>
                    <td>{new Date(com.date).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                    <td className="kfpl-table-cell-mono">{formatAmount(com.amount)}</td>
                    <td><span className={`kfpl-badge kfpl-badge--${com.status.toLowerCase()}`}>{com.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {mockDividendBonus && (
        <div className="kfpl-dividend-card">
          <div className="kfpl-dividend-card-icon" aria-hidden="true">{'\u20B9'}</div>
          <div className="kfpl-dividend-card-content">
            <h3>Dividend Bonus Credited</h3>
            <p>
              {formatAmount(mockDividendBonus.amount)} from {mockDividendBonus.project} ({mockDividendBonus.segment})
            </p>
            <p className="kfpl-dividend-card-note">
              Credited on {new Date(mockDividendBonus.creditDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} {'\u2014'} {mockDividendBonus.adminNote}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============ END: InvestmentOverview.jsx ============ */
