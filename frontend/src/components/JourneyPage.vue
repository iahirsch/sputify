<template>
  <PopupComponent v-if="showPopup" />
  <div class="bubble" data-speed="0.5">
    <BubbleComponent :analysis="currentTrack.analysis" :playing="playing" />
  </div>
  <div class="timeline">
    <StickyTimeline :years="years" :active="false" />
  </div>
  <div class="mobile-timeline">
    <MobileTimeline :years="years" :active="false" :user-name="userName" :user-img="userImg" />
  </div>
  <div id="smooth-wrapper" ref="main">
    <!-- TODO: clear spotify authentication on logout -->
    <span class="material-symbols-rounded logout menu-button" @click="logOut()">logout</span>
    <span class="material-symbols-rounded logout-mobile menu-button" @click="logOut()">logout</span>
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
        <BadgesComponent :badges="badges" :badgeIndex="years.length" />
      </div>
      <div class="share">
        <ShareComponent :user-name="userName" :years="years" :badges="badges" :shareIndex="years.length + 1" />
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
import MobileTimeline from './MobileTimeline.vue';
import ShareComponent from './ShareComponent.vue';
import WelcomeComponent from './WelcomeComponent.vue';
import YearComponent from './YearComponent.vue';
import PopupComponent from './PopupComponent.vue';
import BadgesComponent from './BadgesComponent.vue';

const props = defineProps({
  playerReady: Boolean,
  years: Array,
  userName: String,
  userImg: String,
});

gsap.registerPlugin(ScrollTrigger);
const main = ref();
let updateInterval;
let ctx;
let panel_tl;

