import React from 'react';

export const ContextMenu = ({ x, y, visible, items, onClose }) => {
    if (!visible) return null;

    return (
        <>
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 1999,
                    background: 'transparent'
                }}
                onClick={onClose}
                onContextMenu={(e) => {
                    e.preventDefault();
                    onClose();
                }}
            />
            <div
                style={{
                    position: 'fixed',
                    top: y,
                    left: x,
                    minWidth: '160px',
                    padding: '8px',
                    borderRadius: `calc(12px * var(--radius-scale, 1))`,
                    zIndex: 2000,
                    background: 'rgba(18, 18, 18, 0.96)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
                    pointerEvents: 'auto'
                }}
                onMouseLeave={onClose}
            >
                {items.map((item, index) => {
                    if (item.type === 'separator') {
                        return (
                            <div
                                key={index}
                                style={{
                                    height: '1px',
                                    background: 'rgba(255,255,255,0.08)',
                                    margin: '4px 8px'
                                }}
                            />
                        );
                    }
                    return (
                        <div
                            key={index}
                            onClick={() => {
                                item.onClick();
                                onClose();
                            }}
                            style={{
                                padding: '10px 12px',
                                cursor: 'pointer',
                                borderRadius: `calc(8px * var(--radius-scale, 1))`,
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                transition: 'background 0.2s',
                                color: item.danger ? '#ff4444' : 'inherit'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </div>
                    );
                })}
            </div>
        </>
    );
};
