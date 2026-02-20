import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import { useStore } from '../store/useStore';
import { ContextMenu } from './ContextMenu';
import { GridItem } from './GridItem';
import { Plus, Layout, Link as LinkIcon, Trash2, Rss } from 'lucide-react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

export const Canvas = () => {
    const { items, fetchItems, syncLayout, createItem, deleteItem, user } = useStore();
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, targetId: null });
    const containerRef = useRef(null);

    useEffect(() => {
        fetchItems();
    }, [fetchItems, user]);

    const layout = useMemo(() => {
        if (!items) return [];
        return items.map(item => {
            const pos = item.position || {};
            const isWidget = item.type === 'widget';
            return {
                i: item.id,
                x: pos.x || 0,
                y: pos.y || 0,
                w: pos.w || (isWidget ? 4 : 2),
                h: pos.h || (isWidget ? 4 : 3),
                isResizable: isWidget
            };
        });
    }, [items]);

    const handleContextMenu = useCallback((e, targetId = null) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            targetId: targetId
        });
    }, []);

    const handleCreate = useCallback(async (type, extra = {}) => {
        if (!user) {
            alert('Please login to add items.');
            return;
        }
        const name = extra.name || prompt(`Enter name for the new ${type}:`) || `New ${type}`;
        const position = extra.position || { x: 0, y: 0, w: 4, h: 4 };

        const data = {
            type: type,
            name: name,
            position: position,
            ...extra.fields
        };

        if (extra.file) {
            const formData = new FormData();
            Object.keys(data).forEach(k => formData.append(k, k === 'position' ? JSON.stringify(data[k]) : data[k]));
            formData.append('payload', extra.file);
            await createItem(formData);
        } else {
            await createItem(data);
        }
    }, [user, createItem]);

    const onDrop = async (e) => {
        e.preventDefault();
        if (!user) return;

        const files = e.dataTransfer.files;
        const url = e.dataTransfer.getData('url') || e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');

        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / (rect.width / 32));
        const y = Math.floor((e.clientY - rect.top) / 46);

        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                await handleCreate('file', {
                    name: files[i].name,
                    file: files[i],
                    position: { x: x + (i * 2), y: y, w: 2, h: 3 }
                });
            }
        } else if (url && (url.startsWith('http') || url.includes('.'))) {
            await handleCreate('link', {
                name: url.replace(/^https?:\/\//, '').split('/')[0],
                fields: { config: { url } },
                position: { x, y, w: 2, h: 3 }
            });
        }
    };

    const onLayoutChange = (currentLayout) => {
        currentLayout.forEach(layoutItem => {
            const originalItem = items.find(i => i.id === layoutItem.i);
            const pos = {
                x: layoutItem.x,
                y: layoutItem.y,
                w: layoutItem.w,
                h: layoutItem.h
            };

            if (originalItem && (
                originalItem.position?.x !== pos.x ||
                originalItem.position?.y !== pos.y ||
                originalItem.position?.w !== pos.w ||
                originalItem.position?.h !== pos.h
            )) {
                syncLayout(layoutItem.i, pos);
            }
        });
    };

    const menuItems = useMemo(() => {
        const base = [
            { label: 'Add Link', icon: <LinkIcon size={16} />, onClick: () => handleCreate('link') },
            { label: 'Add Search Bar', icon: <Layout size={16} />, onClick: () => handleCreate('widget', { name: 'Search', fields: { config: { type: 'search', engine: 'google' } }, position: { x: 0, y: 0, w: 12, h: 2 } }) },
            { label: 'Add Weather Bar', icon: <Layout size={16} />, onClick: () => handleCreate('widget', { name: 'Weather', fields: { config: { type: 'weather', city: 'Berlin' } }, position: { x: 0, y: 0, w: 8, h: 4 } }) },
            { label: 'Add Clock', icon: <Plus size={16} />, onClick: () => handleCreate('widget', { name: 'Clock', fields: { config: { type: 'clock', mode: 'digital' } }, position: { x: 0, y: 0, w: 8, h: 4 } }) },
            { label: 'Add RSS Feed', icon: <Rss size={16} />, onClick: () => handleCreate('widget', { name: 'News', fields: { config: { type: 'rss', url: 'https://news.google.com/rss' } }, position: { x: 0, y: 0, w: 8, h: 8 } }) },
            { label: 'Add Board', icon: <Plus size={16} />, onClick: () => handleCreate('board') },
        ];

        if (contextMenu.targetId) {
            const targetItem = items.find(i => i.id === contextMenu.targetId);
            const extraOptions = [];

            if (targetItem?.type === 'widget' && targetItem.config?.type === 'clock') {
                extraOptions.push({
                    label: targetItem.config.mode === 'analog' ? 'Switch to Digital' : 'Switch to Analog',
                    icon: <Plus size={16} />,
                    onClick: () => {
                        const newConfig = { ...targetItem.config, mode: targetItem.config.mode === 'analog' ? 'digital' : 'analog' };
                        useStore.getState().updateItem(targetItem.id, { config: newConfig });
                    }
                });
            }

            return [
                ...extraOptions,
                ...base,
                { label: 'Delete Item', icon: <Trash2 size={16} />, danger: true, onClick: () => deleteItem(contextMenu.targetId) }
            ];
        }
        return base;
    }, [contextMenu.targetId, items, handleCreate, deleteItem]);

    return (
        <div
            ref={containerRef}
            className="canvas-container"
            style={{ height: '100vh', width: '100vw', padding: '20px' }}
            onContextMenu={(e) => handleContextMenu(e)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
        >
            <ResponsiveGridLayout
                className="layout"
                layouts={{ lg: layout }}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xss: 0 }}
                cols={{ lg: 32, md: 24, sm: 12, xs: 8, xss: 4 }}
                rowHeight={30}
                draggableHandle=".drag-handle"
                onLayoutChange={onLayoutChange}
                margin={[16, 16]}
            >
                {items.map(item => (
                    <div key={item.id} style={{ display: 'flex' }}>
                        <GridItem item={item} onContextMenu={handleContextMenu} />
                    </div>
                ))}
            </ResponsiveGridLayout>

            <ContextMenu
                {...contextMenu}
                items={menuItems}
                onClose={() => setContextMenu(prev => ({ ...prev, visible: false }))}
            />
        </div>
    );
};
