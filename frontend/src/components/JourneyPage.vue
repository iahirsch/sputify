<template>
  <PopupComponent />
  <div class="bubble" data-speed="0.5">
    <BubbleComponent :analysis="currentTrack.analysis" :playing="playing" />
  </div>
  <div id="smooth-wrapper" ref="main">
    <!-- TODO: clear spotify authentication on logout -->
    <span class="material-symbols-rounded logout menu-button" @click="logOut()">logout</span>
    <span class="material-symbols-rounded help menu-button">help</span>
    <div id="smooth-content">
      <div>
        <img class="logoJourney" src="../assets/spütify_logo.png" @click="scrollTo" />
      </div>
      <div class="box box-a gradient-black" data-speed="0.5">
        <WelcomeComponent :user-name="userName" />
      </div>
      <div class="box box-b gradient-black">
        <YearComponent v-for="(year, index) in years" :key="index" :year="year" :currentTrack="currentTrack"
          :playing="playing" :playTrack="playTrack" />
      </div>
      <ShareComponent :user-name="userName" :years="years" />
      <footer class="footergradient-black">
        <button @click="scrollTo" class="totop">
          <span class="material-symbols-rounded totop-icon">keyboard_double_arrow_up</span>
          <p>Back to Top</p>
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  playerReady: Boolean
});
import { onMounted, onBeforeUnmount, onUnmounted, ref, nextTick } from 'vue';
import gsap from 'gsap-trial';
import { ScrollTrigger } from 'gsap-trial/ScrollTrigger';
import Lenis from 'lenis';
import { playback } from '../api/playback.js';
import { getTopTracks } from '../api/getTopTracks.js';
import { getTopArtists } from '../api/getTopArtists.js';
import { getArtist } from '../api/getArtist.js';
import { getUserInfo } from '../api/user.js';
import { getWrappedPlaylists } from '../api/getWrappedPlaylists.js';

import BubbleComponent from './BubbleComponent.vue';
import ShareComponent from './ShareComponent.vue';
import WelcomeComponent from './WelcomeComponent.vue';
import YearComponent from './YearComponent.vue';
import PopupComponent from './PopupComponent.vue';

gsap.registerPlugin(ScrollTrigger);
const main = ref();
let updateInterval;
let ctx;
let panel_tl;
const userName = ref('');
const years = ref([
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
const currentTrack = ref({
  id: '',
  name: '',
  artist: '',
  genres: [],
  image: '',
  uri: '',
  analysis: {
    tempo: 0,
    energy: 0,
    valence: 0,
    danceability: 0,
    segments: [
      {
        start: 0,
        duration: 100,
        frequency_spectrum: []
      }
    ],
    color: 'rgb(255, 255, 255)',
  }
});
const playing = ref(false);

async function getAudioAnalysis(name, artist) {
  try {
    const response = await fetch('http://localhost:3000/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        track: {
          name: name,
          artist: artist
        },
      })
    });
    const json = await response.json();
    console.log(json);
    return json.analysisResults;
  } catch (error) {
    console.error('Error fetching audio analysis:', error);
  }
}

async function playTrack(track) {
  const deviceId = getDeviceId();
  const isSameTrack = track.id === currentTrack.value.id;

  if (isSameTrack) {
    playback(deviceId, null, props.playerReady, playing.value);
    playing.value = !playing.value;
  } else {
    playback(deviceId, [track.uri], props.playerReady, false);
    updateCurrentTrack(track);
    playing.value = true;
  }
}

function updateCurrentTrack(track) {
  currentTrack.value = {
    id: track.id,
    name: track.name,
    artist: track.artists[0].name,
    genres: currentTrack.value.genres,
    image: track.album.images[0].url,
    uri: track.uri,
    analysis: currentTrack.value.analysis
  };

  getArtist(track.artists[0].id).then((artist) => {
    currentTrack.value.genres = artist.genres;
  });

  getAudioAnalysis(track.name, track.artists[0].name).then((analysis) => {
    currentTrack.value.analysis = analysis;
  });

  console.log('Playing track:', currentTrack.value);
}

function getDeviceId() {
  return localStorage.getItem('device_id');
}

function logOut() {
  window.location.href = '/';
}

onMounted(async () => {

  async function fetchUserData() {
    try {
      const response = await getUserInfo();
      userName.value = response.display_name;
      console.log("User Name: ", userName);
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
      const wrappedPlaylists = await getWrappedPlaylists(getDeviceId());

      console.log('Wrapped Playlists:', wrappedPlaylists);

      wrappedPlaylists.forEach(async (playlist) => {
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
          years.value.push({
            title: playlist.year,
            topTracks: topTracks.slice(0, 5),
            topArtists: topArtists.slice(0, 5),
            topGenres: []
          });

          analyseTopItems({ items: topArtists }, { items: topTracks }, playlist.index);
        }
      });
    } catch (error) {
      console.error("Error fetching wrapped playlists:", error);
    }
  }

  await fetchUserData();
  await fetchTopTracksAndArtists('short_term', 0);
  await fetchTopTracksAndArtists('medium_term', 1);
  await fetchTopTracksAndArtists('long_term', 2);

  await fetchWrappedPlaylists();

  console.log('Years:', years.value);

  await nextTick();
  //fetchWrappedPlaylists();

  const bubble = document.querySelector('.bubble');

  gsap.to(bubble, {
    opacity: 1,
    scrollTrigger: {
      trigger: '.year-title',
      start: 'top 70%',
      end: 'top 20%',
      scrub: true,
      markers: false,
    },
  });

  gsap.to(bubble, {
    opacity: 0,
    scrollTrigger: {
      trigger: 'footer',
      start: 'top 50%',
      end: 'top 50%',
      scrub: true,
      markers: false,
      onEnter: () => gsap.to(bubble, { opacity: 0 }),
      onLeaveBack: () => gsap.to(bubble, { opacity: 1 }),
    },
  });

}, main.value);



