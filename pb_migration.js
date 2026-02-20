/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
    // Rename the default users collection
    const users = db.findCollectionByNameOrId("users");
    if (users) {
        users.name = "TabdashUsers";
        db.saveCollection(users);
    }

    const collection = new Collection({
        "name": "TabDash",
        "type": "base",
        "system": false,
        "schema": [
            {
                "name": "owner",
                "type": "relation",
                "required": true,
                "options": {
                    "collectionId": "_pb_users_auth_",
                    "cascadeDelete": true,
                    "maxSelect": 1,
                }
            },
            {
                "name": "type",
                "type": "select",
                "required": true,
                "options": {
                    "values": ["board", "widget", "link", "file", "dock"]
                }
            },
            {
                "name": "parent",
                "type": "relation",
                "required": false,
                "options": {
                    "collectionId": "TabDash",
                    "cascadeDelete": false,
                    "maxSelect": 1,
                }
            },
            { "name": "name", "type": "text", "options": {} },
            { "name": "config", "type": "json", "options": {} },
            { "name": "payload", "type": "file", "options": { "maxSelect": 1, "maxSize": 5242880, "mimeTypes": [], "thumbs": [], "protected": false } },
            { "name": "cache_icon", "type": "file", "options": { "maxSelect": 1, "maxSize": 5242880, "mimeTypes": ["image/png", "image/vnd.microsoft.icon", "image/x-icon", "image/jpeg", "image/svg+xml"], "thumbs": [], "protected": false } },
            { "name": "position", "type": "json", "options": {} }
        ],
        "listRule": "@request.auth.id = owner.id",
        "viewRule": "@request.auth.id = owner.id",
        "createRule": "@request.auth.id = owner.id",
        "updateRule": "@request.auth.id = owner.id",
        "deleteRule": "@request.auth.id = owner.id",
    });

    db.saveCollection(collection);
}, (db) => {
    const users = db.findCollectionByNameOrId("TabdashUsers");
    if (users) {
        users.name = "users";
        db.saveCollection(users);
    }
    const q = new QueryGenerator(db);
    db.deleteCollection(q.setCollectionByName("TabDash").getCollection());
})
