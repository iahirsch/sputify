<template>
    <SmoothScroll v-if="accessToken" :player-ready="playerReady"></SmoothScroll>
    <LoadingPage v-else></LoadingPage>
</template>

<script setup>
import SmoothScroll from './JourneyPage.vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import LoadingPage from './LoadingPage.vue';

const playerReady = ref(false);
const accessToken = ref(null);
const route = useRoute();

onMounted(async () => {
    const state = route.query.state;
    const code = route.query.code;
    let currentTime = Math.floor(new Date().getTime() / 1000);

    console.log(isNaN(localStorage.getItem('tokenExpirationTime')), currentTime, localStorage.getItem('tokenExpirationTime'));

    accessToken.value = route.query.access_token;
    localStorage.setItem('access_token', route.query.access_token);

    // if (!localStorage.getItem('tokenExpirationTime') || currentTime > localStorage.getItem('tokenExpirationTime')) {
    //     let access_token_response = await fetch('http://localhost:3000/callback' + "?code=" + code + "&state=" + state,
    //         { credentials: 'include' }
    //     )
    //     let access_token = await access_token_response.json()
    //     console.log(access_token)
    //     localStorage.setItem('tokenExpirationTime', currentTime + access_token.expires_in);
    //     localStorage.setItem('access_token', access_token.access_token);
    //     localStorage.setItem('refresh_token', access_token.refresh_token);
    //     accessToken.value = access_token.access_token;
    //     console.log(accessToken.value);
    // }
    // else {
    //     accessToken.value = localStorage.getItem('access_token');
    //     console.log("Token still valid: Access Token: ", localStorage.getItem('access_token'), "\n Refresh Token: ", localStorage.getItem('refresh_token'));
    // }

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
            playerReady.value = true;
            localStorage.setItem('device_id', device_id);
            console.log('Ready with Device ID', device_id);
        });

        // Not Ready
        player.addListener('not_ready', ({ device_id }) => {
            playerReady.value = false;
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

        player.connect();

    }
});
</script>

<style scoped></style>