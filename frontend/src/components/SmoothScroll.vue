<template>
  <div class="bubble" data-speed="0.5">
    <BubbleComponent :audio-analysis-sections="currentTrack.audioAnalysis"
      :audio-features="currentTrack.audioFeatures" />
  </div>
  <div id="smooth-wrapper" ref="main">
    <span class="material-symbols-rounded help hover-icon">help</span>
    <div id="smooth-content">
      <div class="box box-a gradient-black" data-speed="0.5">
        <WelcomeComponent />
      </div>
      <div class="box box-b gradient-black">
        <div v-for="(year) in years" class="year">
          <h1 class="year-title">{{ year.title }}</h1>
          <div class="content-leftside">
            <h2>your top songs</h2>
            <div v-if="year.topTracks.length > 0">
              <div v-for="(track) in year.topTracks" class="song" @click="playTrack(track)">
                <span class="material-symbols-rounded play-icon">play_arrow</span>
                <p class="song-name">
                  {{ track.name }}<br>
                  <span class="song-artist">{{ track.artists[0].name }}</span>
                </p>
              </div>
            </div>
            <div v-else>
              <p class="loading">Loading top tracks...</p>
            </div>
            <div style="height: 200px;"></div>
            <h2>your top artists</h2>
            <div v-if="year.topArtists.length > 0">
              <div v-for="(artist, index) in year.topArtists" :key="index" class="artist"
                @click="playTrack(artist.tracks[0])">
                <span class="material-symbols-rounded play-icon">play_arrow</span>
                <p class="artist-name">
                  {{ artist.name }}<br>
                  <span v-if="artist.tracks" class="artist-song">{{ artist.tracks[0].name }}</span>
                </p>
              </div>
            </div>
            <div v-else>
              <p class="loading">Loading top artists...</p>
            </div>
          </div>
          <div class="content-rightside">
            <h2>your top genres</h2>
            <div v-if="year.topGenres.length > 0" class="genre-container">
              <p v-for="(genre, index) in year.topGenres" :key="index" class="genre"
                :class="{ 'current-genre': index === 2 }">{{ genre }}</p>
            </div>
            <div v-else>
              <p class="loading">Loading top genres...</p>
            </div>
          </div>
        </div>
      </div>

      <div class="line"></div>
      <footer class="footergradient-black">
        <PrintComponent />
        <button @click="scrollTo" class="totop">
          <span class="material-symbols-rounded totop-icon">keyboard_double_arrow_up</span>
          <p>Back to Top</p>
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, onUnmounted, ref, watch } from 'vue';
import gsap from 'gsap-trial';
import { ScrollTrigger } from 'gsap-trial/ScrollTrigger';
import { ScrollSmoother } from 'gsap-trial/ScrollSmoother';
import { playback } from '../api/playback.js';
import { getTopTracks } from '../api/getTopTracks.js';
import { getTopArtists } from '../api/getTopArtists.js';
import { getArtistTopTracks } from '../api/getArtistTopTracks.js';
import { getAudioAnalysis } from '@/api/getAudioAnalysis';
import { getAudioFeatures } from '@/api/getAudioFeatures';
import { getWrappedPlaylists } from '@/api/getWrappedPlaylists';

import BubbleComponent from './BubbleComponent.vue';
import PrintComponent from './PrintComponent.vue';
import WelcomeComponent from './WelcomeComponent.vue';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
const main = ref();
let updateInterval;
let smoother;
let ctx;
let panel_tl;
const years = ref([
  {
    title: 'now',
    topTracks: [],
    topArtists: [],
    topGenres: []
  },
  {
    title: 'recently',
    topTracks: [],
    topArtists: [],
    topGenres: []
  }
]);

