export async function getWrappedPlaylists(device_id) {
    const accessToken = localStorage.getItem('access_token');

    let wrappedPlaylists = [];

    const playlist2023 = await getPlaylistTracks('37i9dQZF1Fa1IIVtEpGUcU');
    wrappedPlaylists.push({ year: 2023, tracks: playlist2023, index: 3 });

    const playlist2022 = await getPlaylistTracks('37i9dQZF1F0sijgNaJdgit');
    wrappedPlaylists.push({ year: 2022, tracks: playlist2022, index: 4 });

    const playlist2021 = await getPlaylistTracks('37i9dQZF1EUMDoJuT8yJsl');
    wrappedPlaylists.push({ year: 2021, tracks: playlist2021, index: 5 });

    return wrappedPlaylists;

    async function getPlaylistTracks(playlistId) {

        const playResponse = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'context_uri': `spotify:playlist:${playlistId}`
            })
        });
        await new Promise(resolve => setTimeout(resolve, 500));
        if (playResponse.ok) {
            const queueResponse = await fetch(`https://api.spotify.com/v1/me/player/queue`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                }
            });
            if (queueResponse.ok) {
                const queueData = await queueResponse.json();
                let tracks = [];
                tracks.push(queueData.currently_playing);
                queueData.queue.forEach(item => tracks.push(item));
                return tracks;
            } else {
                console.error('Failed to get queue:', queueResponse.statusText);
            }
        } else {
            console.error('Failed to start playback:', playResponse.statusText);
        }
    }
}