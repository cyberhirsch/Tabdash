# Widget Development Guide

TabDash is designed to be extensible. Adding a new widget involves creating a component and registering it in the `GridItem` and `Canvas` components.

## 🧱 Widget Structure

Widgets are located in `frontend/src/components/widgets/`. A standard widget should:
1. Accept a `config` prop for settings.
2. Be self-contained in its styling.
3. Handle its own internal logic (e.g., timers for clocks).

### Example Skeleton:
```jsx
export const MyNewWidget = ({ config }) => {
    return (
        <div style={{ padding: '20px' }}>
            <h3>{config.title || 'New Widget'}</h3>
        </div>
    );
};
```

## 🔌 Steps to Add a New Widget

### 1. Create the Component
Create `frontend/src/components/widgets/MyNewWidget.jsx`.

### 2. Register in GridItem
Update `frontend/src/components/GridItem.jsx` to render your widget based on `item.config.type`.

```jsx
if (item.config?.type === 'my-new-type') {
    content = <MyNewWidget config={item.config} />;
}
```

### 3. Add to Context Menu
Update `frontend/src/components/Canvas.jsx` to include an "Add" option for your new widget.

```jsx
{ 
    label: 'Add My Widget', 
    icon: <Plus size={16} />, 
    onClick: () => handleCreate('widget', { 
        name: 'My Widget', 
        fields: { config: { type: 'my-new-type' } }, 
        position: { x: 0, y: 0, w: 4, h: 4 } 
    }) 
}
```

## ⚙️ Widget Settings
Widgets can have custom settings toggled via the Context Menu. See the `ClockWidget` "Analog/Digital" implementation in `Canvas.jsx` for a reference on how to use `updateItem` to modify `config` properties.
