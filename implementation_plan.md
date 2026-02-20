# Tabdash (Launcher Edition) - Implementation Plan

Tabdash is a high-performance, web-based OS Launcher inspired by mobile systems (Android/iOS) and power-user desktop environments. 

Confirmed PocketBase version: **v0.35.1**.

---

## 1. Technical Vision
**"Think OS, not Website."**
- **Architecture**: Decoupled React (Vite) frontend with a PocketBase (SQLite/Go) backend.
- **Performance**: <300ms load time via "Stale-While-Revalidate" (localStorage cache + background sync).
- **Aesthetic**: Glassmorphism, dynamic grid density, squircle icons, desktop-parity interactions (Right-click, Copy/Paste).
- **Interactions**: Dual-input model (Single Tiny Cogwheel in corner for deep setup/login + Right-click context menu for quick actions).
- **Canvas**: Fully customizable grid system (default 32x16) with user-selectable icon sizes and sub-grid snapping.

### Backend (PocketBase on Raspberry Pi)
- **Deployment**: Already running on Pi.
- **Logic**: JS Hooks for image processing (`sharp`) and the **Icon Proxy Service**. Note: Node.js and dependencies (sharp, metascraper) must be installed on the Pi in the `pb_hooks` directory.
- **Security**: API Rules enforced via `@request.auth.id = owner.id`.

### Frontend (React)
- **Layout**: `react-grid-layout` configured for a 32x16 grid with sub-grid snapping.
- **State**: `Zustand` for global UI states; `PocketBase SDK` for real-time sync.

---

## 3. Data Model (PocketBase Collections)

| Collection     | Purpose      | Key Fields                                                                                                                   |
| :------------- | :----------- | :--------------------------------------------------------------------------------------------------------------------------- |
| **users**      | Auth         | Standard PB fields                                                                                                           |
| **boards**     | Layouts      | `owner`, `name`, `background_image`, `grid_config` (JSON: {cols, rows}), `icon_config` (JSON: {size, padding}), `custom_css` |
| **widgets**    | Grid Items   | `board`, `type` (link_grid, weather, rss, notes, iframe), `position` (JSON), `config` (JSON)                                 |
| **items**      | Files/Links  | `type` (file, link, folder), `file_payload`, `parent_folder`, `coordinates` (JSON)                                           |
| **icon_cache** | Optimization | `domain` (Unique), `icon_file`                                                                                               |

---

### 4. Feature Loop: The Icon Scraper & Proxy
- **Scraper (Factory)**: Triggers on first link drop; scrapes metatags for high-res icons.
- **Cache (Warehouse)**: Stores processed icons in `icon_cache` collection to avoid redundant scraping and bypass CORS.

### Smart Canvas Interactions
- **Widget Addition**: Via "Plus" button in Cogwheel settings OR Right-click on empty grid space.
- **Direct File Injection**: Drag files from desktop → Auto-upload to PB → Generate widget at drop coordinates.
- **URL Drop**: Drag URL → Trigger Scraper → Create Link Widget.

---

## 5. Widget Library (Phase 1)
- **Bookmarks**: A clean grid of cached icons.
- **Search Bar**: Customizable (Google, DuckDuckGo).
- **Weather**: OpenWeatherMap API integration.
- **RSS Parser**: Backend-parsed to bypass CORS.
- **Notes**: Persistent scratchpad per board.

---

## 6. Raspberry Pi Setup & Deployment
- **Hooks Deployment**: `sharp`, `metascraper`, etc., need to be installed in the Pi's `pb_hooks` folder via `npm install`.
- **Environment Variables**:
    - Ensure `DISABLE_REGISTRATION` and `BASE_URL` are set on the Pi environment.
- **Settings**: A "tiny cowheel" in the corner for global configuration.
