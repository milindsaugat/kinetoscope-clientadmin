/* ============================================================
   Page: FAQPage.jsx
   Description: Displays FAQs for clients in a beautiful accordion layout.
                Reads from localStorage (kfpl_faqs) set by super-admin.
   ============================================================ */

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'kfpl_faqs';
const PORTAL_TYPE = 'client';

// Default sample FAQs if none are set by admin
const defaultFAQs = [
  {
    id: 'default-1',
    question: 'How is my monthly ROI calculated?',
    answer: 'Your monthly ROI is calculated based on your investment amount and the agreed ROI percentage in your contract. The returns are processed at the end of each month and reflected in your dashboard.',
    target: 'client',
    priority: 0
  },
  {
    id: 'default-2',
    question: 'How can I request a withdrawal?',
    answer: 'Navigate to the "Payment Requests" section from the sidebar. Click on "New Request", select "Withdrawal", enter the amount, and submit. Your request will be reviewed by the admin team and processed within 3-5 business days.',
    target: 'client',
    priority: 1
  },
  {
    id: 'default-3',
    question: 'What documents are required for KYC verification?',
    answer: 'For Indian nationals: PAN Card, Aadhaar Card, and Bank Account details. For international investors: Passport/ID, Tax ID/SSN, and Bank Account details. You can upload these during onboarding or from your Profile page.',
    target: 'both',
    priority: 2
  },
  {
    id: 'default-4',
    question: 'How do I contact support?',
    answer: 'You can raise a service request from the "Service Requests" section in the sidebar. Alternatively, you can email us at support@kinetoscope.com or call our helpline during business hours.',
    target: 'both',
    priority: 3
  },
];

export default function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      const filtered = parsed.filter(f => f.target === PORTAL_TYPE || f.target === 'both');
      setFaqs(filtered.length > 0 ? filtered : defaultFAQs.filter(f => f.target === PORTAL_TYPE || f.target === 'both'));
    } catch {
      setFaqs(defaultFAQs.filter(f => f.target === PORTAL_TYPE || f.target === 'both'));
    }
  }, []);

  const filtered = searchQuery
    ? faqs.filter(f =>
        f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  return (
    <div className="kfpl-page">
      <div className="kfpl-page-header">
        <div className="kfpl-page-header-left">
          <h2 className="kfpl-page-title">Frequently Asked Questions</h2>
          <p className="kfpl-page-subtitle">Find answers to common questions about your investments and account</p>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ position: 'relative', maxWidth: '480px' }}>
          <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: 'var(--color-text-muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="kfpl-input"
            style={{ paddingLeft: '42px' }}
          />
        </div>
      </div>

      {/* FAQ Accordion */}
      {filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          background: 'var(--color-surface)', borderRadius: '12px',
          border: '1px solid var(--color-border)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
          <h3 style={{ color: 'var(--color-navy)', fontWeight: 700, marginBottom: '6px' }}>No results found</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Try a different search term
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map((faq, idx) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                style={{
                  background: 'var(--color-surface)',
                  border: isExpanded ? '1px solid var(--color-gold, #10B981)' : '1px solid var(--color-border)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 0.25s ease',
                  boxShadow: isExpanded ? '0 4px 20px rgba(16, 185, 129, 0.08)' : 'none'
                }}
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '18px 22px', cursor: 'pointer', userSelect: 'none'
                  }}
                >
                  <span style={{
                    width: '32px', height: '32px', borderRadius: '10px',
                    background: isExpanded ? 'linear-gradient(135deg, var(--color-gold, #10B981) 0%, var(--color-gold-dark, #059669) 100%)' : 'rgba(16, 185, 129, 0.08)',
                    color: isExpanded ? '#fff' : 'var(--color-gold, #10B981)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '0.8rem', flexShrink: 0,
                    transition: 'all 0.25s ease'
                  }}>
                    {idx + 1}
                  </span>
                  <span style={{
                    flex: 1, fontWeight: 600,
                    color: isExpanded ? 'var(--color-gold, #10B981)' : 'var(--color-navy)',
                    fontSize: '0.9375rem', transition: 'color 0.25s ease'
                  }}>
                    {faq.question}
                  </span>
                  <span style={{
                    transition: 'transform 0.3s ease',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                    color: isExpanded ? 'var(--color-gold, #10B981)' : 'var(--color-text-muted)',
                    flexShrink: 0
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </span>
                </div>

                <div style={{
                  maxHeight: isExpanded ? '500px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.35s ease',
                }}>
                  <div style={{
                    padding: '0 22px 20px 68px',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.875rem',
                    lineHeight: '1.7',
                    borderTop: '1px solid var(--color-border)',
                  }}>
                    <div style={{ paddingTop: '16px', whiteSpace: 'pre-wrap' }}>{faq.answer}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{
        textAlign: 'center', marginTop: '32px', padding: '20px',
        color: 'var(--color-text-muted)', fontSize: '0.8125rem'
      }}>
        Can't find what you're looking for? <a href="/service-requests/new" style={{ color: 'var(--color-gold, #10B981)', fontWeight: 600, textDecoration: 'none' }}>Contact Support →</a>
      </div>
    </div>
  );
}

/* ============ END: FAQPage.jsx ============ */
