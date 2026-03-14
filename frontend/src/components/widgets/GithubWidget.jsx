import React from 'react';

export const GithubWidget = ({ config = {} }) => {
    const username = config.username || 'joelshepherd';

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px',
            overflow: 'hidden'
        }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: 'var(--accent-primary)' }}>GitHub Activity</h3>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <img
                    src={`https://ghchart.rshah.org/409ba5/${username}`}
                    alt={`${username}'s Github Chart`}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'hue-rotate(180deg) invert(1) opacity(0.8)' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                />
            </div>
            <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'white', marginTop: '8px', opacity: 0.6, textDecoration: 'none' }}>
                @{username}
            </a>
        </div>
    );
};

export const GithubWidgetSettings = ({ config, setConfig }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Username</span>
            <input
                type="text"
                value={config.username || ''}
                onChange={(e) => setConfig({ ...config, username: e.target.value })}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: `calc(4px * var(--radius-scale, 1))`, padding: '8px' }}
                placeholder="Enter GitHub username"
            />
        </div>
    );
};