const badges = ref([]);

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
  const testYears = [
    {
      title: '0000',
      recentTracks: [
        { name: 'Song 0', artists: ['Artist A'] },
        { name: 'Song 2', artists: ['Artist A'] },
        { name: 'Song 3', artists: ['Artist A'] },
        { name: 'Song 4', artists: ['Artist B'] },
        { name: 'Song 5', artists: ['Artist C'] },
      ],
    },
    {
      title: '2023',
      topArtists: [
        {
          name: 'Unpopular Artist',
          popularity: 30,
        }
      ],
      topTracks: [
        { name: 'Song 0', artists: ['Artist A'] },
        { name: 'Song 2', artists: ['Artist A'] },
        { name: 'Song 3', artists: ['Artist B'] },
        { name: 'Song 4', artists: ['Artist B'] },
        { name: 'Song 5', artists: ['Artist C'] },
      ],
      topGenres: [
        { name: 'Pop' },
        { name: 'Rock' },
        { name: 'Hip-Hop' },
        { name: 'Jazz' },
        { name: 'Classical' }
      ]
    },
    {
      title: '2022',
      topArtists: [
        {
          name: 'Consistent Artist',
          popularity: 100,
        },
      ],
      topTracks: [
        { name: 'Song 1', artists: ['Artist A'] },
        { name: 'Song 2', artists: ['Artist A'] },
        { name: 'Song 3', artists: ['Artist A'] },
        { name: 'Song 4', artists: ['Artist B'] },
        { name: 'Song 5', artists: ['Artist C'] },
      ],
      topGenres: [
        { name: 'Electronic' },
        { name: 'Reggae' },
        { name: 'Blues' },
        { name: 'Country' },
        { name: 'Soul' }
      ]
    },
    {
      title: '2021',
      topArtists: [
        {
          name: 'Consistent Artist',
          popularity: 100,
        },
      ],
      topTracks: [
        { name: 'Song 1', artists: ['Artist A'] },
        { name: 'Song 2', artists: ['Artist B'] },
        { name: 'Song 3', artists: ['Artist B'] },
        { name: 'Song 4', artists: ['Artist B'] },
        { name: 'Song 5', artists: ['Artist B'] },
      ],
      topGenres: [
        { name: 'R&B' },
        { name: 'Latin' },
        { name: 'Punk' },
        { name: 'Grunge' },
        { name: 'Ska' }
      ]
    },
    {
      title: '2020',
      topArtists: [
        {
          name: 'Consistent Artist',
          popularity: 100,
        },
      ],
      topTracks: [
        { name: 'Song 1', artists: ['Artist A'] },
        { name: 'Song 2', artists: ['Artist B'] },
        { name: 'Song 3', artists: ['Artist B'] },
        { name: 'Song 4', artists: ['Artist B'] },
        { name: 'Song 5', artists: ['Artist B'] },
      ],
      topGenres: [
        { name: 'Metal' },
        { name: 'Folk' },
        { name: 'Indie' },
        { name: 'Reggaeton' },
        { name: 'Funk' }
      ]
    },
    {
      title: '2019',
      topArtists: [
        {
          name: 'Consistent Artist',
          popularity: 100,
        },
      ],
      topTracks: [
        { name: 'Song 1', artists: ['Artist A'] },
        { name: 'Song 2', artists: ['Artist B'] },
        { name: 'Song 3', artists: ['Artist B'] },
        { name: 'Song 4', artists: ['Artist B'] },
        { name: 'Song 5', artists: ['Artist B'] },
      ],
      topGenres: [
        { name: 'Disco' },
        { name: 'Techno' },
        { name: 'House' },
        { name: 'Trance' },
        { name: 'Dubstep' }
      ]
    }
  ];

  //const years = testYears;
  const years = props.years;

  const badges = [];

  let gem = {};
  let popularity = 100;

  let topArtist = null;
  let topArtistCount = 0;

  let fan = {};
  let highCount = 0;

  let repeat = {};
  let maxAppearances = 1;
  const trackAppearances = {};

  let diverse = {};
  const uniqueGenres = new Set();

  let newMe = {};

  years.forEach((year, index) => {
    if (index != 0) {
      year.topArtists.forEach((artist, index) => {
        // Hidden Gem
        if (artist.popularity < 40 && artist.popularity < popularity) {
          gem = {
            icon: 'diamond',
            title: 'Hidden Gem',
            text: `You listened to ${artist.name} a lot in ${year.title} with a popularity of only ${artist.popularity}%.`,
          };
          popularity = artist.popularity;
        }

        // Loyal Listener
        let count = 0;
        years.forEach((innerYear, innerIndex) => {
          if (innerIndex !== 0 && innerYear.topArtists.some(innerArtist => innerArtist.name === artist.name)) {
            count++;
          }
        });
        if (count > topArtistCount) {
          topArtist = artist;
          topArtistCount = count;
        }

      });

      // Super Fan
      const trackArtistCount = year.topTracks.reduce((acc, track) => {
        acc[track.artists[0].name] = (acc[track.artists[0].name] || 0) + 1;
        return acc;
      }, {});
      for (const [artist, count] of Object.entries(trackArtistCount)) {
        if (count >= 3 && count >= highCount) {
          fan = {
            icon: 'mode_fan',
            title: 'Super Fan',
            text: `You were obsessed with ${artist} in ${year.title}, ${count} of your top 5 songs were from them.`,
          };
          highCount = count;
        }
      }

      // On Repeat
      year.topTracks.forEach((track) => {
        const trackName = track.name;
        if (!trackAppearances[trackName]) {
          trackAppearances[trackName] = 0;
        }
        trackAppearances[trackName]++;
      });

      // Genre Explorer
      year.topGenres.forEach((genre) => {
        uniqueGenres.add(genre.name);
      });

      // New Me
      if (index != 1) {
        const previousYear = years[index - 1];
        const currentYearArtists = new Set(year.topArtists.map(artist => artist.name));
        const previousYearArtists = new Set((previousYear.topArtists || []).map(artist => artist.name));
        const commonArtists = [...currentYearArtists].filter(artist => previousYearArtists.has(artist));
        if (commonArtists.length === 0) {
          newMe = {
            icon: 'switch_account',
            title: 'New Me',
            text: `Your top artists completely switched up from ${year.title} to ${previousYear.title}.`,
          };
        }
      }
    }
  });
  if (topArtistCount === years.length - 1) {
    badges.push({
      icon: 'volunteer_activism',
      title: 'Loyal Listener',
      text: `You listened to ${topArtist.name} consistently across all years.`,
    });
  }
  for (const [trackName, count] of Object.entries(trackAppearances)) {
    if (count > maxAppearances) {
      maxAppearances = count;
      if (maxAppearances >= 3) {
        repeat = {
          icon: 'repeat',
          title: 'On Repeat',
          text: `You can't stop listening to "${trackName}", it appears in your top tracks ${maxAppearances} times.`,
        };
      }
    }
  }

  if (Object.keys(gem).length !== 0) {
    badges.push(gem);
  }
  if (Object.keys(fan).length !== 0) {
    badges.push(fan);
  }
  if (Object.keys(repeat).length !== 0) {
    badges.push(repeat);
  }
  if (uniqueGenres.size > 20) {
    diverse = {
      icon: 'explore',
      title: 'Genre Explorer',
      text: `Across all years ${uniqueGenres.size} unique genres appeared in your top genres.`,
    };
    badges.push(diverse);
  }
  if (Object.keys(newMe).length !== 0) {
    badges.push(newMe);
  }

  console.log('Badges:', badges);

  return badges.slice(0, 5);
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

  const mobileTimeline = document.querySelector('.mobile-timeline');

  gsap.to(mobileTimeline, {
    opacity: 1,
    scrollTrigger: {
      trigger: '.year-title',
      start: 'top 70%',
      end: 'top 20%',
      scrub: true,
      markers: false,
    },
  });

  const logoutButton = document.querySelector('span.logout-mobile.menu-button');
  gsap.to(logoutButton, {
    opacity: 0,
    scrollTrigger: {
      trigger: '.year-title',
      start: 'top 90%',
      end: 'top 70%',
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

function scrollTo() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

const lenis = new Lenis({
  autoRaf: false,
});

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);


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
  const yearTitles = document.querySelectorAll(".year-title");

  yearTitles.forEach((yearTitle, index) => {
    const handleYearScroll = () => {
      const rect = yearTitle.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight / 2 && rect.bottom > 0;

      if (isVisible) {
        const year = props.years[index];
        if (year?.topTracks?.length > 0 && year.topTracks[0].id !== currentTrack.value.id) {
          playTrack(year.topTracks[0]);
        } else if (year?.recentTracks?.length > 0 && year.recentTracks[0].id !== currentTrack.value.id) {
          playTrack(year.recentTracks[0]);
        }
        window.removeEventListener("scroll", handleYearScroll);
      }
    };

    window.addEventListener("scroll", handleYearScroll);
  });

  badges.value = getBadges();
});

