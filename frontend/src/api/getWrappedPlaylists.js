export async function getWrappedPlaylists() {
    const accessToken = localStorage.getItem('access_token');

    let wrappedPlaylists = [
        { id: '37i9dQZF1Fa1IIVtEpGUcU', year: 2023 },
        { id: '37i9dQZF1F0sijgNaJdgit', year: 2022 },
        { id: '37i9dQZF1EUMDoJuT8yJsl', year: 2021 },
        { id: await searchPlaylist(2020), year: 2020 },
        { id: await searchPlaylist(2019), year: 2019 },
        { id: await searchPlaylist(2018), year: 2018 },
        { id: await searchPlaylist(2017), year: 2017 },
        { id: await searchPlaylist(2016), year: 2016 }
    ];

    const getPlaylist = async (id) => {
        if (id) {
            const url = `https://api.spotify.com/v1/playlists/${id}`;
            const payload = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            };
            const response = await fetch(url, payload);
            if (!response.ok) {
                console.warn(`Playlist with ID ${id} not found.`);
                return null;
            }
            return response.json();
        }
    };

    wrappedPlaylists = await Promise.all(wrappedPlaylists.map(async ({ id, year }) => {
        const playlist = await getPlaylist(id);
        if (playlist) {
            id = playlist.id;
        }
        return { id, year, playlist };
    }));
    return wrappedPlaylists;
}

const searchPlaylist = async (year) => {
    const accessToken = localStorage.getItem('access_token');
    const url = `https://api.spotify.com/v1/search?q=wrapped%25${year}&type=playlist&limit=1`;
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
        console.warn(`No playlist found for ${year}:`);
    }
};