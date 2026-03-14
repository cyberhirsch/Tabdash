import React, { useEffect, useState } from 'react';
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

// ─── iCal Parser ──────────────────────────────────────────────────────────────

const parseIcalDate = (raw) => {
    const str = raw.replace(/^VALUE=DATE:/i, '').replace(/^TZID=[^:]+:/i, '');
    if (str.length === 8) {
        return {
            date: new Date(parseInt(str.slice(0, 4)), parseInt(str.slice(4, 6)) - 1, parseInt(str.slice(6, 8))),
            allDay: true,
        };
    }
    const iso = str.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)/, '$1-$2-$3T$4:$5:$6$7');
    return { date: new Date(iso), allDay: false };
};

const parseIcal = (text) => {
    const events = [];
    const lines = text.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '').split(/\r\n|\n|\r/);
    let inEvent = false;
    let ev = {};
    for (const line of lines) {
        if (line === 'BEGIN:VEVENT') { inEvent = true; ev = {}; continue; }
        if (line === 'END:VEVENT') { inEvent = false; if (ev.start && ev.summary) events.push(ev); continue; }
        if (!inEvent) continue;
        const colon = line.indexOf(':');
        if (colon === -1) continue;
        const keyFull = line.slice(0, colon);
        const key = keyFull.split(';')[0].toUpperCase();
        const params = keyFull.includes(';') ? keyFull.slice(keyFull.indexOf(';') + 1) : '';
        const val = line.slice(colon + 1);
        switch (key) {
            case 'SUMMARY': ev.summary = val.replace(/\\,/g, ',').replace(/\\n/g, '\n'); break;
            case 'DESCRIPTION': ev.description = val.replace(/\\,/g, ',').replace(/\\n/g, '\n'); break;
            case 'LOCATION': ev.location = val.replace(/\\,/g, ','); break;
            case 'DTSTART': ev.start = parseIcalDate(params ? `${params}:${val}` : val); break;
            case 'DTEND': ev.end = parseIcalDate(params ? `${params}:${val}` : val); break;
            case 'UID': ev.uid = val; break;
            default: break;
        }
    }
    return events;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const startOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0=Sun
    const diff = day === 0 ? -6 : 1 - day; // adjust to Monday
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
};

// Default feed colors for new feeds
const FEED_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6', '#f97316'];

// Route fetches through PocketBase server to avoid CORS issues on the deployed site
const PB_URL = import.meta.env.VITE_POCKETBASE_URL || 'https://api.sebhirsch.com';
const pbProxy = (url) => `${PB_URL}/api/tabtop/proxy?url=${encodeURIComponent(url)}`;

const eventsOnDay = (events, date) =>
    events.filter(ev => isSameDay(ev.start.date, date));

const DAY_NAMES = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

// ─── Week View ────────────────────────────────────────────────────────────────

