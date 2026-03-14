import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

export const IpInfoWidget = ({ config = {} }) => {
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIp = async () => {
            setLoading(true);
            try {
                const res = await fetch('https://ipinfo.io/json');
                if (res.ok) {
                    const data = await res.json();
                    setInfo(data);
                }
            } catch (err) {
                console.error("Failed to fetch IP info", err);
            }
            setLoading(false);
        };
        fetchIp();
    }, []);

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px',
            textAlign: 'center'
        }}>
            <Globe size={28} style={{ opacity: 0.6, marginBottom: '12px' }} color="var(--accent-primary)" />
            {loading ? (
                <p style={{ opacity: 0.5 }}>Fetching IP...</p>
            ) : info ? (
                <>
                    <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'white', fontWeight: 'bold' }}>{info.ip}</h2>
                    <div style={{ marginTop: '8px', fontSize: '1rem', color: 'white', opacity: 0.8 }}>
                        {config.displayCity !== false && info.city && <span>{info.city}, </span>}
                        {config.displayCountry !== false && info.country && <span>{info.country}</span>}
                    </div>
                    {info.org && <div style={{ marginTop: '4px', fontSize: '0.8rem', opacity: 0.5 }}>{info.org}</div>}
                </>
            ) : (
                <p style={{ color: '#ff4444' }}>Unable to load IP</p>
            )}
        </div>
    );
};

export const IpInfoWidgetSettings = ({ config, setConfig }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'white' }}>
                <input
                    type="checkbox"
                    checked={config.displayCity !== false}
                    onChange={(e) => setConfig({ ...config, displayCity: e.target.checked })}
                    style={{ accentColor: 'var(--accent-primary)' }}
                />
                <span style={{ fontSize: '0.9rem' }}>Display City</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'white' }}>
                <input
                    type="checkbox"
                    checked={config.displayCountry !== false}
                    onChange={(e) => setConfig({ ...config, displayCountry: e.target.checked })}
                    style={{ accentColor: 'var(--accent-primary)' }}
                />
                <span style={{ fontSize: '0.9rem' }}>Display Country</span>
            </label>
        </div>
    );
};
