/* ============================================================
   Page: MediaFeed.jsx
   Description: Blog/News feed grid with category filter
   ============================================================ */

import { useState } from 'react';
import { mockMedia } from '../../data/mockData';

export default function MediaFeed() {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', ...new Set(mockMedia.map(m => m.category))];
  const filtered = activeCategory === 'All' ? mockMedia : mockMedia.filter(m => m.category === activeCategory);

  return (
    <div className="kfpl-page">
      <div className="kfpl-page-header">
        <div className="kfpl-page-header-left">
          <h1 className="kfpl-page-title">Media & News</h1>
          <p className="kfpl-page-subtitle">Latest updates from KFPL and the entertainment industry</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="kfpl-filter-chips" style={{ marginBottom: '24px' }}>
        {categories.map(cat => (
          <div key={cat} className={`kfpl-filter-chip ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>{cat}</div>
        ))}
      </div>

      {/* Media Grid */}
      <div className="kfpl-media-grid">
        {filtered.map(article => (
          <div key={article.id} className="kfpl-media-card">
            <div className="kfpl-media-card-img">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
            <div className="kfpl-media-card-body">
              <div className="kfpl-media-card-tag">{article.category}</div>
              <h4 className="kfpl-media-card-title">{article.title}</h4>
              <p className="kfpl-media-card-excerpt">{article.excerpt}</p>
              <p className="kfpl-media-card-date">{new Date(article.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ END: MediaFeed.jsx ============ */