const currentTrack = ref({
  id: '',
  name: '',
  artist: '',
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

function playTrack(track) {
  playback(getDeviceId(), [track.uri], true);
  currentTrack.value.id = track.id;
  currentTrack.value.name = track.name;
  currentTrack.value.artist = track.artists[0].name;
  currentTrack.value.image = track.album.images[0].url;
  currentTrack.value.uri = track.uri;
  getAudioAnalysis(track.id).then((response) => {
    currentTrack.value.audioAnalysis = response;
  });
  getAudioFeatures(track.id).then((response) => {
    currentTrack.value.audioFeatures = response;
  });
  console.log('Current track:', currentTrack);
}

function getDeviceId() {
  return localStorage.getItem('device_id');
}

const scrollTo = () => {
  smoother.scrollTo('body', true, '0px, 0px');
};

onMounted(() => {

  // now
  getTopTracks('short_term').then((response) => {
    years.value[0].topTracks = response.items.slice(0, 5);
    console.log("Top tracks:", response);
  }).catch((error) => {
    console.error("Error fetching top tracks:", error);
  });
  getTopArtists('short_term').then((response) => {
    years.value[0].topArtists = response.items.slice(0, 5);

    // Get top genres from top artists
    const genreCount = {};
    response.items.forEach(artist => {
      if (artist.genres) {
        artist.genres.forEach(genre => {
          if (genreCount[genre]) {
            genreCount[genre]++;
          } else {
            genreCount[genre] = 1;
          }
        });
      }
    });
    years.value[0].topGenres = Object.keys(genreCount)
      .sort((a, b) => genreCount[b] - genreCount[a])
      .slice(0, 5);

    // Get top tracks for each artist
    Promise.all(
      years.value[0].topArtists.map((artist) =>
        getArtistTopTracks(artist.id).then((response) => {
          artist.tracks = response.tracks.slice(0, 5);
        })
      )
    ).catch((error) => {
      console.error("Error fetching artist top tracks:", error);
    });

  }).catch((error) => {
    console.error("Error fetching top artists:", error);
  });

  // recently
  getTopTracks('medium_term').then((response) => {
    years.value[1].topTracks = response.items.slice(0, 5);
    console.log("Top tracks:", response);
  }).catch((error) => {
    console.error("Error fetching top tracks:", error);
  });
  getTopArtists('medium_term').then((response) => {
    years.value[1].topArtists = response.items.slice(0, 5);

    // Get top genres from top artists
    const genreCount = {};
    response.items.forEach(artist => {
      if (artist.genres) {
        artist.genres.forEach(genre => {
          if (genreCount[genre]) {
            genreCount[genre]++;
          } else {
            genreCount[genre] = 1;
          }
        });
      }
    });
    years.value[1].topGenres = Object.keys(genreCount)
      .sort((a, b) => genreCount[b] - genreCount[a])
      .slice(0, 5);

    // Get top tracks for each artist
    Promise.all(
      years.value[1].topArtists.map((artist) =>
        getArtistTopTracks(artist.id).then((response) => {
          artist.tracks = response.tracks.slice(0, 5);
        })
      )
    ).catch((error) => {
      console.error("Error fetching artist top tracks:", error);
    });

  }).catch((error) => {
    console.error("Error fetching top artists:", error);
  });

  getWrappedPlaylists().then((wrappedPlaylists) => {
    console.log(wrappedPlaylists);
    wrappedPlaylists.forEach((playlist) => {
      if (playlist.year && playlist.playlist && playlist.playlist.tracks.items.length > 0) {
        years.value.push({
          title: playlist.year,
          topTracks: playlist.playlist.tracks.items.map(item => item.track).slice(0, 5),
          topArtists: [],
          topGenres: []
        });
      }
    });
  });

  ctx = gsap.context(() => {
    // Create the smooth scrolling effect
    smoother = ScrollSmoother.create({
      smooth: 1,
      effects: true,
    });
  }, main.value);


  const bubble = document.querySelector('.bubble');

  gsap.to(bubble, {
    opacity: 1,
    scrollTrigger: {
      trigger: '.year-title',
      start: 'center center',
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

</script>

<style scoped>
body,
html {
  margin: 0;
}

div.step {
  background-color: rgba(255, 255, 255, 0.3);
  padding: 1em;
  margin: 10vh 1em 15vh auto;
  color: white;
}

#smooth-wrapper {
  /* overflow: hidden; */
  position: relative;
  height: 100vh;
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

.song,
.artist {
  display: flex;
  align-items: center;
  justify-content: left;
  background-color: rgba(255, 255, 255, 0);
  border-radius: 20px;
  padding: 0.5rem;
}

.song:hover,
.artist:hover {
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.1);

  .play-icon {
    color: rgba(255, 255, 255, 0.3);
  }
}

.play-icon {
  font-size: 3rem;
  color: rgba(255, 255, 255, 0);
  margin-right: 0.25rem;
}

.play-icon:hover {
  color: rgba(255, 255, 255, 0.8) !important;
}

.song-name,
.artist-name {
  font-size: 1.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.song-artist,
.artist-song {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
}

.genre-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.genre {
  width: fit-content;
  max-width: 20vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.2rem;
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  color: rgba(255, 255, 255, 0.8);
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50px;
}

.current-genre {
  border: white 2px solid;
  color: white;
}

.loading {
  color: rgba(255, 255, 255, 0.5);
}

.year {
  display: flex;
  justify-content: space-between;
  width: 90vw;
  left: 5vw;
  position: relative;
  z-index: 1;
}

.year-title {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 5rem;
  color: rgba(255, 255, 255, 0.5);
}

.content-leftside,
.content-rightside {
  width: 30vw;
  display: flex;
  flex-direction: column;
  padding-top: 200px;
}

.content-rightside {
  text-align: right;
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

.hover-icon {
  position: fixed;
  right: 1rem;
}

.hover-icon::after {
  content: "Here is some help!";
  position: absolute;
  top: 120%;
  right: 0;
  width: fit-content;
  padding: 10px;
  color: white;
  background-color: rgba(255, 255, 255, 0.4);
  visibility: hidden;
  transition: opacity 0.3s ease;
  font-family: 'Familjen Grotesk', sans-serif;
  font-size: 1rem;
  opacity: 0;
}

.hover-icon:hover::after {
  visibility: visible;
  opacity: 1;
}


.help {
  color: white;
  margin-top: 2vh;
  font-family: 'Material Symbols Rounded';
  font-size: 2rem;
  opacity: 0.4;
  margin: 1rem;
  right: 0;
  z-index: 10;
  /* Optional: Set a higher z-index if needed */
}

footer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 150vh;
}

p {
  margin: 0;
}

.totop {
  font-size: 1rem;
  margin-top: 50px;
  background-color: transparent;
  color: #ffffff55;
  border: none;
  cursor: pointer;
  z-index: 4;
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
</style>