# Architecture Overview

Tabtop is built with a modern, decoupled architecture focusing on simplicity, real-time updates, and a glassmorphism aesthetic.

## 🏗️ System Components

### 1. Frontend (React + Vite)
- **Framework**: React 18 with functional components and hooks.
- **State Management**: [Zustand](https://github.com/pmndrs/zustand). Handles authentication state, dashboard items, and real-time synchronization subscriptions.
- **Grid System**: [React-Grid-Layout](https://github.com/react-grid-layout/react-grid-layout). Provides the responsive, draggable, and resizable interface.
- **Styling**: Vanilla CSS utilizing modern CSS variables for a consistent "Glassmorphism" theme.

### 2. Backend (PocketBase)
- **Database**: SQLite (embedded in PocketBase).
- **Authentication**: Built-in PocketBase auth with a custom `TabtopUsers` collection.
- **File Storage**: Handles widget icons and user-uploaded files.
- **Real-time**: Leverages PocketBase's SSE (Server-Sent Events) for instant dashboard updates across devices.

## 📊 Data Model

### Tabtop Collection
Stores all dashboard entities (Widgets, Links, Files).

| Field        | Type     | Description                                                         |
| ------------ | -------- | ------------------------------------------------------------------- |
| `owner`      | Relation | Reference to the user who owns the item.                            |
| `type`       | Select   | `widget`, `link`, `file`, `board`, `dock`.                          |
| `name`       | Text     | Display name.                                                       |
| `config`     | JSON     | Component-specific settings (e.g., analog/digital mode for clocks). |
| `position`   | JSON     | Grids coords: `{ x, y, w, h }`.                                     |
| `payload`    | File     | The actual file data (for `file` type).                             |
| `cache_icon` | File     | Scraped or generated icon image.                                    |

## 🛠️ Key Workflows

### Dashboard Interaction
1. **Adding**: Context menu triggers `createItem` in the store.
2. **Moving**: Dragging triggers `onLayoutChange` which calls `syncLayout` to persist coordinates.
3. **Rendering**: `GridItem.jsx` decides between the "Widget" flavor (framed/resizable) and "Desktop Icon" flavor (frameless/fixed-size).

### Real-time Sync
Upon initialization, the store calls `subscribe()`. Any changes made to the `Tabtop` collection (even from a different browser) are pushed via SSE and reflected instantly in the local Zustand state.

## 🛡️ Administrative System

### Admin Panel
- **Component**: `AdminPanel.jsx`. A restricted dashboard accessible only to users with `account_type: 'admin'`.
- **Functionality**: Allows multi-user management, including modifying account types (`trial`, `member`, `patron`, `admin`).
- **Authorization**: Protected both on the frontend (UI state) and backend (PocketBase API Rules).

### User Status Flow
1. **Trial**: New users start with a 14-day trial period.
2. **Expirations**: `App.jsx` validates the trial duration or premium status (`patron/admin`).
3. **Bypass**: Users flagged as `patron` or `admin` in the database bypass expiration screens.
4. **Diagnostic Mode**: A hidden refresh and diagnostic view on the expiry screen handles edge cases with stale sessions or role updates.