const WeekView = ({ anchorDate, events }) => {
    const today = new Date();
    const weekStart = startOfWeek(anchorDate);
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        return d;
    });

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 10px 10px' }}>
            {/* Day columns */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {days.map((day, i) => {
                    const isToday = isSameDay(day, today);
                    const dayEvents = eventsOnDay(events, day);
                    return (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            {/* Day name */}
                            <span style={{ fontSize: '0.6rem', opacity: 0.4, fontWeight: '700', textTransform: 'uppercase' }}>
                                {DAY_NAMES[i]}
                            </span>
                            {/* Day number */}
                            <div style={{
                                width: '28px', height: '28px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: isToday ? 'var(--accent-primary)' : 'transparent',
                                color: isToday ? 'white' : 'inherit',
                                fontWeight: isToday ? '800' : '400',
                                fontSize: '0.85rem',
                            }}>
                                {day.getDate()}
                            </div>
                            {/* Event dots */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', justifyContent: 'center', minHeight: '8px' }}>
                                {dayEvents.slice(0, 3).map((ev, j) => (
                                    <div key={j} title={ev.summary} style={{
                                        width: '6px', height: '6px', borderRadius: '50%',
                                        background: ev.color || FEED_COLORS[0],
                                        flexShrink: 0,
                                    }} />
                                ))}
                                {dayEvents.length > 3 && (
                                    <span style={{ fontSize: '0.5rem', opacity: 0.5 }}>+{dayEvents.length - 3}</span>
                                )}
                            </div>
                            {/* Event titles (compact) */}
                            {dayEvents.slice(0, 2).map((ev, j) => (
                                <div key={j} title={ev.summary} style={{
                                    width: '100%', fontSize: '0.55rem', lineHeight: '1.2',
                                    padding: '1px 3px', borderRadius: '3px',
                                    background: `${ev.color || FEED_COLORS[0]}33`,
                                    borderLeft: `2px solid ${ev.color || FEED_COLORS[0]}`,
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                }}>
                                    {ev.summary}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ─── Month View ───────────────────────────────────────────────────────────────

const MonthView = ({ anchorDate, events }) => {
    const today = new Date();
    const year = anchorDate.getFullYear();
    const month = anchorDate.getMonth();

    const firstDay = new Date(year, month, 1);
    // offset so week starts on Monday
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

    const cells = Array.from({ length: totalCells }, (_, i) => {
        const dayNum = i - startOffset + 1;
        if (dayNum < 1 || dayNum > daysInMonth) return null;
        const d = new Date(year, month, dayNum);
        return d;
    });

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 10px 10px', gap: '4px' }}>
            {/* Day name headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '2px' }}>
                {DAY_NAMES.map(d => (
                    <div key={d} style={{ textAlign: 'center', fontSize: '0.6rem', opacity: 0.4, fontWeight: '700' }}>{d}</div>
                ))}
            </div>
            {/* Day grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', flex: 1 }}>
                {cells.map((day, i) => {
                    if (!day) return <div key={i} />;
                    const isToday = isSameDay(day, today);
                    const dayEvents = eventsOnDay(events, day);
                    const isCurrentMonth = day.getMonth() === month;
                    return (
                        <div key={i} style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                            opacity: isCurrentMonth ? 1 : 0.25,
                        }}>
                            <div style={{
                                width: '22px', height: '22px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: isToday ? 'var(--accent-primary)' : 'transparent',
                                color: isToday ? 'white' : 'inherit',
                                fontWeight: isToday ? '800' : '400',
                                fontSize: '0.72rem',
                                flexShrink: 0,
                            }}>
                                {day.getDate()}
                            </div>
                            {/* Event dots */}
                            <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {dayEvents.slice(0, 3).map((ev, j) => (
                                    <div key={j} title={ev.summary} style={{
                                        width: '5px', height: '5px', borderRadius: '50%',
                                        background: ev.color || FEED_COLORS[0],
                                    }} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ─── Day View ─────────────────────────────────────────────────────────────────

const DayView = ({ anchorDate, events }) => {
    const today = new Date();
    const isToday = isSameDay(anchorDate, today);
    const dayEvents = eventsOnDay(events, anchorDate)
        .sort((a, b) => a.start.date - b.start.date);

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 12px 10px', gap: '6px', overflowY: 'auto' }}>
            {dayEvents.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '24px', opacity: 0.3, fontSize: '0.8rem' }}>
                    {isToday ? 'Nothing scheduled today' : 'No events this day'}
                </div>
            ) : (
                dayEvents.map((ev, i) => (
                    <div key={i} style={{
                        display: 'flex', gap: '10px', alignItems: 'flex-start',
                        padding: '8px 10px',
                        background: `${ev.color || FEED_COLORS[0]}18`,
                        borderRadius: 'calc(8px * var(--radius-scale, 1))',
                        borderLeft: `3px solid ${ev.color || FEED_COLORS[0]}`,
                    }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: '600', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {ev.summary}
                            </div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '2px' }}>
                                {ev.start.allDay ? 'All day' : ev.start.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                {ev.location && ` · ${ev.location}`}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

// ─── List View ────────────────────────────────────────────────────────────────

const ListView = ({ events, count = 6 }) => {
    const now = new Date();
    const upcoming = events
        .filter(ev => ev.start.date >= now || isSameDay(ev.start.date, now))
        .sort((a, b) => a.start.date - b.start.date)
        .slice(0, count);

    const relativeDay = (date) => {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const d = new Date(date); d.setHours(0, 0, 0, 0);
        const diff = Math.round((d - today) / 86400000);
        if (diff === 0) return 'Today';
        if (diff === 1) return 'Tomorrow';
        if (diff < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 12px 10px', gap: '5px', overflowY: 'auto' }}>
            {upcoming.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '24px', opacity: 0.3, fontSize: '0.8rem' }}>No upcoming events</div>
            ) : (
                upcoming.map((ev, i) => (
                    <div key={i} style={{
                        display: 'flex', gap: '10px', alignItems: 'center',
                        padding: '7px 10px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: 'calc(8px * var(--radius-scale, 1))',
                        borderLeft: `3px solid ${ev.color || FEED_COLORS[0]}`,
                    }}>
                        {/* Date badge */}
                        <div style={{ textAlign: 'center', flexShrink: 0, width: '36px' }}>
                            <div style={{ fontSize: '0.6rem', fontWeight: '700', textTransform: 'uppercase', opacity: 0.5 }}>
                                {relativeDay(ev.start.date)}
                            </div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.4 }}>
                                {ev.start.allDay ? '·' : ev.start.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                        {/* Title */}
                        <div style={{ flex: 1, fontSize: '0.82rem', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {ev.summary}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

// ─── Widget ───────────────────────────────────────────────────────────────────

export const CalendarWidget = ({ config = {} }) => {
    const [events, setEvents] = useState([]);
    const [refreshTick, setRefreshTick] = useState(0);
    const [anchorDate, setAnchorDate] = useState(new Date());
    const view = config.view || 'week';

    // Support both new `feeds` array and legacy single `url`
    const feeds = config.feeds?.length
        ? config.feeds
        : config.url
            ? [{ url: config.url, color: FEED_COLORS[0] }]
            : [];
    const hasFeeds = feeds.some(f => f.url);

    const fetchOneFeed = async (feed) => {
        let text;
        try {
            const res = await fetch(feed.url, { cache: 'no-cache' });
            if (!res.ok) throw new Error('direct failed');
            text = await res.text();
        } catch {
            // Fallback: route through PocketBase proxy (server-side, no CORS)
            const res = await fetch(pbProxy(feed.url));
            if (!res.ok) throw new Error('proxy failed');
            text = await res.text();
        }
        return parseIcal(text).map(ev => ({ ...ev, color: feed.color || FEED_COLORS[0] }));
    };

    useEffect(() => {
        if (!hasFeeds) return;

        const fetchAll = async () => {
            const results = await Promise.allSettled(
                feeds.filter(f => f.url).map(feed => fetchOneFeed(feed))
            );
            const merged = results
                .filter(r => r.status === 'fulfilled')
                .flatMap(r => r.value);
            setEvents(merged);
        };

        fetchAll();
        const t = setInterval(fetchAll, 15 * 60 * 1000);
        return () => clearInterval(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(feeds), refreshTick]);

    const monthLabel = anchorDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const dayLabel = anchorDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    const handlePrev = () => {
        const d = new Date(anchorDate);
        if (view === 'day') d.setDate(d.getDate() - 1);
        else if (view === 'week') d.setDate(d.getDate() - 7);
        else if (view === 'month') d.setMonth(d.getMonth() - 1);
        // list view: no navigation
        setAnchorDate(d);
    };
    const handleNext = () => {
        const d = new Date(anchorDate);
        if (view === 'day') d.setDate(d.getDate() + 1);
        else if (view === 'week') d.setDate(d.getDate() + 7);
        else if (view === 'month') d.setMonth(d.getMonth() + 1);
        setAnchorDate(d);
    };
    const handleToday = () => setAnchorDate(new Date());

    const headerLabel = {
        day: dayLabel,
        week: `Week of ${startOfWeek(anchorDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
        month: monthLabel,
        list: 'Upcoming',
    }[view] || monthLabel;

    const showNav = view !== 'list';

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '10px 12px 8px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, minWidth: 0 }}>
                    {showNav && (
                        <button onClick={handlePrev}
                            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.4, padding: '2px', display: 'flex', flexShrink: 0 }}
                        ><ChevronLeft size={14} /></button>
                    )}
                    <span
                        onClick={handleToday}
                        style={{ fontWeight: '800', fontSize: '0.82rem', cursor: 'pointer', userSelect: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        title="Go to today"
                    >
                        {headerLabel}
                    </span>
                    {showNav && (
                        <button onClick={handleNext}
                            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.4, padding: '2px', display: 'flex', flexShrink: 0 }}
                        ><ChevronRight size={14} /></button>
                    )}
                    {hasFeeds && (
                        <button onClick={() => setRefreshTick(t => t + 1)}
                            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.3, padding: '2px', display: 'flex', flexShrink: 0, marginLeft: '2px' }}
                            title="Refresh feeds"
                        ><RefreshCw size={10} /></button>
                    )}
                </div>
            </div>

            {/* Calendar view */}
            {view === 'day' && <DayView anchorDate={anchorDate} events={events} />}
            {view === 'week' && <WeekView anchorDate={anchorDate} events={events} />}
            {view === 'month' && <MonthView anchorDate={anchorDate} events={events} />}
            {view === 'list' && <ListView events={events} count={6} />}

            {/* Subtle hint if no feeds configured */}
            {!hasFeeds && (
                <div style={{ textAlign: 'center', padding: '4px 12px 8px', fontSize: '0.6rem', opacity: 0.25 }}>
                    Add an iCal feed in settings to show events
                </div>
            )}
            {hasFeeds && (
                <div style={{ display: 'flex', gap: '4px', padding: '0 12px 8px', flexWrap: 'wrap' }}>
                    {feeds.filter(f => f.url).map((f, i) => (
                        <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: f.color }} title={f.url} />
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Settings ─────────────────────────────────────────────────────────────────

export const CalendarWidgetSettings = ({ config, setConfig }) => {
    const feeds = config.feeds?.length
        ? config.feeds
        : config.url
            ? [{ url: config.url, color: FEED_COLORS[0] }]
            : [{ url: '', color: FEED_COLORS[0] }];

    const updateFeeds = (newFeeds) => setConfig({ ...config, feeds: newFeeds, url: undefined });

    const addFeed = () => updateFeeds([...feeds, { url: '', color: FEED_COLORS[feeds.length % FEED_COLORS.length] }]);

    const removeFeed = (i) => updateFeeds(feeds.filter((_, idx) => idx !== i));

    const updateFeed = (i, patch) => {
        const next = feeds.map((f, idx) => idx === i ? { ...f, ...patch } : f);
        updateFeeds(next);
    };

    const currentView = config.view || 'week';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* View toggle */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '600', opacity: 0.8 }}>Default View</span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {['day', 'week', 'month', 'list'].map(v => (
                        <button key={v} onClick={() => setConfig({ ...config, view: v })} style={{
                            flex: 1, padding: '7px 4px', borderRadius: 'calc(8px * var(--radius-scale, 1))',
                            border: `1px solid ${currentView === v ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)'}`,
                            background: currentView === v ? 'rgba(255,255,255,0.08)' : 'transparent',
                            color: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '0.75rem', textTransform: 'capitalize'
                        }}>{v}</button>
                    ))}
                </div>
            </div>

            {/* Feeds list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '600', opacity: 0.8 }}>iCal Feeds</span>

                {feeds.map((feed, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {/* Color picker */}
                        <input
                            type="color"
                            value={feed.color || FEED_COLORS[i % FEED_COLORS.length]}
                            onChange={(e) => updateFeed(i, { color: e.target.value })}
                            style={{ border: 'none', background: 'none', width: '28px', height: '28px', cursor: 'pointer', padding: 0, flexShrink: 0 }}
                            title="Feed color"
                        />
                        {/* URL input */}
                        <input
                            type="url"
                            value={feed.url || ''}
                            onChange={(e) => updateFeed(i, { url: e.target.value })}
                            style={{
                                flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                color: 'white', borderRadius: 'calc(8px * var(--radius-scale, 1))', padding: '8px 10px', fontSize: '0.75rem'
                            }}
                            placeholder="https://calendar.google.com/calendar/ical/..."
                        />
                        {/* Remove button */}
                        {feeds.length > 1 && (
                            <button
                                onClick={() => removeFeed(i)}
                                style={{ background: 'none', border: 'none', color: 'rgba(255,80,80,0.7)', cursor: 'pointer', fontSize: '1rem', padding: '4px', flexShrink: 0 }}
                                title="Remove feed"
                            >✕</button>
                        )}
                    </div>
                ))}

                <button
                    onClick={addFeed}
                    style={{
                        padding: '8px', borderRadius: 'calc(8px * var(--radius-scale, 1))',
                        border: '1px dashed rgba(255,255,255,0.2)', background: 'transparent',
                        color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.8rem',
                    }}
                >+ Add another feed</button>

                <span style={{ fontSize: '0.65rem', opacity: 0.4 }}>
                    Google Calendar: Settings → "Secret address in iCal format"
                </span>
            </div>
        </div>
    );
};
