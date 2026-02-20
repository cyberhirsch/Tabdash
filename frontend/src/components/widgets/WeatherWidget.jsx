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
            className="glass"
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '12px',
                borderRadius: '16px',
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
