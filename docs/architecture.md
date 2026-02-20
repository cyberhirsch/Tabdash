# Architecture Overview

TabDash is built with a modern, decoupled architecture focusing on simplicity, real-time updates, and a glassmorphism aesthetic.

## 🏗️ System Components

### 1. Frontend (React + Vite)
- **Framework**: React 18 with functional components and hooks.
- **State Management**: [Zustand](https://github.com/pmndrs/zustand). Handles authentication state, dashboard items, and real-time synchronization subscriptions.
- **Grid System**: [React-Grid-Layout](https://github.com/react-grid-layout/react-grid-layout). Provides the responsive, draggable, and resizable interface.
- **Styling**: Vanilla CSS utilizing modern CSS variables for a consistent "Glassmorphism" theme.

### 2. Backend (PocketBase)
- **Database**: SQLite (embedded in PocketBase).
- **Authentication**: Built-in PocketBase auth with a custom `TabdashUsers` collection.
- **File Storage**: Handles widget icons and user-uploaded files.
- **Real-time**: Leverages PocketBase's SSE (Server-Sent Events) for instant dashboard updates across devices.

## 📊 Data Model

### TabDash Collection
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
Upon initialization, the store calls `subscribe()`. Any changes made to the `TabDash` collection (even from a different browser) are pushed via SSE and reflected instantly in the local Zustand state.
