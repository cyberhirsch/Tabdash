import React from 'react';
import { useStore } from '../store/useStore';
import { pb } from '../api/pocketbase';
import { Settings as CogIcon, LogOut, User, Lock, Mail, Shield } from 'lucide-react';

export const Settings = () => {
    const { isSettingsOpen, toggleSettings, user, gridConfig, setGridConfig, themeConfig, setThemeConfig, toggleAdminPanel } = useStore();

    const handleLogout = () => {
        pb.authStore.clear();
        toggleSettings();
    };

    const handleOpenAdmin = () => {
        toggleSettings();
        toggleAdminPanel();
    };

    return (
        <>
            {/* Always-visible cogwheel toggle */}
            <div
                className="glass"
                onClick={toggleSettings}
                style={{
                    position: 'fixed',
                    bottom: '16px',
                    right: '16px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1001,
                    opacity: isSettingsOpen ? 1 : 0.4,
                    transition: 'opacity 0.2s',
                    background: isSettingsOpen ? 'rgba(255,255,255,0.12)' : undefined,
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = isSettingsOpen ? '1' : '0.4'}
            >
                <CogIcon size={16} />
            </div>

            {/* Settings panel */}
            {isSettingsOpen && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '64px',
                        right: '16px',
                        width: '320px',
                        padding: '24px',
                        borderRadius: `calc(24px * var(--radius-scale, 1))`,
                        zIndex: 1000,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        background: 'rgba(18, 18, 18, 0.92)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Settings</h2>
                        <button onClick={toggleSettings} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: 0.5 }}>✕</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: `calc(16px * var(--radius-scale, 1))` }}>
                            <div style={{ width: '40px', height: '40px', background: 'var(--accent-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={20} />
                            </div>
                            <div>
                                <div style={{ fontWeight: '500' }}>{user?.email}</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Connected</div>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="glass"
                            style={{
                                padding: '12px',
                                borderRadius: `calc(12px * var(--radius-scale, 1))`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                color: '#ff4444',
                                fontWeight: '500'
                            }}
                        >
                            <LogOut size={16} /> Logout
                        </button>
                        
                        {(() => {
                            const role = Array.isArray(user?.account_type) ? user.account_type[0] : user?.account_type;
                            return role === 'admin' && (
                                <button
                                    onClick={handleOpenAdmin}
                                    className="glass"
                                    style={{
                                        padding: '12px',
                                        borderRadius: `calc(12px * var(--radius-scale, 1))`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        cursor: 'pointer',
                                        color: 'var(--accent-primary)',
                                        fontWeight: 'bold',
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        border: '1px solid rgba(99, 102, 241, 0.2)'
                                    }}
                                >
                                    <Shield size={16} /> Admin Panel
                                </button>
                            );
                        })()}
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                        <h3 style={{ fontSize: '0.9rem', marginBottom: '12px', opacity: 0.6 }}>Appearance</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Primary Accent</span>
                                <input
                                    type="color"
                                    value={themeConfig.primary}
                                    onChange={(e) => setThemeConfig({ primary: e.target.value })}
                                    style={{ border: 'none', background: 'none', width: '30px', height: '30px', cursor: 'pointer' }}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Secondary Accent</span>
                                <input
                                    type="color"
                                    value={themeConfig.secondary}
                                    onChange={(e) => setThemeConfig({ secondary: e.target.value })}
                                    style={{ border: 'none', background: 'none', width: '30px', height: '30px', cursor: 'pointer' }}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Corner Radius ({themeConfig.cornerRadius !== undefined ? themeConfig.cornerRadius : 100}%)</span>
                                <input
                                    type="range" min="0" max="200" step="5"
                                    value={themeConfig.cornerRadius !== undefined ? themeConfig.cornerRadius : 100}
                                    onChange={(e) => setThemeConfig({ cornerRadius: parseInt(e.target.value) })}
                                    style={{ width: '80px', accentColor: 'var(--accent-primary)' }}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Frame Opacity ({themeConfig.frameOpacity !== undefined ? themeConfig.frameOpacity : 100}%)</span>
                                <input
                                    type="range" min="0" max="200" step="5"
                                    value={themeConfig.frameOpacity !== undefined ? themeConfig.frameOpacity : 100}
                                    onChange={(e) => setThemeConfig({ frameOpacity: parseInt(e.target.value) })}
                                    style={{ width: '80px', accentColor: 'var(--accent-primary)' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', marginTop: '16px' }}>
                        <h3 style={{ fontSize: '0.9rem', marginBottom: '12px', opacity: 0.6 }}>Background</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Type</span>
                                <select
                                    value={themeConfig.bgType || 'gradient'}
                                    onChange={(e) => setThemeConfig({ bgType: e.target.value })}
                                    style={{ background: 'var(--bg-primary)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: `calc(4px * var(--radius-scale, 1))`, padding: '4px 8px' }}
                                >
                                    <option value="solid">Solid Color</option>
                                    <option value="gradient">Gradient</option>
                                    <option value="image">Image</option>
                                </select>
                            </div>

                            {themeConfig.bgType === 'solid' && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Color</span>
                                    <input
                                        type="color"
                                        value={themeConfig.bgColor || '#0a0a0c'}
                                        onChange={(e) => setThemeConfig({ bgColor: e.target.value })}
                                        style={{ border: 'none', background: 'none', width: '30px', height: '30px', cursor: 'pointer', padding: 0 }}
                                    />
                                </div>
                            )}

                            {themeConfig.bgType === 'gradient' && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Gradient Settings</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <input
                                            type="color"
                                            value={themeConfig.bgColor || '#0a0a0c'}
                                            onChange={(e) => setThemeConfig({ bgColor: e.target.value })}
                                            style={{ border: 'none', background: 'none', width: '24px', height: '24px', cursor: 'pointer', padding: 0 }}
                                        />
                                        <input
                                            type="color"
                                            value={themeConfig.bgGradientColor2 || '#1a1a2e'}
                                            onChange={(e) => setThemeConfig({ bgGradientColor2: e.target.value })}
                                            style={{ border: 'none', background: 'none', width: '24px', height: '24px', cursor: 'pointer', padding: 0 }}
                                        />
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <input
                                                type="range"
                                                min="0" max="360"
                                                value={themeConfig.bgGradientAngle !== undefined ? themeConfig.bgGradientAngle : 135}
                                                onChange={(e) => setThemeConfig({ bgGradientAngle: parseInt(e.target.value) })}
                                                style={{ width: '60px', accentColor: 'var(--accent-primary)' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {themeConfig.bgType === 'image' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Upload Image</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => setThemeConfig({ bgImage: reader.result });
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        style={{ fontSize: '0.8rem' }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', marginTop: '16px' }}>
                        <h3 style={{ fontSize: '0.9rem', marginBottom: '12px', opacity: 0.6 }}>Grid Configuration</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Columns</span>
                                <input
                                    type="range" min="8" max="64" step="4"
                                    value={gridConfig.cols}
                                    onChange={(e) => setGridConfig({ cols: parseInt(e.target.value) })}
                                    style={{ width: '120px', accentColor: 'var(--accent-primary)' }}
                                />
                                <span style={{ fontSize: '0.8rem', width: '24px', textAlign: 'right' }}>{gridConfig.cols}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Row Height</span>
                                <input
                                    type="range" min="10" max="100" step="5"
                                    value={gridConfig.rowHeight}
                                    onChange={(e) => setGridConfig({ rowHeight: parseInt(e.target.value) })}
                                    style={{ width: '120px', accentColor: 'var(--accent-primary)' }}
                                />
                                <span style={{ fontSize: '0.8rem', width: '24px', textAlign: 'right' }}>{gridConfig.rowHeight}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Icon Size</span>
                                <input
                                    type="range" min="32" max="128" step="4"
                                    value={gridConfig.iconSize}
                                    onChange={(e) => setGridConfig({ iconSize: parseInt(e.target.value) })}
                                    style={{ width: '120px', accentColor: 'var(--accent-primary)' }}
                                />
                                <span style={{ fontSize: '0.8rem', width: '24px', textAlign: 'right' }}>{gridConfig.iconSize}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
