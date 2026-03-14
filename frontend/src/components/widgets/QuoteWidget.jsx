import React, { useState, useEffect } from 'react';

export const QuoteWidget = ({ config = {} }) => {
    const [quote, setQuote] = useState({ content: "The best preparation for tomorrow is doing your best today.", author: "H. Jackson Brown, Jr." });

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const res = await fetch('https://api.quotable.io/random');
                if (res.ok) {
                    const data = await res.json();
                    setQuote({ content: data.content, author: data.author });
                }
            } catch (err) {
                console.error("Failed to fetch quote", err);
            }
        };
        fetchQuote();
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
            <p style={{ fontSize: '1.2rem', fontWeight: 500, fontStyle: 'italic', marginBottom: '8px', color: 'white' }}>
                "{quote.content}"
            </p>
            <p style={{ fontSize: '0.9rem', opacity: 0.7, color: 'white' }}>
                — {quote.author}
            </p>
        </div>
    );
};

export const QuoteWidgetSettings = ({ config, setConfig }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ opacity: 0.6, fontSize: '0.9rem', textAlign: 'center' }}>
                Quotes are fetched automatically.
            </div>
        </div>
    );
};
