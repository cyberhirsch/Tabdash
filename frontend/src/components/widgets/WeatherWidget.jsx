import React, { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Thermometer, CloudLightning, CloudSnow, Wind, CloudFog, Navigation } from 'lucide-react';


const WEATHER_ICONS = {
    clear: <Sun size={28} color="#fcd34d" />,
    sunny: <Sun size={28} color="#fcd34d" />,
    cloudy: <Cloud size={28} color="#94a3b8" />,
    partly: <Cloud size={28} color="#94a3b8" />,
    rain: <CloudRain size={28} color="#7dd3fc" />,
    drizzle: <CloudRain size={28} color="#7dd3fc" />,
    snow: <CloudSnow size={28} color="#bae6fd" />,
    storm: <CloudLightning size={28} color="#fcd34d" />,
    fog: <CloudFog size={28} color="#94a3b8" />,
    mist: <CloudFog size={28} color="#94a3b8" />,
    windy: <Wind size={28} color="#94a3b8" />,
};

const getIcon = (desc) => {
    const d = desc.toLowerCase();
    if (d.includes('storm') || d.includes('lightning') || d.includes('thunder')) return WEATHER_ICONS.storm;
    if (d.includes('snow') || d.includes('ice') || d.includes('blizzard')) return WEATHER_ICONS.snow;
    if (d.includes('rain') || d.includes('drizzle') || d.includes('shower')) return WEATHER_ICONS.rain;
    if (d.includes('fog') || d.includes('mist') || d.includes('haze')) return WEATHER_ICONS.fog;
    if (d.includes('wind')) return WEATHER_ICONS.windy;
    if (d.includes('partly') || d.includes('broken') || d.includes('overcast')) return WEATHER_ICONS.partly;
    if (d.includes('cloud')) return WEATHER_ICONS.cloudy;
    if (d.includes('clear') || d.includes('sunny')) return WEATHER_ICONS.sunny;
    return <Cloud size={28} color="#94a3b8" />;
};

