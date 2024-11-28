export async function playback(device_id, songUris, playerReady, pause) {
    const accessToken = localStorage.getItem('access_token');

    if (playerReady) {
        if (pause) {
            fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${device_id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                }
            });
        } else {
            fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'uris': songUris
                })
            });
        }

    } else {
        console.warn('Player not ready. Cannot play music.');
    }
}