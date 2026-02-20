import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import { useStore } from '../store/useStore';
import { ContextMenu } from './ContextMenu';
import { GridItem } from './GridItem';
import { Plus, Layout, Link as LinkIcon, Trash2, Rss, LayoutGrid } from 'lucide-react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

export const Canvas = () => {
    const { items, fetchItems, syncLayout, createItem, deleteItem, user, gridConfig, gridOpacity, showGrid, hideGrid } = useStore();
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
        const x = Math.floor((e.clientX - rect.left) / (rect.width / gridConfig.cols));
        const y = Math.floor((e.clientY - rect.top) / (gridConfig.rowHeight + gridConfig.gap));

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

    const handleLayoutChange = (currentLayout) => {
        currentLayout.forEach(layoutItem => {
            const originalItem = items.find(i => i.id === layoutItem.i);
            if (!originalItem) return;

            const pos = {
                x: layoutItem.x,
                y: layoutItem.y,
                w: layoutItem.w,
                h: layoutItem.h
            };

            if (
                originalItem.position?.x !== pos.x ||
                originalItem.position?.y !== pos.y ||
                originalItem.position?.w !== pos.w ||
                originalItem.position?.h !== pos.h
            ) {
                syncLayout(layoutItem.i, pos);
            }
        });
    };

    const autoArrange = useCallback(() => {
        const cols = gridConfig.cols;
        const icons = items.filter(i => i.type !== 'widget');
        const widgets = items.filter(i => i.type === 'widget');

        const iconW = 2;
        const iconH = 3;
        const iconsPerRow = Math.floor(cols / iconW);

        let y = 0;

        // Place icons in compact rows
        icons.forEach((icon, idx) => {
            const col = idx % iconsPerRow;
            const row = Math.floor(idx / iconsPerRow);
            const pos = { x: col * iconW, y: row * iconH, w: iconW, h: iconH };
            syncLayout(icon.id, pos);
        });

        y = icons.length > 0 ? Math.ceil(icons.length / iconsPerRow) * iconH : 0;

        // Place widgets sequentially below the icons
        widgets.forEach(widget => {
            const pos = widget.position || {};
            const w = pos.w || 8;
            const h = pos.h || 4;
            const newPos = { x: 0, y, w, h };
            syncLayout(widget.id, newPos);
            y += h;
        });
    }, [items, gridConfig.cols, syncLayout]);

    const menuItems = useMemo(() => {
        const base = [
            { label: 'Auto Arrange', icon: <LayoutGrid size={16} />, onClick: autoArrange },
            { type: 'separator' },
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

            if (targetItem?.type === 'link' || targetItem?.type === 'file') {
                extraOptions.push({
                    label: 'Rename Item',
                    icon: <Plus size={16} />,
                    onClick: () => {
                        const newName = prompt('Enter new name (leave empty for icon-only):', targetItem.name);
                        if (newName !== null) {
                            useStore.getState().updateItem(targetItem.id, { name: newName });
                        }
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
    }, [contextMenu.targetId, items, handleCreate, deleteItem, autoArrange]);

    return (
        <div
            ref={containerRef}
            className="canvas-container"
            style={{ height: '100vh', width: '100vw', padding: '20px', position: 'relative' }}
            onContextMenu={(e) => handleContextMenu(e)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
        >
            <div
                className="grid-preview"
                style={{
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    right: 20,
                    bottom: 20,
                    pointerEvents: 'none',
                    zIndex: 0,
                    opacity: gridOpacity,
                    background: `
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)
                        `,
                    backgroundSize: `calc((100% + ${gridConfig.gap}px) / ${gridConfig.cols}) ${gridConfig.rowHeight + gridConfig.gap}px`,
                    transition: 'opacity 0.5s ease'
                }}
            />

            <ResponsiveGridLayout
                className="layout"
                layouts={{ lg: layout }}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xss: 0 }}
                cols={{ lg: gridConfig.cols, md: Math.floor(gridConfig.cols * 0.75), sm: Math.floor(gridConfig.cols * 0.5), xs: 8, xss: 4 }}
                rowHeight={gridConfig.rowHeight}
                draggableHandle=".drag-handle"
                onDragStart={showGrid}
                onDragStop={(l) => {
                    hideGrid();
                    handleLayoutChange(l);
                }}
                onResizeStop={handleLayoutChange}
                margin={[gridConfig.gap, gridConfig.gap]}
                compactType={null}
                preventCollision={false}
            >
                {items.map(item => (
                    <div key={item.id} i={item.id} className="drag-handle">
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