export const WeatherWidget = ({ config = {} }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const city = config.city || 'Berlin';
    const unit = config.unit || 'C';
    const service = config.service || 'openmeteo';

    useEffect(() => {
        // Clear stale data immediately — no old values shown during transition
        setWeather(null);
        setLoading(true);

        const fetchWeather = async () => {
            try {
                const hasCoords = config.lat != null && config.lon != null;

                if (service === 'wttr') {
                    const location = hasCoords
                        ? `${config.lat},${config.lon}`
                        : encodeURIComponent(city);
                    const res = await fetch(`https://wttr.in/${location}?format=j1`);
                    if (!res.ok) throw new Error(`wttr.in error: ${res.status}`);
                    const data = await res.json();
                    const current = data.current_condition[0];
                    const forecast = data.weather.slice(1, 4).map(d => ({
                        date: d.date,
                        max: unit === 'C' ? d.maxtempC : d.maxtempF,
                        min: unit === 'C' ? d.mintempC : d.mintempF,
                        desc: d.hourly[4].weatherDesc[0].value
                    }));
                    setWeather({
                        current: {
                            temp: unit === 'C' ? current.temp_C : current.temp_F,
                            desc: current.weatherDesc[0].value,
                        },
                        forecast
                    });

                } else if (service === 'openmeteo') {
                    let latitude = config.lat;
                    let longitude = config.lon;
                    if (!hasCoords) {
                        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
                        const geoData = await geoRes.json();
                        if (!geoData.results?.length) throw new Error('City not found');
                        latitude = geoData.results[0].latitude;
                        longitude = geoData.results[0].longitude;
                    }
                    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&temperature_unit=${unit === 'C' ? 'celsius' : 'fahrenheit'}`);
                    if (!weatherRes.ok) throw new Error(`Open-Meteo error: ${weatherRes.status}`);
                    const data = await weatherRes.json();
                    const mapCode = (c) => {
                        if (c === 0) return 'Sunny';
                        if (c < 4) return 'Partly Cloudy';
                        if (c < 50) return 'Cloudy';
                        if (c < 70) return 'Rainy';
                        return 'Stormy';
                    };
                    setWeather({
                        current: {
                            temp: Math.round(data.current.temperature_2m),
                            desc: mapCode(data.current.weather_code)
                        },
                        forecast: data.daily.time.slice(1, 4).map((t, i) => ({
                            date: t,
                            max: Math.round(data.daily.temperature_2m_max[i + 1]),
                            min: Math.round(data.daily.temperature_2m_min[i + 1]),
                            desc: mapCode(data.daily.weather_code[i + 1])
                        }))
                    });

                } else if (service === 'openweathermap') {
                    if (!config.apiKey) throw new Error('API Key required');
                    const locationParam = hasCoords
                        ? `lat=${config.lat}&lon=${config.lon}`
                        : `q=${encodeURIComponent(city)}`;
                    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?${locationParam}&units=${unit === 'C' ? 'metric' : 'imperial'}&appid=${config.apiKey}`);
                    const data = await res.json();
                    if (data.cod !== '200') throw new Error(data.message);
                    setWeather({
                        current: {
                            temp: Math.round(data.list[0].main.temp),
                            desc: data.list[0].weather[0].main
                        },
                        forecast: [8, 16, 24].map(idx => ({
                            date: data.list[idx].dt_txt.split(' ')[0],
                            max: Math.round(data.list[idx].main.temp_max),
                            min: Math.round(data.list[idx].main.temp_min),
                            desc: data.list[idx].weather[0].main
                        }))
                    });
                }
            } catch {
                // Silently fail — widget stays blank, no error shown
                setWeather(null);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
        const t = setInterval(fetchWeather, 3600000);
        return () => clearInterval(t);
    }, [city, unit, service, config.apiKey, config.lat, config.lon]);

    // Show nothing while fetching or if fetch failed — no placeholders, no errors
    if (loading || !weather) return <div style={{ width: '100%', height: '100%' }} />;

    const currentIcon = getIcon(weather.current.desc);

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '16px', gap: '12px' }}>
            {/* Main Weather */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ transform: 'scale(1.2)' }}>{currentIcon}</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '1.8rem', fontWeight: '800', lineHeight: 1 }}>{weather.current.temp}°</span>
                        <span style={{ fontSize: '0.7rem', opacity: 0.5, fontWeight: '700', letterSpacing: '0.5px' }}>{weather.current.desc.toUpperCase()}</span>
                    </div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.8 }}>
                        <Navigation size={10} style={{ transform: 'rotate(45deg)' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>{city.toUpperCase()}</span>
                    </div>
                    <span style={{ fontSize: '0.6rem', opacity: 0.4, fontWeight: '700' }}>{service.toUpperCase()} SERVICE</span>
                </div>
            </div>

            {/* Forecast */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                {weather.forecast.map((day, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '0.65rem', opacity: 0.5, fontWeight: '700' }}>
                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                        </span>
                        <div style={{ transform: 'scale(0.8)' }}>{getIcon(day.desc)}</div>
                        <div style={{ display: 'flex', gap: '4px', fontSize: '0.75rem', fontWeight: '700' }}>
                            <span>{day.max}°</span>
                            <span style={{ opacity: 0.3 }}>{day.min}°</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const WeatherWidgetSettings = ({ config, setConfig }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState(config.city || '');

    useEffect(() => {
        if (!query || query.length < 2) return;

        const fetchSuggestions = async () => {
            setLoading(true);
            try {
                const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
                const data = await res.json();
                setSuggestions(data.results || []);
            } catch (err) {
                console.error('Geocoding error:', err);
            }
            setLoading(false);
        };

        const timeout = setTimeout(fetchSuggestions, 500);
        return () => clearTimeout(timeout);
    }, [query]);

    const handleSelect = (s) => {
        const cityName = `${s.name}${s.admin1 ? `, ${s.admin1}` : ''}, ${s.country}`;
        setQuery(cityName);
        setConfig({
            ...config,
            city: cityName,
            lat: s.latitude,
            lon: s.longitude
        });
        setSuggestions([]);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.8, fontWeight: '600' }}>City</span>
                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            if (e.target.value.length < 2) setSuggestions([]);
                        }}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: 'calc(8px * var(--radius-scale, 1))', padding: '10px' }}
                        placeholder="Type city name..."
                    />
                    {loading && (
                        <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '0.7rem' }}>
                            ...
                        </div>
                    )}
                </div>

                {suggestions.length > 0 && (
                    <div style={{
                        position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
                        background: 'var(--bg-primary)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px', marginTop: '4px', overflow: 'hidden',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                    }}>
                        {suggestions.map((s, i) => (
                            <div
                                key={i}
                                onClick={() => handleSelect(s)}
                                style={{
                                    padding: '10px 12px', cursor: 'pointer', transition: 'background 0.2s',
                                    borderBottom: i === suggestions.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)',
                                    display: 'flex', flexDirection: 'column'
                                }}
                                className="suggestion-item"
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                            >
                                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{s.name}</span>
                                <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>
                                    {s.admin1 ? `${s.admin1}, ` : ''}{s.country}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '0.8rem', opacity: 0.8, fontWeight: '600' }}>Service</span>
                    <select
                        value={config.service || 'openmeteo'}
                        onChange={(e) => setConfig({ ...config, service: e.target.value })}
                        style={{ background: 'var(--bg-primary)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: 'calc(8px * var(--radius-scale, 1))', padding: '10px' }}
                    >
                        <option value="wttr">wttr.in (Unified)</option>
                        <option value="openmeteo">Open-Meteo (Precise)</option>
                        <option value="openweathermap">OpenWeatherMap</option>
                    </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '0.8rem', opacity: 0.8, fontWeight: '600' }}>Unit</span>
                    <select
                        value={config.unit || 'C'}
                        onChange={(e) => setConfig({ ...config, unit: e.target.value })}
                        style={{ background: 'var(--bg-primary)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: 'calc(8px * var(--radius-scale, 1))', padding: '10px' }}
                    >
                        <option value="C">Celsius (°C)</option>
                        <option value="F">Fahrenheit (°F)</option>
                    </select>
                </div>
            </div>

            {config.service === 'openweathermap' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '0.8rem', opacity: 0.8, fontWeight: '600' }}>API Key</span>
                    <input
                        type="password"
                        value={config.apiKey || ''}
                        onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: 'calc(8px * var(--radius-scale, 1))', padding: '10px' }}
                        placeholder="Paste your key here..."
                    />
                    <p style={{ fontSize: '0.65rem', opacity: 0.4 }}>Required for OpenWeatherMap service.</p>
                </div>
            )}
        </div>
    );
};
