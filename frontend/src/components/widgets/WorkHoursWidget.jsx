import React, { useState, useEffect } from 'react';

export const WorkHoursWidget = ({ config = {} }) => {
    const [progress, setProgress] = useState(0);
    const startHour = config.startHour || 9;
    const endHour = config.endHour || 17;

    useEffect(() => {
        const updateProgress = () => {
            const now = new Date();
            const currentHour = now.getHours() + now.getMinutes() / 60;

            if (currentHour < startHour) {
                setProgress(0);
            } else if (currentHour >= endHour) {
                setProgress(100);
            } else {
                const total = endHour - startHour;
                const elapsed = currentHour - startHour;
                setProgress((elapsed / total) * 100);
            }
        };

        updateProgress();
        const interval = setInterval(updateProgress, 60000); // update every minute
        return () => clearInterval(interval);
    }, [startHour, endHour]);

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px'
        }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: 'white', opacity: 0.8 }}>Work Day Progress</h3>
            <div style={{
                width: '100%',
                height: '12px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '6px',
                overflow: 'hidden',
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: `${progress}%`,
                    background: 'var(--accent-primary)',
                    borderRadius: '6px',
                    transition: 'width 1s ease-out'
                }} />
            </div>
            <p style={{ marginTop: '12px', fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>
                {progress.toFixed(1)}%
            </p>
        </div>
    );
};

export const WorkHoursWidgetSettings = ({ config, setConfig }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Start Hour (0-23)</span>
                <input
                    type="number"
                    min="0"
                    max="23"
                    value={config.startHour || 9}
                    onChange={(e) => setConfig({ ...config, startHour: parseInt(e.target.value) })}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: `calc(4px * var(--radius-scale, 1))`, padding: '8px' }}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>End Hour (1-24)</span>
                <input
                    type="number"
                    min="1"
                    max="24"
                    value={config.endHour || 17}
                    onChange={(e) => setConfig({ ...config, endHour: parseInt(e.target.value) })}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: `calc(4px * var(--radius-scale, 1))`, padding: '8px' }}
                />
            </div>
        </div>
    );
};
