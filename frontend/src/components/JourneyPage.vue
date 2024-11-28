<template>
  <div class="popup" v-if="showPopup">
    <div class="popup-content">
      <span class="material-symbols-rounded close" @click="closePopup">close</span>
      <span class="material-symbols-rounded headphones">headphones</span>
      <h2>Use headphones for better experience</h2>
      <button @click="closePopup">OK</button>
    </div>
  </div>
  <div class="bubble" data-speed="0.5">
    <BubbleComponent :audio-analysis-sections="currentTrack.audioAnalysis" :audio-features="currentTrack.audioFeatures"
      :playing="playing" />
  </div>
  <div id="smooth-wrapper" ref="main">
    <!-- TODO: clear spotify authentication on logout -->
    <span class="material-symbols-rounded logout menu-button" @click="logOut()">logout</span>
    <span class="material-symbols-rounded help menu-button">help</span>
    <div id="smooth-content">
      <div>
        <img class="logoJourney" src="../assets/spütify_logo.png" />
      </div>
      <div class="box box-a gradient-black" data-speed="0.5">
        <WelcomeComponent :user-name="userName" />
      </div>
      <div class="box box-b gradient-black">
        <YearComponent v-for="(year, index) in years" :key="index" :year="year" :currentTrack="currentTrack"
          :playing="playing" :playTrack="playTrack" />
      </div>

      <div class="line"></div>
      <footer class="footergradient-black">
        <ShareComponent :user-name="userName" :years="years" />
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
import { onMounted, onBeforeUnmount, onUnmounted, ref } from 'vue';
import gsap from 'gsap-trial';
import { ScrollTrigger } from 'gsap-trial/ScrollTrigger';
import Lenis from 'lenis';
import { playback } from '../api/playback.js';
import { getTopTracks } from '../api/getTopTracks.js';
import { getTopArtists } from '../api/getTopArtists.js';
import { getArtistTopTracks } from '../api/getArtistTopTracks.js';
import { getArtist } from '@/api/getArtist.js';
import { getAudioAnalysis } from '@/api/getAudioAnalysis';
import { getAudioFeatures } from '@/api/getAudioFeatures';
import { getWrappedPlaylists } from '@/api/getWrappedPlaylists';
import { getUserInfo } from '../api/user.js';

import BubbleComponent from './BubbleComponent.vue';
import ShareComponent from './ShareComponent.vue';
import WelcomeComponent from './WelcomeComponent.vue';
import YearComponent from './YearComponent.vue';

gsap.registerPlugin(ScrollTrigger);
const main = ref();
let updateInterval;
let ctx;
let panel_tl;
const userName = ref('');
const years = ref([
  {
    title: 'last 3 weeks',
    topTracks: [],
    topArtists: [],
    topGenres: []
  },
  {
    title: 'last 6 months',
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
  audioAnalysis: [
    {
      start: 0,
      duration: 100,
      loudness: 0,
      tempo: 60,
      key: 0,
      mode: 0,
      time_signature: 0
    }
  ],
  audioFeatures: {
    danceability: 0,
    energy: 0,
    key: 0,
    loudness: 0,
    mode: 0,
    speechiness: 0,
    acousticness: 0,
    instrumentalness: 0,
    liveness: 0,
    valence: 0,
    tempo: 0,
    duration_ms: 0,
    time_signature: 0
  }
});
const playing = ref(false);

function playTrack(track) {
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
    audioAnalysis: currentTrack.value.audioAnalysis,
    audioFeatures: currentTrack.value.audioFeatures
  };

  getArtist(track.artists[0].id).then((artist) => {
    currentTrack.value.genres = artist.genres;
  });

  /* getAudioAnalysis(track.id).then((response) => {
    currentTrack.value.audioAnalysis = response;
  });

  getAudioFeatures(track.id).then((response) => {
    currentTrack.value.audioFeatures = response;
  }); */

  console.log('Playing track:', currentTrack.value);
}

function getDeviceId() {
  return localStorage.getItem('device_id');
}

function logOut() {
  window.location.href = '/';
}

