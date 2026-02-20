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
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
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

export const SearchWidgetSettings = ({ config, setConfig }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Search Engine</span>
                <select
                    value={config.engine || 'google'}
                    onChange={(e) => setConfig({ ...config, engine: e.target.value })}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px', padding: '4px 8px' }}
                >
                    <option value="google">Google</option>
                    <option value="duckduckgo">DuckDuckGo</option>
                    <option value="bing">Bing</option>
                </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Custom Placeholder</span>
                <input
                    type="text"
                    value={config.placeholder || ''}
                    onChange={(e) => setConfig({ ...config, placeholder: e.target.value })}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px', padding: '8px' }}
                    placeholder="Search with..."
                />
            </div>
        </div>
    );
};
