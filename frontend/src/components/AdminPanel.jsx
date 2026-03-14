import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Shield, X, User, Calendar, Star, Crown, Clock, Check, AlertCircle } from 'lucide-react';

export const AdminPanel = () => {
    const { isAdminPanelOpen, toggleAdminPanel, users, fetchUsers, updateUserStatus } = useStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAdminPanelOpen) return;

        const loadContent = async () => {
            setLoading(true);
            try {
                await fetchUsers();
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, [isAdminPanelOpen, fetchUsers]);

    const handleStatusChange = async (userId, newType) => {
        try {
            await updateUserStatus(userId, { account_type: newType });
        } catch (err) {
            console.error(err);
        }
    };

    if (!isAdminPanelOpen) return null;

    return (
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 2000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                animation: 'fadeIn 0.3s ease-out'
            }}
            onClick={toggleAdminPanel}
        >
            <div 
                className="glass"
                style={{
                    width: '90%',
                    maxWidth: '1000px',
                    height: '80vh',
                    borderRadius: 'var(--border-radius-lg)',
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    overflow: 'hidden',
                    background: 'rgba(18, 18, 18, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 24px 64px rgba(0, 0, 0, 0.8)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                            width: '48px', 
                            height: '48px', 
                            borderRadius: '12px', 
                            background: 'var(--accent-primary)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
                        }}>
                            <Shield size={24} color="white" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Admin Dashboard</h2>
                            <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Manage user accounts and subscription statuses</p>
                        </div>
                    </div>
                    <button 
                        onClick={toggleAdminPanel}
                        style={{ 
                            background: 'rgba(255, 255, 255, 0.05)', 
                            border: '1px solid rgba(255, 255, 255, 0.1)', 
                            borderRadius: '50%', 
                            width: '40px', 
                            height: '40px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'white',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                    >
                        <X size={20} />
                    </button>
                </div>

                {error && (
                    <div style={{ 
                        padding: '16px', 
                        background: 'rgba(239, 68, 68, 0.1)', 
                        border: '1px solid rgba(239, 68, 68, 0.2)', 
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        color: '#ef4444'
                    }}>
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <div style={{ 
                    flex: 1, 
                    overflowY: 'auto', 
                    borderRadius: '12px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <div className="spinner" style={{ 
                                width: '40px', 
                                height: '40px', 
                                border: '3px solid rgba(255,255,255,0.1)', 
                                borderTopColor: 'var(--accent-primary)', 
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }} />
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ position: 'sticky', top: 0, background: 'rgba(28, 28, 30, 0.95)', zIndex: 1 }}>
                                <tr>
                                    <th style={{ padding: '16px 24px', fontSize: '0.85rem', opacity: 0.5, fontWeight: '500', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>USER</th>
                                    <th style={{ padding: '16px 24px', fontSize: '0.85rem', opacity: 0.5, fontWeight: '500', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>JOINED</th>
                                    <th style={{ padding: '16px 24px', fontSize: '0.85rem', opacity: 0.5, fontWeight: '500', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>TRIAL START</th>
                                    <th style={{ padding: '16px 24px', fontSize: '0.85rem', opacity: 0.5, fontWeight: '500', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>ACCOUNT TYPE</th>
                                    <th style={{ padding: '16px 24px', fontSize: '0.85rem', opacity: 0.5, fontWeight: '500', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => {
                                    const role = Array.isArray(u.account_type) ? u.account_type[0] : u.account_type;
                                    return (
                                     <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                         <td style={{ padding: '16px 24px' }}>
                                             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                 <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: role === 'admin' ? '#f59e0b' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                     <User size={16} color={role === 'admin' ? 'white' : 'rgba(255,255,255,0.6)'} />
                                                 </div>
                                                 <div>
                                                     <div style={{ fontWeight: '500' }}>{u.email}</div>
                                                     <div style={{ fontSize: '0.75rem', opacity: 0.4 }}>ID: {u.id}</div>
                                                 </div>
                                             </div>
                                         </td>
                                         <td style={{ padding: '16px 24px', fontSize: '0.9rem', opacity: 0.8 }}>
                                             <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                 <Calendar size={14} opacity={0.5} />
                                                 {new Date(u.created).toLocaleDateString()}
                                             </div>
                                         </td>
                                         <td style={{ padding: '16px 24px', fontSize: '0.9rem', opacity: 0.8 }}>
                                             <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                 <Clock size={14} opacity={0.5} />
                                                 {u.trial_started_at ? new Date(u.trial_started_at).toLocaleDateString() : 'N/A'}
                                             </div>
                                         </td>
                                         <td style={{ padding: '16px 24px' }}>
                                             <div style={{ 
                                                 display: 'inline-flex', 
                                                 alignItems: 'center', 
                                                 gap: '6px', 
                                                 padding: '4px 10px', 
                                                 borderRadius: '20px',
                                                 fontSize: '0.75rem',
                                                 fontWeight: '600',
                                                 textTransform: 'uppercase',
                                                 background: role === 'admin' ? 'rgba(245, 158, 11, 0.15)' : 
                                                            role === 'patron' ? 'rgba(249, 104, 84, 0.15)' : 
                                                            'rgba(16, 185, 129, 0.15)',
                                                 color: role === 'admin' ? '#f59e0b' : 
                                                       role === 'patron' ? '#f96854' : 
                                                       '#10b981',
                                                 border: `1px solid ${role === 'admin' ? 'rgba(245, 158, 11, 0.2)' : role === 'patron' ? 'rgba(249, 104, 84, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
                                             }}>
                                                 {role === 'admin' && <Crown size={12} />}
                                                 {role === 'patron' && <Star size={12} />}
                                                 {role === 'member' && <Check size={12} />}
                                                 {role}
                                             </div>
                                         </td>
                                         <td style={{ padding: '16px 24px' }}>
                                             <select 
                                                 value={role}
                                                 onChange={(e) => handleStatusChange(u.id, e.target.value)}
                                                 style={{ 
                                                     background: 'rgba(255, 255, 255, 0.05)', 
                                                     border: '1px solid rgba(255, 255, 255, 0.1)', 
                                                     color: 'white', 
                                                     borderRadius: '8px', 
                                                     padding: '6px 12px',
                                                     fontSize: '0.85rem',
                                                     outline: 'none',
                                                     cursor: 'pointer'
                                                 }}
                                             >
                                                 <option value="trial">Trial</option>
                                                 <option value="member">Member</option>
                                                 <option value="patron">Patron</option>
                                                 <option value="admin">Admin</option>
                                             </select>
                                         </td>
                                     </tr>
                                   );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
                
                <style dangerouslySetInnerHTML={{ __html: `
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                    .spinner {
                        border-top-color: var(--accent-primary) !important;
                    }
                `}} />
            </div>
        </div>
    );
};
