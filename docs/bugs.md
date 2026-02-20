# 🐛 Known Bugs & Issues

This document tracks known bugs, limitations, and edge cases in Tabdash.

## Critical Issues
- **Favicon Regressions**: Investigating why icons are failing to load. Might be `sz=64` param incompatibility or URL parsing issues.
- [x] **Drag Duplication/Ghosting**: (Fixed) removed wrapping div and disabled CSS transitions during drag.
- [x] **Link Dragging failure**: (Fixed) correctly assigned `drag-handle` class to non-widget items.

## UI/UX Issues
- **Grid Persistence**: Settings reset on refresh (Implementation in progress).
- **CORS Restricted Favicons**: A few websites block direct icon fetching; these currently fall back to the generic globe icon.
- **Search Widget Scope**: The search widget defaults to Google; currently no way to switch search engines without code changes.

## Backend/Sync
- **Real-time Collision**: If two users edit the same item's position simultaneously, the last write wins (no advanced conflict resolution).
- **Mobile Layout**: The grid layout is not yet fully optimized for touch-based drag-and-drop.
