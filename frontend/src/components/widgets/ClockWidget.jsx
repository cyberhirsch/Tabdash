import React, { useState, useEffect } from 'react';
import { Clock as ClockIcon } from 'lucide-react';

export const ClockWidget = ({ config }) => {
    const [time, setTime] = useState(new Date());
    const isAnalog = config?.mode === 'analog';

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const dateString = time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

    if (isAnalog) {
        // Simple CSS Clock representation
        const seconds = time.getSeconds() * 6;
        const minutes = time.getMinutes() * 6;
        const hours = (time.getHours() % 12) * 30 + minutes / 12;

        return (
            <div className="clock-analog" style={{
                width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '20px'
            }}>
                <div style={{
                    width: '120px', height: '120px', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '50%', position: 'relative'
                }}>
                    <div style={{ position: 'absolute', width: '2px', height: '40px', background: 'white', bottom: '50%', left: '50%', transformOrigin: 'bottom', transform: `translateX(-50%) rotate(${hours}deg)` }} />
                    <div style={{ position: 'absolute', width: '2px', height: '55px', background: 'rgba(255,255,255,0.6)', bottom: '50%', left: '50%', transformOrigin: 'bottom', transform: `translateX(-50%) rotate(${minutes}deg)` }} />
                    <div style={{ position: 'absolute', width: '1px', height: '60px', background: 'var(--accent-primary)', bottom: '50%', left: '50%', transformOrigin: 'bottom', transform: `translateX(-50%) rotate(${seconds}deg)` }} />
                    <div style={{ position: 'absolute', width: '6px', height: '6px', background: 'white', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', borderRadius: '50%' }} />
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
