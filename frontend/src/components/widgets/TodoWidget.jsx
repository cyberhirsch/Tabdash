import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Trash2, CheckSquare, Square } from 'lucide-react';

export const TodoWidget = ({ config = {}, item }) => {
    const { updateItem } = useStore();
    const todos = config.todos || [];
    const [newTask, setNewTask] = useState('');

    const saveTodos = async (newTodos) => {
        if (item && item.id) {
            await updateItem(item.id, { config: { ...config, todos: newTodos } });
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        const newTodos = [...todos, { id: Date.now(), text: newTask, done: false }];
        await saveTodos(newTodos);
        setNewTask('');
    };

    const toggleDone = async (id) => {
        const newTodos = todos.map(t => t.id === id ? { ...t, done: !t.done } : t);
        await saveTodos(newTodos);
    };

    const deleteTodo = async (id) => {
        const newTodos = todos.filter(t => t.id !== id);
        await saveTodos(newTodos);
    };

    return (
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: 'var(--accent-primary)' }}>To Do</h3>
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '12px' }}>
                {todos.map(todo => (
                    <div key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div onClick={() => toggleDone(todo.id)} style={{ cursor: 'pointer', display: 'flex' }}>
                            {todo.done ? <CheckSquare size={16} opacity={0.8} /> : <Square size={16} opacity={0.6} />}
                        </div>
                        <span style={{
                            flex: 1,
                            fontSize: '0.9rem',
                            textDecoration: todo.done ? 'line-through' : 'none',
                            opacity: todo.done ? 0.6 : 1
                        }}>
                            {todo.text}
                        </span>
                        <Trash2
                            size={14}
                            onClick={() => deleteTodo(todo.id)}
                            style={{ cursor: 'pointer', opacity: 0.5 }}
                            onMouseEnter={(e) => e.target.style.opacity = 1}
                            onMouseLeave={(e) => e.target.style.opacity = 0.5}
                        />
                    </div>
                ))}
            </div>
            <form onSubmit={handleAdd} style={{ display: 'flex', gap: '8px' }}>
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="New task..."
                    style={{
                        flex: 1,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '6px 10px',
                        borderRadius: `calc(6px * var(--radius-scale, 1))`,
                        color: 'white',
                        fontSize: '0.85rem'
                    }}
                />
                <button type="submit" style={{
                    background: 'var(--accent-primary)', border: 'none', borderRadius: `calc(6px * var(--radius-scale, 1))`,
                    padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'white'
                }}>
                    <Plus size={16} />
                </button>
            </form>
        </div>
    );
};

export const TodoWidgetSettings = ({ config, setConfig }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>No configurable settings. Tasks are managed on the widget itself.</span>
        </div>
    );
};
