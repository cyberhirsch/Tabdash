# 📝 TabDash Project TODO

## High Priority
- [x] **Grid Preview on Drag**: The grid overlay now appears automatically whenever an item is being moved, providing immediate feedback for snapping.
- [x] **Free Positioning**: Disabled "auto-arrange" (vertical compaction). Items can now be placed anywhere on the canvas without snapping to the top.
- [x] **Adjustable Icon Size**: Added a slider in Settings to control the visual size of desktop icons and favicons globally.
- [x] **Project Branding**: Created a new custom SVG favicon and updated the page title to "Tabdash".
- [x] **Widget Overlays**: Added Settings (cog) and Close (x) buttons that appear on widget hover.
- [x] **Clock Customization**: Implemented Digital and Analog modes with smooth animations and customizable formats (12/24h).
- [x] **Self-Contained Widgets**: Refactored widgets to export their own settings components, making the architecture modular.
- [ ] **Expanded Clock Settings**: Add Timezone selection and custom label fields.
- [x] **Custom Theme Colors**: Primary and Secondary accent color pickers added to the Appearance section in Settings.
- [ ] **Grid Persistence**: 
  - [x] Added `preferences` field to `TabdashUsers` collection schema.
  - [x] Implemented local state for `cols`, `rowHeight`, and `iconSize`.
  - [ ] Implement backend save/load for `gridConfig` and `themeConfig`.

## Low Priority / Ideas
- [ ] **Widget Store**: A way to browse and add community-made widgets.
- [ ] **Multi-Board Support**: Add a "Board" switcher to have different dashboards for Work, Personal, etc.
- [ ] **Theming**: Custom accent colors beyond the default indigo/purple.
