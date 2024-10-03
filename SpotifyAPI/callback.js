const urlParams = new URLSearchParams(window.location.search);
console.log(urlParams)
let code = urlParams.get('code');

const getToken = async code => {

    // stored in the previous step
    let codeVerifier = localStorage.getItem('code_verifier');

    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: "003e413536ef443289571ec1bd987207", // add your clientId here from the spotify dashboard
            grant_type: 'authorization_code',
            code,
            redirect_uri: 'http://localhost:3000/SpotifyAPI/callback.html', // must be the same as what was used in authorization
            code_verifier: codeVerifier,
        }),
    }

    const url = "https://accounts.spotify.com/api/token";
    const body = await fetch(url, payload);
    const response = await body.json();

    localStorage.setItem('access_token', response.access_token);
    console.log(response.access_token);
}

const getTopArtists = async () => {
    const token = localStorage.getItem('access_token');
    const url = "https://api.spotify.com/v1/me/top/artists";
    const payload = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    const body = await fetch(url, payload);
    const response = await body.json();
    console.log(response);
}

const getCurrentlyPlaying = async () => {
    const token = localStorage.getItem('access_token');
    const url = "https://api.spotify.com/v1/me/player/currently-playing";
    const payload = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    const body = await fetch(url, payload);
    const response = await body.json();
    console.log(response);
}

const getAllPlaylists = async () => {
    const token = localStorage.getItem('access_token');
    const url = "https://api.spotify.com/v1/me/playlists";
    const payload = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    const body = await fetch(url, payload);
    const response = await body.json();
    console.log(response);
}

// Get the wrapped playlists for the years 2019-2023
const getWrappedPlaylists = async () => {
    const token = localStorage.getItem('access_token');
    const playlistIds = [
        '37i9dQZF1Fa1IIVtEpGUcU', //2023
        '37i9dQZF1F0sijgNaJdgit', //2022
        '37i9dQZF1EUMDoJuT8yJsl', //2021
        '37i9dQZF1EM8zP5iEUpvtS', //2020
        '37i9dQZF1EtavyuTuNdfaO' //2019
    ];

    const getPlaylist = async (id) => {
        const url = `https://api.spotify.com/v1/playlists/${id}`;
        const payload = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const response = await fetch(url, payload);
        return response.json();
    };

    const playlists = await Promise.all(playlistIds.map(id => getPlaylist(id)));
    console.log(playlists);
};

const playPauseMusic = async () => {
    const token = localStorage.getItem('access_token');
    const url = "https://api.spotify.com/v1/me/player";

    try {
        // Get current playback state
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching playback state: ${response.statusText}`);
        }

        const data = await response.json();
        const isPlaying = data.is_playing;

        // Determine the action based on playback state
        const action = isPlaying ? 'pause' : 'play';

        // Make the request to play or pause
        const actionResponse = await fetch(`${url}/${action}/?device_id=${device_id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!actionResponse.ok) {
            throw new Error(`Error trying to ${action} playback: ${actionResponse.statusText}`);
        }

        console.log(`Playback ${action}ed successfully.`);
        console.warn('Note: This will only work with Spotify premium users.');
    } catch (error) {
        console.error('Error in playPauseMusic:', error);
    }
};

const addSongToQueueAndSkip = async () => {
    const token = localStorage.getItem('access_token');
    const songUri = "spotify:track:351KkakA2YtGEXqSEIIasy";

    try {
        // Add song to queue
        let response = await fetch(`https://api.spotify.com/v1/me/player/queue?uri=${songUri}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error adding song to queue: ${response.statusText}`);
        }

        // Skip to next song
        response = await fetch("https://api.spotify.com/v1/me/player/next", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error skipping to next song: ${response.statusText}`);
        }

        console.log('Song added to queue and skipped to next.');
        console.warn('Note: This will only work with Spotify premium users.');
    } catch (error) {
        console.error('Error in addSongToQueueAndSkip:', error);
    }
};

const getTopTracks = async (timeRange) => {
    const token = localStorage.getItem('access_token');
    const url = `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}`;
    const payload = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    const body = await fetch(url, payload);
    const response = await body.json();
    console.log(response);
};

document.querySelector('#topTracksShortTerm').addEventListener('click', () => getTopTracks('short_term'));
document.querySelector('#topTracksMediumTerm').addEventListener('click', () => getTopTracks('medium_term'));
document.querySelector('#topTracksLongTerm').addEventListener('click', () => getTopTracks('long_term'));

document.querySelector('#token').addEventListener('click', () => getToken(code));
document.querySelector('#artists').addEventListener('click', () => getTopArtists());
document.querySelector('#currentlyPlaying').addEventListener('click', () => getCurrentlyPlaying());
document.querySelector('#allPlaylists').addEventListener('click', () => getAllPlaylists());
document.querySelector('#wrappedPlaylists').addEventListener('click', () => getWrappedPlaylists());
document.querySelector('#playPause').addEventListener('click', () => playPauseMusic());
document.querySelector('#addSongToQueueAndSkip').addEventListener('click', () => addSongToQueueAndSkip());