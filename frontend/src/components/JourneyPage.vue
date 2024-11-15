<template>
    <div>
        <SmoothScroll />
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
            <button id="topTracksShortTerm" @click="fetchTopTracks('short_term')">
                <span class="material-icons">trending_up</span> short
            </button>
            <button id="topTracksMediumTerm" @click="fetchTopTracks('medium_term')">
                <span class="material-icons">trending_up</span> medium
            </button>
            <button id="topTracksLongTerm" @click="fetchTopTracks('long_term')">
                <span class="material-icons">trending_up</span> long
            </button>
        </div>
    </div>
</template>

<script setup>
import SmoothScroll from './SmoothScroll.vue';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router'

import { getUserInfo } from '../api/user.js';
import { getPlaylist } from '../api/getPlaylist.js';
import { getTopTracks } from '../api/getTopTracks.js';
import { searchPlaylist } from '../api/searchPlaylist.js';
import { playback } from '../api/playback.js';

let playerReady = false;

async function getWrappedPlaylists() {
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

    wrappedPlaylists = await Promise.all(wrappedPlaylists.map(async ({ id, year }) => {
        const playlist = await getPlaylist(id);
        if (playlist) {
            id = playlist.id;
        }
        return { id, year, playlist };
    }));
    console.log(wrappedPlaylists);
    makePlaylistButtons(wrappedPlaylists);
}

function makePlaylistButtons(playlists) {
    const playlistContainer = document.getElementById('playlistContainer');
    playlists.forEach((p) => {
        if (p.id && p.playlist && p.playlist.tracks.items.length > 0 && !document.querySelector(`button[data-year="${p.year}"]`)) {
            const button = document.createElement('button');
            button.textContent = p.year;
            button.setAttribute('data-year', p.year);
            button.addEventListener('click', () => {
                const device_id = localStorage.getItem('device_id');
                const songUris = p.playlist.tracks.items.slice(0, 5).map(item => item.track.uri);
                playback(device_id, songUris, playerReady);
            });
            playlistContainer.appendChild(button);
        }
    });
}

async function fetchTopTracks(timeRange) {
    const response = await getTopTracks(timeRange);
    console.log(response);

    // Play the top song
    const device_id = localStorage.getItem('device_id');
    const songUris = response.items.slice(0, 5).map(item => item.uri);
    playback(device_id, songUris, playerReady);
}

//TODO: RefreshToken

// async getRefreshToken() {
//     const refresh_token = localStorage.getItem('refresh_token');
//     let refresh_token_response = await fetch('http://localhost:3000/api/spotify/refresh_token' + "?refresh_token=" + refresh_token,
//         { credentials: 'include' }
//     )
//     let access_token = await refresh_token_response.json()
//     console.log(access_token)
//     localStorage.setItem('access_token', access_token.access_token);
//     localStorage.setItem('refresh_token', access_token.refresh_token);

// },
// async checkAndRefreshToken() {
//     const now = new Date().getTime();
//     if (now > tokenExpirationTime) {
//         await this.getRefreshToken();
//     }
// },
//     this.checkAndRefreshToken();
//     let token = localStorage.getItem('access_token');
//     let url = "https://api.spotify.com/v1/me";
//     const payload = {
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     }

//     let response = await fetch(url, payload);

//     if (response.status === 401) {
//         console.log("Access Token expired. Refreshing token...");
//         await getRefreshToken();
//         token = localStorage.getItem('access_token');

//         payload.headers['Authorization'] = `Bearer ${token}`;
//         response = await fetch(url, payload);
//     }
//     const body = await fetch(url, payload);
//     response = await body.json();
//     console.log(response);

//     const userInfoContainer = document.getElementById('userInfoContainer');

//     if (!document.querySelector('#userInfoContainer img')) {
//         const userImage = document.createElement('img');
//         userImage.id = 'userImage';
//         userImage.src = response.images[0]?.url || 'default-image-url.jpg';
//         userImage.alt = 'User Profile Picture';
//         userInfoContainer.appendChild(userImage);
//     }

//     if (!document.querySelector('#userInfoContainer h3')) {
//         const userName = document.createElement('h3');
//         userName.textContent = response.display_name;
//         if (response.product === "premium") {
//             const premiumIcon = document.createElement('span');
//             premiumIcon.className = 'material-icons';
//             premiumIcon.textContent = 'star';
//             premiumIcon.id = 'premiumStar';
//             premiumIcon.title = 'Premium User';
//             userName.appendChild(premiumIcon);
//         }
//         userInfoContainer.appendChild(userName);
//     }
// }, 

onMounted(async () => {
    const state = useRoute().query.state;
    const code = useRoute().query.code;
    let currentTime = Math.floor(new Date().getTime() / 1000);

    console.log(isNaN(localStorage.getItem('tokenExpirationTime')), currentTime, localStorage.getItem('tokenExpirationTime'));

    if (!localStorage.getItem('tokenExpirationTime') || currentTime > localStorage.getItem('tokenExpirationTime')) {
        let access_token_response = await fetch('http://localhost:3000/api/spotify/callback' + "?code=" + code + "&state=" + state,
            { credentials: 'include' }
        )
        let access_token = await access_token_response.json()
        console.log(access_token)
        localStorage.setItem('tokenExpirationTime', currentTime + access_token.expires_in);
        localStorage.setItem('access_token', access_token.access_token);
        localStorage.setItem('refresh_token', access_token.refresh_token);
    }
    else {
        console.log("Token still valid: Access Token: ", localStorage.getItem('access_token'), "\n Refresh Token: ", localStorage.getItem('refresh_token'));
    }

    const script = document.createElement('script');
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
        console.log('Spotify Web Playback SDK is ready');
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
});
</script>

<style scoped></style>