import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { pb } from '../api/pocketbase';
import { Settings as CogIcon, LogOut, User, Lock, Mail } from 'lucide-react';

export const Settings = () => {
    const { isSettingsOpen, toggleSettings, user } = useStore();
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await pb.collection('TabdashUsers').authWithPassword(email, password);
            toggleSettings();
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Check console.');
        }
        setLoading(false);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await pb.collection('TabdashUsers').create({
                email,
                password,
                passwordConfirm: password,
            });
            await pb.collection('TabdashUsers').authWithPassword(email, password);
            toggleSettings();
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. Check console.');
        }
        setLoading(false);
    };

    const handleLogout = () => {
        pb.authStore.clear();
        toggleSettings();
    };

    if (!isSettingsOpen) {
        return (
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
                    zIndex: 1000,
                    opacity: 0.4,
                    transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.4'}
            >
                <CogIcon size={16} />
            </div>
        );
    }

    return (
        <div
            className="glass animate-fade-in"
            style={{
                position: 'fixed',
                bottom: '64px',
                right: '16px',
                width: '320px',
                padding: '24px',
                borderRadius: '24px',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '600' }}>{isRegistering ? 'Create Account' : 'Settings'}</h2>
                <button onClick={toggleSettings} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: 0.5 }}>✕</button>
            </div>

            {user ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}>
                        <div style={{ width: '40px', height: '40px', background: 'var(--accent-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={20} />
                        </div>
                        <div>
                            <div style={{ fontWeight: '500' }}>{user.email}</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Connected</div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="glass"
                        style={{
                            padding: '12px',
                            borderRadius: '12px',
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
                </div>
            ) : (
                <form onSubmit={isRegistering ? handleRegister : handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="input-group" style={{ position: 'relative' }}>
                        <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                            required
                        />
                    </div>
                    <div className="input-group" style={{ position: 'relative' }}>
                        <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '12px',
                            borderRadius: '12px',
                            background: 'var(--accent-primary)',
                            border: 'none',
                            color: 'white',
                            fontWeight: '600',
                            cursor: 'pointer',
                            marginTop: '8px'
                        }}
                    >
                        {loading ? 'Processing...' : (isRegistering ? 'Sign Up' : 'Login')}
                    </button>
                    <div
                        onClick={() => setIsRegistering(!isRegistering)}
                        style={{ textAlign: 'center', fontSize: '0.8rem', opacity: 0.6, cursor: 'pointer', marginTop: '4px' }}
                    >
                        {isRegistering ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
                    </div>
                </form>
            )}

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                <h3 style={{ fontSize: '0.9rem', marginBottom: '12px', opacity: 0.6 }}>Grid Configuration</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {/* Placeholder for grid scale controls */}
                    <div style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.8rem', textAlign: 'center' }}>
                        Density: 32x16
                    </div>
                </div>
            </div>
        </div>
    );
};