onBeforeUnmount(() => {
  clearInterval(updateInterval);
});

onUnmounted(() => {
  ctx.revert();
});

// Scroll to top button jetzt mit lenis
function scrollTo() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

//Lenis smooth scrolling
const lenis = new Lenis({
  autoRaf: false,
});

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

lenis.on('scroll', ScrollTrigger.update);// Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0); // Disable GSAP's lag smoothing


window.onload = function () {
  gsap.utils.toArray(".step").forEach(function (panel) {
    panel_tl = gsap.timeline({
      scrollTrigger: {
        trigger: panel,
        start: "top 90%",
        end: "bottom 10%",
        scrub: true,
        markers: false,
        toggleActions: "resume pause reverse pause"
      }
    });
    panel_tl.from(panel, { opacity: 0, duration: 0.5 });
    panel_tl.to(panel, { opacity: 0, duration: 0.5 });
  });

};

onMounted(() => {
  const boxB = document.querySelector(".box-b");

  const handleScroll = () => {
    const rect = boxB.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isVisible) {
      // Play the first track
      if (years.value[0]?.topTracks?.length > 0) {
        playTrack(years.value[0].topTracks[0]);
      }
      window.removeEventListener("scroll", handleScroll);
    }
  };

  window.addEventListener("scroll", handleScroll);
});

</script>

<style scoped>
body,
html {
  margin: 0;
}

html.lenis,
html.lenis body {
  height: auto;
}

.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}

.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}

.lenis.lenis-stopped {
  overflow: clip;
}

.lenis.lenis-smooth iframe {
  pointer-events: none;
}

div.step {
  background-color: rgba(255, 255, 255, 0.3);
  padding: 1em;
  margin: 10vh 1em 15vh auto;
  color: white;
}

#smooth-wrapper {
  position: relative;
}

#smooth-content {
  width: 100%;
}

.box {
  height: 120vh;
  transition: scale 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.box-a {
  height: 120vh;
}

.box-b {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  position: relative;
  z-index: 2;
  padding-top: 5rem;
  height: auto;
}

h2 {
  font-size: 2rem;
  margin: 1rem;
}

.bubble {
  position: sticky;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  opacity: 0;
}

.gradient-black {
  background: none;
  color: white;
}

.line {
  height: 250px;
  background: none;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu-button {
  color: rgba(255, 255, 255, 0.6);
  margin-top: 2vh;
  margin: 1rem;
  font-size: 2rem;
  z-index: 10;
  position: fixed;
  cursor: pointer;
  -webkit-filter: drop-shadow(0 0 0.5rem black);
  filter: drop-shadow(0 0 0.5rem black);
}

.logout {
  left: 1rem;
  left: 0;
  top: 91%;
  transform: scaleX(-1);
}

.help {
  right: 1rem;
  right: 0;
}

.menu-button:hover {
  color: white;
}

.menu-button::after {
  position: absolute;
  top: 120%;
  width: fit-content;
  padding: 15px;
  color: white;
  background-color: rgba(255, 255, 255, 0.2);
  visibility: hidden;
  transition: opacity 0.4s ease;
  font-family: 'Familjen Grotesk', sans-serif;
  font-size: 1.1rem;
  border-radius: 10px;
}

.menu-button:hover::after {
  visibility: visible;
  opacity: 1;
}

.help::after {
  width: 20vw;
  text-wrap: wrap;
  content: "Wie kann die Visualisierung des Musikgeschmacks in Form einer interaktiven Zeitreise das persönliche Musikerlebnis vertiefen? - Scrolle um es zu erfahren!";
  right: 0;
}

.logout::after {
  content: "Log out";
  top: -30%;
  left: -280%;
}

.logout:hover::after {
  visibility: visible;
  opacity: 1;
  transform: scaleX(-1);
}

footer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

}

p {
  margin: 0;
}

.totop {
  font-size: 1rem;
  font-weight: 300;
  margin-top: 10vh;
  background-color: transparent;
  color: #ffffff55;
  border: none;
  cursor: pointer;
  z-index: 4;
  margin-bottom: 1rem;
  flex-direction: column;
}

.totop:hover {
  color: white;
}

.totop-icon {
  font-size: 3rem;
}

.pin-spacer {
  pointer-events: none;
}

.logoJourney {
  width: 10rem;
  margin: 1rem;
  position: fixed;
  z-index: 10;
  -webkit-filter: drop-shadow(0 0 0.5rem black);
  filter: drop-shadow(0 0 0.5rem black);
}
</style>