import React, { useEffect, useState } from 'react';
import { Rss, ExternalLink } from 'lucide-react';

// Parse a raw RSS/Atom XML string into a list of items
const parseXml = (text) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/xml');

    // RSS 2.0
    const rssItems = Array.from(doc.querySelectorAll('item'));
    if (rssItems.length > 0) {
        return rssItems.map(el => ({
            title: el.querySelector('title')?.textContent?.trim() || '',
            link: el.querySelector('link')?.textContent?.trim() || '',
            date: el.querySelector('pubDate')?.textContent?.trim() || '',
            source: doc.querySelector('channel > title')?.textContent?.trim() || '',
        }));
    }

    // Atom
    const atomItems = Array.from(doc.querySelectorAll('entry'));
    return atomItems.map(el => ({
        title: el.querySelector('title')?.textContent?.trim() || '',
        link: el.querySelector('link')?.getAttribute('href') || '',
        date: el.querySelector('updated')?.textContent?.trim() || el.querySelector('published')?.textContent?.trim() || '',
        source: doc.querySelector('feed > title')?.textContent?.trim() || '',
    }));
};

const relativeTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return '';
    const diff = (Date.now() - d) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};

const REFRESH_MS = { '5m': 300000, '30m': 1800000, '1h': 3600000 };

// Route fetches through PocketBase server to avoid CORS issues on the deployed site
const PB_URL = import.meta.env.VITE_POCKETBASE_URL || 'https://api.sebhirsch.com';
const pbProxy = (url) => `${PB_URL}/api/tabtop/proxy?url=${encodeURIComponent(url)}`;

export const RSSWidget = ({ config = {} }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const url = config.url || '';
    const refresh = REFRESH_MS[config.refresh] || 1800000;
    const maxItems = config.maxItems || 20;

    useEffect(() => {
        const fetchFeed = async () => {
            if (!url) { setLoading(false); return; }
            setLoading(true);
            try {
                let parsed = [];

                // Strategy 1: rss2json (reliable CORS proxy + JSON conversion)
                try {
                    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}&count=${maxItems}`;
                    const res = await fetch(apiUrl);
                    const data = await res.json();
                    if (data.status === 'ok' && data.items?.length) {
                        parsed = data.items.map(item => ({
                            title: item.title || '',
                            link: item.link || '',
                            date: item.pubDate || '',
                            source: data.feed?.title || '',
                        }));
                    } else {
                        throw new Error('rss2json failed');
                    }
                } catch {
                    // Strategy 2: fetch via PocketBase proxy (server-side, no CORS)
                    const res = await fetch(pbProxy(url));
                    if (!res.ok) throw new Error('proxy failed');
                    const text = await res.text();
                    parsed = parseXml(text).slice(0, maxItems);
                }

                setItems(parsed.filter(i => i.title));
            } catch {
                setItems([]);
            } finally {
                setLoading(false);
            }
        };

        setItems([]);
        setLoading(true);
        fetchFeed();
        const t = setInterval(fetchFeed, refresh);
        return () => clearInterval(t);
    }, [url, refresh, maxItems]);

    if (!url) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '8px', opacity: 0.4 }}>
            <Rss size={24} />
            <span style={{ fontSize: '0.8rem' }}>No feed URL set</span>
            <span style={{ fontSize: '0.7rem' }}>Open widget settings to add an RSS/Atom feed</span>
        </div>
    );

    if (loading && items.length === 0) return <div style={{ width: '100%', height: '100%' }} />;

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '12px 14px 8px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Rss size={13} color="var(--accent-primary)" />
                <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {items[0]?.source || 'News Feed'}
                </span>
            </div>

            {/* Articles */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {items.length === 0 && !loading && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%', opacity: 0.4, fontSize: '0.8rem' }}>
                        No items found in feed
                    </div>
                )}
                {items.map((item, i) => (
                    <a
                        key={i}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'flex', flexDirection: 'column', gap: '3px',
                            padding: '8px 6px',
                            borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                            textDecoration: 'none', color: 'inherit',
                            borderRadius: '4px',
                            transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                        <span style={{ fontSize: '0.82rem', fontWeight: '500', lineHeight: '1.3' }}>{item.title}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.4 }}>
                            <span style={{ fontSize: '0.65rem' }}>{relativeTime(item.date)}</span>
                            {item.link && <ExternalLink size={9} />}
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export const RSSWidgetSettings = ({ config, setConfig }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '600', opacity: 0.8 }}>Feed URL (RSS or Atom)</span>
            <input
                type="url"
                value={config.url || ''}
                onChange={(e) => setConfig({ ...config, url: e.target.value })}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: 'calc(8px * var(--radius-scale, 1))', padding: '10px', fontSize: '0.8rem' }}
                placeholder="https://feeds.bbci.co.uk/news/rss.xml"
            />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '600', opacity: 0.8 }}>Refresh</span>
                <select
                    value={config.refresh || '30m'}
                    onChange={(e) => setConfig({ ...config, refresh: e.target.value })}
                    style={{ background: 'var(--bg-primary)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: 'calc(8px * var(--radius-scale, 1))', padding: '10px' }}
                >
                    <option value="5m">Every 5 min</option>
                    <option value="30m">Every 30 min</option>
                    <option value="1h">Every hour</option>
                </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '600', opacity: 0.8 }}>Max items</span>
                <select
                    value={config.maxItems || 20}
                    onChange={(e) => setConfig({ ...config, maxItems: parseInt(e.target.value) })}
                    style={{ background: 'var(--bg-primary)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: 'calc(8px * var(--radius-scale, 1))', padding: '10px' }}
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>
        </div>
    </div>
);
