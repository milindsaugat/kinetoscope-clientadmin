/* ============================================================
   Page: MediaFeed.jsx
   Description: Blog/News feed grid with category filter
   ============================================================ */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockMedia } from '../../data/mockData';
import { getArticleCover } from './MediaDetail';

export default function MediaFeed() {
  const [articles] = useState(() => {
    try {
      const stored = localStorage.getItem('kfpl_news_media');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load news media from localStorage', e);
    }
    return mockMedia;
  });

  const [activeCategory, setActiveCategory] = useState('All');

  // Only display published articles
  const publishedArticles = articles.filter(a => a.status === 'Published' || !a.status);

  const categories = ['All', ...new Set(publishedArticles.map(m => m.category))];
  const filtered = activeCategory === 'All' ? publishedArticles : publishedArticles.filter(m => m.category === activeCategory);

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
          <Link key={article.id} to={`/media/${article.id}`} className="kfpl-media-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            {getArticleCover(article) && (
              <div className="kfpl-media-card-img">
                <img src={getArticleCover(article)} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <div className="kfpl-media-card-body">
              <div className="kfpl-media-card-tag">{article.category}</div>
              <h4 className="kfpl-media-card-title">{article.title}</h4>
              <p className="kfpl-media-card-excerpt">{article.excerpt}</p>
              <p className="kfpl-media-card-date">{new Date(article.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ============ END: MediaFeed.jsx ============ */
