export async function searchPlaylist(year) {
    const url = `https://api.spotify.com/v1/search?q=wrapped%25${year}&type=playlist&limit=1`;
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
        console.error('Access token is undefined');
        return null;
    }

    const payload = {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    };

    const response = await fetch(url, payload);
    const data = await response.json();

    const playlist = data.playlists.items[0];

    if (playlist) {
        const isWrapped = playlist.name.toLowerCase().includes(year) && !playlist.name.toLowerCase().includes('radio');
        const isSpotifyOwned = playlist.owner.id === 'spotify';

        if (isWrapped && isSpotifyOwned) {
            console.log(`Wrapped playlist ID for ${year}: ${playlist.id}`);
            return playlist.id;
        } else {
            console.warn(`Not the Wrapped ${year} playlist: ${playlist.name}`);
        }
    } else {
        console.warn(`No playlist found for ${year}`);
    }
}