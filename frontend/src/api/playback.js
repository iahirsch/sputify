export async function playback(device_id, songUris, playerReady, pause) {
    const accessToken = localStorage.getItem('access_token');
    const hasValidDevice = !!device_id && device_id !== 'null' && device_id !== 'undefined';
    const playbackUrl = hasValidDevice
        ? `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`
        : 'https://api.spotify.com/v1/me/player/play';
    const pauseUrl = hasValidDevice
        ? `https://api.spotify.com/v1/me/player/pause?device_id=${device_id}`
        : 'https://api.spotify.com/v1/me/player/pause';

    if (playerReady) {
        if (pause) {
            const response = await fetch(pauseUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                console.error('Failed to pause playback:', response.status, response.statusText);
            }
        } else {
            const response = await fetch(playbackUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'uris': songUris
                })
            });
            if (!response.ok) {
                console.error('Failed to start playback:', response.status, response.statusText);
            }
        }
    } else {
        console.warn('Player not ready. Cannot play music.');
    }
}