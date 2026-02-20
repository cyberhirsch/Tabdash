import { create } from 'zustand';
import { pb } from '../api/pocketbase';

export const useStore = create((set) => ({
    // Auth State
    user: pb.authStore.model,
    setUser: (user) => set({ user }),

    // Items State
    items: [],
    setItems: (items) => set({ items }),
    addItem: (item) => set((state) => ({ items: [...state.items, item] })),

    // UI State
    isSettingsOpen: false,
    toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),

    widgetSettings: { isOpen: false, item: null },
    setWidgetSettings: (isOpen, item = null) => set({ widgetSettings: { isOpen, item } }),

    gridConfig: {
        cols: 32,
        rowHeight: 30,
        gap: 16,
        iconSize: 64
    },
    setGridConfig: (config) => {
        set((state) => ({ gridConfig: { ...state.gridConfig, ...config } }));
        useStore.getState().triggerGridPreview();
    },
    gridOpacity: 0,
    triggerGridPreview: () => {
        set({ gridOpacity: 0.3 });
        if (window._gridTimeout) clearTimeout(window._gridTimeout);
        window._gridTimeout = setTimeout(() => set({ gridOpacity: 0 }), 10000);
    },
    showGrid: () => {
        if (window._gridTimeout) clearTimeout(window._gridTimeout);
        set({ gridOpacity: 0.3 });
    },
    hideGrid: () => {
        set({ gridOpacity: 0 });
    },

    themeConfig: {
        primary: '#6366f1',
        secondary: '#a855f7'
    },
    setThemeConfig: (config) => {
        set((state) => {
            const newTheme = { ...state.themeConfig, ...config };
            document.documentElement.style.setProperty('--accent-primary', newTheme.primary);
            document.documentElement.style.setProperty('--accent-secondary', newTheme.secondary);
            return { themeConfig: newTheme };
        });
    },

    // Actions
    fetchItems: async () => {
        if (!pb.authStore.model) return [];
        try {
            const records = await pb.collection('TabDash').getFullList();
            set({ items: records });
            return records;
        } catch (error) {
            // Ignore auto-cancellation errors (status 0)
            if (error.status !== 0 && error.name !== 'AbortError') {
                console.error('Failed to fetch items:', error);
            }
            return [];
        }
    },

    createItem: async (data) => {
        try {
            let record;
            if (data instanceof FormData) {
                if (!data.has('owner')) {
                    data.append('owner', pb.authStore.model?.id);
                }
                record = await pb.collection('TabDash').create(data);
            } else {
                const payload = {
                    ...data,
                    owner: pb.authStore.model?.id
                };
                record = await pb.collection('TabDash').create(payload);
            }
            set((state) => ({
                items: state.items.some(i => i.id === record.id)
                    ? state.items.map(i => i.id === record.id ? record : i)
                    : [...state.items, record]
            }));
            return record;
        } catch (error) {
            console.error('Failed to create item:', error);
            throw error;
        }
    },

    syncLayout: async (id, position) => {
        try {
            await pb.collection('TabDash').update(id, { position });
            set((state) => ({
                items: state.items.map(i => i.id === id ? { ...i, position } : i)
            }));
        } catch (error) {
            console.error('Failed to sync layout:', error);
        }
    },

    updateItem: async (id, data) => {
        try {
            const record = await pb.collection('TabDash').update(id, data);
            set((state) => ({
                items: state.items.map(i => i.id === id ? record : i)
            }));
            return record;
        } catch (error) {
            console.error('Failed to update item:', error);
        }
    },

    deleteItem: async (id) => {
        try {
            await pb.collection('TabDash').delete(id);
            set((state) => ({ items: state.items.filter(i => i.id !== id) }));
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    },

    subscribe: () => {
        pb.collection('TabDash').subscribe('*', ({ action, record }) => {
            set((state) => {
                let newItems = [...state.items];
                if (action === 'create') {
                    const exists = newItems.some(item => item.id === record.id);
                    if (exists) {
                        newItems = newItems.map(item => item.id === record.id ? record : item);
                    } else {
                        newItems.push(record);
                    }
                } else if (action === 'update') {
                    newItems = newItems.map(item => item.id === record.id ? record : item);
                } else if (action === 'delete') {
                    newItems = newItems.filter(item => item.id !== record.id);
                }
                return { items: newItems };
            });
        });
    },

    unsubscribe: () => {
        pb.collection('TabDash').unsubscribe('*');
    }
}));

// Initialize subscription and listen for PocketBase auth changes
window.useStore = useStore;
useStore.getState().subscribe();
pb.authStore.onChange((token, model) => {
    useStore.getState().setUser(model);
});
