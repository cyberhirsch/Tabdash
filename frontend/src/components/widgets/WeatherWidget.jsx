import React, { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Thermometer } from 'lucide-react';

export const WeatherWidget = ({ config = {} }) => {
    const [weather, setWeather] = useState(null);
    const city = config.city || 'Berlin';

    useEffect(() => {
        // Mock weather data for now (since we need an API key)
        const fetchWeather = () => {
            setTimeout(() => {
                setWeather({
                    temp: 18,
                    condition: 'Parly Cloudy',
                    icon: <Cloud size={32} color="#94a3b8" />
                });
            }, 1000);
        };
        fetchWeather();
    }, [city]);

    if (!weather) return <div style={{ opacity: 0.5, fontSize: '0.8rem', padding: '16px' }}>Loading weather...</div>;

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '12px',
                gap: '4px'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {weather.icon}
                <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>{weather.temp}°</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.7 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>{city}</span>
                <span style={{ fontSize: '0.7rem' }}>{weather.condition}</span>
            </div>
        </div>
    );
};

export const WeatherWidgetSettings = ({ config, setConfig }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>City</span>
                <input
                    type="text"
                    value={config.city || ''}
                    onChange={(e) => setConfig({ ...config, city: e.target.value })}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px', padding: '8px' }}
                    placeholder="Enter city name..."
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Temperature Unit</span>
                <select
                    value={config.unit || 'C'}
                    onChange={(e) => setConfig({ ...config, unit: e.target.value })}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px', padding: '4px 8px' }}
                >
                    <option value="C">Celsius (°C)</option>
                    <option value="F">Fahrenheit (°F)</option>
                </select>
            </div>
        </div>
    );
};
