# 📜 Changelog

All notable changes to the Tabtop project will be documented in this file.

## [2026-03-12] - Admin Panel & User Security
### Added
- **Admin Dashboard**: New administrative panel for managing all user accounts.
- **Account Type Management**: Ability to toggle users between `trial`, `member`, `patron`, and `admin` statuses via a secure UI.
- **Admin Bypass**: Automatic bypass of the "Trial Expired" screen for `admin` and `patron` accounts.
- **Diagnostic Info**: Added a hidden diagnostic viewer and account refresh button to the trial expiry screen to troubleshoot account status issues.
- **Admin API Rules**: Updated PocketBase schema to allow administrators to list and update other user records while maintaining private data for standard users.

### Fixed
- **Array-based Roles**: Resolved a bug where PocketBase select fields (like `account_type`) were returned as arrays, causing logic failures in identity checks.
- **Stale Account Sessions**: Implemented `authRefresh` logic to ensure account status updates (like becoming a Patron) are reflected immediately without requiring a logout.

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