</script>

<script>
function logOut() {
  if (
    document.querySelector('span.logout-mobile.menu-button').style.opacity == 1 ||
    document.querySelector('span.logout.menu-button').style.display != 'none' ||
    document.querySelector('.sidebar.open')
  ) {
    window.location.href = '/';
    localStorage.removeItem('showPopup');
    console.log(localStorage);
  }
}
export { logOut };
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
  bottom: 1rem;
  opacity: 1;
  transform: scaleX(-1);
}

.logout-mobile {
  font-size: 1.8rem;
  margin: 0.8rem;
  opacity: 1;
  transform: scaleX(-1);
  display: none;
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

.logout::after,
.logout-mobile::after {
  content: "Log out";
  top: -30%;
  left: -280%;
}

.logout-mobile::after {
  margin-left: -1rem;
}

.logout:hover::after,
.logout-mobile:hover::after {
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
  font-size: 1.2rem;
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
  height: 3rem;
  margin: 1rem;
  position: fixed;
  z-index: 10;
  -webkit-filter: drop-shadow(0 0 0.5rem black);
  filter: drop-shadow(0 0 0.5rem black);
}

.mobile-timeline {
  display: none;
  opacity: 0;
  position: fixed;
  z-index: 99;
}

@media screen and (max-width: 1000px) {
  .logoJourney {
    right: 0;
    height: 1.8rem;
    margin: 0.8rem;
  }

  .timeline {
    display: none;
  }

  .logout {
    display: none;
  }

  .logout-mobile {
    display: block;
  }

  .totop {
    font-size: 1rem;
    margin-top: 5vh;
  }

  .mobile-timeline {
    display: block;
  }
}
</style>