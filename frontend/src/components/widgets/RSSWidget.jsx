import React, { useEffect, useState } from 'react';
import { Rss } from 'lucide-react';

export const RSSWidget = ({ config = {} }) => {
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);
    const url = config.url || 'https://news.google.com/rss';

    useEffect(() => {
        // Mock RSS feed for now
        const fetchFeed = () => {
            setLoading(true);
            setTimeout(() => {
                setFeed([
                    { title: 'New Tabdash Features Live!', date: '2h ago' },
                    { title: 'Tech Trends 2026: AI Launchers', date: '5h ago' },
                    { title: 'PocketBase v0.35 released', date: '1d ago' },
                ]);
                setLoading(false);
            }, 1200);
        };
        fetchFeed();
    }, [url]);

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: '12px',
                gap: '8px',
                overflow: 'hidden'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.6 }}>
                <Rss size={14} />
                <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>News Feed</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', flex: 1 }}>
                {loading ? (
                    <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>Loading feed...</div>
                ) : feed.map((item, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingBottom: '4px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '500', lineHeight: '1.2' }}>{item.title}</span>
                        <span style={{ fontSize: '0.65rem', opacity: 0.4 }}>{item.date}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const RSSWidgetSettings = ({ config, setConfig }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>RSS Feed URL</span>
                <input
                    type="text"
                    value={config.url || ''}
                    onChange={(e) => setConfig({ ...config, url: e.target.value })}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px', padding: '8px' }}
                    placeholder="https://..."
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Refresh Interval</span>
                <select
                    value={config.refresh || '30m'}
                    onChange={(e) => setConfig({ ...config, refresh: e.target.value })}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px', padding: '4px 8px' }}
                >
                    <option value="5m">Every 5 minutes</option>
                    <option value="30m">Every 30 minutes</option>
                    <option value="1h">Every hour</option>
                </select>
            </div>
        </div>
    );
};
