# 📜 Changelog

All notable changes to the Tabdash project will be documented in this file.

## [2026-02-20] - UI Overhaul & Customization
### Added
- **Favicon Support**: Automatic favicon fetching for link shortcuts using Google's favicon service.
- **Rename Feature**: Context menu option to rename Links and Files.
- **Icon-Only Mode**: Shortcuts can now have empty names for a minimal look.
- **Theme Color Pickers**: Custom Primary and Secondary accent color selection in Settings.
- **Dynamic Grid Configuration**: Sliders for grid column density and row height.
- **Grid Preview**: Semi-transparent grid overlay that appears when changing settings and fades out after 10 seconds.
- **Architecture Docs**: Added detailed technical documentation for architecture, widgets, and security.

### Changed
- **Visual Distinction**: Refactored `GridItem` to differentiate between "Widgets" (framed, resizable) and "Shortcuts" (frameless desktop icons).
- **Project Structure**: Organized local documentation into the `docs/` folder.
- **Security**: Moved hardcoded API URLs to environment variables (`.env`).

### Fixed
- **State Cleanup**: Resolved several React/ESLint warnings regarding unused variables and duplicate JSX tags.
- **Layout Persistence**: Improved the layout sync logic to prevent unnecessary backend updates.

---

## [Initial Development] - The Foundation
### Added
- Core dashboard with `react-grid-layout`.
- PocketBase backend integration.
- Standard widgets: Clock, Weather, RSS, and Search.
- Drag-and-drop support for files and URLs.
- User authentication (Login/Sign-up).
