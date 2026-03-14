import React, { useState, useEffect } from 'react';

export const LiteratureClockWidget = ({ config = {} }) => {
    const [quote, setQuote] = useState(null);

    useEffect(() => {
        const fetchQuote = async () => {
            const now = new Date();
            const hour = now.getHours().toString().padStart(2, '0');
            const minute = now.getMinutes().toString().padStart(2, '0');
            const timeCode = `${hour}:${minute}`;

            try {
                const res = await fetch(`https://raw.githubusercontent.com/lbngoc/literature-clock/master/docs/times/${timeCode}.json`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        const randomQuote = data[Math.floor(Math.random() * data.length)];
                        setQuote(randomQuote);
                    } else {
                        setQuote(null);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch literature clock quote", err);
            }
        };

        fetchQuote();
        const interval = setInterval(() => {
            const now = new Date();
            if (now.getSeconds() === 0) {
                fetchQuote();
            }
        }, 1000); // Check every second if minute has changed
        return () => clearInterval(interval);
    }, []);

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
            {quote ? (
                <>
                    <p style={{ fontSize: '1.2rem', color: 'white', fontStyle: 'italic', marginBottom: '12px' }}>
                        "{quote.quote_first}
                        <span style={{ fontWeight: 'bold', color: 'var(--accent-primary)' }}>{quote.quote_time_case}</span>
                        {quote.quote_last}"
                    </p>
                    <p style={{ fontSize: '0.9rem', color: 'white', opacity: 0.7, margin: 0 }}>
                        — {quote.title}, {quote.author}
                    </p>
                </>
            ) : (
                <p style={{ color: 'white', opacity: 0.5 }}>Waiting for a literary moment...</p>
            )}
        </div>
    );
};

export const LiteratureClockWidgetSettings = ({ config, setConfig }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>No configurable settings for Literature Clock.</span>
        </div>
    );
};
