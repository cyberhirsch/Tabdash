import PocketBase from 'pocketbase';

const PB_URL = import.meta.env.VITE_POCKETBASE_URL || 'https://api.sebhirsch.com';
export const pb = new PocketBase(PB_URL);

// Auto-refresh auth token if possible
pb.authStore.onChange(() => {
    console.log('Auth state changed:', pb.authStore.model);
});
