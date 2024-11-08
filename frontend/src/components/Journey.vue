<template>
    <div>
        <h1>Spütify</h1>
        <div id="userInfoContainer"></div>
        <div class="button-row">
            <button id="togglePlay" @click="togglePlay">
                <span class="material-icons">play_arrow</span>Toggle Play
            </button>
            <button id="userInfo" @click="getUserInfo">
                <span class="material-icons">account_circle</span> Get User Info
            </button>
        </div>

        <h2>Wrapped Playlists</h2>
        <button id="wrappedPlaylists" @click="getWrappedPlaylists">
            <span class="material-icons">playlist_play</span> Get wrapped playlists
        </button>
        <div id="playlistContainer" style="display: flex; gap: 10px;"></div>

        <h2>Top Tracks</h2>
        <div class="button-row">
            <button id="topTracksShortTerm" @click="getTopTracks('short_term')">
                <span class="material-icons">trending_up</span> short
            </button>
            <button id="topTracksMediumTerm" @click="getTopTracks('medium_term')">
                <span class="material-icons">trending_up</span> medium
            </button>
            <button id="topTracksLongTerm" @click="getTopTracks('long_term')">
                <span class="material-icons">trending_up</span> long
            </button>
        </div>
    </div>
</template>
<script>
export default {
    name: 'SpotifyComponent',
    data() {
        return {
            playerReady: false,
            clientId: '003e413536ef443289571ec1bd987207',
            tokenExpirationTime: null
        };
    },
    methods: {
        async handleAuthorization() {
            const accessToken = localStorage.getItem('access_token');
            const refreshToken = localStorage.getItem('refresh_token');
            const code = new URLSearchParams(window.location.search).get('code');

            if (!accessToken && code) {
                await this.getToken(code);
                window.history.replaceState({}, document.title, "/journey");
            } else if (!accessToken && refreshToken) {
                await this.getRefreshToken();
            } else if (accessToken) {
                console.log("Tokens already available. No need to exchange authorization code.");
            } else {
                console.error("No authorization code or tokens found.");
            }
        },
        async getToken(code) {
            const codeVerifier = localStorage.getItem('code_verifier');
            const url = "https://accounts.spotify.com/api/token";
            const payload = {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    client_id: this.clientId,
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: 'http://localhost:5173/journey',
                    code_verifier: codeVerifier,
                })
            };

            try {
                const response = await fetch(url, payload);
                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('access_token', data.access_token);
                    localStorage.setItem('refresh_token', data.refresh_token);
                    console.log("Access Token:", data.access_token);
                    console.log("Refresh Token:", data.refresh_token);
                } else {
                    console.error("(getToken) Error fetching tokens:", data);
                }
            } catch (error) {
                console.error("Network error while fetching token:", error);
            }
        },
        async getRefreshToken() {
            const refreshToken = localStorage.getItem('refresh_token');
            const url = "https://accounts.spotify.com/api/token";
            const payload = {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                    client_id: this.clientId
                })
            };

            try {
                const response = await fetch(url, payload);
                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('access_token', data.access_token);
                    console.log("New Access Token:", data.access_token);

                    if (data.refresh_token) {
                        localStorage.setItem('refresh_token', data.refresh_token);
                    }
                } else {
                    console.error("(getRefreshToken) Error fetching token:", data);
                }
            } catch (error) {
                console.error("Network error while refreshing token:", error);
            }
        },
        async checkAndRefreshToken() {
            const now = new Date().getTime();
            if (now > this.tokenExpirationTime) {
                await this.getRefreshToken();
            }
        },
        async getUserInfo() {
            this.checkAndRefreshToken();
            let token = localStorage.getItem('access_token');
            let url = "https://api.spotify.com/v1/me";
            const payload = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }

            let response = await fetch(url, payload);

            if (response.status === 401) {
                console.log("Access Token expired. Refreshing token...");
                await getRefreshToken();
                token = localStorage.getItem('access_token');

                payload.headers['Authorization'] = `Bearer ${token}`;
                response = await fetch(url, payload);
            }
            const body = await fetch(url, payload);
            response = await body.json();
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
        },
        async getWrappedPlaylists() {
            this.checkAndRefreshToken();
            const token = localStorage.getItem('access_token');

            let wrappedPlaylists = [
                { id: '37i9dQZF1Fa1IIVtEpGUcU', year: 2023 },
                { id: '37i9dQZF1F0sijgNaJdgit', year: 2022 },
                { id: '37i9dQZF1EUMDoJuT8yJsl', year: 2021 },
                { id: await this.searchPlaylist(2020), year: 2020 },
                { id: await this.searchPlaylist(2019), year: 2019 },
                { id: await this.searchPlaylist(2018), year: 2018 },
                { id: await this.searchPlaylist(2017), year: 2017 },
                { id: await this.searchPlaylist(2016), year: 2016 }
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

            this.makePlaylistButtons(wrappedPlaylists);
        },
        async searchPlaylist(year) {
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
                console.warn(`No playlist found for ${year}`);
            }
        },
        makePlaylistButtons(playlists) {
            this.checkAndRefreshToken();
            const playlistContainer = document.getElementById('playlistContainer');
            playlists.forEach((p) => {
                if (p.id && p.playlist && p.playlist.tracks.items.length > 0 && !document.querySelector(`button[data-year="${p.year}"]`)) {
                    const button = document.createElement('button');
                    button.textContent = p.year;
                    button.setAttribute('data-year', p.year);
                    button.addEventListener('click', () => {
                        const device_id = localStorage.getItem('device_id');
                        const songUris = p.playlist.tracks.items.slice(0, 5).map(item => item.track.uri);
                        this.playInBrowser(device_id, songUris);
                    });
                    playlistContainer.appendChild(button);
                }
            });
        },
        async getTopTracks(timeRange) {
            this.checkAndRefreshToken();
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
            const songUris = response.items.slice(0, 5).map(item => item.uri);
            this.playInBrowser(device_id, songUris);
        },
        playInBrowser(device_id, songUris) {
            this.checkAndRefreshToken();
            const token = localStorage.getItem('access_token');
            if (this.playerReady) {
                fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
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
    },
    async mounted() {
        const state = this.$route.query.state;
        const code = this.$route.query.code;
        console.log(state)

        let access_token_response = await fetch('http://localhost:3000/api/spotify/callback' +"?code=" + code + "&state=" + state,
        {credentials: 'include'}
        )
        let access_token = await access_token_response.json()
        console.log(access_token)
        localStorage.setItem('access_token', access_token.access_token);

        const script = document.createElement('script');
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            console.log('Spotify Web Playback SDK is ready');
            this.checkAndRefreshToken();
            const token = localStorage.getItem('access_token');
            const player = new Spotify.Player({
                name: 'Spütify',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });

            // Ready
            player.addListener('ready', ({ device_id }) => {
                this.playerReady = true;
                localStorage.setItem('device_id', device_id);
                console.log('Ready with Device ID', device_id);
            });

            // Not Ready
            player.addListener('not_ready', ({ device_id }) => {
                this.playerReady = false;
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
    }
};
</script>

<style scoped></style>