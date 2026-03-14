import React, { useState } from 'react';

export const MessageWidget = ({ config = {} }) => {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px',
            textAlign: 'center'
        }}>
            <h1 style={{
                fontSize: `${config.size || 2}rem`,
                fontWeight: config.weight || 'bold',
                color: 'white',
                margin: 0,
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}>
                {config.message || 'Have a great day!'}
            </h1>
        </div>
    );
};

export const MessageWidgetSettings = ({ config, setConfig }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Message</span>
                <input
                    type="text"
                    value={config.message || ''}
                    onChange={(e) => setConfig({ ...config, message: e.target.value })}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: `calc(4px * var(--radius-scale, 1))`, padding: '8px' }}
                    placeholder="Enter your message"
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Size (rem)</span>
                <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="10"
                    value={config.size || 2}
                    onChange={(e) => setConfig({ ...config, size: parseFloat(e.target.value) })}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: `calc(4px * var(--radius-scale, 1))`, padding: '8px' }}
                />
            </div>
        </div>
    );
};
