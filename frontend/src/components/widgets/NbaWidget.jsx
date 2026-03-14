import React, { useState, useEffect } from 'react';

export const NbaWidget = ({ config = {} }) => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGames = async () => {
            setLoading(true);
            try {
                // Formatting date for NBA API payload YYYYMMDD
                const now = new Date();
                const timezoneOffset = now.getTimezoneOffset() * 60000;
                const estDate = new Date(now.getTime() - timezoneOffset - (5 * 3600000)); // Rough EST
                const dateString = estDate.toISOString().slice(0, 10).replace(/-/g, '');

                const query = `
                    query games($date: String!) {
                        schedule(date: $date) {
                            gameId
                            playByPlayAvailable
                            isStartTimeTBD
                            gameTimeUTC
                            gameStatus { statusCode statusText }
                            period { current type }
                            clock
                            homeTeam { teamId teamName teamCity teamTricode score inBonus timeoutsRemaining }
                            awayTeam { teamId teamName teamCity teamTricode score inBonus timeoutsRemaining }
                        }
                    }`;

                const res = await fetch("https://nba.rickyg.io/v1/graphql", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ query, variables: { date: dateString } })
                });

                if (res.ok) {
                    const { data } = await res.json();
                    if (data && data.schedule) {
                        setGames(data.schedule);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch NBA games", err);
            }
            setLoading(false);
        };
        fetchGames();
    }, []);

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '16px',
            overflowY: 'auto'
        }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: 'var(--accent-primary)' }}>NBA Games Today</h3>
            {loading ? (
                <p style={{ opacity: 0.5 }}>Loading games...</p>
            ) : games.length === 0 ? (
                <p style={{ opacity: 0.5 }}>No games scheduled for today.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {games.map(game => (
                        <div key={game.gameId} style={{
                            background: 'rgba(255,255,255,0.05)',
                            padding: '12px',
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 'bold' }}>{game.awayTeam.teamTricode}</span>
                                    <span>{game.awayTeam.score}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 'bold' }}>{game.homeTeam.teamTricode}</span>
                                    <span>{game.homeTeam.score}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginLeft: '16px', fontSize: '0.8rem', opacity: 0.8 }}>
                                <span>{game.gameStatus.statusText}</span>
                                {game.clock && <span>{game.clock}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const NbaWidgetSettings = ({ config, setConfig }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>No configurable settings for NBA widget.</span>
        </div>
    );
};