onMounted(() => {

  async function fetchUserData() {
    try {
      const response = await getUserInfo();
      userName.value = response.display_name;
      console.log("User Name: ", userName);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }

  async function fetchTopTracksAndArtists(term, index) {
    try {
      const tracksResponse = await getTopTracks(term);
      years.value[index].topTracks = tracksResponse.items.slice(0, 5);

      const artistsResponse = await getTopArtists(term);
      years.value[index].topArtists = artistsResponse.items.slice(0, 5);

      const genreCount = {};
      artistsResponse.items.forEach(artist => {
        if (artist.genres) {
          artist.genres.forEach(genre => {
            genreCount[genre] = (genreCount[genre] || 0) + 1;
          });
        }
      });
      years.value[index].topGenres = Object.keys(genreCount)
        .sort((a, b) => genreCount[b] - genreCount[a])
        .slice(0, 5);

      years.value[index].topArtists.forEach(async (artist, i) => {
        const artistTopTracks = tracksResponse.items.filter(track =>
          track.artists.some(a => a.id === years.value[index].topArtists[i].id)
        ).slice(0, 5);
        years.value[index].topArtists[i].tracks = artistTopTracks;
      });

    } catch (error) {
      console.error(`Error fetching top tracks and artists for ${term}:`, error);
    }
  }

  async function fetchWrappedPlaylists() {
    try {
      const wrappedPlaylists = await getWrappedPlaylists();
      console.log(wrappedPlaylists);

      wrappedPlaylists.forEach((playlist) => {
        if (playlist.year && playlist.playlist && playlist.playlist.tracks.items.length > 0) {
          const artistCount = {};

          playlist.playlist.tracks.items.forEach((item) => {
            item.track.artists.forEach((artist) => {
              artistCount[artist.name] = (artistCount[artist.name] || 0) + 1;
            });
          });

          const topArtists = Object.keys(artistCount)
            .sort((a, b) => artistCount[b] - artistCount[a])
            .slice(0, 5)
            .map((artistName) => {
              const artist = playlist.playlist.tracks.items.find((item) =>
                item.track.artists.some((artist) => artist.name === artistName)
              ).track.artists.find((artist) => artist.name === artistName);
              return {
                ...artist,
                tracks: playlist.playlist.tracks.items
                  .filter((item) => item.track.artists.some((a) => a.name === artistName))
                  .map((item) => item.track)
                  .slice(0, 5),
              };
            });

          years.value.push({
            title: playlist.year,
            topTracks: playlist.playlist.tracks.items.map((item) => item.track).slice(0, 5),
            topArtists: topArtists,
            topGenres: []
          });
        }
      });
    } catch (error) {
      console.error("Error fetching wrapped playlists:", error);
    }
  }

  fetchUserData();
  fetchTopTracksAndArtists('short_term', 0);
  fetchTopTracksAndArtists('medium_term', 1);
  console.log(years.value);
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

  //disappear bubble when scrolling to footer aber es ghat ned
  // gsap.to(bubble, {
  //   opacity: 0,
  //   scrollTrigger: {
  //     trigger: 'footergradient-black',
  //     start: 'top 30%', 
  //     end: 'top 50%', 
  //     scrub: true,
  //     markers: false,
  //   },
  // });
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

const showPopup = ref(true);
function closePopup() {
  showPopup.value = false;
}

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
  gap: 40vh;
  position: relative;
  z-index: 2;
  padding-top: 20vh;
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
  height: 50px;
  background: none;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu-button {
  color: white;
  margin-top: 2vh;
  margin: 1rem;
  font-size: 2rem;
  opacity: 0.5;
  z-index: 10;
  position: fixed;
  cursor: pointer;
}

.logout {
  left: 1rem;
  left: 0;
  top: 91%;
  transform: scaleX(-1);
  opacity: 1;
}

.help {
  right: 1rem;
  right: 0;
  opacity: 1;
}

.menu-button:hover {
  color: white;
  opacity: 0.7;
}

.menu-button::after {
  position: absolute;
  top: 120%;
  width: fit-content;
  padding: 15px;
  color: white;
  background-color: rgba(255, 255, 255, 0.4);
  visibility: hidden;
  transition: opacity 0.4s ease;
  font-family: 'Familjen Grotesk', sans-serif;
  font-size: 1.1rem;
  opacity: 0;
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
  margin-top: 10vh;
  background-color: transparent;
  color: #ffffff55;
  border: none;
  cursor: pointer;
  z-index: 4;
  margin-bottom: 1rem;
}

.totop:hover {
  color: #fff;
}

.totop-icon {
  font-size: 3rem;
}

.pin-spacer {
  pointer-events: none;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  /* background could be adjusted to fullscreen popup */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.popup-content {
  position: relative;
  background-image: linear-gradient(#1DB954, #4DD4AC);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  text-align: center;
  max-width: 60vh;
  font-family: 'Familjen Grotesk', sans-serif;
}

.popup-content h2 {
  margin-bottom: 1.3rem;
  font-size: 1.2rem;
  color: white;
}

.popup-content button {
  background: white;
  color: black;
  border: none;
  padding: 0.2rem 1.5rem;
  border-radius: 1rem;
  width: 25%;
  cursor: pointer;
  font-size: 0.7rem;
}

.popup-content button:hover {
  background: #1c6a20;
  ;
  color: white;
}

.close {
  position: absolute;
  top: 0;
  right: 0;
  padding: 1rem;
  font-size: 1.5rem;
  color: white;
}

.close:hover {
  color: #1c6a20;
}

.headphones {
  font-size: 3rem;
  color: white;
}

.logoJourney {
  width: 10vw;
  margin: 1rem;
  position: fixed;
}
</style>