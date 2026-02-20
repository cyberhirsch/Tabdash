import React from 'react';

export const ContextMenu = ({ x, y, visible, items, onClose }) => {
    if (!visible) return null;

    return (
        <div
            className="glass animate-fade-in"
            style={{
                position: 'fixed',
                top: y,
                left: x,
                minWidth: '160px',
                padding: '8px',
                borderRadius: '12px',
                zIndex: 2000,
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
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
                            borderRadius: '8px',
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
    );
};
