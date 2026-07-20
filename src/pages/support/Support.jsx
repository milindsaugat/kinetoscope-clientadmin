/* ============================================================
   Page: Support.jsx
   Description: Support page with contact cards, FAQ accordion
   ============================================================ */

import { useState, useEffect } from 'react';
import { apiRequest } from '../../config/apiHelper';

export default function Support() {
  const [openFaq, setOpenFaq] = useState(null);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    let isMounted = true;
    apiRequest('/api/client/faqs')
      .then(res => {
        if (!isMounted) return;
        const list = res?.faqs || res?.data?.faqs || res?.data || (Array.isArray(res) ? res : []);
        setFaqs(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        if (isMounted) setFaqs([]);
      });
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="kfpl-page">
      <div className="kfpl-page-header">
        <div className="kfpl-page-header-left">
          <h1 className="kfpl-page-title">Support</h1>
          <p className="kfpl-page-subtitle">Get help with your investment account</p>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="kfpl-support-grid">
        <a href="mailto:support@kfpl.com" className="kfpl-support-card">
          <div className="kfpl-support-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <h3>Email Support</h3>
          <p>support@kfpl.com</p>
        </a>
        <a href="tel:+919876543210" className="kfpl-support-card">
          <div className="kfpl-support-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <h3>Phone Support</h3>
          <p>+91 98765 43210</p>
        </a>
        <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="kfpl-support-card">
          <div className="kfpl-support-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          </div>
          <h3>WhatsApp</h3>
          <p>Chat with us instantly</p>
        </a>
      </div>

      {/* FAQ Accordion */}
      <div className="kfpl-card">
        <h3 style={{ marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid var(--color-gold)' }}>Frequently Asked Questions</h3>
        {faqs.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No FAQs available at the moment.
          </div>
        ) : (
          faqs.map((faq, i) => (
            <div key={i} className="kfpl-faq-item">
              <div className={`kfpl-faq-question ${openFaq === i ? 'open' : ''}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {faq.question || faq.q}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
              {openFaq === i && <div className="kfpl-faq-answer">{faq.answer || faq.a}</div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
