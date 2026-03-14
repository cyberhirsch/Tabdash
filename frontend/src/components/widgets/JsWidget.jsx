import React, { useEffect, useRef, useState } from 'react';

export const JsWidget = ({ config = {} }) => {
    const code = config.code || 'document.getElementById("custom-js-output").innerText = "Hello Custom JS!";';
    const iframeRef = useRef(null);

    useEffect(() => {
        if (iframeRef.current) {
            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { color: white; font-family: sans-serif; margin: 0; padding: 16px; display: flex; align-items: center; justify-content: center; height: 100vh; box-sizing: border-box; }
                    </style>
                </head>
                <body>
                    <div id="custom-js-output">Running...</div>
                    <script>${code}</script>
                </body>
                </html>
            `;
            iframeRef.current.srcdoc = html;
        }
    }, [code]);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <iframe
                ref={iframeRef}
                title="Custom JS Sandbox"
                style={{ width: '100%', height: '100%', border: 'none' }}
                sandbox="allow-scripts"
            />
        </div>
    );
};

export const JsWidgetSettings = ({ config, setConfig }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Custom Javascript Code</span>
            <textarea
                value={config.code || ''}
                onChange={(e) => setConfig({ ...config, code: e.target.value })}
                style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white',
                    borderRadius: `calc(4px * var(--radius-scale, 1))`,
                    padding: '8px',
                    fontFamily: 'monospace',
                    height: '150px',
                    resize: 'none'
                }}
                placeholder="document.getElementById('custom-js-output').innerText = 'Hello';"
            />
        </div>
    );
};
