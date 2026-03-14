import React, { useState } from 'react';
import { useStore } from '../../store/useStore';

export const NotesWidget = ({ config = {}, item }) => {
    const [note, setNote] = useState(config.note || '');
    const { updateItem } = useStore();

    const handleChange = (e) => {
        setNote(e.target.value);
    };

    const handleBlur = async () => {
        if (item && item.id) {
            await updateItem(item.id, { config: { ...config, note } });
        }
    };

    return (
        <div style={{ width: '100%', height: '100%', padding: '16px', display: 'flex', flexDirection: 'column' }}>
            <div style={{
                fontSize: '1.1rem',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: 'var(--accent-primary)'
            }}>
                Notes
            </div>
            <textarea
                value={note}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Write your notes here..."
                style={{
                    flex: 1,
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    resize: 'none',
                    outline: 'none',
                    fontFamily: 'inherit',
                    lineHeight: '1.5'
                }}
            />
        </div>
    );
};

export const NotesWidgetSettings = ({ config, setConfig }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>No configurable settings for Notes yet.</span>
        </div>
    );
};
