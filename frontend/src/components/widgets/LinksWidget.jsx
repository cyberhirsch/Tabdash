import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Trash2, ExternalLink } from 'lucide-react';

export const LinksWidget = ({ config = {}, item }) => {
    const { updateItem } = useStore();
    const links = config.links || [];
    const [newLinkUrl, setNewLinkUrl] = useState('');
    const [newLinkTitle, setNewLinkTitle] = useState('');

    const saveLinks = async (newLinks) => {
        if (item && item.id) {
            await updateItem(item.id, { config: { ...config, links: newLinks } });
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newLinkUrl.trim() || !newLinkTitle.trim()) return;
        let finalUrl = newLinkUrl;
        if (!finalUrl.startsWith('http')) finalUrl = 'https://' + finalUrl;

        const newLinks = [...links, { id: Date.now(), title: newLinkTitle, url: finalUrl }];
        await saveLinks(newLinks);
        setNewLinkUrl('');
        setNewLinkTitle('');
    };

    const deleteLink = async (id) => {
        const newLinks = links.filter(l => l.id !== id);
        await saveLinks(newLinks);
    };

    return (
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: 'var(--accent-primary)' }}>Quick Links</h3>
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {links.map(link => (
                    <div key={link.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '6px 10px', borderRadius: '8px' }}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <ExternalLink size={14} opacity={0.6} />
                            <span style={{ fontSize: '0.9rem' }}>{link.title}</span>
                        </a>
                        <Trash2
                            size={14}
                            onClick={() => deleteLink(link.id)}
                            style={{ cursor: 'pointer', opacity: 0.5 }}
                            onMouseEnter={(e) => e.target.style.opacity = 1}
                            onMouseLeave={(e) => e.target.style.opacity = 0.5}
                        />
                    </div>
                ))}
            </div>
            <form onSubmit={handleAdd} style={{ display: 'flex', gap: '6px', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                    <input
                        type="text"
                        value={newLinkTitle}
                        onChange={(e) => setNewLinkTitle(e.target.value)}
                        placeholder="Title"
                        style={{
                            flex: 1,
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            padding: '6px 10px',
                            borderRadius: `calc(6px * var(--radius-scale, 1))`,
                            color: 'white',
                            fontSize: '0.85rem'
                        }}
                    />
                    <input
                        type="text"
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                        placeholder="URL"
                        style={{
                            flex: 2,
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            padding: '6px 10px',
                            borderRadius: `calc(6px * var(--radius-scale, 1))`,
                            color: 'white',
                            fontSize: '0.85rem'
                        }}
                    />
                    <button type="submit" style={{
                        background: 'var(--accent-primary)', border: 'none', borderRadius: `calc(6px * var(--radius-scale, 1))`,
                        padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'white'
                    }}>
                        <Plus size={16} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export const LinksWidgetSettings = ({ config, setConfig }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Add and remove links directly from the widget.</span>
        </div>
    );
};
