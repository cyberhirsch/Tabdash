/**
 * Tabdash Schema Sync Script
 * This script programmatically pushes the pb_schema.json to the PocketBase server.
 */

import fs from 'node:fs';
import path from 'node:path';

const PB_URL = 'https://api.sebhirsch.com';
const SCHEMA_PATH = './pb_schema.json';

// NOTE: These should ideally come from env variables
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD;

async function syncSchema() {
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
        console.error('Error: PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD environment variables are required.');
        process.exit(1);
    }

    try {
        const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));

        console.log(`Connecting to ${PB_URL}...`);

        // 1. Authenticate as Admin
        const authRes = await fetch(`${PB_URL}/api/admins/auth-with-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASSWORD })
        });

        if (!authRes.ok) {
            throw new Error(`Authentication failed: ${await authRes.text()}`);
        }

        const authData = await authRes.json();
        const token = authData.token;
        console.log('Authenticated successfully.');

        // 2. Import Collections
        console.log('Importing collections...');
        const importRes = await fetch(`${PB_URL}/api/settings/import`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(schema)
        });

        if (!importRes.ok) {
            const errText = await importRes.text();
            throw new Error(`Schema import failed: ${errText}`);
        }

        console.log('✅ Schema synced successfully!');
    } catch (error) {
        console.error('❌ Error syncing schema:', error.message);
        process.exit(1);
    }
}

syncSchema();
