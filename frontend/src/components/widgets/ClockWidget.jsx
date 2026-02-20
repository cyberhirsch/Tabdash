import React, { useState, useEffect } from 'react';
import { Clock as ClockIcon } from 'lucide-react';

export const ClockWidget = ({ config }) => {
    const [time, setTime] = useState(new Date());
    const isAnalog = config?.mode === 'analog';

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const timeString = time.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: config?.showSeconds ? '2-digit' : undefined,
        hour12: config?.hour12 ?? false
    });
    const dateString = config?.showDate !== false ? time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }) : null;

    if (isAnalog) {
        const seconds = time.getSeconds() * 6;
        const minutes = (time.getMinutes() + time.getSeconds() / 60) * 6;
        const hours = (time.getHours() % 12) * 30 + (time.getMinutes() / 60) * 30;

        return (
            <div className="clock-analog" style={{
                width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'
            }}>
                <div style={{
                    width: 'min(85%, 160px)',
                    aspectRatio: '1/1',
                    border: '2px solid rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    position: 'relative',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
                }}>
                    {/* Hour Markers */}
                    {[...Array(12)].map((_, i) => (
                        <div key={i} style={{
                            position: 'absolute', width: '2px', height: '6px', background: i % 3 === 0 ? 'white' : 'rgba(255,255,255,0.3)',
                            left: '50%', top: '4px', transformOrigin: '50% 76px', // Adjusted for 160px max size
                            transform: `translateX(-50%) rotate(${i * 30}deg)`
                        }} />
                    ))}

                    {/* Hands */}
                    <div style={{ position: 'absolute', width: '4px', height: '25%', background: 'white', bottom: '50%', left: '50%', transformOrigin: 'bottom', borderRadius: '4px', transform: `translateX(-50%) rotate(${hours}deg)`, transition: 'transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 0.44)' }} />
                    <div style={{ position: 'absolute', width: '3px', height: '35%', background: 'rgba(255,255,255,0.7)', bottom: '50%', left: '50%', transformOrigin: 'bottom', borderRadius: '3px', transform: `translateX(-50%) rotate(${minutes}deg)`, transition: 'transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 0.44)' }} />
                    <div style={{ position: 'absolute', width: '1.5px', height: '40%', background: 'var(--accent-primary)', bottom: '50%', left: '50%', transformOrigin: 'bottom', borderRadius: '2px', transform: `translateX(-50%) rotate(${seconds}deg)`, transition: seconds === 0 ? 'none' : 'transform 0.2s cubic-bezier(0.4, 2.08, 0.55, 0.44)' }} />

                    {/* Center Dot */}
                    <div style={{ position: 'absolute', width: '8px', height: '8px', background: 'white', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', borderRadius: '50%', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }} />
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '12px',
            }}
        >
            <div style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px', lineHeight: '1' }}>
                {timeString}
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: '500', opacity: 0.6, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {dateString}
            </div>
        </div>
    );
};

export const ClockWidgetSettings = ({ config, setConfig }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Time Format</span>
                <select
                    value={config.hour12 ? '12h' : '24h'}
                    onChange={(e) => setConfig({ ...config, hour12: e.target.value === '12h' })}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px', padding: '4px 8px' }}
                >
                    <option value="24h">24 Hour</option>
                    <option value="12h">12 Hour (AM/PM)</option>
                </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Clock Mode</span>
                <select
                    value={config.mode || 'digital'}
                    onChange={(e) => setConfig({ ...config, mode: e.target.value })}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px', padding: '4px 8px' }}
                >
                    <option value="digital">Digital</option>
                    <option value="analog">Analog</option>
                </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Show Seconds</span>
                <input
                    type="checkbox"
                    checked={config.showSeconds}
                    onChange={(e) => setConfig({ ...config, showSeconds: e.target.checked })}
                    style={{ accentColor: 'var(--accent-primary)' }}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Show Date</span>
                <input
                    type="checkbox"
                    checked={config.showDate !== false}
                    onChange={(e) => setConfig({ ...config, showDate: e.target.checked })}
                    style={{ accentColor: 'var(--accent-primary)' }}
                />
            </div>
        </div>
    );
};
