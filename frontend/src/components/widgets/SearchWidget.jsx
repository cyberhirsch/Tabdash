import React, { useState } from 'react';
import { Search } from 'lucide-react';

export const SearchWidget = ({ config = {} }) => {
    const [query, setQuery] = useState('');
    const engine = config.engine || 'google';

    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        const baseUrl = engine === 'duckduckgo'
            ? 'https://duckduckgo.com/?q='
            : 'https://www.google.com/search?q=';

        window.open(`${baseUrl}${encodeURIComponent(query)}`, '_blank');
        setQuery('');
    };

    return (
        <form
            onSubmit={handleSearch}
            className="glass"
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                borderRadius: '16px',
                gap: '12px'
            }}
        >
            <Search size={20} opacity={0.5} />
            <input
                type="text"
                placeholder={`Search with ${engine}...`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    fontSize: '0.95rem',
                    outline: 'none'
                }}
            />
        </form>
    );
};
