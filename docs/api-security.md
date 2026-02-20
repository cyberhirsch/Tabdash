# API & Security Rules

TabDash uses PocketBase's sophisticated collection rules to ensure data privacy while maintaining real-time collaboration features.

## 🔐 Collection Rules

### `TabdashUsers` (Auth Collection)
- **Create**: Allowed by everyone (to enable public sign-ups).
- **List/View/Update/Delete**: `@request.auth.id = id` (Users can only see and manage their own profile).

### `TabDash` (Base Collection)
- **List/View/Create/Update/Delete**: `@request.auth.id = owner.id`
- This ensures that every dashboard item is strictly private to the user who created it.

## 📡 Real-time Subscriptions
The frontend uses the `pb.collection('TabDash').subscribe('*', ...)` method. PocketBase automatically ensures that users only receive events for records they have access to based on the **List Rule** above.

## 📁 File Security
Uploaded files in the `payload` field inherit the security of the record. Unauthorized users cannot access file URLs as PocketBase validates the auth token before serving protected files if configured, or by relying on the non-guessable record ID.

## 🛠️ Performance Notes
- **Indexes**: An index is recommended on the `owner` field for faster filtering in large datasets.
- **Auto-Cancellation**: The PocketBase JS-SDK uses auto-cancellation for overlapping requests. This is handled gracefully in `useStore.js`.
