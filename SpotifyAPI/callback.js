const urlParams = new URLSearchParams(window.location.search);
console.log(urlParams)
let code = urlParams.get('code');

let playerReady = false;

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

const getUserInfo = async () => {
    const token = localStorage.getItem('access_token');
    const url = "https://api.spotify.com/v1/me";
    const payload = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    const body = await fetch(url, payload);
    const response = await body.json();
    console.log(response);

    const userInfoContainer = document.getElementById('userInfoContainer');

    if (!document.querySelector('#userInfoContainer img')) {
        const userImage = document.createElement('img');
        userImage.id = 'userImage';
        userImage.src = response.images[0]?.url || 'default-image-url.jpg';
        userImage.alt = 'User Profile Picture';
        userInfoContainer.appendChild(userImage);
    }

    if (!document.querySelector('#userInfoContainer h3')) {
        const userName = document.createElement('h3');
        userName.textContent = response.display_name;
        if (response.product === "premium") {
            const premiumIcon = document.createElement('span');
            premiumIcon.className = 'material-icons';
            premiumIcon.textContent = 'star';
            premiumIcon.id = 'premiumStar';
            premiumIcon.title = 'Premium User';
            userName.appendChild(premiumIcon);
        }
        userInfoContainer.appendChild(userName);
    }
}

// Get the wrapped playlists for the years 2016-2023
const getWrappedPlaylists = async () => {
    const token = localStorage.getItem('access_token');

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
                    'Authorization': `Bearer ${token}`
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
    console.log(wrappedPlaylists);

    makePlaylistButtons(wrappedPlaylists);
};
const searchPlaylist = async (year) => {
    const token = localStorage.getItem('access_token');
    const url = `https://api.spotify.com/v1/search?q=wrapped%25${year}&type=playlist&limit=1`;
    const payload = {
        headers: {
            'Authorization': `Bearer ${token}`
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
const makePlaylistButtons = (playlists) => {
    const playlistContainer = document.getElementById('playlistContainer');
    playlists.forEach((p) => {
        if (p.id && p.playlist && p.playlist.tracks.items.length > 0 && !document.querySelector(`button[data-year="${p.year}"]`)) {
            const button = document.createElement('button');
            button.textContent = p.year;
            button.setAttribute('data-year', p.year);
            button.addEventListener('click', () => {
                const device_id = localStorage.getItem('device_id');
                const songUri = p.playlist.tracks.items[0].track.uri;
                playInBrowser(device_id, songUri);
            });
            playlistContainer.appendChild(button);
        }
    });
}

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

    // Play the top song
    const device_id = localStorage.getItem('device_id');
    const songUri = response.items[0].uri;
    playInBrowser(device_id, songUri);
};

//not needed
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
//not needed
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
//not needed
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
        const actionResponse = await fetch(`${url}/${action}`, {
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
//not needed
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

document.querySelector('#topTracksShortTerm').addEventListener('click', () => getTopTracks('short_term'));
document.querySelector('#topTracksMediumTerm').addEventListener('click', () => getTopTracks('medium_term'));
document.querySelector('#topTracksLongTerm').addEventListener('click', () => getTopTracks('long_term'));
//document.querySelector('#token').addEventListener('click', () => getToken(code));
//document.querySelector('#artists').addEventListener('click', () => getTopArtists());
//document.querySelector('#currentlyPlaying').addEventListener('click', () => getCurrentlyPlaying());
document.querySelector('#wrappedPlaylists').addEventListener('click', () => getWrappedPlaylists());
//document.querySelector('#playPause').addEventListener('click', () => playPauseMusic());
//document.querySelector('#addSongToQueueAndSkip').addEventListener('click', () => addSongToQueueAndSkip());
document.querySelector('#userInfo').addEventListener('click', () => getUserInfo());

window.onSpotifyWebPlaybackSDKReady = () => {
    getToken(code);
    const token = localStorage.getItem('access_token');
    const player = new Spotify.Player({
        name: 'Spütify',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
    });

    // Ready
    player.addListener('ready', ({ device_id }) => {
        playerReady = true;
        localStorage.setItem('device_id', device_id);
        console.log('Ready with Device ID', device_id);
        //playInBrowser(device_id, songUri);
        //transferPlayback(device_id);
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        playerReady = false;
        console.log('Device ID has gone offline', device_id);
    });

    player.addListener('initialization_error', ({ message }) => {
        console.error(message);
    });

    player.addListener('authentication_error', ({ message }) => {
        console.error(message);
    });

    player.addListener('account_error', ({ message }) => {
        console.error(message);
    });

    document.getElementById('togglePlay').onclick = function () {
        player.togglePlay();
    };

    player.connect();
}

function transferPlayback(device_id) {
    const token = localStorage.getItem('access_token');
    fetch('https://api.spotify.com/v1/me/player', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "device_ids": [device_id],
            "play": true // Setze auf true, um die Wiedergabe sofort zu starten
        })
    });
}

function playInBrowser(device_id, songUri) {
    const token = localStorage.getItem('access_token');
    if (playerReady) {
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "uris": [songUri],
                play: true
            })
        });
    } else {
        console.warn('Player not ready. Cannot play music.');
    }
}