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
            className="glass"
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: '12px',
                borderRadius: '16px',
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
