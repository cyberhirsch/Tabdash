import React, { useRef } from 'react';
import { File as FileIcon, Globe, Layout, Rss, Settings as Cog, X, MoreVertical } from 'lucide-react';
import { pb } from '../api/pocketbase';
import { SearchWidget } from './widgets/SearchWidget';
import { WeatherWidget } from './widgets/WeatherWidget';
import { RSSWidget } from './widgets/RSSWidget';
import { ClockWidget } from './widgets/ClockWidget';
import { useStore } from '../store/useStore';

export const GridItem = ({ item, onContextMenu }) => {
    const { gridConfig, deleteItem, setWidgetSettings } = useStore();
    const dragStartPos = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        dragStartPos.current = { x: e.clientX, y: e.clientY };
    };

    const getIcon = () => {
        if (item.type === 'widget' && (item.config?.type === 'search' || item.config?.type === 'weather' || item.config?.type === 'rss' || item.config?.type === 'clock')) {
            return null;
        }

        const size = gridConfig.iconSize || 64;

        if (item.cache_icon) {
            return (
                <img
                    src={pb.files.getURL(item, item.cache_icon)}
                    alt={item.name}
                    style={{ width: `${size * 0.7}px`, height: `${size * 0.7}px`, borderRadius: '10px', objectFit: 'contain' }}
                />
            );
        }

        if (item.type === 'link' && item.config?.url) {
            try {
                let urlStr = item.config.url;
                if (!urlStr.startsWith('http')) urlStr = 'https://' + urlStr;
                const url = new URL(urlStr);
                return (
                    <img
                        src={`https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`}
                        alt={item.name}
                        style={{ width: `${size * 0.6}px`, height: `${size * 0.6}px`, borderRadius: '8px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                    />
                );
            } catch {
                // Fallback to globe
            }
        }

        switch (item.type) {
            case 'link': return <Globe size={size * 0.5} opacity={0.6} color="var(--accent-primary)" />;
            case 'file': return <FileIcon size={size * 0.5} opacity={0.6} color="var(--accent-secondary)" />;
            case 'widget': return <Layout size={size * 0.5} opacity={0.6} />;
            default: return <Layout size={size * 0.5} opacity={0.6} />;
        }
    };

    const handleClick = (e) => {
        const dist = Math.sqrt(
            Math.pow(e.clientX - dragStartPos.current.x, 2) +
            Math.pow(e.clientY - dragStartPos.current.y, 2)
        );
        if (dist > 5) return;

        if (item.type === 'link' && item.config?.url) {
            let url = item.config.url;
            if (!url.startsWith('http')) url = 'https://' + url;
            window.open(url, '_blank');
        } else if (item.type === 'file' && item.payload) {
            window.open(pb.files.getURL(item, item.payload), '_blank');
        }
    };

    if (item.type === 'widget') {
        let content;
        if (item.config?.type === 'search') content = <SearchWidget config={item.config} />;
        else if (item.config?.type === 'weather') content = <WeatherWidget config={item.config} />;
        else if (item.config?.type === 'rss') content = <RSSWidget config={item.config} />;
        else if (item.config?.type === 'clock') content = <ClockWidget config={item.config} />;
        else content = (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <Layout size={32} opacity={0.6} />
                <span style={{ fontSize: '12px', opacity: 0.6 }}>{item.name}</span>
            </div>
        );

        return (
            <div
                className="glass-card widget-container animate-fade-in"
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}
                onMouseDown={handleMouseDown}
                onContextMenu={(e) => onContextMenu(e, item.id)}
            >
                <div className="widget-controls">
                    <button className="control-btn" onClick={() => setWidgetSettings(true, item)}>
                        <Cog size={12} />
                    </button>
                    <button className="control-btn delete" onClick={() => deleteItem(item.id)}>
                        <X size={12} />
                    </button>
                </div>

                <div className="drag-handle" style={{
                    height: '14px',
                    width: '100%',
                    background: 'rgba(255,255,255,0.02)',
                    cursor: 'grab',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    padding: '0 4px',
                    flexShrink: 0
                }}>
                    <MoreVertical size={10} opacity={0.3} />
                </div>
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                    {content}
                </div>
            </div>
        );
    }

    return (
        <div
            className="desktop-icon animate-fade-in"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                width: '100%',
                cursor: 'pointer',
                textAlign: 'center',
                padding: '4px',
                userSelect: 'none'
            }}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
            onContextMenu={(e) => onContextMenu(e, item.id)}
        >
            <div className="icon-wrapper" style={{
                width: '100%',
                aspectRatio: '1/1',
                maxHeight: '70%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                marginBottom: '4px',
                transition: 'transform 0.1s ease'
            }}>
                <div className="icon-hover-effect" style={{
                    position: 'absolute',
                    width: '110%',
                    height: '110%',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    opacity: 0,
                    transition: 'opacity 0.2s'
                }} />
                {getIcon()}
            </div>
            <span style={{
                fontSize: '11px',
                fontWeight: '500',
                color: 'white',
                textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                maxWidth: '100%',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: '1.2',
                padding: '0 2px'
            }}>
                {item.name}
            </span>
        </div>
    );
};
