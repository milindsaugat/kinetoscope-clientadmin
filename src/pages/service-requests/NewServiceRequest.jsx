/* ============================================================
   Page: NewServiceRequest.jsx
   Description: New service request form with category, subject, description, attachment
   ============================================================ */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { REQUEST_CATEGORIES } from '../../constants';

export default function NewServiceRequest() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ category: REQUEST_CATEGORIES[0], subject: '', description: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/service-requests');
  };

  return (
    <div className="kfpl-page">
      <div className="kfpl-page-header">
        <div className="kfpl-page-header-left">
          <h1 className="kfpl-page-title">New Service Request</h1>
          <p className="kfpl-page-subtitle">Describe your issue or request and we'll respond promptly</p>
        </div>
      </div>

      <div className="kfpl-form-card" style={{ maxWidth: '640px' }}>
        <form className="kfpl-form" onSubmit={handleSubmit}>
          <div className="kfpl-input-group">
            <label className="kfpl-input-label">Category <span className="required">*</span></label>
            <select className="kfpl-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {REQUEST_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="kfpl-input-group">
            <label className="kfpl-input-label">Subject <span className="required">*</span></label>
            <input className="kfpl-input" placeholder="Brief summary of your request" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
          </div>
          <div className="kfpl-input-group">
            <label className="kfpl-input-label">Description <span className="required">*</span></label>
            <textarea className="kfpl-textarea" rows={5} placeholder="Provide details about your request..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
          </div>
          <div className="kfpl-input-group">
            <label className="kfpl-input-label">Attachment (Optional)</label>
            <div className="kfpl-dropzone">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="kfpl-dropzone-icon">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <p className="kfpl-dropzone-text">Click to upload or drag & drop</p>
              <p className="kfpl-dropzone-hint">PDF, DOC, JPG, PNG (max 5MB)</p>
            </div>
          </div>
          <div className="kfpl-form-actions">
            <button type="button" className="kfpl-btn kfpl-btn--ghost" onClick={() => navigate('/service-requests')}>Cancel</button>
            <button type="submit" className="kfpl-btn kfpl-btn--primary" disabled={!form.subject || !form.description}>Submit Request</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============ END: NewServiceRequest.jsx ============ */
