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
            set((state) => ({ items: [...state.items, record] }));
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
                    newItems.push(record);
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
