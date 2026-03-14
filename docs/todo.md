# 📝 Tabtop Project TODO

## High Priority
- [x] **Grid Preview on Drag**: The grid overlay now appears automatically whenever an item is being moved, providing immediate feedback for snapping.
- [x] **Free Positioning**: Disabled "auto-arrange" (vertical compaction). Items can now be placed anywhere on the canvas without snapping to the top.
- [x] **Adjustable Icon Size**: Added a slider in Settings to control the visual size of desktop icons and favicons globally.
- [x] **Project Branding**: Created a new custom SVG favicon and updated the page title to "Tabtop".
- [x] **Widget Overlays**: Added Settings (cog) and Close (x) buttons that appear on widget hover.
- [x] **Clock Customization**: Implemented Digital and Analog modes with smooth animations and customizable formats (12/24h).
- [x] **Self-Contained Widgets**: Refactored widgets to export their own settings components, making the architecture modular.
- [ ] **Expanded Clock Settings**: Add Timezone selection and custom label fields.
- [x] **Custom Theme Colors**: Primary and Secondary accent color pickers added to the Appearance section in Settings.
- [x] **Grid Persistence**: 
  - [x] Added `preferences` field to `TabtopUsers` collection schema.
  - [x] Implemented local state for `cols`, `rowHeight`, and `iconSize`.
  - [x] Implement backend save/load for `gridConfig` and `themeConfig`.
- [x] **Admin Dashboard**: 
  - [x] Create dedicated management UI for users and statuses.
  - [x] Implement admin-only API access in PocketBase rules.
  - [x] Add secure toggle for account types (Trial, Patron, Admin).
- [x] **Subscription Bypass**: 
  - [x] Logic to automatically skip trial expiry screen for Admins/Patrons.
  - [x] Fix for array-based role mismatch from PocketBase fields.


