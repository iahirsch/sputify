<template>
  <JourneyPage v-if="accessToken && isReady" :player-ready="playerReady" :years="years" :userName="userName"
               :userImg="userImg">
  </JourneyPage>
  <LoadingPage v-else></LoadingPage>
</template>

<script setup>
import JourneyPage from './JourneyPage.vue';
import {ref, onMounted} from 'vue';
import {useRoute} from 'vue-router';
import LoadingPage from './LoadingPage.vue';

import {getUserInfo} from '@/api/user';
import {getWrappedPlaylists} from '@/api/getWrappedPlaylists';
import {getRecentlyPlayed} from '@/api/getRecentlyPlayed.js';
import {getTopTracks} from '@/api/getTopTracks';
import {getTopArtists} from '@/api/getTopArtists';
import {getArtist} from '@/api/getArtist';
import Lenis from "lenis";
import {ScrollTrigger} from "gsap-trial/ScrollTrigger";
import gsap from "gsap-trial";

const playerReady = ref(false);
const accessToken = ref(null);
const route = useRoute();

const years = ref([
  {
    title: 'Now',
    recentTracks: [],
  },
  {
    title: 'Last 4 Weeks',
    topTracks: [],
    topArtists: [],
    topGenres: []
  },
  {
    title: 'Last 6 Months',
    topTracks: [],
    topArtists: [],
    topGenres: []
  },
  {
    title: 'Last 12 Months',
    topTracks: [],
    topArtists: [],
    topGenres: []
  }
]);
const userName = ref('');
const userImg = ref('');
const isReady = ref(false);

// Lenis Smooth Scroll
const lenis = new Lenis({
  autoRaf: false,
});

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});


onMounted(async () => {
  accessToken.value = route.query.access_token;
  localStorage.setItem('access_token', route.query.access_token);

  const script = document.createElement('script');
  script.src = "https://sdk.scdn.co/spotify-player.js";
  script.async = true;
  document.body.appendChild(script);

  window.onSpotifyWebPlaybackSDKReady = () => {
    const token = localStorage.getItem('access_token');
    const player = new Spotify.Player({
      name: 'Spütify',
      getOAuthToken: cb => {
        cb(token);
      },
      volume: 0.5
    });

    player.addListener('ready', ({device_id}) => {
      playerReady.value = true;
      localStorage.setItem('device_id', device_id);
    });

    player.addListener('not_ready', ({device_id}) => {
      playerReady.value = false;
      console.log('Device ID has gone offline', device_id);
    });

    player.addListener('initialization_error', ({message}) => {
      console.error(message);
    });

    player.addListener('authentication_error', ({message}) => {
      console.error(message);
    });

    player.addListener('account_error', ({message}) => {
      console.error(message);
    });

    player.connect();

  }

  // Retrieve data from sessionStorage
  const sessionUserName = sessionStorage.getItem('userName');
  const sessionUserImg = sessionStorage.getItem('userImg');
  const sessionYears = JSON.parse(sessionStorage.getItem('years'));

  if (sessionUserName && sessionUserImg && sessionYears) {
    userName.value = sessionUserName;
    userImg.value = sessionUserImg;
    years.value = sessionYears;
    await fetchRecentlyPlayed();
    isReady.value = true;
    return;
  }

  async function fetchUserData() {
    try {
      const response = await getUserInfo();
      userName.value = response.display_name;
      if (response.images.length > 0) {
        userImg.value = response.images[0].url;
      } else {
        userImg.value = "../assets/user.png";
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }

  function analyseTopItems(topArtists, topTracks, index) {
    // Fetch top genres for each time period
    const genreCount = {};
    topArtists.items.forEach(artist => {
      if (artist.genres) {
        artist.genres.forEach(genre => {
          genreCount[genre] = (genreCount[genre] || 0) + 1;
        });
      }
    });
    years.value[index].topGenres = Object.keys(genreCount)
        .sort((a, b) => genreCount[b] - genreCount[a])
        .slice(0, 5);

    // Fetch top 3 artists for each genre
    const genreArtists = {};
    for (const genre of years.value[index].topGenres) {
      genreArtists[genre] = [];
      for (const artist of topArtists.items) {
        if (artist.genres.includes(genre) && genreArtists[genre].length < 3) {
          genreArtists[genre].push(artist);
        }
      }
    }
    years.value[index].topGenres = years.value[index].topGenres.map(genre => ({
      name: genre,
      artists: genreArtists[genre]
    }));

    // Fetch top tracks for each artist
    years.value[index].topArtists.forEach(async (_artist, i) => {
      const artistTopTracks = topTracks.items.filter(track =>
          track.artists.some(a => a.id === years.value[index].topArtists[i].id)
      ).slice(0, 3);
      years.value[index].topArtists[i].tracks = artistTopTracks;
    });
  }

  async function fetchTopTracksAndArtists(term, index) {
    try {
      const tracksResponse = await getTopTracks(term);
      years.value[index].topTracks = tracksResponse.items.slice(0, 5);

      const artistsResponse = await getTopArtists(term);
      years.value[index].topArtists = artistsResponse.items.slice(0, 5);

      analyseTopItems(artistsResponse, tracksResponse, index);

    } catch (error) {
      console.error(`Error fetching top tracks and artists for ${term}:`, error);
    }
  }

  async function fetchWrappedPlaylists() {
    try {
      const wrappedPlaylists = await getWrappedPlaylists(localStorage.getItem('device_id'));

      for (const playlist of wrappedPlaylists) {
        if (playlist.year && playlist.tracks && playlist.tracks.length > 0) {

          // get top artists for each playlist
          const artistCount = {};
          playlist.tracks.forEach(track => {
            const artistId = track.artists[0].id;
            artistCount[artistId] = (artistCount[artistId] || 0) + 1;
          });

          const sortedArtistIds = Object.keys(artistCount).sort((a, b) => artistCount[b] - artistCount[a]);

          const topArtists = [];
          for (const artistId of sortedArtistIds.slice(0, 5)) {
            const artist = await getArtist(artistId);
            topArtists.push(artist);
          }

          const topTracks = playlist.tracks;
          years.value[playlist.index] = Object.assign({}, years.value[playlist.index], {
            title: playlist.year,
            topTracks: topTracks.slice(0, 5),
            topArtists: topArtists.slice(0, 5),
            topGenres: []
          });

          analyseTopItems({items: topArtists}, {items: topTracks}, playlist.index);
        }
      }
    } catch (error) {
      console.error("Error fetching wrapped playlists:", error);
    }
  }

  async function fetchRecentlyPlayed() {
    try {
      const response = await getRecentlyPlayed();
      const recentTracks = response.items.map(item => item.track);

      years.value[0].recentTracks = recentTracks.slice(0, 5);
    } catch (error) {
      console.error('Error fetching recently played:', error);
    }
  }

  await fetchUserData();

  await fetchRecentlyPlayed();

  await fetchTopTracksAndArtists('short_term', 1);
  await fetchTopTracksAndArtists('medium_term', 2);
  await fetchTopTracksAndArtists('long_term', 3);

  await fetchWrappedPlaylists();

  // Store data in sessionStorage
  sessionStorage.setItem('userName', userName.value);
  sessionStorage.setItem('userImg', userImg.value);
  sessionStorage.setItem('years', JSON.stringify(years.value));

  isReady.value = true;
});
</script>

<style scoped></style>