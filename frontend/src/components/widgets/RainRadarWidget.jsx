import React from 'react';

export const RainRadarWidget = ({ config = {} }) => {
    const lat = config.lat || 52.52;
    const lon = config.lon || 13.405;
    const zoom = config.zoom || 6;

    // Using RainViewer's free map embed
    const radarUrl = `https://www.rainviewer.com/map.html?loc=${lat},${lon},${zoom}&mode=radar&menu=0&over=1&noLogo=1&id=rain-radar`;

    return (
        <div style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: 'calc(12px * var(--radius-scale, 1))', position: 'relative', background: '#000' }}>
            <iframe
                title="Rain Radar"
                src={radarUrl}
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    filter: 'grayscale(0.2) contrast(1.1) brightness(0.9)',
                }}
                allow="geolocation"
            />
            {/* Overlay to catch clicks and prevent interaction unless wanted? No, radar needs interaction for panning. 
                But Grid Layout handles drag via the handle. */}
        </div>
    );
};

export const RainRadarWidgetSettings = ({ config, setConfig }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Latitude</span>
                    <input
                        type="number"
                        step="0.0001"
                        value={config.lat || 52.52}
                        onChange={(e) => setConfig({ ...config, lat: parseFloat(e.target.value) })}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: 'calc(4px * var(--radius-scale, 1))', padding: '8px' }}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Longitude</span>
                    <input
                        type="number"
                        step="0.0001"
                        value={config.lon || 13.405}
                        onChange={(e) => setConfig({ ...config, lon: parseFloat(e.target.value) })}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: 'calc(4px * var(--radius-scale, 1))', padding: '8px' }}
                    />
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Zoom Level ({config.zoom || 6})</span>
                <input
                    type="range"
                    min="1"
                    max="15"
                    value={config.zoom || 6}
                    onChange={(e) => setConfig({ ...config, zoom: parseInt(e.target.value) })}
                    style={{ width: '100%' }}
                />
            </div>
            <p style={{ fontSize: '0.7rem', opacity: 0.5, fontStyle: 'italic' }}>
                Tip: Use Google Maps to find your exact coordinates for the center point.
            </p>
        </div>
    );
};
