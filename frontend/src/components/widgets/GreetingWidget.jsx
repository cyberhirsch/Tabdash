import React, { useState, useEffect } from 'react';

export const GreetingWidget = ({ config = {} }) => {
    const [greeting, setGreeting] = useState('');
    const name = config.name || 'Friend';

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');
    }, []);

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
            <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white',
                margin: 0,
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}>
                {greeting}, {name}.
            </h1>
        </div>
    );
};

export const GreetingWidgetSettings = ({ config, setConfig }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Your Name</span>
            <input
                type="text"
                value={config.name || ''}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: `calc(4px * var(--radius-scale, 1))`, padding: '8px' }}
                placeholder="Enter your name"
            />
        </div>
    );
};
