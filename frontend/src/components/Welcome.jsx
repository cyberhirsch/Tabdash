import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { pb } from '../api/pocketbase';
import { Lock, Mail, Github, Heart } from 'lucide-react';

export const Welcome = () => {
    const { setUser } = useStore();
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const authData = await pb.collection('TabtopUsers').authWithPassword(email, password);
            setUser(authData.record);
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials.');
        }
        setLoading(false);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await pb.collection('TabtopUsers').create({
                email,
                password,
                passwordConfirm: password,
                trial_started_at: new Date().toISOString(),
                account_type: 'trial'
            });
            const authData = await pb.collection('TabtopUsers').authWithPassword(email, password);
            setUser(authData.record);
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. Check console.');
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            position: 'relative'
        }}>
            <div className="glass-card animate-fade-in" style={{
                maxWidth: '900px',
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '40px',
                padding: '40px',
                borderRadius: 'calc(24px * var(--radius-scale, 1))',
            }}>
                {/* Left side: Information */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 8px 0', background: 'linear-gradient(135deg, white, rgba(255,255,255,0.5))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Tabtop.
                        </h1>
                        <p style={{ fontSize: '1.2rem', opacity: 0.8, margin: 0 }}>Your personal, beautiful start page.</p>
                    </div>

                    <div style={{ opacity: 0.8, lineHeight: '1.6', fontSize: '1rem' }}>
                        Tabtop is a highly customizable, glassmorphism-inspired dashboard. Add widgets like clocks, weather, search engines, RSS feeds, and quick links. Resize and organize them on a flexible grid. Connect your world in one clean, aesthetic workspace.
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: 'auto', paddingTop: '32px' }}>
                        <a href="https://github.com/cyberhirsch/Tabtop" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white', textDecoration: 'none', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 'calc(12px * var(--radius-scale, 1))', border: '1px solid rgba(255,255,255,0.1)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                            <Github size={20} />
                            <div>
                                <div style={{ fontWeight: '600' }}>Host it yourself</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Get the open-source code on GitHub.</div>
                            </div>
                        </a>
                        <a href="https://patreon.com/" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white', textDecoration: 'none', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 'calc(12px * var(--radius-scale, 1))', border: '1px solid rgba(255,255,255,0.1)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                            <Heart size={20} color="#f96854" />
                            <div>
                                <div style={{ fontWeight: '600' }}>Support the project</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Help keep Tabtop alive on Patreon.</div>
                            </div>
                        </a>
                    </div>
                </div>

                {/* Right side: Auth */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', padding: '32px', borderRadius: 'calc(16px * var(--radius-scale, 1))', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h2 style={{ margin: '0 0 24px 0', fontSize: '1.5rem', fontWeight: '600', textAlign: 'center' }}>
                        {isRegistering ? 'Create your Tabtop' : 'Welcome back'}
                    </h2>

                    <form onSubmit={isRegistering ? handleRegister : handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="input-group" style={{ position: 'relative' }}>
                            <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: 'calc(12px * var(--radius-scale, 1))', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem' }}
                                required
                            />
                        </div>
                        <div className="input-group" style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: 'calc(12px * var(--radius-scale, 1))', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem' }}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '16px',
                                borderRadius: 'calc(12px * var(--radius-scale, 1))',
                                background: 'var(--accent-primary, #6366f1)',
                                border: 'none',
                                color: 'white',
                                fontWeight: '600',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                marginTop: '8px',
                                transition: 'transform 0.1s, opacity 0.2s',
                                opacity: loading ? 0.7 : 1
                            }}
                            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            {loading ? 'Processing...' : (isRegistering ? 'Sign Up' : 'Login')}
                        </button>

                        <div
                            onClick={() => setIsRegistering(!isRegistering)}
                            style={{ textAlign: 'center', fontSize: '0.9rem', opacity: 0.6, cursor: 'pointer', marginTop: '8px', textDecoration: 'underline' }}
                        >
                            {isRegistering ? 'Already have an account? Sign In.' : "New here? Create an account."}
                        </div>
                    </form>
                </div>
            </div>

            {/* Footer / Imprint */}
            <div style={{
                position: 'absolute',
                bottom: '16px',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                gap: '24px',
                fontSize: '0.8rem',
                opacity: 0.4
            }}>
                <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Imprint</a>
                <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Privacy Policy</a>
                <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Terms of Service</a>
                <span>&copy; {new Date().getFullYear()} Tabtop</span>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .glass-card {
                        grid-template-columns: 1fr !important;
                        padding: 24px !important;
                    }
                }
            `}</style>
        </div>
    );
};
