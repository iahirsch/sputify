export async function playback(device_id, songUris, playerReady) {
    const accessToken = localStorage.getItem('access_token');
    console.log(device_id);

    if (playerReady) {
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "uris": songUris,
                play: true
            })
        });
    } else {
        console.warn('Player not ready. Cannot play music.');
    }
}