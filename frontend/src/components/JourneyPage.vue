<template>
  <PopupComponent v-if="showPopup" />
  <div class="bubble" data-speed="0.5">
    <BubbleComponent :analysis="currentTrack.analysis" :playing="playing" />
  </div>
  <div class="timeline">
    <StickyTimeline :years="years" :active="false" />
  </div>
  <div id="smooth-wrapper" ref="main">
    <!-- TODO: clear spotify authentication on logout -->
    <span class="material-symbols-rounded logout menu-button" @click="logOut()">logout</span>
    <div id="smooth-content">
      <div>
        <img class="logoJourney" src="../assets/spütify_logo.png" @click="scrollTo" />
      </div>
      <div class="box box-a gradient-black" data-speed="0.5">
        <WelcomeComponent :user-name="userName" />
      </div>
      <div class="box box-b gradient-black">
        <YearComponent v-for="(year, index) in years" :key="index" :yearIndex="index" :year="year"
          :currentTrack="currentTrack" :playing="playing" :playTrack="playTrack" />
      </div>
      <div class="badge-page">
        <BadgesComponent :badges="badges" :badgeIndex="years.length"/>
      </div>
      <div class="share">
        <ShareComponent :user-name="userName" :years="years" :shareIndex="years.length+1" />
      </div>
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
import { onMounted, onBeforeUnmount, onUnmounted, ref, nextTick } from 'vue';
import gsap from 'gsap-trial';
import { ScrollTrigger } from 'gsap-trial/ScrollTrigger';
import Lenis from 'lenis';
import { playback } from '../api/playback.js';
import { getArtist } from '../api/getArtist.js';

import BubbleComponent from './BubbleComponent.vue';
import StickyTimeline from './StickyTimeline.vue';
import ShareComponent from './ShareComponent.vue';
import WelcomeComponent from './WelcomeComponent.vue';
import YearComponent from './YearComponent.vue';
import PopupComponent from './PopupComponent.vue';
import BadgesComponent from './BadgesComponent.vue';

const props = defineProps({
  playerReady: Boolean,
  years: Array,
  userName: String,
});

gsap.registerPlugin(ScrollTrigger);
const main = ref();
let updateInterval;
let ctx;
let panel_tl;

const badges = ref();

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
let showPopup = handleShowPopup();

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
  const deviceId = localStorage.getItem('device_id');
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

function logOut() {
  window.location.href = '/';
  localStorage.removeItem('showPopup');
  console.log(localStorage);
}

function handleShowPopup() {
  const storedShowPopup = localStorage.getItem('showPopup');
  if (storedShowPopup === null) {
    localStorage.setItem('showPopup', 'false');
    return true;
  } else {
    return false;
  }
}

function getBadges() {
  const badges = [];
  props.years.forEach((year, index) => {
    console.log(year);
    if (year.topArtists?.length > 0) {
      badges.push({
        id: index,
        icon: 'Favorite',
        text: `You were obsessed with ${year.topArtists[0].name} in ${year.title}`,
      });
    }
  });
  return badges;
}

onMounted(async () => {

  await nextTick();

const bubble = document.querySelector('.bubble');

const bubbleTimeline = gsap.timeline();

bubbleTimeline.to(bubble, {
  opacity: 1,
  scrollTrigger: {
    trigger: '.year-title',
    start: 'top bottom',
    end: 'top top',
    scrub: true,
    markers: false,
  },
  immediateRender: false
});

bubbleTimeline.to(bubble, {
  opacity: 0,
  scrollTrigger: {
    trigger: '.share',
    start: 'top bottom',
    end: 'top top',
    scrub: true,
    markers: false,
  },
  immediateRender: false
});


  const timeline = document.querySelector('.timeline');

  gsap.to(timeline, {
    opacity: 1,
    scrollTrigger: {
      trigger: '.year-title',
      start: 'top 70%',
      end: 'top 20%',
      scrub: true,
      markers: false,
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
      if (props.years[0]?.topTracks?.length > 0) {
        playTrack(props.years[0].topTracks[0]);
      } else if (props.years[0]?.recentTracks?.length > 0) {
        playTrack(props.years[0].recentTracks[0]);
      }
      window.removeEventListener("scroll", handleScroll);
    }
  };

  window.addEventListener("scroll", handleScroll);

  badges.value = getBadges();
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
  height: 100vh;
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

.timeline {
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
  font-size: 1.5rem;
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
  font-size: 2.5rem !important;
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