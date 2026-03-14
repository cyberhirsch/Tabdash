import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export const JokeWidget = () => {
    const [joke, setJoke] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchJoke = async () => {
        setLoading(true);
        try {
            const res = await fetch('https://v2.jokeapi.dev/joke/Any?safe-mode');
            if (res.ok) {
                const data = await res.json();
                if (data.type === 'single') {
                    setJoke({ text: data.joke });
                } else {
                    setJoke({ setup: data.setup, delivery: data.delivery });
                }
            }
        } catch (err) {
            console.error('Failed to fetch joke', err);
        }
        setLoading(false);
    };

    useEffect(() => { fetchJoke(); }, []);

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px',
            textAlign: 'center',
            position: 'relative'
        }}>
            <button
                onClick={fetchJoke}
                style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '12px',
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    opacity: 0.3,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <RefreshCw size={13} className={loading ? 'spin' : ''} />
            </button>
            {joke ? (
                <>
                    {joke.text ? (
                        <p style={{ fontSize: '1.1rem', color: 'white' }}>{joke.text}</p>
                    ) : (
                        <>
                            <p style={{ fontSize: '1.1rem', color: 'white', fontWeight: 'bold' }}>{joke.setup}</p>
                            <p style={{ fontSize: '1.1rem', color: 'var(--accent-primary)', marginTop: '8px' }}>{joke.delivery}</p>
                        </>
                    )}
                </>
            ) : (
                <p style={{ opacity: 0.5 }}>Loading...</p>
            )}
        </div>
    );
};

export const JokeWidgetSettings = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>No configurable settings for Jokes.</span>
    </div>
);
